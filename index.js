const express = require('express')
const {create} = require('express-handlebars')
const authRoutes = require('./routes/auth')
const productsRoutes = require('./routes/products')
const dotenv = require('dotenv')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const varMiddleware = require('./middleware/var')
const session  = require('express-session')
const cookieParser = require('cookie-parser') // browserdagi cookie larni olish uchun cookie parser kutubxonasi ornatildi
const app = express();
const PORT = process.env.PORT || 5000
dotenv.config()
const hbs = create({
    defaultLayout: "main",
    extname: "hbs"
})
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(express.static("public"))
app.use(express.static('images'))
app.use(session({secret: "sammi", resave:false, saveUninitialized:false}))
app.use(flash())
app.use(varMiddleware)

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', './views')


app.use(authRoutes)
app.use(productsRoutes)

const startApp = () => {
    try{
        mongoose.set("strictQuery", false)
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
        },() => console.log("MongoDB connected"))
        app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));
    }catch (e) {
        console.log(e)
    }
}

startApp()
