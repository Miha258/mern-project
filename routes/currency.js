const { Router } = require('express')
const CC = require('currency-converter-lt')
const router = Router()


//api /api/currency

router.get( '/convert', async (req, res) => {
    try {
        const { from, to, amount  } = req.query
        const currencyConverter = new CC({from, to, amount: parseFloat(amount)})
        const convertedCur = await currencyConverter.convert()
        return res.status(200).json({ result: convertedCur })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})  

module.exports = router