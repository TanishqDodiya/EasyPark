// Seed script to populate database with sample data
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import Parking from './models/Parking.js';

dotenv.config();

const seedParkings = [
  {
    name: 'Sitabuldi Metro Parking',
    address: 'Zero Mile – Sitabuldi Metro Station, Nagpur',
    location: {
      lat: 21.1458,
      lng: 79.0882,
    },
    totalSlots: 120,
    availableSlots: 24,
    pricePerHour: 30,
    rating: 4.6,
    isOpen: true,
    description: 'Convenient parking near Sitabuldi Metro Station with easy access to city center.',
    entryInstructions: 'Enter from the main gate. Follow signs to your assigned level.',
    exitInstructions: 'Exit through the same gate. Payment receipt required.',
    operatingHours: {
      open: '06:00',
      close: '23:00',
    },
    features: ['Covered', 'Security', 'Well-lit', 'Near Metro'],
  },
  {
    name: 'MIHAN Business Park Parking',
    address: 'MIHAN IT Park, Wardha Road, Nagpur',
    location: {
      lat: 21.0624,
      lng: 79.0606,
    },
    totalSlots: 200,
    availableSlots: 38,
    pricePerHour: 25,
    rating: 4.4,
    isOpen: true,
    description: 'Spacious parking facility in MIHAN IT Park with modern amenities.',
    entryInstructions: 'Enter from Wardha Road entrance. Automated barrier system.',
    exitInstructions: 'Scan QR code at exit gate for automatic barrier opening.',
    operatingHours: {
      open: '07:00',
      close: '22:00',
    },
    features: ['Covered', 'Security', 'EV Charging', '24/7 Access'],
  },
  {
    name: 'Airport Multi-level Parking',
    address: 'Dr. Babasaheb Ambedkar International Airport, Nagpur',
    location: {
      lat: 21.092,
      lng: 79.0556,
    },
    totalSlots: 300,
    availableSlots: 52,
    pricePerHour: 40,
    rating: 4.7,
    isOpen: true,
    description: 'Multi-level parking facility at Nagpur Airport with premium services.',
    entryInstructions: 'Follow airport signs to parking. Take ticket at entry.',
    exitInstructions: 'Pay at exit counter or use mobile payment. Keep ticket safe.',
    operatingHours: {
      open: '00:00',
      close: '23:59',
    },
    features: ['Multi-level', 'Security', '24/7', 'Airport Shuttle', 'Premium'],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Parking.deleteMany({});
    console.log('🗑️  Cleared existing parking data');

    // Insert seed data
    const parkings = await Parking.insertMany(seedParkings);
    console.log(`✅ Seeded ${parkings.length} parking locations`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

