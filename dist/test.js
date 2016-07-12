'use strict';

var _bluebird = require('bluebird');

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let start = (() => {
  var _ref3 = (0, _bluebird.coroutine)(function* () {
    yield seneca.ready();

    (0, _tapeAsync2.default)('act await async add', (() => {
      var _ref4 = (0, _bluebird.coroutine)(function* (t) {
        const response = yield seneca.act('role:test,cmd:hello,name:jeremy');
        t.equal(response.msg, 'hello jeremy');
      });

      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    })());

    (0, _tapeAsync2.default)('act promise async add', function (t) {
      seneca.act('role:test,cmd:hello,name:hazel').then(function (response) {
        t.equal(response.msg, 'hello hazel');
        t.end();
      });
    });

    (0, _tapeAsync2.default)('act callback, async add', function (t) {
      seneca.act('role:test,cmd:hello,name:moss', function (err, response) {
        t.false(err);
        t.equal(response.msg, 'hello moss');
        t.end();
      });
    });

    (0, _tapeAsync2.default)('act await, callback add', (() => {
      var _ref5 = (0, _bluebird.coroutine)(function* (t) {
        const response = yield seneca.act('role:test,cmd:bye,name:jo');
        t.equal(response.msg, 'bye jo');
      });

      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    })());

    (0, _tapeAsync2.default)('act promise, callback add', function (t) {
      seneca.act('role:test,cmd:bye,name:hazel').then(function (response) {
        t.equal(response.msg, 'bye hazel');
        t.end();
      });
    });

    (0, _tapeAsync2.default)('act callback, callback add', function (t) {
      seneca.act('role:test,cmd:bye,name:moss', function (err, response) {
        t.false(err);
        t.equal(response.msg, 'bye moss');
      });
    });

    (0, _tapeAsync2.default)('add calling await act internally', (() => {
      var _ref6 = (0, _bluebird.coroutine)(function* (t) {
        const response = yield seneca.act('role:test,cmd:hellobye,name:jeremy');
        t.equal(response.hello.msg, 'hello jeremy');
        t.equal(response.bye.msg, 'bye jeremy');
      });

      return function (_x5) {
        return _ref6.apply(this, arguments);
      };
    })());

    (0, _tapeAsync2.default)('multiple input patterns', (() => {
      var _ref7 = (0, _bluebird.coroutine)(function* (t) {
        const response = yield seneca.act('role:test,cmd:hellobye', { name: 'molly' });
        t.equal(response.hello.msg, 'hello molly');
        t.equal(response.bye.msg, 'bye molly');
      });

      return function (_x6) {
        return _ref7.apply(this, arguments);
      };
    })());

    (0, _tapeAsync2.default)('before wrap', (() => {
      var _ref8 = (0, _bluebird.coroutine)(function* (t) {
        seneca.wrap('role:test,cmd:hello', (() => {
          var _ref9 = (0, _bluebird.coroutine)(function* ({ name }) {
            return yield this.prior({ name: name.toUpperCase() });
          });

          return function (_x8) {
            return _ref9.apply(this, arguments);
          };
        })());

        const response = yield seneca.act('role:test,cmd:hello,name:jeremy');
        t.equals(response.msg, 'hello JEREMY');
      });

      return function (_x7) {
        return _ref8.apply(this, arguments);
      };
    })());

    (0, _tapeAsync2.default)('after wrap', (() => {
      var _ref10 = (0, _bluebird.coroutine)(function* (t) {
        seneca.wrap('role:test,cmd:hello', (() => {
          var _ref11 = (0, _bluebird.coroutine)(function* ({ name }) {
            const response = yield this.prior({ name });
            return { msg: response.msg.toUpperCase() };
          });

          return function (_x10) {
            return _ref11.apply(this, arguments);
          };
        })());

        const response = yield seneca.act('role:test,cmd:hello,name:jeremy');
        t.equals(response.msg, 'HELLO JEREMY');
      });

      return function (_x9) {
        return _ref10.apply(this, arguments);
      };
    })());
  });

  return function start() {
    return _ref3.apply(this, arguments);
  };
})();

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _tapeAsync = require('tape-async');

var _tapeAsync2 = _interopRequireDefault(_tapeAsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const seneca = (0, _index2.default)();

seneca.add({ role: 'test', cmd: 'hello' }, (() => {
  var _ref = (0, _bluebird.coroutine)(function* (msg) {
    return { msg: `hello ${ msg.name }` };
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

seneca.add({ role: 'test', cmd: 'bye' }, function (msg, respond) {
  respond(null, { msg: `bye ${ msg.name }` });
});

seneca.add({ role: 'test', cmd: 'hellobye' }, (() => {
  var _ref2 = (0, _bluebird.coroutine)(function* (msg) {
    const hello = yield this.act(_extends({}, msg, { cmd: 'hello' }));
    const bye = yield this.act(_extends({}, msg, { cmd: 'bye' }));
    return { hello, bye };
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
})());

start();