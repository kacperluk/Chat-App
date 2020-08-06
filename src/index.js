const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || '3000'
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', 'Welcome to Chat-app')
    socket.broadcast.emit('message', 'A new user has joined!!!')

    socket.on('sendMessage', (msg) => {
        io.emit('message', msg)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'User has left')
    })
})

server.listen(port, () => {
    console.log(`listening on port ${port}`)
})