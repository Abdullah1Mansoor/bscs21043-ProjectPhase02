const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Import listings data from the data.js file
const listings = require('./data');

// Middleware to parse incoming JSON requests
app.use(express.json());

// Routes
app.get('/api/listings', (req, res) => {
  res.json(listings); // Return the listings as JSON
});

app.get('/api/listings/:id', (req, res) => {
  const listing = listings.find(l => l.id === parseInt(req.params.id));
  listing ? res.json(listing) : res.status(404).json({ error: 'Listing not found' });
});

// Search route for listings based only on location
app.get('/api/listings/search', (req, res) => {
  const { location } = req.query;
  console.log('Received location query:', location); // Check if location parameter is received

  if (!location) {
    return res.status(400).json({ error: 'Location parameter is missing' });
  }

  const results = listings.filter(listing =>
    listing.location.toLowerCase().includes(location.toLowerCase())
  );

  // If no results, send an appropriate message
  if (results.length === 0) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  res.json(results);
});

app.get('/api/test', (req, res) => {
  res.send('Test route is working!');
});



// Mock booking route
app.post('/api/bookings', (req, res) => {
  console.log('Booking data received:', req.body); // Log the booking data
  res.json({ message: 'Booking successful!' });
});

// Start the server on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
