var http = require('http')
var ws = require('ws')
var debug = require('debug')
var log = debug('webrtc-bootstrap-server')
var randombytes = require('randombytes')
var express = require('express')

function Server (secret, opts) {
  secret = secret || process.env.SECRET
  opts = opts || {}
  opts.public = opts.public || null
  opts.timeout = opts.timeout || 30 * 1000

  if (!secret) {
    throw new Error('Invalid secret: ' + secret)
  }

  if (!opts.httpServer) {
    var app = express()
    if (opts.public) {
      app.use(express.static(opts.public))
    }
    var port = opts.port || process.env.PORT || 5000
    this.httpServer = http.createServer(app)
    this.httpServer.listen(port)
    log('http server listening on %d', port)
  } else {
    this.httpServer = opts.httpServer
  }

  var root = null
  var prospects = this.prospects = {}

  function closeProspect (id) {
    if (prospects[id]) prospects[id].close()
  }

  function messageHandler (id) {
    return function incomingMessage (message) {
      message = JSON.parse(message)
      message.origin = id
      log('INCOMING MESSAGE')
      log(message)
      if (message.destination) {
        log('Destination defined')
        if (prospects.hasOwnProperty(message.destination)) {
          log('Known destination ' + message.destination)
          prospects[message.destination].send(JSON.stringify(message), function (err) {
            if (err) closeProspect(message.destination)
          })
        } else {
          log('Unknown destination ' + message.destination + ', ignoring message')
        }
      } else {
        if (root) root.send(JSON.stringify(message))
      }
    }
  }

  log('Opening websocket connection for root on ' + secret)

  this.server = new ws.Server({server: this.httpServer})
    .on('connection/' + secret + '/webrtc-bootstrap-root', function (ws) {
      log('root connected')
      ws.on('message', function (data) {
        log('WARNING: unexpected message from root: ' + data)
      })
      root = ws
    })
    .on('connection/join', function (ws) {
      function remove () {
        log('node ' + id + ' disconnected')
        delete prospects[id]
        clearTimeout(timeout)
      }
      var id = ws.id = randombytes(16).hexSlice()
      log('node connected with id ' + id)
      ws.on('message', messageHandler(id))
      ws.on('close', remove)
      prospects[id] = ws
      var timeout = setTimeout(function () {
        closeProspect(id)
      }, opts.timeout)
    })

  return this
}

Server.prototype.close = function () {
  log('closing ws server')
  this.server.close()
  log('closing http server')
  this.httpServer.close()
  log('closing all prospects')
  for (var p in this.prospects) {
    log(this.prospects[p].close)
    this.prospects[p].close()
  }
}

module.exports = Server
