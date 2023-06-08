const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
 
    userId: {
        type: String,
        required: false
    },

    name: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        required: true
    },

    adressLine1: {
        type: String,
         required: true
    },

    
    adressLine2: {
        type: String,
        
    },

    city: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    pin: {
        type: String,
        required: true
    },

    is_default: {
        type: Boolean,
        required: false
    }
})


module.exports = mongoose.model('adress', addressSchema)