import Seneca from './index'

const seneca = Seneca()

seneca.add({role:'test',cmd:'hello'}, async function(msg) {
  return {msg: `hello ${msg.name}`}
})

seneca.add({role:'test',cmd:'bye'}, function(msg, respond) {
  return {msg: `bye ${msg.name}`}
})

async function start() {
  await seneca.ready()
  const msg = await seneca.act('role:test,cmd:hello,name:jeremy')
  console.log(msg)

  const msg2 = await seneca.act('role:test,cmd:hello,name:jo')
  console.log(msg2)

  seneca.act('role:test,cmd:hello,name:hazel')
    .then(msg => console.log(msg))

  seneca.act('role:test,cmd:hello,name:moss', function(err, response) {
    console.log(err, response)
  })

  const msg3 = await seneca.act('role:test,cmd:bye,name:jeremy')
  console.log(msg3)

  const msg4 = await seneca.act('role:test,cmd:bye,name:jo')
  console.log(msg4)

  seneca.act('role:test,cmd:bye,name:hazel')
    .then(msg => console.log(msg))

  seneca.act('role:test,cmd:bye,name:moss', function(err, response) {
    console.log(err, response)
  })
}

start()
