'use strict';

var _bluebird = require('bluebird');

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let start = (() => {
  var _ref3 = (0, _bluebird.coroutine)(function* () {
    yield seneca.ready();
    const msg = yield seneca.act('role:test,cmd:hello,name:jeremy');
    console.log(msg);

    const msg2 = yield seneca.act('role:test,cmd:hello,name:jo');
    console.log(msg2);

    seneca.act('role:test,cmd:hello,name:hazel').then(function (msg) {
      return console.log(msg);
    });

    seneca.act('role:test,cmd:hello,name:moss', function (err, response) {
      console.log(err, response);
    });

    const msg3 = yield seneca.act('role:test,cmd:bye,name:jeremy');
    console.log(msg3);

    const msg4 = yield seneca.act('role:test,cmd:bye,name:jo');
    console.log(msg4);

    seneca.act('role:test,cmd:bye,name:hazel').then(function (msg) {
      return console.log(msg);
    });

    seneca.act('role:test,cmd:bye,name:moss', function (err, response) {
      console.log(err, response);
    });

    const msg5 = yield seneca.act('role:test,cmd:hellobye,name:jeremy');
    console.log(msg5);
  });

  return function start() {
    return _ref3.apply(this, arguments);
  };
})();

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

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
  return { msg: `bye ${ msg.name }` };
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