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
    enum: ['Pending', 'Confirmed', 'Cancelled'], // status options
    default: 'Confirmed'
  },
  message: {
    type: String,
   
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

// Optional: index for better performance on queries
propertyBookSchema.index({ buyer: 1 });
propertyBookSchema.index({ seller: 1 });
propertyBookSchema.index({ property: 1 });

const PropertyBook = mongoose.model('PropertyBook', propertyBookSchema);
module.exports = PropertyBook;
