const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  product: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
      image: { type: String },
      address: { type: Object },
      
    },
  ],

  // address: {
  //   type: String,
  //   required: true,
  // },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adress",
    required: true,
  },

  orderId: {
    type: String,
    required: true,
  },

  total: {
    type: Number,
    required: true,
  },

  discountAmt: {
    type: Number,
  },

  amountAfterDscnt: {
    type: Number,
  
  },

  coupon: {
    type: String,
  },

  paymentMethod: {
    type: String,
    required: true,
  },

  couponUsed: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: ["pending", "Shipped", "Delivered", 'Cancelled', 'Returned'],
    default: "pending",
  },

  date: {
    type: Date,
    default: Date.now,
  },
  orderDate: {
    type: Date, // Add the orderDate field of type Date
  },
});

module.exports = mongoose.model("Order", orderSchema);
