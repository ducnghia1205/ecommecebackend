const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  description: {
    type: String,
  },
  photos: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['Active', 'Locked', 'Pending'],
    default: 'Pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }
}, {
  timestamps: true,
  toObject: {
    transform: function (doc, ret) {
      delete ret.__v;
    }
  }
});



module.exports  = mongoose.model('Hotel', HotelSchema);
