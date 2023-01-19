const {Router} = require("express");
const router = Router()
const mongoose = require('mongoose')
const Product = require('../models/Product')
const authMiddleware = require('../middleware/auth')
const userMiddleware = require('../middleware/user')
router.get('/', async (req, res) => {
    // lean funksiyasi jsonga aylantiradi
    const products = await Product.find().lean()
    res.render('index', {
        title: 'Shop',
        products: products.reverse(),
        userId:  req.userId? req.userId.toString() : null,
        //reverse funksiyasi massivni teskarisiga o'giradi. bu Yangi qoshilgan product tepada turishi uchun
    })

})


router.get('/products',async (req, res) => {
    const user = req.userId ? req.userId.toString() :null
    const myProducts = await Product.find({user: user}).populate('user').lean()

    res.render('products', {
        title: 'Products',
        isProduct: true,
        myProducts:myProducts,
    })
})
router.get('/add', authMiddleware, (req, res) => {

    res.render('add', {
        title: 'Add',
        isAdd: true,
        errorAddProducts: req.flash('errorAddProducts')
    })
})
router.get('/product/:id',async (req,res ) => {
    console.log(req.params.id)
    const product = await Product.findById(req.params.id).populate('user').lean()
    res.render('product', {
        product:product
    })
})
router.get('/edit-product/:id', async (req,res) =>{
    const product = await Product.findById(req.params.id).populate('user').lean()
    res.render("edit-product", {
        product: product,
        errorEditProducts: req.flash('errorEditProducts')
    })
})
router.post('/edit-product/:id', async (req,res) => {
    const {title, description, image, price} = req.body
    const id = req.params.id
    if (!title || !description || !image || !price){
        req.flash('errorEditProducts', "All fields are required")
        res.redirect(`/edit-product/${id}`)
        return
    }
    const product = {title:title, description:description, image:image, price:price}
    const updateProduct = await Product.findByIdAndUpdate(id, product, {new:true})
    // console.log(updateProduct)
    res.redirect('/')
})
router.post("/delete-product/:id", async (req,res) => {
    const deleteProduct = await Product.findByIdAndRemove(req.params.id)

    res.redirect("/")
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