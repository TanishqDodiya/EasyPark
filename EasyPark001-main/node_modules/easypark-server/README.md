# EasyPark Backend API

Node.js + Express + MongoDB backend for EasyPark application.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install MongoDB

**Option A: Local MongoDB**
- Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service: `mongod` (or use Homebrew: `brew services start mongodb-community`)

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `.env` file

### 3. Configure Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/easypark
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

### 4. Seed Database (Optional)

Populate database with sample parking locations:

```bash
node server/seed.js
```

### 5. Start Server

```bash
npm run server
```

Or from root directory:
```bash
npm run server
```

Server will run on `http://localhost:5000`

## API Endpoints

### Parking
- `GET /api/parking` - Get all parking locations
- `GET /api/parking/:id` - Get single parking location
- `POST /api/parking` - Create parking (Admin)
- `PUT /api/parking/:id` - Update parking (Admin)
- `DELETE /api/parking/:id` - Delete parking (Admin)

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile

### Health Check
- `GET /api/health` - Check API status

## Database Models

### Parking
- name, address, location (lat/lng)
- totalSlots, availableSlots
- pricePerHour, rating
- isOpen, features, operatingHours

### Booking
- bookingId, userId, parkingId
- date, time, duration
- vehicle (type, number)
- slot (level, number)
- amount, paymentMethod, status

### User
- name, email, password
- phone, savedParkings
- role (user/admin)

## Notes

- All routes are currently public (no authentication middleware)
- In production, add authentication middleware for protected routes
- Update JWT_SECRET to a secure random string
- Enable CORS for your frontend domain in production

