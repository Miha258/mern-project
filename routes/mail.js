const { Router } = require('express')
const router = Router()
const sendMail = require('../api/googlemail')


//api /api/mail
router.post('/send-mail', async (req, res) => {
    try {
        const { to, html } = req.body
        await sendMail(to, html)
        return res.status(200).json({ result: "Email sendeed" })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})  

module.exports = router