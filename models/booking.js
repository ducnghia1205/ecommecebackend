const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Hotel',
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  adults: {
    type: Number,
    default: 1
  },
  children: {
    type: Number
  },
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



module.exports  = mongoose.model('Booking', BookingSchema);
