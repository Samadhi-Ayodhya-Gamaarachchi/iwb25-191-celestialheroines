# TikiriCare Backend API Documentation

## Base URL
```
http://localhost:8080
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Sarah Fernando",
  "email": "sarah@example.com",
  "password": "password123",
  "telephone": "0771234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid-here",
    "name": "Sarah Fernando",
    "email": "sarah@example.com",
    "telephone": "0771234567",
    "role": "parent",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "sarah@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid-here",
      "name": "Sarah Fernando",
      "email": "sarah@example.com",
      "telephone": "0771234567",
      "role": "parent"
    },
    "message": "Login successful"
  }
}
```

#### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <jwt_token>
```

#### Update User Profile
```http
PUT /auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Sarah Fernando Updated",
  "telephone": "0777654321"
}
```

### 2. Children Management

#### Create Child
```http
POST /api/children
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Emma",
  "gender": "female",
  "dateOfBirth": "2023-06-15",
  "height": 50.0,
  "weight": 3.2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Child created successfully",
  "data": {
    "id": "child-uuid",
    "parentId": "parent-uuid",
    "name": "Emma",
    "gender": "female",
    "dateOfBirth": "2023-06-15",
    "ageInMonths": 6,
    "height": 50.0,
    "weight": 3.2,
    "bmi": 12.8,
    "lastCheckup": "",
    "developmentScore": 0,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get All Children
```http
GET /api/children
Authorization: Bearer <jwt_token>
```

#### Get Specific Child
```http
GET /api/children/{childId}
Authorization: Bearer <jwt_token>
```

#### Update Child
```http
PUT /api/children/{childId}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "height": 55.0,
  "weight": 4.0,
  "lastCheckup": "2024-01-15"
}
```

#### Delete Child
```http
DELETE /api/children/{childId}
Authorization: Bearer <jwt_token>
```

### 3. Vaccine Management

#### Initialize Vaccine Schedule
```http
POST /api/vaccines/initialize/{childId}
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Vaccine schedule initialized successfully",
  "data": [
    {
      "id": "vaccine-uuid-1",
      "childId": "child-uuid",
      "name": "BCG",
      "age": "0-4 weeks",
      "dueDate": "2023-06-15",
      "status": "upcoming",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "vaccine-uuid-2",
      "childId": "child-uuid",
      "name": "Penta (D,T,P,HepB & Hib) + OPV (1st dose)",
      "age": "2 months",
      "dueDate": "2023-08-15",
      "status": "upcoming",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Vaccine Schedule
```http
GET /api/vaccines/schedule/{childId}
Authorization: Bearer <jwt_token>
```

#### Mark Vaccine as Completed
```http
PUT /api/vaccines/{vaccineId}/complete
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "completed",
  "completedDate": "2024-01-15",
  "remarks": "Administered at General Hospital"
}
```

#### Get Upcoming Vaccines
```http
GET /api/vaccines/upcoming/{childId}
Authorization: Bearer <jwt_token>
```

#### Get Completed Vaccines
```http
GET /api/vaccines/completed/{childId}
Authorization: Bearer <jwt_token>
```

### 4. Health Monitoring

#### Add Growth Record
```http
POST /api/health/growth
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "childId": "child-uuid",
  "height": 55.0,
  "weight": 4.0,
  "recordedDate": "2024-01-15"
}
```

#### Get Growth History
```http
GET /api/health/growth/{childId}
Authorization: Bearer <jwt_token>
```

#### Add Medical Record
```http
POST /api/health/medical
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "childId": "child-uuid",
  "type": "Checkup",
  "description": "Regular health checkup",
  "date": "2024-01-15",
  "doctor": "Dr. Perera",
  "hospital": "General Hospital"
}
```

#### Get Medical Records
```http
GET /api/health/medical/{childId}
Authorization: Bearer <jwt_token>
```

#### Get Health Summary
```http
GET /api/health/summary/{childId}
Authorization: Bearer <jwt_token>
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Additional error details"]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Data Validation

### User Registration
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `telephone`: Required, minimum 10 characters

### Child Creation
- `name`: Required, non-empty string
- `gender`: Required, must be "male" or "female"
- `dateOfBirth`: Required, format: yyyy-MM-dd
- `height`: Optional, positive decimal
- `weight`: Optional, positive decimal

### Vaccine Updates
- `status`: Must be one of: "upcoming", "due", "completed", "overdue"
- `completedDate`: Required when status is "completed", format: yyyy-MM-dd

## Rate Limiting

- **Requests per window**: 100
- **Window size**: 15 minutes
- **Headers returned**: 
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Testing the API

### Using curl
```bash
# Register a user
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","telephone":"0771234567"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use the returned token for authenticated requests
curl -X GET http://localhost:8080/api/children \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import the collection
2. Set the base URL to `http://localhost:8080`
3. Use the login endpoint to get a token
4. Set the Authorization header with the token for other requests

## Notes

- All dates are in ISO 8601 format (yyyy-MM-dd)
- All measurements (height, weight) are in metric units
- Age is calculated automatically in months
- Vaccine schedules are based on Sri Lanka National Immunization Schedule
- JWT tokens expire after 24 hours
- The backend uses in-memory storage for development (data is lost on restart) 