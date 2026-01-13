import express from 'express';
import Booking from '../models/Booking.js';
import Parking from '../models/Parking.js';

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings (with optional userId filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};

    if (userId) {
      query.userId = userId;
    }

    const bookings = await Booking.find(query)
      .populate('parkingId', 'name address location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      'parkingId',
      'name address location pricePerHour'
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message,
    });
  }
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      parkingId,
      date,
      time,
      duration,
      vehicle,
      slot,
      paymentMethod,
      userId,
    } = req.body;

    // Get parking to calculate amount
    const parking = await Parking.findById(parkingId);
    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking location not found',
      });
    }

    // Check if slots are available
    if (parking.availableSlots <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No slots available',
      });
    }

    // Calculate amount
    const amount = parking.pricePerHour * duration;

    // Create booking
    const booking = await Booking.create({
      userId: userId || null,
      parkingId,
      date: new Date(date),
      time,
      duration,
      vehicle,
      slot,
      amount,
      paymentMethod,
      paymentStatus: 'completed', // In real app, this would be set after payment gateway confirmation
      status: 'active',
    });

    // Populate parking details
    await booking.populate('parkingId', 'name address location');

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking (e.g., mark as completed, cancelled)
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('parkingId', 'name address');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // If booking is cancelled or completed, free up the slot
    if (req.body.status === 'cancelled' || req.body.status === 'completed') {
      await Parking.findByIdAndUpdate(booking.parkingId._id, {
        $inc: { availableSlots: 1 },
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating booking',
      error: error.message,
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Free up the slot
    await Parking.findByIdAndUpdate(booking.parkingId, {
      $inc: { availableSlots: 1 },
    });

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Booking deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message,
    });
  }
});

export default router;

