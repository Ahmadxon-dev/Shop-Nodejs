const {Schema, model} = require('mongoose')

const ProductSchema = new Schema({
    title: {type: String, required:true },
    description: {type: String, required:true},
    image: {type: String, required:true},
    price: {type: Number, required:true},
    user: {type: Schema.Types.ObjectId, ref:'User'}

}, {timestamps: true})

// timestamps: true ------------- bu yaratilgan  vaqtni va yangilangan vaqtni ko'rsatadi
module.exports = model("Product", ProductSchema)