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
    }
})

module.exports = mongoose.model('user', userSchema)