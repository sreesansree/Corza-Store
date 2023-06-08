const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
      }
    });

    
module.exports =  mongoose.model('CartItem', cartItemSchema);