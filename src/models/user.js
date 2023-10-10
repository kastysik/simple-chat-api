const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    surname: {
        required: false,
        type: String
    },
    nickname: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    token: {
        required: true,
        type: String
    },
})

module.exports = mongoose.model('users', userSchema)
