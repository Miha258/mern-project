const { Schema, model } = require('mongoose')

const schema = new Schema({
    surname: { type: String, require: true }, 
    name: { type: String, require: true}, 
    email: { type: String, require: true, unique: true }, 
    password: { type: String, require: true }, 
    dateOfBirth: { type: Date, require: true }, 
    addres: { type: String, require: true },
    balance: { type: String, require: true },
    opened: { type: Boolean, require: true }
})

module.exports = model('User', schema)