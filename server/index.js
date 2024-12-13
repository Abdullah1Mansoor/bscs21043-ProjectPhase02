const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables
//const { adminRouter } = require('./routes/adminRoutes'); // Import admin routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Import Models
const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking'); // Import the Booking model

// Import Middleware
const authMiddleware = require('./middleware/authMiddleware');

// Paths to store user data
const userDataPath = path.join(__dirname, 'data', 'user.json');

// Routes

// User Registration
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Read users from user.json
    const users = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword };

    // Add the new user to the users array
    users.push(newUser);
    fs.writeFileSync(userDataPath, JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user', details: err.message });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Dynamically fetch admin status from the user.json file
    const isAdmin = user.isAdmin || false;

    const token = jwt.sign(
      { userId: user.email, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Login successful!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login user', details: err.message });
  }
});



// Secure Route Example
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Fetch Listings
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Import JSON Data into MongoDB
app.post('/api/import-listings', async (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'data.json');
  
  try {
    // Read data from JSON file
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Insert data into MongoDB
    await Listing.insertMany(jsonData);

    res.status(200).json({ message: 'Listings imported successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to import listings', details: err.message });
  }
});

// Create Booking
app.post('/api/bookings', authMiddleware, async (req, res) => {
  const { listingId, checkInDate, checkOutDate, totalPrice } = req.body;
  const userId = req.user.userId; // Extract the userId from the JWT token
  
  try {
    // Create a new booking object
    const newBooking = new Booking({
      userId,
      listingId,
      checkIn: new Date(checkInDate),
      checkOut: new Date(checkOutDate),
      status: 'pending', // Default status
    });

    // Save the booking to the database
    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });
  } catch (err) {
    console.error('Error creating booking:', err.message);
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
});
//admin code
//app.use('/api/admin', adminRouter);  // Use the adminRouter for admin routes
// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
