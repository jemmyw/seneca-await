# Seneca Async

Use async / await methods with seneca.

## Install

```
npm install seneca-async
```

## Usage

```
import Seneca from 'seneca-async'

const seneca = Seneca()

async function addHello(msg) {
  return `Hello ${msg}`
}

seneca.add('role:test,cmd:echo', async function(msg) {
  const outputMsg = await addHello(msg.text)
  return {text: outputMsg}
})

async function start() {
  await seneca.ready()

  const response = await seneca.act('role:test,cmd:echo,text:Person')
  console.log(response.text) // => Hello Person
}

start()
```

