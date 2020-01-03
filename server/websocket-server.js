const http = require('http')
const webSocketServer = require('websocket').server
const handlers = require('./handlers')
const webSocketsServerPort = process.env.PORT //process.env.PORT
const server = http.createServer()

server.listen(webSocketsServerPort, '0.0.0.0', function () {
  console.log((new Date()) + " Server is listening on port " +
    webSocketsServerPort)
})

const wsServer = new webSocketServer({
  httpServer: server
})

wsServer.on('request', function (request) {
  let connection = request.accept(null, null)
  handlers['PUSH_CONNECTION'](connection)

  connection.on('message', function (message) {
    if (message.type == 'utf8') {
      let data = JSON.parse(message.utf8Data)
      console.log(data);
      handlers[data.type](data,connection)
      
    }
  })
  connection.on('close', function (code) {
    handlers['DELETE_CONNECTION'](connection)
    console.log(connection)
  })
})