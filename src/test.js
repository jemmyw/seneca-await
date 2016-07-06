import Seneca from './index'
import test from 'tape-async'

const seneca = Seneca()

seneca.add({role:'test',cmd:'hello'}, async function(msg) {
  return {msg: `hello ${msg.name}`}
})

seneca.add({role:'test',cmd:'bye'}, function(msg, respond) {
  respond(null, {msg: `bye ${msg.name}`})
})

seneca.add({role:'test',cmd:'hellobye'}, async function(msg) {
  const hello = await this.act({...msg,cmd:'hello'})
  const bye = await this.act({...msg,cmd:'bye'})
  return {hello, bye}
})

async function start() {
  await seneca.ready()

  test('act await async add', async function(t) {
    const response = await seneca.act('role:test,cmd:hello,name:jeremy')
    t.equal(response.msg, 'hello jeremy')
  })

  test('act promise async add', function(t) {
    seneca.act('role:test,cmd:hello,name:hazel').then(response => {
      t.equal(response.msg, 'hello hazel')
      t.end()
    })
  })

  test('act callback, async add', function(t) {
    seneca.act('role:test,cmd:hello,name:moss', function(err, response) {
      t.false(err)
      t.equal(response.msg, 'hello moss')
      t.end()
    })
  })

  test('act await, callback add', async function(t) {
    const response = await seneca.act('role:test,cmd:bye,name:jo')
    t.equal(response.msg, 'bye jo')
  })

  test('act promise, callback add', function(t) {
    seneca.act('role:test,cmd:bye,name:hazel')
    .then(response => {
      t.equal(response.msg, 'bye hazel')
      t.end()
    })
  })

  test('act callback, callback add', function(t) {
    seneca.act('role:test,cmd:bye,name:moss', function(err, response) {
      t.false(err)
      t.equal(response.msg, 'bye moss')
    })
  })

  test('add calling await act internally', async function(t) {
    const response = await seneca.act('role:test,cmd:hellobye,name:jeremy')
    t.equal(response.hello.msg, 'hello jeremy')
    t.equal(response.bye.msg, 'bye jeremy')
  })

  test('multiple input patterns', async function(t) {
    const response = await seneca.act('role:test,cmd:hellobye', {name: 'molly'})
    t.equal(response.hello.msg, 'hello molly')
    t.equal(response.bye.msg, 'bye molly')
  })
}

start()
