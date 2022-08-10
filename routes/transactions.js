const { Router } = require('express')
const router = Router()
const Transaction = require('../models/Transaction')
const User = require('../models/User')
const { check, validationResult} = require('express-validator')

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

        const transferSum = parseFloat(sum.replace(',','.'))
        const candidateBalance = parseFloat(candidate.balance.replace(',','.'))
        const userBalance = parseFloat(user.balance.replace(',','.'))
        
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
        
        await candidate.updateOne({ "$set": { balance: (candidateBalance - transferSum).toString().replace('.',',') + " USD" }})
        await user.updateOne({ "$set": { balance: (userBalance + transferSum).toString().replace('.',',') + " USD" }})

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

        const lendSum = parseFloat(sum.replace(',','.'))
        const candidateBalance = parseFloat(candidate.balance.replace(',','.'))
        const userBalance = parseFloat(user.balance.replace(',','.'))
        
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
        
        await candidate.updateOne({ "$set": { balance: (candidateBalance - lendSum).toString().replace('.',',') + " USD" }})
        await user.updateOne({ "$set": { balance: (userBalance + lendSum).toString().replace('.',',') + " USD" }})

        let checkLendStatus = setInterval(async () => { 
            if (userBalance * 0.6 < lendSum) {
                clearInterval(checkLendStatus)
                //Send message to user
                checkLendStatus = setInterval(() => {
                    if (userBalance === 0) {
                        clearInterval(checkLendStatus)
                        //Send message to manager
                    }
                }, 5000)
            } else if (transaction.date === transaction.date.setDate(transaction.date.getDate + 7)){
                await candidate.updateOne({ "$set": { balance: (candidateBalance - lendSum).toString().replace('.',',') + " USD" }})
                await user.update({ "$set": { balance: (userBalance + lendSum).toString().replace('.',',') + " USD" }})
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