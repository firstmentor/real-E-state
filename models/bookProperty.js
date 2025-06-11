const mongoose = require('mongoose');

const propertyBookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to User model
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'property', // Reference to Property model
    required: true
  },
  bookedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'pending'],
    default: 'booked'
  }
}, {
  timestamps: true // automatically adds createdAt and updatedAt
});

const PropertyBook = mongoose.model('PropertyBook', propertyBookSchema);
module.exports = PropertyBook;
