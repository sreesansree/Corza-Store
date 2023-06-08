const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        requierd:true
    },
    password:{
        type:String,
        requierd:true
    },
})

module.exports= mongoose.model('admin',adminSchema)