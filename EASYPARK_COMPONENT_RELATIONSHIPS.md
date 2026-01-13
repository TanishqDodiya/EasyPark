# EasyPark Component Relationships & Data Flow

## 1. FRONTEND COMPONENT TREE

```
App (Root)
│
├── ThemeProvider (Context)
│   └── AuthProvider (Context)
│       │
│       ├── Navbar
│       │   ├── Theme Toggle Button
│       │   ├── Navigation Links
│       │   └── User Menu
│       │
│       └── Main Routes
│           │
│           ├── Home Page
│           │   ├── Hero Section
│           │   ├── Search Bar
│           │   ├── Stats Display
│           │   └── Parking Feed Preview
│           │
│           ├── Discover Page
│           │   ├── Filter Sidebar
│           │   ├── Sort Options
│           │   ├── ParkingCard (List)
│           │   │   └── ParkingCard Component (Reusable)
│           │   └── MapView Component
│           │       └── Google Maps Integration
│           │
│           ├── ParkingDetails Page
│           │   ├── Image Gallery
│           │   ├── Parking Info Section
│           │   ├── Amenities List
│           │   ├── Reviews Section
│           │   ├── Entry/Exit Instructions
│           │   └── Book Now Button
│           │
│           ├── BookSlot Page
│           │   ├── Date Picker
│           │   ├── Time Picker
│           │   ├── Duration Selector
│           │   ├── Vehicle Type Selector
│           │   ├── Vehicle Number Input
│           │   └── Next Button
│           │
│           ├── SelectSlot Page
│           │   ├── Level Selector (B1, B2, B3)
│           │   ├── Slot Grid (Movie-ticket style)
│           │   │   └── Individual Slot Components
│           │   └── Confirm Selection Button
│           │
│           ├── Payment Page
│           │   ├── Booking Summary
│           │   ├── Amount Display
│           │   ├── Payment Method Selector
│           │   │   ├── UPI Option
│           │   │   ├── Card Option
│           │   │   └── QR Code Option
│           │   ├── Payment Form
│           │   └── Confirm Payment Button
│           │
│           ├── Dashboard Page
│           │   ├── User Profile Section
│           │   ├── Active Bookings
│           │   │   └── Booking Card (Reusable)
│           │   ├── Quick Stats
│           │   └── Saved Parking List
│           │
│           ├── BookingHistory Page
│           │   ├── Filter Options
│           │   ├── Booking List
│           │   │   └── Booking Card (Reusable)
│           │   └── Download Receipt Button
│           │
│           ├── Admin Page
│           │   ├── Admin Dashboard
│           │   ├── Parking Management Section
│           │   │   ├── Add Parking Form
│           │   │   ├── Parking List
│           │   │   └── Edit/Delete Options
│           │   ├── Analytics Section
│           │   │   ├── Revenue Chart
│           │   │   ├── Booking Stats
│           │   │   └── Popular Locations
│           │   └── Booking Management
│           │
│           ├── Management Page
│           │   ├── Parking Operator Dashboard
│           │   ├── Slot Availability Manager
│           │   └── Real-time Updates
│           │
│           ├── Login Page
│           │   ├── Email Input
│           │   ├── Password Input
│           │   ├── Login Button
│           │   ├── SocialLoginButtons Component
│           │   │   ├── Google Button
│           │   │   └── Facebook Button
│           │   └── Signup Link
│           │
│           └── Signup Page
│               ├── Name Input
│               ├── Email Input
│               ├── Password Input
│               ├── Phone Input
│               ├── Signup Button
│               ├── SocialLoginButtons Component
│               └── Login Link
│
└── MovingColors (Background Animation)
```

---

## 2. CONTEXT FLOW

### AuthContext Flow
```
AuthProvider
│
├── State
│   ├── user: User object or null
│   ├── session: Session object or null
│   ├── isLoading: Boolean
│   └── isAuthenticated: Boolean
│
├── Methods
│   ├── signUp(email, password, userData)
│   ├── signIn(email, password)
│   ├── signInWithGoogle()
│   ├── signInWithFacebook()
│   ├── signOut()
│   └── resetPassword(email)
│
└── Consumers
    ├── Login Page
    ├── Signup Page
    ├── Navbar (for user menu)
    ├── Dashboard (protected route)
    ├── BookSlot (requires auth)
    └── Payment (requires auth)
```

