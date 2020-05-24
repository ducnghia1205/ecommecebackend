const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
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


module.exports  = mongoose.model('Booking', BookingSchema);
