import express from 'express';
import Parking from '../models/Parking.js';

const router = express.Router();

// @route   GET /api/parking
// @desc    Get all parking locations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { lat, lng, sort } = req.query;
    
    let query = {};
    let parking = await Parking.find(query);

    // Calculate distance if lat/lng provided
    if (lat && lng) {
      parking = parking.map((p) => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          p.location.lat,
          p.location.lng
        );
        return { ...p.toObject(), distance };
      });

      // Sort by distance
      if (sort === 'nearest') {
        parking.sort((a, b) => a.distance - b.distance);
      }
    }

    // Sort by price
    if (sort === 'cheapest') {
      parking.sort((a, b) => a.pricePerHour - b.pricePerHour);
    }

    // Sort by available slots
    if (sort === 'slots') {
      parking.sort((a, b) => b.availableSlots - a.availableSlots);
    }

    res.json({
      success: true,
      count: parking.length,
      data: parking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching parking locations',
      error: error.message,
    });
  }
});

// @route   GET /api/parking/:id
// @desc    Get single parking location
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking location not found',
      });
    }

    res.json({
      success: true,
      data: parking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching parking location',
      error: error.message,
    });
  }
});

// @route   POST /api/parking
// @desc    Create new parking location (Admin only)
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const parking = await Parking.create(req.body);

    res.status(201).json({
      success: true,
      data: parking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating parking location',
      error: error.message,
    });
  }
});

// @route   PUT /api/parking/:id
// @desc    Update parking location
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const parking = await Parking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking location not found',
      });
    }

    res.json({
      success: true,
      data: parking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating parking location',
      error: error.message,
    });
  }
});

// @route   DELETE /api/parking/:id
// @desc    Delete parking location
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const parking = await Parking.findByIdAndDelete(req.params.id);

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: 'Parking location not found',
      });
    }

    res.json({
      success: true,
      message: 'Parking location deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting parking location',
      error: error.message,
    });
  }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

export default router;

