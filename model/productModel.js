const mongoose = require('mongoose');
const Category = require('../model/categoryModel');


const productschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,

    },
    brand:{
        type:String,
        required:true
    },
    offer: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        default: 0
    },
    is_blocked: {       
        type: Boolean,
        default: false
    },
   
    isWishlisted:{
        type:Boolean,
        dafault:true
    },
    isOnCart: {
        type: Boolean,
        default: false,
    }

});
 module.exports = mongoose.model('Product', productschema);

