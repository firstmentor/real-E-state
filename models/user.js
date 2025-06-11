const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
   
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    createdAt: { type: Date, default: Date.now },
    isApproved: { type: Boolean, default: true }
    }, { timestamps: true });

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;