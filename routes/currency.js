const { Router } = require('express')
const CC = require('currency-converter-lt')
const router = Router()
const User = require('../models/User')


//api /api/currency

async function convertLVC(to, from, amount) {
    if (to === 'LVC') {
        const currencyConverter = new CC({from, to: "USD", amount: parseFloat(amount)})
        const usdAmount = await currencyConverter.convert()
        
        let usersCount = (await User.find({})).length
        usersCount = 100 > usersCount ? 100 - usersCount : 100
        const result = parseFloat(((usersCount * 0.01) * usdAmount).toFixed(2))
        return result
    } else if (from === 'LVC') {
        const currencyConverter = new CC({from: "USD", to, amount: parseFloat(amount)})
        const usdAmount = await currencyConverter.convert()

        let usersCount = (await User.find({})).length
        usersCount = 100 > usersCount ? 100 - usersCount : 100
        const result = parseFloat((usdAmount / (usersCount * 0.01)).toFixed(2))
        return result
    }
}

router.get('/convert', async (req, res) => {
    try {
        const { to, from, amount  } = req.query
        let convertedCur
        if (from === "LVC" || to === "LVC"){
            convertedCur = await convertLVC(from, to, amount)
            return res.status(200).json({ result: convertedCur })
        }

        const currencyConverter = new CC({from: to, to: from, amount: parseFloat(amount)})
        convertedCur = await currencyConverter.convert()
        return res.status(200).json({ result: convertedCur })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Convertion error' })
    }
})  


module.exports = { router, convertLVC }