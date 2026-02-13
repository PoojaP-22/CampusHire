# Campus Hire - Backend API

Backend server for the Campus Placement & Career Tracking Portal built with MERN stack.

## 🚀 Features

- ✅ Role-based authentication (Student, TPO, Company, Admin)
- ✅ JWT token-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ MongoDB integration with Mongoose
- ✅ Rate limiting for API protection
- ✅ CORS enabled for frontend integration
- ✅ Security headers with Helmet
- ✅ Request logging with Morgan

## 📋 Prerequisites

Before running this server, make sure you have:

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## 🛠 Installation

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env file:**
   Open `.env` and update the following:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campus-hire
   JWT_SECRET=your_super_secret_key_change_this
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7
   FRONTEND_URL=http://localhost:5173
   ```

## 🏃‍♂️ Running the Server

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js              # JWT verification & role-based access
│   ├── asyncHandler.js      # Async error wrapper
│   ├── errorHandler.js      # Global error handler
│   └── validator.js         # Input validation rules
├── models/
│   ├── User.js              # User model (all roles)
│   ├── StudentProfile.js    # Student-specific fields
│   ├── Company.js           # Company profile
│   ├── Drive.js             # Placement drives
│   └── Application.js       # Student applications
├── routes/
│   └── authRoutes.js        # Authentication endpoints
├── utils/
│   └── errorResponse.js     # Custom error class
├── uploads/                 # File uploads directory
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
└── server.js               # Express app entry point
```

## 🔑 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| GET | `/logout` | Logout user | Private |
| PUT | `/updatedetails` | Update user details | Private |
| PUT | `/updatepassword` | Change password | Private |

### Health Check
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/health` | Check API status | Public |

## 🧪 Testing API with Postman/Thunder Client

### 1. Register a Student
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "student",
  "phone": "9876543210"
}
```

### 2. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

Response will include a JWT token:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### 3. Get Current User (Protected Route)
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your-token-here>
```

## 👥 User Roles

The system supports 4 user roles:

1. **Student** - Can apply to drives, manage profile, track applications
2. **TPO** - Can create drives, manage applications, view analytics
3. **Company** - Can post jobs, view applicants, shortlist candidates
4. **Admin** - Full system access, user management, analytics

## 🗄 Database Models

### User Model
- Basic authentication for all roles
- Fields: name, email, password, role, phone, isActive, isVerified

### Student Profile
- Extended profile for students
- Fields: rollNumber, department, batch, cgpa, skills, resume, backlogs

### Company Model
- Company information
- Fields: companyName, industry, hrDetails, website, logo

### Drive Model
- Placement drive/job posting
- Fields: jobTitle, description, eligibility, salary, deadline

### Application Model
- Student applications to drives
- Fields: student, drive, status, interview, selection details

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT tokens with expiration
- ✅ HTTP-only cookies for token storage
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Helmet for security headers
- ✅ Input validation and sanitization
- ✅ MongoDB injection prevention
- ✅ CORS configuration

## 🐛 Error Handling

The API uses a centralized error handling system:

- Validation errors return 400 status
- Authentication errors return 401 status
- Authorization errors return 403 status
- Not found errors return 404 status
- Server errors return 500 status

## 📊 MongoDB Setup

### Local MongoDB:
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

### MongoDB Atlas (Cloud):
1. Create account at mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in .env

## 🔄 Next Steps

After backend setup:
1. ✅ Test all authentication endpoints
2. ⏳ Create Drive management APIs
3. ⏳ Create Application management APIs
4. ⏳ Add file upload functionality (Multer/Cloudinary)
5. ⏳ Implement email notifications
6. ⏳ Add Socket.io for real-time updates
7. ⏳ Create frontend and connect with backend

## 📝 Development Notes

- All routes use async/await with error handling
- Mongoose virtuals enabled for relationships
- Indexes created for frequently queried fields
- Password never returned in API responses
- Comprehensive validation on all inputs

## 🤝 Contributing

1. Follow existing code structure
2. Add validation for new routes
3. Use async/await pattern
4. Include error handling
5. Add comments for complex logic

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using MERN Stack**
