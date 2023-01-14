const {Router} = require("express");
const router = Router()
const Product = require('../models/Product')
const authMiddleware = require('../middleware/auth')
const userMiddleware = require('../middleware/user')
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Shop'
    })

})

router.get('/products', (req, res) => {
    res.render('products', {
        title: 'Products',
        isProduct: true
    })
})
router.get('/add', authMiddleware, (req, res) => {

    res.render('add', {
        title: 'Add',
        isAdd: true,
        errorAddProducts: req.flash('errorAddProducts')
    })
})
router.post('/add-products', userMiddleware ,async (req, res) => {
    // console.log(req.body)
    const {title, description, image, price} = req.body
    if (!title || !description || !image || !price){
        req.flash('errorAddProducts', "All fields are required")
        res.redirect('/add')
        return
    }
    const productData = {
        title: title,
        description: description,
        image: image,
        price: price
    }
    await Product.create({...productData, user: req.userId})
    console.log(req.userId)
    res.redirect('/')
})
module.exports = router