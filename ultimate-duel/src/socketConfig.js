const port = process.env.PORT || 'http://localhost:4000'
const io = require('socket.io-client')
const socket = io(port)

module.exports = socket