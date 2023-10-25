const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        index:true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    highscore: {
        type: Number,
        required: false
    },
    session_id: {
        type: String,
        unique:true
    }
})

module.exports = mongoose.model('user', userSchema)