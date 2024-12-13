const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { verifyAdmin } = require('../middleware/authMiddleware'); // Middleware to verify admin role
//const { Listing, Booking } = require('../models'); // Assuming Sequelize or similar ORM is used
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
// GET /api/admin/listings: Fetch all listings with pagination (admin view)
router.get('/listings', verifyAdmin, async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default pagination values
  const offset = (page - 1) * limit;

  try {
    const listings = await Listing.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: listings.rows,
      total: listings.count,
      totalPages: Math.ceil(listings.count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching paginated listings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch listings' });
  }
});

// POST /api/admin/listings: Add a new listing
router.post(
  '/listings',
  verifyAdmin,
  [
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('description').isString().notEmpty().withMessage('Description is required'),
    body('pricePerNight').isFloat({ gt: 0 }).withMessage('Price per night must be a positive number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, pricePerNight } = req.body;
    try {
      const newListing = await Listing.create({ title, description, pricePerNight });
      res.status(201).json({ success: true, data: newListing });
    } catch (error) {
      console.error('Error adding listing:', error);
      res.status(500).json({ success: false, error: 'Failed to add listing' });
    }
  }
);

// DELETE /api/admin/listings/:id: Delete a listing by ID (soft delete)
router.delete('/listings/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    await listing.update({ deletedAt: new Date() }); // Assuming a `deletedAt` column for soft deletes
    res.status(200).json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ success: false, error: 'Failed to delete listing' });
  }
});

// PUT /api/admin/listings/:id: Update a listing by ID
router.put('/listings/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, pricePerNight } = req.body;
  try {
    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const updatedListing = await listing.update({ title, description, pricePerNight });
    res.status(200).json({ success: true, data: updatedListing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ success: false, error: 'Failed to update listing' });
  }
});

// GET /api/admin/bookings: View all bookings (admin overview)
router.get('/bookings', verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.findAll({ include: [{ model: Listing }] });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// PUT /api/admin/bookings/:id: Update booking status or details
router.put('/bookings/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Example: updating booking status

  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const updatedBooking = await booking.update({ status });
    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, error: 'Failed to update booking' });
  }
});

module.exports = router;
