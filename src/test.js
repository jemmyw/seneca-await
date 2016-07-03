import Seneca from './index'

const seneca = Seneca()

seneca.add({role:'test',cmd:'make'}, async function(msg) {
  return {msg: `hello ${msg.name}`}
})

async function start() {
  await seneca.ready()
  const msg = await seneca.act('role:test,cmd:make,name:jeremy')
  console.log(msg)

  const msg2 = await seneca.act('role:test,cmd:make,name:jo')
  console.log(msg2)
}

start()
