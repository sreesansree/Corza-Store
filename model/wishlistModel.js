const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const wishlistSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  items: [{
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        required:true
    },
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
  }]
});
const Wishlist=mongoose.model("Wishlist",wishlistSchema)
module.exports=Wishlist