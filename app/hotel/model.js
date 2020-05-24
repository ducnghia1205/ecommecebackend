const mongoose = require('mongoose');
const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
  },
  avatar: {
    type: String,
  },
  photos: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['Active', 'Locked', 'Pending'],
    default: 'Active'
  },
}, {
  timestamps: true,
  toObject: {
    transform: function (doc, ret) {
      delete ret.__v;
    }
  }
});

module.exports  = mongoose.model('Hotel', HotelSchema);
