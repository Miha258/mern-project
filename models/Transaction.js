const { Schema, model } = require('mongoose')

const schema = new Schema({
    userId: { type: String, require: true },
    type: { type: String, require: true },
    email: { type: String, require: true }, 
    date: { type: Date, require: true }, 
    sum: { type: String, require: true }, 
    from: { type: String, require: true },
    to: { type: String, require: true }
})

module.exports = model('Transaction', schema)