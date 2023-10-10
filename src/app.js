require('dotenv').config();

const routes = require('./routes/routes');
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const http = require('http').Server(app);

const socketIO = require('socket.io')(http, {
    cors: {
        origins: ["http://localhost:3000", "http://localhost:3456"]
    }
});

const PORT = process.env.API_PORT;
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.use(cors());
let users = [];

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

app.use(express.json());

app.use('/api', routes);

app.get("/api", (req, res) => {
    res.json({message: "Hello"})
});


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
