const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({

    code: {
        type: String,
        required: true,
        unique: true
    },

    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 50
    },

    expiryDate: {
        type: Date,
        required: true
    },

    status: {
        type: Boolean,
        default: true
    },

    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

});

module.exports = mongoose.model('Coupon', couponSchema);
