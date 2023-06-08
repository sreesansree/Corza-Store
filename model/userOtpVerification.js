const mongoose = require('mongoose');

const userOtpVerificationSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    OTP: {
        type: String,
    },
    createdAt: Date,
    expiredAt: Date
})

module.exports = mongoose.model('userotp',userOtpVerificationSchema)