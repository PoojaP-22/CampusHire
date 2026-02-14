# 🎓 CAMPUS HIRE - Placement & Career Tracking Portal

## 📌 PROJECT OVERVIEW

A comprehensive full-stack MERN application for managing campus placements, similar to Internshala + LinkedIn + College ERP (Placement Module) combined.

### 🎯 Vision
Smart Placement & Career Management Portal that helps:
- **Students** track applications and placement status
- **TPOs** manage drives and analyze performance
- **Companies** post jobs and shortlist candidates
- **Admins** oversee the entire system

---

## ✅ COMPLETED - PHASE 1-3 (Backend Foundation)

### 🏗 Project Structure Created

```
Campus-hire/
├── server/                      ✅ Backend API
│   ├── config/
│   │   └── database.js         ✅ MongoDB connection with error handling
│   ├── controllers/
│   │   └── authController.js   ✅ Authentication logic (register, login, logout)
│   ├── middleware/
│   │   ├── auth.js            ✅ JWT verification & role-based authorization
│   │   ├── asyncHandler.js    ✅ Async error wrapper
│   │   ├── errorHandler.js    ✅ Global error handling
│   │   └── validator.js       ✅ Input validation rules
│   ├── models/
│   │   ├── User.js            ✅ Base user model (all roles)
│   │   ├── StudentProfile.js  ✅ Student extended profile
│   │   ├── Company.js         ✅ Company profile
│   │   ├── Drive.js           ✅ Placement drive/job posting
│   │   └── Application.js     ✅ Student applications
│   ├── routes/
│   │   └── authRoutes.js      ✅ Authentication endpoints
│   ├── utils/
│   │   └── errorResponse.js   ✅ Custom error class
│   ├── uploads/               ✅ File upload directory
│   ├── .env                   ✅ Environment configuration
│   ├── .env.example           ✅ Environment template
│   ├── package.json           ✅ Dependencies defined
│   ├── server.js              ✅ Express server configured
│   └── README.md              ✅ Backend documentation
│
└── src/                         ✅ Frontend (React)
    ├── components/             ✅ Created folder structure
    │   ├── common/
    │   ├── student/
    │   ├── tpo/
    │   ├── company/
    │   └── admin/
    ├── pages/                  ✅ Created folder structure
    │   ├── auth/
    │   ├── student/
    │   ├── tpo/
    │   ├── company/
    │   └── admin/
    ├── context/                ✅ For state management
    ├── redux/                  ✅ Redux Toolkit setup
    │   └── slices/
    ├── services/               ✅ API service layer
    ├── hooks/                  ✅ Custom React hooks
    └── utils/                  ✅ Helper functions
```

---

## 🚀 BACKEND FEATURES IMPLEMENTED

### 1️⃣ **Authentication System** ✅
- ✅ User registration with role selection (student/tpo/company/admin)
- ✅ Login with JWT token generation
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Token-based authentication with expiry
- ✅ Protected routes middleware
- ✅ Role-based authorization
- ✅ Logout functionality
- ✅ Update user details
- ✅ Change password functionality

### 2️⃣ **Database Models** ✅

#### User Model
- Base authentication for all roles
- Fields: name, email, password, role, phone, avatar
- Status tracking: isActive, isVerified, isApproved
- Password reset tokens
- Virtual relationships with profiles

#### Student Profile Model
- Academic info: rollNumber, department, batch, cgpa, semester
- Backlog tracking
- Skills array
- Resume upload support
- Social links (LinkedIn, GitHub, Portfolio)
- Placement status tracking
- Mock test performance (for ML prediction)
- Address details
- **Smart Features:**
  - Eligibility score calculation (virtual field)
  - Auto-categorization based on performance

#### Company Model
- Company details: name, type, industry, description
- HR contact information
- Verification system with documents
- Company size categorization
- Statistics: total drives posted, total hires
- Virtual relationship with drives

#### Drive Model (Placement/Job Posting)
- Complete job details: title, description, type, category
- Skills required array
- **Eligibility Criteria:**
  - Minimum CGPA
  - Allowed departments
  - Allowed batches
  - Backlog restrictions
  - Gender preferences
