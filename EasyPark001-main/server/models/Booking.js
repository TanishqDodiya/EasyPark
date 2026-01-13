import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Allow anonymous bookings
    },
    parkingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parking',
      required: [true, 'Parking ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    time: {
      type: String, // e.g., "14:30"
      required: [true, 'Booking time is required'],
    },
    duration: {
      type: Number, // in hours
      required: [true, 'Duration is required'],
      min: 1,
    },
    vehicle: {
      type: {
        type: String, // Car, Bike, SUV
        required: true,
      },
      number: {
        type: String,
        required: [true, 'Vehicle number is required'],
        uppercase: true,
      },
    },
    slot: {
      level: {
        type: String, // B1, B2, B3
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'QR'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    entryTime: Date,
    exitTime: Date,
  },
  {
    timestamps: true,
  }
);

// Generate booking ID before saving
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString().slice(-6);
    this.bookingId = `EP-${timestamp}`;
  }
  next();
});

// Update parking available slots when booking is created
bookingSchema.post('save', async function () {
  if (this.status === 'active' && this.paymentStatus === 'completed') {
    const Parking = mongoose.model('Parking');
    await Parking.findByIdAndUpdate(this.parkingId, {
      $inc: { availableSlots: -1 },
    });
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;