### ThemeContext Flow
```
ThemeProvider
│
├── State
│   └── isDark: Boolean
│
├── Methods
│   └── toggleTheme()
│
├── Persistence
│   └── localStorage: 'theme' key
│
└── Consumers
    ├── Navbar (theme toggle button)
    ├── All Pages (dark/light styling)
    └── Global CSS (dark mode classes)
```

---

## 3. API SERVICE LAYER

```
api.js (Axios Instance)
│
├── Base Configuration
│   ├── baseURL: VITE_API_URL
│   └── headers: Content-Type: application/json
│
├── parkingAPI
│   ├── getAll(params) → GET /api/parking
│   ├── getById(id) → GET /api/parking/:id
│   ├── create(data) → POST /api/parking
│   ├── update(id, data) → PUT /api/parking/:id
│   └── delete(id) → DELETE /api/parking/:id
│
├── bookingAPI
│   ├── getAll(params) → GET /api/bookings
│   ├── getById(id) → GET /api/bookings/:id
│   ├── create(data) → POST /api/bookings
│   ├── update(id, data) → PUT /api/bookings/:id
│   └── delete(id) → DELETE /api/bookings/:id
│
├── userAPI
│   ├── register(data) → POST /api/users/register
│   ├── login(data) → POST /api/users/login
│   └── getProfile(id) → GET /api/users/:id
│
├── analyticsAPI
│   └── getStats() → GET /api/analytics/stats
│
└── healthCheck() → GET /api/health
```

---

## 4. DATA FLOW DIAGRAMS

### User Registration Flow
```
Signup Page
    ↓
User enters: name, email, password, phone
    ↓
Click "Sign Up"
    ↓
userAPI.register(data)
    ↓
POST /api/users/register
    ↓
Backend: Validate input
    ↓
Check if email exists
    ↓
Hash password with bcryptjs
    ↓
Create User document in MongoDB
    ↓
Generate JWT token (30-day expiry)
    ↓
Return: { token, user data }
    ↓
Frontend: Store token in localStorage
    ↓
Update AuthContext
    ↓
Redirect to Dashboard
```

### Parking Discovery Flow
```
Discover Page
    ↓
User clicks "Find Near Me"
    ↓
Request geolocation permission
    ↓
Get user coordinates (lat, lng)
    ↓
parkingAPI.getAll({ lat, lng, sort: 'nearest' })
    ↓
GET /api/parking?lat=21.14&lng=79.08&sort=nearest
    ↓
Backend: Query MongoDB for all parking
    ↓
Calculate distance for each parking (Haversine)
    ↓
Sort by distance
    ↓
Return parking array with distances
    ↓
Frontend: Display on map with markers
    ↓
Display in list with distance info
    ↓
User clicks on parking
    ↓
Navigate to ParkingDetails page
```

### Booking Creation Flow
```
Payment Page
    ↓
User confirms booking details
    ↓
Select payment method (UPI/Card/QR)
    ↓
Click "Confirm Payment"
    ↓
bookingAPI.create({
    parkingId, date, time, duration,
    vehicle, slot, paymentMethod, userId
})
    ↓
POST /api/bookings
    ↓
Backend: Validate all fields
    ↓
Get parking details
    ↓
Check availableSlots > 0
    ↓
Calculate amount = pricePerHour × duration
    ↓
Create Booking document
    ↓
Auto-generate bookingId (EP-XXXXXX)
    ↓
Decrement parking.availableSlots
    ↓
Return booking confirmation
    ↓
Frontend: Generate e-ticket with QR code
    ↓
Display booking confirmation
    ↓
Option to download/share ticket
```

### Authentication Check Flow
```
App Component Mounts
    ↓
AuthProvider initializes
    ↓
auth.getCurrentSession()
    ↓
Check localStorage for token
    ↓
Validate token with Supabase
    ↓
If valid: Set user & session
    ↓
If invalid: Clear token, set user = null
    ↓
Set isLoading = false
    ↓
Listen for auth state changes
    ↓
Protected routes check isAuthenticated
    ↓
If not authenticated: Redirect to login
    ↓
If authenticated: Render page
```

---

## 5. BACKEND ROUTE DEPENDENCIES

