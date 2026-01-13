# EasyPark - Smart Parking Discovery & Booking

A modern, fully responsive web application for finding and booking parking spaces in Nagpur.

## Features

- 🚗 Real-time parking discovery
- 📍 Google Maps integration
- 💳 Online payment system (UPI, Card, QR)
- 🎫 E-ticket generation with QR codes
- 📱 Mobile-first responsive design
- 🌓 Dark/Light mode toggle
- ✨ Smooth animations with Framer Motion
- 📊 User dashboard and booking history
- 🔐 User authentication
- 👨‍💼 Admin panel

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Hackathon - EasyPark"
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Backend**

   a. Navigate to server directory:
   ```bash
   cd server
   ```

   b. Create `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/easypark
   JWT_SECRET=your_super_secret_jwt_key
   FRONTEND_URL=http://localhost:5173
   ```

   c. Start MongoDB (if using local):
   ```bash
   # macOS (Homebrew)
   brew services start mongodb-community
   
   # Or run mongod directly
   mongod
   ```

   d. Seed database (optional):
   ```bash
   npm run seed
   ```

4. **Start Development Servers**

   In separate terminals:

   **Terminal 1 - Backend:**
   ```bash
   npm run server
   ```
   Backend runs on: http://localhost:5000

   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```
   Frontend runs on: http://localhost:5173

## Project Structure

```
easypark/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/            # Database config
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Server entry point
│   └── seed.js            # Database seeder
│
└── package.json           # Root package.json
```

## API Endpoints

### Parking
- `GET /api/parking` - Get all parking locations
- `GET /api/parking/:id` - Get single parking
- `POST /api/parking` - Create parking (Admin)
- `PUT /api/parking/:id` - Update parking (Admin)
- `DELETE /api/parking/:id` - Delete parking (Admin)

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Users
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile

## Environment Variables

### Server (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS

## Scripts

- `npm run dev` - Start frontend dev server
- `npm run server` - Start backend server
- `npm run seed` - Seed database with sample data
- `npm run build` - Build for production

## Features in Detail

### 1. Home Page
- Hero section with animated search
- Location auto-detection
- Real-time parking stats
- Live parking feed preview

### 2. Discovery Page
- List of nearby parking locations
- Sort & filter options
- Integrated Google Maps
- Real-time slot availability

### 3. Parking Details
- Full parking information
- Photo gallery
- Entry/exit instructions
- Book Now button

### 4. Slot Selection
- Movie-ticket style slot picker
- Level selection (B1, B2, B3)
- Visual slot grid

### 5. Booking & Payment
- Booking form
- Payment options (UPI, Card, QR)
- E-ticket generation
- Auto-download ticket

### 6. Dashboard
- Active bookings
- Booking history
- Saved parking places

### 7. Admin Panel
- Add/remove parking locations
- Update slot availability
- View bookings and revenue

## Development

### Adding New Features
1. Create models in `server/models/`
2. Add routes in `server/routes/`
3. Create components in `client/src/components/`
4. Add pages in `client/src/pages/`

### Database Seeding
Run `npm run seed` to populate database with sample Nagpur parking locations.

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update `MONGODB_URI` to production database
3. Set secure `JWT_SECRET`
4. Update `FRONTEND_URL` to production domain
5. Build frontend: `npm run build`
6. Deploy to hosting service (Vercel, Netlify, Heroku, etc.)

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

