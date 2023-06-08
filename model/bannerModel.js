const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  linkUrl: {
    type: String,
    required:true

  },
  status: {
    type:String,

  },
  createdAt: {
    type: Date,
    default: Date.now
  },

});

module.exports = mongoose.model('Banner', bannerSchema);
