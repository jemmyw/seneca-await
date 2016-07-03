'use strict';

var _bluebird = require('bluebird');

let start = (() => {
  var _ref2 = (0, _bluebird.coroutine)(function* () {
    yield seneca.ready();
    const msg = yield seneca.act('role:test,cmd:make,name:jeremy');
    console.log(msg);

    const msg2 = yield seneca.act('role:test,cmd:make,name:jo');
    console.log(msg2);
  });

  return function start() {
    return _ref2.apply(this, arguments);
  };
})();

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const seneca = (0, _index2.default)();

seneca.add({ role: 'test', cmd: 'make' }, (() => {
  var _ref = (0, _bluebird.coroutine)(function* (msg) {
    return { msg: `hello ${ msg.name }` };
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

start();