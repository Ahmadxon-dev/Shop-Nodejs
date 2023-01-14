module.exports= function(req,res,next){
    // console.log(req.cookies.token)
    // req.cookies ni cookie-parser kutubxonasi yordamida qilinadi
    const isAuth = req.cookies.token ? true : false
    res.locals.token = isAuth
    // next funksiyasi bu middleware dan keyingi funksiyalani ishlashini davom ettirish uchun
    next();
}