# EasyPark API Specification

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.easypark.com/api
```

## Authentication
- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Token Expiry**: 30 days
- **Storage**: localStorage (frontend)

---

## 1. USER ENDPOINTS

### 1.1 Register User
```
POST /api/users/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+919876543210"
}

Response (201 Created):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210"
  }
}

Error Response (400):
{
  "success": false,
  "message": "User already exists"
}
```

### 1.2 Login User
```
POST /api/users/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200 OK):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210"
  }
}

Error Response (401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 1.3 Get User Profile
```
GET /api/users/:id
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "savedParkings": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Sitabuldi Metro Parking",
        "address": "Zero Mile – Sitabuldi Metro Station, Nagpur",
        "location": {
          "lat": 21.1458,
          "lng": 79.0882
        }
      }
    ]
  }
}

Error Response (404):
{
  "success": false,
  "message": "User not found"
}
```

---

## 2. PARKING ENDPOINTS

### 2.1 Get All Parking Locations
```
GET /api/parking
Query Parameters:
  - lat (optional): User latitude for distance calculation
  - lng (optional): User longitude for distance calculation
  - sort (optional): 'nearest' | 'cheapest' | 'slots'

Example: GET /api/parking?lat=21.14&lng=79.08&sort=nearest

Response (200 OK):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Sitabuldi Metro Parking",
      "address": "Zero Mile – Sitabuldi Metro Station, Nagpur",
      "location": {
        "lat": 21.1458,
        "lng": 79.0882
      },
      "totalSlots": 120,
      "availableSlots": 24,
      "pricePerHour": 30,
      "rating": 4.6,
      "isOpen": true,
      "images": ["url1", "url2"],
      "description": "Convenient parking near Sitabuldi Metro Station...",
      "features": ["Covered", "Security", "Well-lit", "Near Metro"],
      "distance": 0.5,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    ...
  ]
}
```

### 2.2 Get Single Parking Location
```
GET /api/parking/:id

Response (200 OK):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Sitabuldi Metro Parking",
    "address": "Zero Mile – Sitabuldi Metro Station, Nagpur",
    "location": {
      "lat": 21.1458,
      "lng": 79.0882
    },
    "totalSlots": 120,
    "availableSlots": 24,
    "pricePerHour": 30,
    "rating": 4.6,
    "isOpen": true,
    "images": ["url1", "url2"],
    "description": "Convenient parking near Sitabuldi Metro Station...",
    "entryInstructions": "Enter from the main gate. Follow signs to your assigned level.",
    "exitInstructions": "Exit through the same gate. Payment receipt required.",
    "operatingHours": {
      "open": "06:00",
      "close": "23:00"
    },
    "features": ["Covered", "Security", "Well-lit", "Near Metro"],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}

Error Response (404):
{
  "success": false,
  "message": "Parking location not found"
}
```

### 2.3 Create Parking Location (Admin)
```
POST /api/parking
Authorization: Bearer <admin-token>
Content-Type: application/json

Request Body:
{
  "name": "New Parking",
  "address": "123 Main Street, Nagpur",
  "location": {
    "lat": 21.1458,
    "lng": 79.0882
  },
  "totalSlots": 100,
  "pricePerHour": 25,
  "rating": 0,
  "isOpen": true,
  "description": "New parking facility",
  "entryInstructions": "Enter from main gate",
  "exitInstructions": "Exit through same gate",
  "operatingHours": {
    "open": "06:00",
    "close": "23:00"
  },
  "features": ["Covered", "Security"]
}

Response (201 Created):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "New Parking",
    ...
  }
}
```

### 2.4 Update Parking Location (Admin)
```
PUT /api/parking/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

Request Body:
{
  "availableSlots": 50,
  "pricePerHour": 35,
  "isOpen": false
}

Response (200 OK):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Sitabuldi Metro Parking",
    "availableSlots": 50,
    "pricePerHour": 35,
    "isOpen": false,
    ...
  }
}
```

### 2.5 Delete Parking Location (Admin)
```
DELETE /api/parking/:id
Authorization: Bearer <admin-token>

Response (200 OK):
{
  "success": true,
  "message": "Parking location deleted"
}

Error Response (404):
{
  "success": false,
  "message": "Parking location not found"
}
```

---

## 3. BOOKING ENDPOINTS

### 3.1 Get All Bookings
```
GET /api/bookings
Query Parameters:
  - userId (optional): Filter by user ID

Example: GET /api/bookings?userId=507f1f77bcf86cd799439011

Response (200 OK):
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "bookingId": "EP-123456",
      "userId": "507f1f77bcf86cd799439011",
      "parkingId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Sitabuldi Metro Parking",
        "address": "Zero Mile – Sitabuldi Metro Station, Nagpur",
        "location": {
          "lat": 21.1458,
          "lng": 79.0882
        }
      },
      "date": "2024-01-20T00:00:00Z",
      "time": "14:30",
      "duration": 2,
      "vehicle": {
        "type": "Car",
        "number": "MH01AB1234"
      },
      "slot": {
        "level": "B1",
        "number": "A12"
      },
      "amount": 60,
      "paymentMethod": "UPI",
      "paymentStatus": "completed",
      "status": "active",
      "entryTime": "2024-01-20T14:30:00Z",
      "exitTime": null,
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T14:30:00Z"
    },
    ...
  ]
}
```

### 3.2 Get Single Booking
```
GET /api/bookings/:id
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "bookingId": "EP-123456",
    "userId": "507f1f77bcf86cd799439011",
    "parkingId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Sitabuldi Metro Parking",
      "address": "Zero Mile – Sitabuldi Metro Station, Nagpur",
      "location": {
        "lat": 21.1458,
        "lng": 79.0882
      },
      "pricePerHour": 30
    },
    "date": "2024-01-20T00:00:00Z",
    "time": "14:30",
    "duration": 2,
    "vehicle": {
      "type": "Car",
      "number": "MH01AB1234"
    },
    "slot": {
      "level": "B1",
      "number": "A12"
    },
    "amount": 60,
    "paymentMethod": "UPI",
    "paymentStatus": "completed",
    "status": "active",
    "entryTime": "2024-01-20T14:30:00Z",
    "exitTime": null,
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T14:30:00Z"
  }
}

Error Response (404):
{
  "success": false,
  "message": "Booking not found"
}
```

### 3.3 Create Booking
```
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "parkingId": "507f1f77bcf86cd799439012",
  "date": "2024-01-20",
  "time": "14:30",
  "duration": 2,
  "vehicle": {
    "type": "Car",
    "number": "MH01AB1234"
  },
  "slot": {
    "level": "B1",
    "number": "A12"
  },
  "paymentMethod": "UPI",
  "userId": "507f1f77bcf86cd799439011"
}

Response (201 Created):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "bookingId": "EP-123456",
    "userId": "507f1f77bcf86cd799439011",
    "parkingId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Sitabuldi Metro Parking",
      "address": "Zero Mile – Sitabuldi Metro Station, Nagpur",
      "location": {
        "lat": 21.1458,
        "lng": 79.0882
      }
    },
    "date": "2024-01-20T00:00:00Z",
    "time": "14:30",
    "duration": 2,
    "vehicle": {
      "type": "Car",
      "number": "MH01AB1234"
    },
    "slot": {
      "level": "B1",
      "number": "A12"
    },
    "amount": 60,
    "paymentMethod": "UPI",
    "paymentStatus": "completed",
    "status": "active",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}

Error Response (400):
{
  "success": false,
  "message": "No slots available"
}
```

### 3.4 Update Booking
```
PUT /api/bookings/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "status": "completed",
  "exitTime": "2024-01-20T16:30:00Z"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "bookingId": "EP-123456",
    "status": "completed",
    "exitTime": "2024-01-20T16:30:00Z",
    ...
  }
}
```

### 3.5 Delete Booking
```
DELETE /api/bookings/:id
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Booking deleted"
}

Error Response (404):
{
  "success": false,
  "message": "Booking not found"
}
```

---

## 4. ANALYTICS ENDPOINTS

### 4.1 Get Dashboard Statistics
```
GET /api/analytics/stats
Authorization: Bearer <admin-token>

Response (200 OK):
{
  "success": true,
  "data": {
    "overview": {
      "totalBookings": 150,
      "completedBookings": 120,
      "activeBookings": 25,
      "totalRevenue": 45000,
      "averageBookingAmount": 300,
      "totalParkingLocations": 5
    },
    "revenueByPaymentMethod": [
      {
        "_id": "UPI",
        "total": 25000,
        "count": 80
      },
      {
        "_id": "Card",
        "total": 15000,
        "count": 30
      },
      {
        "_id": "QR",
        "total": 5000,
        "count": 10
      }
    ],
    "bookingsByParking": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "parkingName": "Sitabuldi Metro Parking",
        "parkingAddress": "Zero Mile – Sitabuldi Metro Station, Nagpur",
        "totalRevenue": 18000,
        "bookingCount": 60
      },
      ...
    ],
    "recentBookings": [
      {
        "bookingId": "EP-123456",
        "amount": 60,
        "date": "2024-01-20T00:00:00Z",
        "time": "14:30",
        "duration": 2,
        "vehicle": {
          "type": "Car",
          "number": "MH01AB1234"
        },
        "slot": {
          "level": "B1",
          "number": "A12"
        },
        "paymentMethod": "UPI",
        "createdAt": "2024-01-20T10:00:00Z"
      },
      ...
    ],
    "bookingsByStatus": [
      {
        "_id": "active",
        "count": 25
      },
      {
        "_id": "completed",
        "count": 120
      },
      {
        "_id": "cancelled",
        "count": 5
      }
    ]
  }
}
```

---

## 5. HEALTH CHECK ENDPOINT

### 5.1 Health Check
```
GET /api/health

Response (200 OK):
{
  "success": true,
  "message": "EasyPark API is running",
  "timestamp": "2024-01-20T10:00:00Z"
}
```

---

## 6. ERROR RESPONSES

### Common Error Codes

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Detailed error information"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Something went wrong!",
  "error": "Error details (only in development)"
}
```

---

## 7. REQUEST/RESPONSE HEADERS

### Request Headers
```
Content-Type: application/json
Authorization: Bearer <jwt-token> (for protected routes)
```

### Response Headers
```
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:5173 (or production URL)
Access-Control-Allow-Credentials: true
```

---

## 8. PAGINATION (Future Enhancement)

```
GET /api/bookings?page=1&limit=10

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

