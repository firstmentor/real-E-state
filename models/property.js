const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    discreption: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    squarefit: {
      type: String,
      required: true,
    },
    bedrooms: {
      type: String,
      required: true,
    },
    beds:{
      type: String,
      required: true,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Available', 'Booked', 'Sold'], // add "Booked"
      default: 'Available'
    },
    bookedBy: {
        type: String, // future: mongoose.Schema.Types.ObjectId for user reference
        default: ""
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

  },
  { timestamps: true }
); // jab hum insert krenge to 2 field dega created data and insert data time and date
const PropertyModel = mongoose.model("property", PropertySchema);
module.exports = PropertyModel;