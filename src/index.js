import Seneca from 'seneca'
import Promise from 'bluebird'
import {co} from 'bluebird-co'
import thunks from 'thunks'

const t = thunks()
const awaitWrapped = Symbol()

function toc(fn) {
  return function(msg, cb) {
    const seneca = wrap(this)
    return t(fn.call(seneca, msg))(cb)
  }
}

function wrap(seneca) {
  if (seneca[awaitWrapped]) {
    return seneca
  }

  const wrapped = {}
  wrapped[awaitWrapped] = true

  for(let k in seneca) {
    if (typeof seneca[k] === 'function') {
      wrapped[k] = seneca[k].bind(seneca)
    } else {
      Object.defineProperty(wrapped, k, {
        get: function() { return seneca[k] }
      })
    }
  }

  wrapped.act = function(msg, cb) {
    if (typeof cb === 'function') {
      return seneca.act(msg, cb)
    } else {
      return new Promise(function(resolve, reject) {
        seneca.act(msg, function(err, response) {
          if (err) { return reject(err) }
          resolve(response)
        })
      })
    }
  }
  wrapped.ready = Promise.promisify(seneca.ready, {context: seneca})

  wrapped.add = function(pattern, fn) {
    const cb = fn.length !== 2 ?  toc(fn) : fn
    return seneca.add(pattern, cb);
  }

  wrapped.use = function(fn, ...rest) {
    return seneca.use(function(...args) {
      const innerWrapped = wrap(this)
      return fn.apply(innerWrapped, args)
    }, ...rest)
  }

  if (seneca.prior) {
    wrapped.prior = function(msg, cb) {
      if (typeof cb === 'function') {
        return seneca.prior(msg, cb)
      } else {
        return new Promise(function(resolve, reject) {
          seneca.prior(msg, function(err, response) {
            if (err) { return reject(err) }
            resolve(response)
          })
        })
      }
    }
  }

  return wrapped
}

function wrapped(options) {
  return wrap(Seneca(options))
}

module.exports = wrapped
export default wrapped
