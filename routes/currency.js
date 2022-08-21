const { Router } = require('express')
const CC = require('currency-converter-lt')
const router = Router()
const User = require('../models/User')


//api /api/currency

router.get('/convert', async (req, res) => {
    try {
        const { from, to, amount  } = req.query
        if (to === 'LVC') {
            let usersCount = (await User.find({})).length
            usersCount = 100 > usersCount ? 100 - usersCount : 100
            const result = parseFloat(((usersCount * 0.01) * amount).toFixed(2))
            return res.status(200).json({ result })
        } else if (from === 'LVC') {
            let usersCount = (await User.find({})).length
            usersCount = 100 > usersCount ? 100 - usersCount : 100
            const result = parseFloat((amount / (usersCount * 0.01)).toFixed(2))
            return res.status(200).json({ result: result})
        }
        const currencyConverter = new CC({from, to, amount: parseFloat(amount)})
        const convertedCur = await currencyConverter.convert()
        return res.status(200).json({ result: convertedCur })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Convertion error' })
    }
})  

module.exports = router