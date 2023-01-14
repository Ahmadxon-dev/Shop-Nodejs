const {Router} = require("express");
const router = Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const generateJWTToken = require('../services/token')
router.get('/login', (req, res) => {
    if (req.cookies.token ){
        res.redirect('/')
        return
    }
    res.render('login', {
        title: 'Login',
        isLogin: true,
        loginError: req.flash("loginError")
    })
})
router.get('/register', (req, res) => {
    if (req.cookies.token ){
        res.redirect('/')
        return
    }
    res.render('register', {
        title: 'Register',
        isRegister: true,
        registerError: req.flash("registerError")
    })
})

router.post('/login',async (req,res) => {
    const {email, password} = req.body
    if (!email || !password) {
        req.flash('loginError', "All fields are required")
        res.redirect('/login')
        return
    }
    const user = await User.findOne({email})
    if (!user) {
        req.flash("loginError", "User not found")
        res.redirect('/login')
        return
    }
    const isPassEqual = await bcrypt.compare(password, user.password)
    if (!isPassEqual) {
        req.flash('loginError', "Password Wrong")
        res.redirect('/login')
        return
    }
    const token =generateJWTToken(user._id)
    // cookie larga joylash
    //        ism berish  token,     konfiguratsiya
    res.cookie("token", token, {httpOnly: true, secure: true})
    res.redirect('/')
})

router.post('/register', async(req, res) => {
    try{
        const {firstname, lastname, email, password} = req.body
        if (!firstname || !lastname || !email || !password){
            req.flash('registerError', "All fields are required")
            res.redirect('/register')
            return
        }
        const candidate = await User.findOne({email})
        if (candidate){
            req.flash("registerError", "User already registered")
            res.redirect('/register')
            return
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const userdata = {
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
        }
        const user = await User.create(userdata)
        const token =generateJWTToken(user._id)
        // cookie larga joylash
        //        ism berish  token,     konfiguratsiya
        res.cookie("token", token, {httpOnly: true, secure: true})
        res.redirect('/')
    }catch (e) {
        console.log(e)
    }
})


router.get('/logout', (req, res) => {

    res.clearCookie('token')
    res.redirect('/')
})

module.exports = router