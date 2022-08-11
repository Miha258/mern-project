const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const app = express()
const PORT = config.get('port') || 5000
const cors = require('cors')

app.use(cors())
app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/currency', require('./routes/currency'))
app.use('/api/accounts', require('./routes/accounts'))
app.use('/api/transactions', require('./routes/transactions'))  
app.use('/api/mail', require('./routes/mail'))  


const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'))
        app.listen(PORT, () => console.log(`App started on port: ${PORT}`))
    } catch (error) { 
        console.log(`Server error: ${error}`)
        process.exit(1)
    }
}

start()

