import express from 'express';
import Booking from '../models/Booking.js';
import Parking from '../models/Parking.js';

const router = express.Router();

// @route   GET /api/analytics/stats
// @desc    Get management analytics (bookings count, revenue, etc.)
// @access  Public (should be Private/Admin in production)
router.get('/stats', async (req, res) => {
  try {
    // Get total bookings count
    const totalBookings = await Booking.countDocuments();

    // Get completed bookings (paid)
    const completedBookings = await Booking.countDocuments({
      paymentStatus: 'completed',
    });

    // Get active bookings
    const activeBookings = await Booking.countDocuments({
      status: 'active',
      paymentStatus: 'completed',
    });

    // Calculate total revenue (sum of all completed payments)
    const revenueData = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          averageBookingAmount: { $avg: '$amount' },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    const averageBookingAmount = revenueData[0]?.averageBookingAmount || 0;

    // Get revenue by payment method
    const revenueByPaymentMethod = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
        },
      },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get bookings by parking location
    const bookingsByParking = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
        },
      },
      {
        $group: {
          _id: '$parkingId',
          totalRevenue: { $sum: '$amount' },
          bookingCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'parkings',
          localField: '_id',
          foreignField: '_id',
          as: 'parking',
        },
      },
      {
        $unwind: '$parking',
      },
      {
        $project: {
          parkingName: '$parking.name',
          parkingAddress: '$parking.address',
          totalRevenue: 1,
          bookingCount: 1,
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
    ]);

    // Get recent bookings (last 10)
    const recentBookings = await Booking.find({
      paymentStatus: 'completed',
    })
      .populate('parkingId', 'name address')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('bookingId amount date time duration vehicle slot paymentMethod createdAt');

    // Get bookings by status
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get total parking locations
    const totalParkingLocations = await Parking.countDocuments();

    res.json({
      success: true,
      data: {
        overview: {
          totalBookings,
          completedBookings,
          activeBookings,
          totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimal places
          averageBookingAmount: Math.round(averageBookingAmount * 100) / 100,
          totalParkingLocations,
        },
        revenueByPaymentMethod,
        bookingsByParking,
        recentBookings,
        bookingsByStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message,
    });
  }
});

export default router;

