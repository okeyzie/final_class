const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: { 
        type: Number, 
        required: true
    },
    phoneNumber: {
        type: String,
        require:true,
        trim: true,
        unquie:true
    },
    profilePicture: {
        imageUrl:{type: String, required:true },
        publicId:{type: String, required:true }
    },
    isVerifed: {
        type: Boolean,
        default: false
    }
}, 
{ timestamps: true })

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;