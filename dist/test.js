'use strict';

var _bluebird = require('bluebird');

let start = (() => {
  var _ref2 = (0, _bluebird.coroutine)(function* () {
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
  });

  return function start() {
    return _ref2.apply(this, arguments);
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

start();