import Seneca from 'seneca'
import Promise from 'bluebird'
import {co} from 'bluebird-co'
import thunks from 'thunks'

const t = thunks()

function toc(fn) {
  return function(msg, cb) {
    const seneca = wrap(this)
    t(fn.call(seneca, msg))(cb)
  }
}

function wrap(seneca) {
  const wrapped = {}

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
    return seneca.add(pattern, toc(fn))
  }

  if (seneca.prior) {
    wrapped.prior = Promise.promisify(seneca.prior, {context: seneca})
  }

  return wrapped
}

function wrapped(options) {
  return wrap(Seneca(options))
}

module.exports = wrapped
export default wrapped
