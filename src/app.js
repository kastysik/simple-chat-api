const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = 4008
const socketIO = require('socket.io')(http, {
    cors: {
        origins: ["http://localhost:3000", "http://localhost:3456"]
    }
});

app.use(cors())
let users = []

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)
    socket.on("client:message", data => {
        socketIO.emit("server:message", data)
    })

    socket.on("client:typing", data => (
        socket.broadcast.emit("server:typing", data)
    ))

    socket.on("client:newUser", data => {
        console.log(data);
        users.push(data)
        socketIO.emit("server:newUser", users)
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} user disconnected`);
        users = users.filter(user => user.socketId !== socket.id)
        socketIO.emit("server:newUser", users)
        socket.disconnect()
    });
});

app.get("/api", (req, res) => {
    res.json({message: "Hello"})
});


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});