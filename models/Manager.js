const { Schema, model } = require('mongoose')

const schema = new Schema({
    surname: { type: String, require: true }, 
    name: { type: String, require: true}, 
    email: { type: String, require: true, unique: true }, 
    password: { type: String, require: true }
})

module.exports = model('Manager', schema)