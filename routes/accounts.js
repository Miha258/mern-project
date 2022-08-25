const { Router } = require('express')
const { check, validationResult} = require('express-validator')
const User = require('../models/User')
const Manager = require('../models/Manager')
const bcrypt = require('bcrypt')

const router = Router()

//api /api/accounts

router.get('/user-account/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const user = await User.findById(id)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            return res.status(200).json({ data: user })
        }
        return res.status(400).json({ message: 'Invalid user id' })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})

router.get('/open-account/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const user = await User.findById(id)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            await user.updateOne({"$set": {opened: true}})
            console.log(user)
            return res.status(200).json({ message: 'Account opened successfully' })
        }
        return res.status(400).json({ message: 'Invalid user id' })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})


router.delete('/delete-account/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            await User.findByIdAndDelete(id)
            return res.status(200).json({ message: 'User deleted' })
        }
        return res.status(400).json({ message: 'Invalid user id' })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})


router.get('/user-accounts', async (req, res) => {
    try {
        const users = await User.find({})
        return res.status(200).json({ data: users })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})

router.put('/change-user-account', 
    [ 
        check('email', 'Invalid email').isEmail(),
        check('password', 'Invalid password').isLength({ min: 7 }),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const { userId, surname, name, email, password, dateOfBirth, addres } = req.body
        const candidate = await User.findOne({ email })
        if (candidate && candidate.id != userId) {
            return res.status(409).json({ message: 'This email already used' })
        }
        const passwordHash = await bcrypt.hash(password, 12)
        await User.findByIdAndUpdate(userId, { "$set": { surname, name, email, password: passwordHash, dateOfBirth, addres }})
        return res.status(200).json({ message: 'User successfully updated', data: { surname, name, email, password: passwordHash, dateOfBirth, addres } })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})


router.get('/all-managers', async (req, res) => {
    try {
        const managers = await Manager.find({})
        return res.status(200).json({ data: managers })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})


module.exports = router