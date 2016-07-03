# Seneca Async

Use async / await methods with seneca.

## Install

```
npm install seneca-async
```

## Setup

You need to have babel to use await functions.

http://babeljs.io/docs/plugins/transform-async-to-module-method/

## Usage

```
import Seneca from 'seneca-async'

const seneca = Seneca()

async function addHello(msg) {
  return `Hello ${msg}`
}

seneca.add('role:test,cmd:sayhello', async function(msg) {
  const text = await addHello(msg.name)
  return {text: text}
})

async function start() {
  await seneca.ready()

  const response = await seneca.act('role:test,cmd:sayhello,name:Person')
  console.log(response.text) // => Hello Person
}

start()
```

