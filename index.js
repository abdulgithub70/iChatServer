const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

const users = {}

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log('new user joined', name)
        users[socket.id] = name;
        socket.emit('user-joined', name)
    })

    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]
    })
})

app.get('/', (req, res) => {
    res.send('Server is Running 👍');
})

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