```
Express App (server.js)
│
├── Middleware
│   ├── CORS (configured for frontend URL)
│   ├── express.json()
│   └── express.urlencoded()
│
├── Routes
│   │
│   ├── /api/parking (parkingRoutes.js)
│   │   ├── GET / → Parking.find()
│   │   ├── GET /:id → Parking.findById()
│   │   ├── POST / → Parking.create()
│   │   ├── PUT /:id → Parking.findByIdAndUpdate()
│   │   └── DELETE /:id → Parking.findByIdAndDelete()
│   │
│   ├── /api/bookings (bookingRoutes.js)
│   │   ├── GET / → Booking.find().populate('parkingId')
│   │   ├── GET /:id → Booking.findById().populate('parkingId')
│   │   ├── POST / → Booking.create() + Parking.updateOne()
│   │   ├── PUT /:id → Booking.findByIdAndUpdate()
│   │   └── DELETE /:id → Booking.findByIdAndDelete() + Parking.updateOne()
│   │
│   ├── /api/users (userRoutes.js)
│   │   ├── POST /register → User.create() + JWT.sign()
│   │   ├── POST /login → User.findOne() + comparePassword() + JWT.sign()
│   │   └── GET /:id → User.findById().populate('savedParkings')
│   │
│   ├── /api/analytics (analyticsRoutes.js)
│   │   └── GET /stats → Booking.aggregate() + Parking.countDocuments()
│   │
│   └── /api/health → Health check response
│
├── Error Handler
│   └── Catches all errors and returns JSON response
│
└── 404 Handler
    └── Returns "Route not found" for undefined routes
```

---

## 6. DATABASE RELATIONSHIPS

```
MongoDB Collections
│
├── Users Collection
│   ├── _id (ObjectId)
│   ├── name
│   ├── email (unique)
│   ├── password (hashed)
│   ├── phone
│   ├── savedParkings: [ObjectId] → References Parking
│   ├── role (user/admin)
│   └── timestamps
│
├── Parking Collection
│   ├── _id (ObjectId)
│   ├── name
│   ├── address
│   ├── location: { lat, lng }
│   ├── totalSlots
│   ├── availableSlots
│   ├── pricePerHour
│   ├── rating
│   ├── isOpen
│   ├── images: [String]
│   ├── description
│   ├── entryInstructions
│   ├── exitInstructions
│   ├── operatingHours: { open, close }
│   ├── features: [String]
│   ├── timestamps
│   └── indexes: geospatial on location
│
└── Bookings Collection
    ├── _id (ObjectId)
    ├── bookingId (unique, auto-generated)
    ├── userId → References User (nullable)
    ├── parkingId → References Parking
    ├── date
    ├── time
    ├── duration
    ├── vehicle: { type, number }
    ├── slot: { level, number }
    ├── amount
    ├── paymentMethod (UPI/Card/QR)
    ├── paymentStatus (pending/completed/failed/refunded)
    ├── status (active/completed/cancelled)
    ├── entryTime
    ├── exitTime
    └── timestamps
```

---

## 7. COMPONENT COMMUNICATION PATTERNS

### Parent-to-Child Props
```
Discover Page
    ↓ passes parkingList, filters
ParkingCard Component
    ↓ displays parking info
    ↓ onClick → navigate to ParkingDetails

Dashboard Page
    ↓ passes bookings, user data
BookingCard Component
    ↓ displays booking info
    ↓ onClick → navigate to booking details
```

### Child-to-Parent Communication
```
Login Page (Parent)
    ↓
SocialLoginButtons Component (Child)
    ↓ onClick → calls signInWithGoogle()
    ↓ from AuthContext
    ↓
Updates AuthContext state
    ↓
Login Page receives update
    ↓
Redirects to Dashboard
```

### Context-Based Communication
```
Any Component
    ↓
useAuth() hook
    ↓
Access AuthContext
    ↓
Call signIn(), signOut(), etc.
    ↓
AuthContext updates state
    ↓
All consumers re-render
```

### API Communication
```
Component
    ↓
Calls parkingAPI.getAll()
    ↓
Axios makes HTTP request
    ↓
Backend processes request
    ↓
Returns JSON response
    ↓
Component updates state
    ↓
Component re-renders with data
```

---

## 8. STATE MANAGEMENT FLOW

### Global State (Context)
```
AuthContext
├── user
├── session
├── isLoading
├── isAuthenticated
└── Methods: signIn, signUp, signOut, etc.

ThemeContext
├── isDark
└── Methods: toggleTheme
```

### Local State (Component)
```
Discover Page
├── parkingList: []
├── filters: {}
├── sortBy: 'nearest'
├── isLoading: false
└── error: null

BookSlot Page
├── selectedDate: null
├── selectedTime: null
├── duration: 1
├── vehicleType: 'Car'
├── vehicleNumber: ''
└── isSubmitting: false
```