- Compensation details with range
- Location and work mode
- Important dates: deadline, drive date, joining date
- Position tracking: total vs filled
- Drive status workflow
- Selection process rounds
- **Smart Features:**
  - Auto-close after deadline
  - Match percentage calculation with student skills
  - Application statistics

#### Application Model
- Student-Drive relationship tracking
- **Status Flow:**
  - Applied → Under Review → Shortlisted → Interview Scheduled
  - → Interview Completed → Selected/Rejected
- Status history tracking (all changes logged)
- Interview scheduling details
- Selection details (offer letter, package, joining date)
- Rejection tracking with reasons
- AI-based match percentage
- TPO internal notes
- Priority system
- **Smart Features:**
  - Auto-update drive statistics
  - One application per student per drive (unique constraint)

### 3️⃣ **Security Features** ✅
- ✅ Helmet.js for security headers
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS configuration
- ✅ Input validation with express-validator
- ✅ MongoDB injection prevention
- ✅ HTTP-only cookies
- ✅ Password strength validation
- ✅ JWT expiration handling

### 4️⃣ **Error Handling** ✅
- ✅ Centralized error handler middleware
- ✅ Custom ErrorResponse class
- ✅ Mongoose error handling:
  - Cast errors (invalid ObjectId)
  - Duplicate key errors
  - Validation errors
  - JWT errors
- ✅ Async error wrapper
- ✅ Development vs Production error responses

### 5️⃣ **Middleware Stack** ✅
- ✅ Body parser (JSON & URL-encoded)
- ✅ Cookie parser
- ✅ Compression
- ✅ Morgan logging (dev mode)
- ✅ CORS with credentials
- ✅ Rate limiting

---

## 📊 DATABASE SCHEMA DESIGN

### Relationships:
```
User (1) ←→ (1) StudentProfile
User (1) ←→ (1) Company
User (1) ←→ (N) Drives (as creator)
Company (1) ←→ (N) Drives
Drive (1) ←→ (N) Applications
User/Student (1) ←→ (N) Applications
```

### Indexes Created:
- User: email, role
- StudentProfile: user, rollNumber, department+batch, cgpa, isPlaced
- Company: user, companyName, industry
- Drive: company, status, applicationDeadline, minCGPA, createdAt
- Application: student+drive (unique), drive+status, student+status, createdAt

---

## 🔑 API ENDPOINTS AVAILABLE

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| GET | `/logout` | Logout user | Private |
| PUT | `/updatedetails` | Update profile | Private |
| PUT | `/updatepassword` | Change password | Private |

### Health Check
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/health` | Server status | Public |

---

## 🎯 NEXT PHASES (To Be Implemented)

### PHASE 4: Drive Management APIs ⏳
- Create drive (TPO/Company)
- Get all drives (with filters)
- Get drive by ID
- Update drive
- Delete drive
- Publish/Unpublish drive
- Close drive
- Get eligible students for a drive
- Search drives

### PHASE 5: Application Management APIs ⏳
- Apply to drive (Student)
- Get my applications (Student)
- Get applications for a drive (TPO/Company)
- Update application status (TPO/Company)
- Bulk status update
- Schedule interview
- Add feedback
- Download applicant list

### PHASE 6: User Profile Management ⏳
- Update student profile
- Upload resume (Multer + Cloudinary)
- Update company profile
- Get student profile by ID
- Search students

### PHASE 7: Analytics & Dashboard ⏳
- Placement statistics
- Department-wise analysis
- Company-wise statistics
- Student performance metrics
- Charts data endpoints

### PHASE 8: Advanced Features ⏳
- Email notifications (Nodemailer)
- Real-time notifications (Socket.io)
- Resume keyword matching (AI-based)
- Job recommendations
- Interview scheduling system
- Resume builder
- Placement prediction (ML)

### PHASE 9: Frontend Development ⏳
- Install dependencies (React Router, Redux, Tailwind, Chart.js)
- Authentication pages (Login/Register)
- Protected routes
- Dashboard UIs for all roles
- Drive listing and details
- Application tracking
- Profile management
- Analytics dashboards

### PHASE 10: Integration & Deployment ⏳
- Connect frontend with backend
- API integration with Axios
- State management with Redux
- Real-time updates
- Testing
- Deployment (Render + MongoDB Atlas + Netlify)

---

## 🚦 HOW TO START BACKEND SERVER

### 1. Install Dependencies:
```bash
cd server
npm install
```

### 2. Configure Environment:
```bash
# Copy .env.example to .env
cp .env.example .env

