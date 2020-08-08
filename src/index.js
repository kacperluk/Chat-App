const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || '3000'
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', generateMessage('Welcome to Chat-app'))
    socket.broadcast.emit('message', generateMessage('A new user has joined!!!'))

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter()

        if (filter.isProfane(msg)) {
            return callback('Profanity filter is not allowed!')
        }

        io.emit('message', generateMessage(msg))
        callback()
    })

    socket.on('sendLocation', ({ latitude, longitude }, callback) => {
        const msg = `https://google.com/maps?q=${latitude},${longitude}`
        io.emit('locationMessage', msg)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('User has left'))
    })
})

server.listen(port, () => {
    console.log(`listening on port ${port}`)
})