---

## 9. FILTERING & SORTING (Future Enhancement)

```
GET /api/parking?minPrice=20&maxPrice=50&rating=4&sort=-pricePerHour

Query Parameters:
  - minPrice: Minimum price per hour
  - maxPrice: Maximum price per hour
  - rating: Minimum rating
  - sort: Sort field (prefix with - for descending)
```

---

## 10. RATE LIMITING (Future Enhancement)

```
Headers:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890

Error Response (429):
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

---

## 11. API USAGE EXAMPLES

### Example 1: Complete Booking Flow
```javascript
// 1. Login
const loginRes = await fetch('http://localhost:5000/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { token } = await loginRes.json();

// 2. Get nearby parking
const parkingRes = await fetch(
  'http://localhost:5000/api/parking?lat=21.14&lng=79.08&sort=nearest',
  { headers: { 'Authorization': `Bearer ${token}` } }
);
const { data: parkings } = await parkingRes.json();

// 3. Create booking
const bookingRes = await fetch('http://localhost:5000/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    parkingId: parkings[0]._id,
    date: '2024-01-20',
    time: '14:30',
    duration: 2,
    vehicle: { type: 'Car', number: 'MH01AB1234' },
    slot: { level: 'B1', number: 'A12' },
    paymentMethod: 'UPI',
    userId: userId
  })
});
const { data: booking } = await bookingRes.json();
```

### Example 2: Get User Bookings
```javascript
const bookingsRes = await fetch(
  `http://localhost:5000/api/bookings?userId=${userId}`,
  { headers: { 'Authorization': `Bearer ${token}` } }
);
const { data: bookings } = await bookingsRes.json();
```

---

## 12. AUTHENTICATION FLOW

### JWT Token Structure
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "userId": "507f1f77bcf86cd799439011", "iat": 1234567890, "exp": 1234654290 }
Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### Token Refresh (Future Enhancement)
```
POST /api/users/refresh-token
Authorization: Bearer <expired-token>

Response:
{
  "success": true,
  "token": "new-jwt-token"
}
```

---

## 13. WEBHOOK ENDPOINTS (Future Enhancement)

```
POST /api/webhooks/payment
POST /api/webhooks/booking-status
POST /api/webhooks/slot-availability
```

---

## 14. API VERSIONING (Future Enhancement)

```
GET /api/v1/parking
GET /api/v2/parking
```

---

## Summary

This API specification provides:
- ✅ Complete endpoint documentation
- ✅ Request/response examples
- ✅ Error handling patterns
- ✅ Authentication details
- ✅ Query parameters
- ✅ Usage examples
- ✅ Future enhancements

All endpoints follow RESTful conventions and return JSON responses with consistent structure.
