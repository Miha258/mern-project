const { Router } = require('express')
const { check, validationResult} = require('express-validator')
const User = require('../models/User')
const Manager = require('../models/Manager')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')

const router = Router()

//api /api/auth

router.post(
    '/user-register',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Invalid password').isLength({ min: 7 }),
        check('dateOfBirth', 'Invalid date').toDate(),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const { surname, name, email, password, dateOfBirth, addres, balance} = req.body
        const candidate = await User.findOne({ email })
        if (candidate) {
            return res.status(409).json({message: 'This user already registered'})
        }
        const passwordHash = await bcrypt.hash(password, 12)
        const user = new User({ surname, name, email, password: passwordHash, dateOfBirth, addres, balance, opened: false})
        await user.save()
        return res.status(201).json({ message: 'User successfully created'})
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error' })
    }
})

router.post(
    '/user-login', 
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Enter password').exists(),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid registration data'
            })
        }
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user){
            return res.status(404).json({ message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' })
        }

        const token = jwt.sign(
           { userId: user.id }, 
           config.get('jwtSecret'),
           { expiresIn: '1h' }
        )
        return res.json({ userId: user.id, token})
    } catch (err) {
        return res.status(400).json({ message: 'Error' })
    }
})

router.post('/manager-register',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Invalid password').isLength({ min: 7 }),
        check('dateOfBirth', 'Invalid date').toDate(),
    ],
    async (req, res) => {
        // try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array()
                })
            }
            const { surname, name, email, password } = req.body
            const candidate = await Manager.findOne({ email })
            if (candidate) {
                return res.status(409).json({message: 'This user manager registered'})
            }
            const passwordHash = await bcrypt.hash(password, 12)
            const manager = new Manager({ surname, name, email, password: passwordHash })
            await manager.save()
            return res.status(201).json({ message: 'Manager successfully created'})
        // } catch (err) {
        //     console.log(err)
        //     return res.status(400).json({ message: 'Error' })
        // }
})

router.post('/manager-login', 
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Enter password').exists(),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid registration data'
            })
        }
        const { email, password } = req.body
        const manager = await Manager.findOne({ email })
        if (!manager){
            return res.status(404).json({ message: 'Manager not found' })
        }

        const isMatch = await bcrypt.compare(password, manager.password)
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' })
        }

        const token = jwt.sign(
           { userId: manager.id }, 
           config.get('jwtSecret'),
           { expiresIn: '1h' }
        )
        return res.json({ userId: manager.id, token})
    } catch (err) {
        return res.status(400).json({ message: 'Error' })
    }
})

module.exports = router