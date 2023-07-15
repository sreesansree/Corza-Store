
const { StreamDescription } = require("mongodb");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    mobile: {
        type: Number,
        require: true

    },
    is_verifed: {
        type: Boolean,
        required: false
    },
    is_blocked: {
        type: Boolean,
        required: false
    },
    
    wishlist: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    cart:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity:{
                type: Number, 
                default: 1
            }      
        }
    ],
    wallet:{
        type: Number,
        default: 0
    },
    address:[
       {
        userId: {type: String, required: true},
        name: {type: String,required: true},
        mobile: {type: String,required: true},
        adressLine1: {type: String,required: true},
        adressLine2: { type: String,},
        city: {type: String,required: true},
        state: { type: String,required: true},
        pin: {type: String,required: true},
        is_default: {type: Boolean,required: true}
       }
    ]
});


module.exports = mongoose.model('User', userSchema)