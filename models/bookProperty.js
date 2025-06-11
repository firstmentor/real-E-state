const mongoose = require('mongoose');

const propertyBookSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'property',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'], // ✔️ Clearly defined options
    default: 'Confirmed'
  },
  message: {
    type: String
  }
}, {
  timestamps: true
});

const PropertyBook = mongoose.model('PropertyBook', propertyBookSchema);
module.exports = PropertyBook;
