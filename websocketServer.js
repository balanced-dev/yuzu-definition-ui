const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8081 })
console.log("starting setup")

wss.on('connection', (ws) => {
  console.log("connecting")
  ws.on('message', (message) => {
    console.log(`Received message => ${message}`)
  })
  ws.send('ho!')
})