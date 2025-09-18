const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    productName: { 
        type: String, 
        required: true,
        trim: true ,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true

    },
    productPicture: {
        imageUrl:{type: String, required:true },
        publicId:{type: String, required:true }
    }
}, 
{ timestamps: true })

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;