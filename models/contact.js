const mongoose = require('mongoose')

const contactSchema =mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    phone:{
        type:String,
        required: true,
    },
    message:{
        type:String,
        required: true,
    },
    role: {
        type: String,
        default: 'contact',
    },

    }, { timestamps: true });
        

const contactModel =mongoose.model('contact',contactSchema) 
module.exports =contactModel