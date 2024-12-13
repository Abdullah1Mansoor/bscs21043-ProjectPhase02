const mongoose = require('mongoose');

// Define the booking schema
const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing', // Reference to the Listing model
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled'],
    default: 'pending',
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// Create and export the Booking model
module.exports = mongoose.model('Booking', bookingSchema);
