'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _seneca = require('seneca');

var _seneca2 = _interopRequireDefault(_seneca);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _bluebirdCo = require('bluebird-co');

var _thunks = require('thunks');

var _thunks2 = _interopRequireDefault(_thunks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const t = (0, _thunks2.default)();

function toc(fn) {
  return function (msg, cb) {
    const seneca = wrap(this);
    t(fn.call(seneca, msg))(cb);
  };
}

function wrap(seneca) {
  const wrapped = {};

  for (let k in seneca) {
    if (typeof seneca[k] === 'function') {
      wrapped[k] = seneca[k].bind(seneca);
    } else {
      Object.defineProperty(wrapped, k, {
        get: function () {
          return seneca[k];
        }
      });
    }
  }

  wrapped.act = function (msg, cb) {
    if (typeof cb === 'function') {
      return seneca.act(msg, cb);
    } else {
      return new _bluebird2.default(function (resolve, reject) {
        seneca.act(msg, function (err, response) {
          if (err) {
            return reject(err);
          }
          resolve(response);
        });
      });
    }
  };
  wrapped.ready = _bluebird2.default.promisify(seneca.ready, { context: seneca });
  wrapped.add = function (pattern, fn) {
    return seneca.add(pattern, toc(fn));
  };

  if (seneca.prior) {
    wrapped.prior = _bluebird2.default.promisify(seneca.prior, { context: seneca });
  }

  return wrapped;
}

function wrapped(options) {
  return wrap((0, _seneca2.default)(options));
}

module.exports = wrapped;
exports.default = wrapped;