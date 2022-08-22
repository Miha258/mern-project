const { Router } = require('express')
const router = Router()
const Transaction = require('../models/Transaction')
const User = require('../models/User')
const { check, validationResult} = require('express-validator')
const sendMail = require('../api/googlemail')
const Manager = require('../models/Manager')

//api /api/transactions

router.post('/transfer', 
    [
        check('email', 'Invalid email').isEmail()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const { userId, email, type, sum } = req.body
        const user = await User.findOne({ email }) //recive sum
        const candidate = await User.findById(userId) // send sum
        if (!user) {
            return res.status(404).json({ message: 'User doesn`t exists' })
        }

        const transferSum = parseFloat(sum.substring(4))
        const candidateBalance = parseFloat(candidate.balance.substring(4))
        const userBalance = parseFloat(user.balance.substring(4))
        
        if (email === candidate.email) {
            return res.status(400).json({ message: 'You can`t transfer money yourself' })
        }

        if (transferSum === 0) {
            return res.status(400).json({ message: 'You cant transfer zero' })
        }
        
        if (candidateBalance < transferSum) {
            return res.status(400).json({ message: 'Your balance too small to transfer this sum' })
        }
        
        const transaction = new Transaction({ userId, type, email: user.email, date: new Date(), sum, from: candidate.surname + " " + candidate.name, to: user.surname + " " + user.name})
        await transaction.save()
        
        await candidate.updateOne({ "$set": { balance:  "USD " + (candidateBalance - transferSum).toString()}})
        await user.updateOne({ "$set": { balance: "USD " + (userBalance + transferSum).toString()}})

        return res.status(200).json({ message: 'Transaction complite' }) 
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})

router.post('/lend',
    [
        check('email', 'Invalid email').isEmail(),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const { userId, email, type, sum } = req.body
        const user = await User.findOne({ email }) // receive sum
        const candidate = await User.findById(userId) // send sum
        if (!user) {
            return res.status(404).json({message: 'User doesn`t exists'})
        }

        const lendSum = parseFloat(sum.substring(4))
        const candidateBalance = parseFloat(candidate.balance.substring(4))
        const userBalance = parseFloat(user.balance.substring(4))
        
        if (email === candidate.email) {
            return res.status(400).json({message: 'You can`t lend money yourself'})
        }

        if (lendSum === 0) {
            return res.status(400).json({ message: 'You cant lend zero' })
        }
        
        if (candidateBalance < lendSum) {
            return res.status(400).json({ message: 'Your balance too small to lend this sum' })
        }

        if (userBalance * 0.6 < lendSum) {
            return res.status(400).json({ message: 'User balance too small to recive this sum by lending' })
        }

        let transaction = new Transaction({userId: user.id, type, email: user.email, date: new Date(), sum, closed: false, from: candidate.surname + " " + candidate.name, to: user.surname + " " + user.name })
        await transaction.save()
        transaction = new Transaction({userId, type, email: user.email, date: new Date(), sum, closed: false, from: candidate.surname + " " + candidate.name, to: user.surname + " " + user.name })
        await transaction.save()
        
        await candidate.updateOne({ "$set": { balance: "USD " + (candidateBalance - lendSum).toString()}})
        await user.updateOne({ "$set": { balance: "USD " + (userBalance + lendSum).toString()}})

        let checkLendStatus = setInterval(async () => { 
            if (userBalance * 0.6 < lendSum) {
                clearInterval(checkLendStatus)
                await sendMail(user.email, `
                <html lang="en">
                <head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
                </head>
                    <body>
                        <div id="root">
                            <h1>Dear ${user.surname} ${user.name}.Fill up your balance or your account will be deleted</h1>
                        </div>
                    </body>
                </html>
                `)
                checkLendStatus = setInterval(async () => {
                    if (userBalance === 0) {
                        const allManagers = await Manager.find({})
                        const emails = allManagers.filter(manager => manager.email)
                        clearInterval(checkLendStatus)
                        
                        for (let email of emails){
                            await sendMail(email,`
                            <html lang="en">
                            <head>
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
                            </head>
                                <body>
                                    <div id="root">
                                        <h1>Close this account bcause this user can\`t pay credit</h1>
                                        <a className="dark-grey waves-light btn text-center" href="http://localhost:3000/manager/user-accounts#${user.id}">Accept</a>
                                    </div>
                                </body>
                            </html>
                            `)
                        }
                    }
                }, 5000)
            } else if (transaction.date === transaction.date.setDate(transaction.date.getDate + 7)){
                await candidate.updateOne({ "$set": { balance: "USD " + (candidateBalance - lendSum).toString() }})
                await user.update({ "$set": { balance: "USD " + (userBalance + lendSum).toString() }})
                await Transaction.findByIdAndUpdate(user.id, { "$set": { closed: true }})
                await Transaction.findByIdAndUpdate(userId, { "$set": { closed: true }})
            }
        }, 5000)

        return res.status(200).json({ message: 'Transaction complite' })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})

router.get( '/user-transactions/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const transactions = await Transaction.find({ userId: id })
            return res.status(200).json({ message: transactions }) 
        } 
        return res.status(400).json({ message: 'Invalid user id' })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})  

module.exports = router