### Derived State
```
Dashboard Page
├── activeBookings = bookings.filter(b => b.status === 'active')
├── pastBookings = bookings.filter(b => b.status === 'completed')
└── totalSpent = bookings.reduce((sum, b) => sum + b.amount, 0)
```

---

## 9. EVENT FLOW EXAMPLES

### Example 1: User Login
```
1. User enters email & password on Login page
2. Clicks "Login" button
3. onClick handler calls: authContext.signIn(email, password)
4. AuthContext calls: auth.signIn(email, password)
5. Supabase validates credentials
6. Returns: { user, session, error }
7. AuthContext updates state: setUser(user), setSession(session)
8. All components using useAuth() re-render
9. Login page checks isAuthenticated
10. Redirects to /dashboard
11. Dashboard page renders with user data
```

### Example 2: Booking Creation
```
1. User on Payment page clicks "Confirm Payment"
2. onClick handler calls: bookingAPI.create(bookingData)
3. Axios makes POST request to /api/bookings
4. Backend validates booking data
5. Calculates amount = pricePerHour × duration
6. Creates Booking document in MongoDB
7. Decrements parking.availableSlots
8. Returns booking confirmation
9. Frontend receives response
10. Generates e-ticket with QR code
11. Displays confirmation message
12. Offers download/share options
```

### Example 3: Theme Toggle
```
1. User clicks theme toggle button in Navbar
2. onClick handler calls: themeContext.toggleTheme()
3. ThemeContext updates: setIsDark(!isDark)
4. useEffect runs: updates document.documentElement.classList
5. Updates localStorage: localStorage.setItem('theme', isDark ? 'dark' : 'light')
6. All components using useTheme() re-render
7. Tailwind dark: classes apply/remove
8. Page transitions to dark/light mode
```

---

## 10. ERROR HANDLING FLOW

```
Component
    ↓
Try to fetch data
    ↓
API call fails
    ↓
Catch error
    ↓
Set error state
    ↓
Display error message to user
    ↓
Offer retry option
    ↓
User clicks retry
    ↓
Retry API call
    ↓
Success: Clear error, display data
    ↓
Failure: Show error again
```

---

## 11. PERFORMANCE OPTIMIZATION PATTERNS

### Code Splitting
```
App.jsx
├── Home (lazy loaded)
├── Discover (lazy loaded)
├── ParkingDetails (lazy loaded)
├── BookSlot (lazy loaded)
├── Payment (lazy loaded)
└── Dashboard (lazy loaded)
```

### Memoization
```
ParkingCard Component
├── Memoized with React.memo()
├── Only re-renders if props change
└── Prevents unnecessary renders in lists
```

### Lazy Loading
```
MapView Component
├── Loaded only when needed
├── Google Maps API loaded on demand
└── Reduces initial bundle size
```

---

## 12. INTEGRATION POINTS

### Frontend ↔ Backend
```
Frontend (React)
    ↓ HTTP/REST
Backend (Express)
    ↓ Query/Update
MongoDB
```

### Frontend ↔ External Services
```
Frontend (React)
    ├─ Google Maps API (geolocation, maps)
    ├─ Supabase Auth (OAuth, session)
    └─ Payment Gateway (future)
```

### Backend ↔ External Services
```
Backend (Express)
    ├─ MongoDB (data persistence)
    ├─ Supabase (optional auth)
    └─ Email Service (future)
```

---

## 13. DEPLOYMENT ARCHITECTURE

```
Production Environment
│
├── Frontend
│   ├── Deployed to: Vercel/Netlify
│   ├── Build: npm run build
│   ├── Output: dist/ folder
│   └── Served via: CDN
│
├── Backend
│   ├── Deployed to: Heroku/Railway/AWS
│   ├── Environment: Node.js runtime
│   ├── Process: npm start
│   └── Port: 5000 (or configured)
│
└── Database
    ├── MongoDB Atlas (cloud)
    ├── Connection: MONGODB_URI env var
    └── Backups: Automated
```

---

## 14. SUMMARY

This document outlines the complete component relationships and data flow in the EasyPark application:

- **Frontend**: React components organized by pages and features
- **State Management**: Context API for global state (Auth, Theme)
- **API Layer**: Axios-based service layer for backend communication
- **Backend**: Express routes organized by resource (parking, bookings, users)
- **Database**: MongoDB collections with relationships
- **External Services**: Google Maps, Supabase, OAuth providers
- **Data Flow**: Clear patterns for user interactions and API calls
- **Error Handling**: Consistent error handling across the app
- **Performance**: Optimization techniques for scalability

All components work together to provide a seamless parking discovery and booking experience.
