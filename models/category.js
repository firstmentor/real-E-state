const mongoose = require('mongoose')

const CategorySchema =mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      }
    
})
const CategoryModel =mongoose.model('category',CategorySchema) 
module.exports =CategoryModel