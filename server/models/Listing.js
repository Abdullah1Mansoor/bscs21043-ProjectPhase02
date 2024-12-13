const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  id: {type: Number, requuired:true},
  title: { type: String, required: true },
  type: { type: String, required: true },
  guests: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Listing', ListingSchema);
