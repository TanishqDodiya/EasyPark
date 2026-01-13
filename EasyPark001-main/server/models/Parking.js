import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Parking name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    location: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
    },
    totalSlots: {
      type: Number,
      required: [true, 'Total slots is required'],
      min: 1,
    },
    availableSlots: {
      type: Number,
      required: true,
      default: function () {
        return this.totalSlots;
      },
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    images: [String],
    description: String,
    entryInstructions: String,
    exitInstructions: String,
    operatingHours: {
      open: String,
      close: String,
    },
    features: [String], // e.g., ["Covered", "Security", "EV Charging"]
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
parkingSchema.index({ 'location.lat': 1, 'location.lng': 1 });

const Parking = mongoose.model('Parking', parkingSchema);

export default Parking;