# Update .env with your values
```

### 3. Install & Start MongoDB:
```bash
# Local MongoDB
mongod

# OR use MongoDB Atlas cloud
```

### 4. Run Server:
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

---

## 🧪 TESTING THE API

### Using Thunder Client / Postman:

#### 1. Register a Student:
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "email": "rahul@student.com",
  "password": "Password123",
  "role": "student",
  "phone": "9876543210"
}
```

#### 2. Login:
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "rahul@student.com",
  "password": "Password123"
}
```

#### 3. Get Current User (use token from login):
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📦 DEPENDENCIES INSTALLED

### Backend:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin requests
- **express-validator** - Input validation
- **multer** - File uploads (ready to use)
- **cloudinary** - Cloud storage (ready to use)
- **nodemailer** - Email service (ready to use)
- **socket.io** - Real-time communication (ready to use)
- **cookie-parser** - Parse cookies
- **morgan** - HTTP logger
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **compression** - Response compression

---

## 🎨 DESIGN DECISIONS

### 1. **Modular Architecture**
- Separation of concerns (MVC pattern)
- Reusable middleware
- Centralized error handling

### 2. **Scalability**
- Indexed database fields
- Efficient queries with virtuals
- Pagination ready (to be implemented)
- Caching ready (to be implemented)

### 3. **Security First**
- Multiple layers of security
- Validation at every level
- Role-based access control
- Token expiration

### 4. **Developer Experience**
- Clear folder structure
- Comprehensive comments
- Async/await pattern
- Error messages in development
- Health check endpoint

### 5. **Production Ready**
- Environment-based configuration
- Proper error codes
- Logging system
- Process error handlers

---

## 📈 CURRENT PROJECT STATUS

### ✅ Completed (60% of Backend):
1. ✅ Project structure setup
2. ✅ Express server with security
3. ✅ MongoDB connection
4. ✅ All database models
5. ✅ Authentication system
6. ✅ Role-based authorization
7. ✅ Input validation
8. ✅ Error handling

### ⏳ Remaining:
9. ⏳ Drive management APIs
10. ⏳ Application management APIs
11. ⏳ File upload functionality
12. ⏳ Email notifications
13. ⏳ Analytics endpoints
14. ⏳ Frontend development
15. ⏳ Integration & testing
16. ⏳ Deployment

---

## 🎓 KEY FEATURES READY TO IMPLEMENT

### Smart Eligibility Filtering
- Drive model has `calculateMatchPercentage()` method
- Student model has `eligibilityScore` virtual field
- Ready for AI-based recommendations

### Application Status Tracking
- Complete workflow implemented
- Status history maintained
- Auto-update drive statistics

### Role-Based Access
- Middleware ready for all roles
- Authorization helper functions
- Ownership checking

### Data Relationships
- Virtual populations configured
- Efficient queries ready
- Referential integrity

---

## 💡 WHAT YOU CAN DO NOW

1. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up MongoDB** (local or Atlas)

3. **Configure .env** file

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Test authentication APIs** using Postman/Thunder Client

6. **Ready for next phase:** Drive Management APIs

---

## 📞 NEXT STEPS

Would you like me to:
1. ✅ Continue with **Drive Management APIs** (CRUD operations)?
2. ✅ Continue with **Application Management APIs**?
3. ✅ Add **File Upload** functionality (Resume, Documents)?
4. ✅ Start **Frontend Development** (React components)?
5. ✅ Create **Seed Data** for testing?
6. ✅ Add **Email Notification** system?

Let me know which phase you'd like me to implement next! 🚀

---

**Built with ❤️ using MERN Stack**
