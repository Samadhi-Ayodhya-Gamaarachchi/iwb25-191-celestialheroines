# TikiriCare & TikiriPiyasa Backend

A comprehensive Ballerina backend service that provides REST APIs for both TikiriCare (child healthcare management) and TikiriPiyasa (caregiver marketplace) applications.

## Features

### TikiriCare APIs
- **User Authentication**: JWT-based authentication with user registration and login
- **Child Management**: Add, update, and manage children records  
- **Vaccine Tracking**: Track vaccine schedules and completion status
- **Health Monitoring**: Track growth records and medical history

### TikiriPiyasa APIs
- **Caregiver Management**: Registration and profile management for caregivers
- **Care Request System**: Parents can request care services
- **Marketplace**: Browse available caregivers and their services

## Quick Start

1. **Start the backend server:**
   ```bash
   cd TikiriCare-backend
   bal run
   ```

2. **Server will start on:** `http://localhost:8080`

3. **Health check:** `GET http://localhost:8080/health`
- **Age Calculation**: Automatic age calculation based on birth date

## Project Structure

```
src/
├── main.bal                 # Main entry point
├── types/
│   └── types.bal           # Data types and models
├── constants/
│   └── vaccine_schedule.bal # Sri Lanka vaccine schedule constants
├── services/
│   ├── auth_service.bal     # Authentication service
│   ├── child_service.bal    # Child management service
│   ├── vaccine_service.bal  # Vaccine tracking service
│   └── health_service.bal   # Health monitoring service
└── utils/
    └── utils.bal           # Utility functions
```

## API Endpoints

### Authentication (`/auth`)

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Children Management (`/api/children`)

- `POST /api/children` - Create a new child
- `GET /api/children` - Get all children for current user
- `GET /api/children/{childId}` - Get specific child details
- `PUT /api/children/{childId}` - Update child information
- `DELETE /api/children/{childId}` - Delete child record

### Vaccine Management (`/api/vaccines`)

- `GET /api/vaccines/schedule/{childId}` - Get vaccine schedule for a child
- `POST /api/vaccines/initialize/{childId}` - Initialize vaccine schedule for a new child
- `PUT /api/vaccines/{vaccineId}/complete` - Mark vaccine as completed
- `GET /api/vaccines/upcoming/{childId}` - Get upcoming vaccines
- `GET /api/vaccines/completed/{childId}` - Get completed vaccines

### Health Monitoring (`/api/health`)

- `POST /api/health/growth` - Add growth record
- `GET /api/health/growth/{childId}` - Get growth history
- `POST /api/health/medical` - Add medical record
- `GET /api/health/medical/{childId}` - Get medical records
- `GET /api/health/summary/{childId}` - Get health summary

## Vaccine Schedule

The backend automatically generates vaccine schedules based on the **Sri Lanka National Immunization Schedule**:

### First Year of Life
- **0-4 weeks**: BCG
- **2 months**: Penta (D,T,P,HepB & Hib) + OPV (1st dose)
- **4 months**: Penta (D,T,P,HepB & Hib) + OPV (2nd dose)
- **6 months**: Penta (D,T,P,HepB & Hib) + OPV (3rd dose)
- **9 months**: Live JE Vaccine

### Second Year of Life
- **12 months**: MMR (1st Dose)
- **18 months**: DTP + OPV (4th dose)

### Pre-School Age
- **3 years**: MMR (2nd Dose)

### School Going Age
- **5 years**: DT + OPV (5th Dose)

## Data Models

### User
```ballerina
type User record {
    string id;
    string email;
    string name;
    string telephone;
    string password;
    string role;
    string createdAt;
    string updatedAt;
};
```

### Child
```ballerina
type Child record {
    string id;
    string parentId;
    string name;
    string gender;
    string dateOfBirth;
    int ageInMonths;
    decimal height;
    decimal weight;
    decimal bmi;
    string lastCheckup;
    int developmentScore;
    string createdAt;
    string updatedAt;
};
```

### Vaccine
```ballerina
type Vaccine record {
    string id;
    string childId;
    string name;
    string age;
    string dueDate;
    string status; // "upcoming", "due", "completed", "overdue"
    string? completedDate;
    string? remarks;
    string createdAt;
    string updatedAt;
};
```

## Getting Started

### Prerequisites
- Ballerina 2201.10.0 or later
- Java 17 or later

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd TikiriCare-backend
   ```

3. Install dependencies:
   ```bash
   bal build
   ```

4. Run the application:
   ```bash
   bal run
   ```

The server will start on port 8080.

### Environment Variables

- `JWT_SECRET`: Secret key for JWT token generation (default: "tikiricare-super-secret-key-2024")
- `JWT_ISSUER`: JWT issuer name (default: "tikiricare-auth-service")

## API Usage Examples

### User Registration
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Fernando",
    "email": "sarah@example.com",
    "password": "password123",
    "telephone": "0771234567"
  }'
```

### User Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@example.com",
    "password": "password123"
  }'
```

### Add Child
```bash
curl -X POST http://api/children \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emma",
    "gender": "female",
    "dateOfBirth": "2023-06-15",
    "height": 50.0,
    "weight": 3.2
  }'
```

### Initialize Vaccine Schedule
```bash
curl -X POST http://api/vaccines/initialize/CHILD_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Development

### Adding New Features
1. Create new types in `src/types/types.bal`
2. Add new services in `src/services/`
3. Update the main entry point in `src/main.bal`
4. Add tests for new functionality

### Testing
```bash
bal test
```

### Building
```bash
bal build
```

## Security Features

- JWT-based authentication
- Input validation and sanitization
- User authorization checks
- Secure password handling (in production, implement hashing)

## Production Considerations

- Replace in-memory storage with a proper database
- Implement password hashing (bcrypt, Argon2)
- Add rate limiting
- Implement proper logging and monitoring
- Use environment variables for sensitive configuration
- Add comprehensive error handling
- Implement data validation middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License. 