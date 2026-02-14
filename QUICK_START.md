# 🚀 QUICK START GUIDE - Campus Hire Portal

## ⚡ Get Started in 5 Minutes

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Set Up MongoDB

**Option A - Local MongoDB:**
```bash
# Make sure MongoDB is installed and running
mongod
```

**Option B - MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Use it in .env file

### Step 3: Configure Environment Variables
```bash
# Already created: server/.env
# Just update these values if needed:

MONGODB_URI=mongodb://localhost:27017/campus-hire
JWT_SECRET=campus_hire_super_secret_jwt_key_2026_change_in_production
```

### Step 4: Start the Backend Server
```bash
# From server directory
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
📊 Database Name: campus-hire
🎓 CAMPUS HIRE API SERVER
🚀 Server running on port 5000
```

### Step 5: Test the API

**Using VS Code REST Client / Thunder Client / Postman:**

1. **Health Check:**
```http
GET http://localhost:5000/api/health
```

2. **Register a Student:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test Student",
  "email": "student@test.com",
  "password": "Test@123",
  "role": "student",
  "phone": "9876543210"
}
```

3. **Login:**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "Test@123"
}
```

4. **Get Profile (use token from login response):**
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🎯 What's Working Now?

✅ **Backend Server** - Fully configured Express server
✅ **MongoDB Connection** - Database ready
✅ **User Registration** - All 4 roles (student/tpo/company/admin)
✅ **Login System** - JWT token-based auth
✅ **Protected Routes** - Role-based access control
✅ **Data Models** - User, StudentProfile, Company, Drive, Application
✅ **Security** - Rate limiting, validation, encryption

---

## 📊 Database Models Created

- ✅ **User** - Base authentication (all roles)
- ✅ **StudentProfile** - Extended student data (cgpa, skills, resume)
- ✅ **Company** - Company details and HR info
- ✅ **Drive** - Placement drives/job postings
- ✅ **Application** - Student applications with status tracking

---

## 🔐 Test Users You Can Create

### Student Account:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@student.com",
  "password": "Student@123",
  "role": "student"
}
```

### TPO Account:
```json
{
  "name": "Dr. Priya TPO",
  "email": "priya@tpo.com",
  "password": "Tpo@123",
  "role": "tpo"
}
```

### Company Account:
```json
{
  "name": "TechCorp HR",
  "email": "hr@techcorp.com",
  "password": "Company@123",
  "role": "company"
}
```

### Admin Account:
```json
{
  "name": "Admin User",
  "email": "admin@college.com",
  "password": "Admin@123",
  "role": "admin"
}
```

---

## 🛠 Troubleshooting

### MongoDB Connection Failed?
- Check if MongoDB service is running
- Verify MONGODB_URI in .env
- For Atlas, check network access whitelist

### Port 5000 Already in Use?
- Change PORT in .env to 5001 or any other port
- Update FRONTEND_URL accordingly

### Dependencies Not Installing?
- Try: `npm install --legacy-peer-deps`
- Or: `npm cache clean --force` then `npm install`

---

## 📁 Project Structure

```
Campus-hire/
├── server/              ✅ Backend (Express + MongoDB)
│   ├── config/         → Database connection
│   ├── controllers/    → Business logic
│   ├── middleware/     → Auth, validation, errors
│   ├── models/         → Mongoose schemas
│   ├── routes/         → API endpoints
│   ├── utils/          → Helper functions
│   └── server.js       → Entry point
│
└── src/                ✅ Frontend (React - Structure Ready)
    ├── components/     → Reusable UI components
    ├── pages/          → Page components
    ├── context/        → State management
    ├── services/       → API calls
    └── App.jsx         → Main component
```

---

## ✨ What's Next?

Choose your path:

### Path 1: Complete Backend First (Recommended)
1. Drive Management APIs
2. Application Management APIs  
3. File Upload (Resume)
4. Email Notifications
5. Analytics Endpoints

### Path 2: Start Frontend Development
1. Install React dependencies
2. Create authentication UI
3. Build dashboard layouts
4. Connect with backend

### Path 3: Add Advanced Features
1. Real-time notifications (Socket.io)
2. Resume keyword matching (AI)
3. Interview scheduling
4. Analytics dashboard

---

## 🎓 Ready to Continue?

Tell me which phase you want next:

1. **Drive Management** - Create/manage placement drives (TPO/Company)
2. **Application System** - Student apply, TPO review, track status
3. **Profile Management** - Update profiles, upload resume
4. **Frontend Development** - React UI for all users
5. **Advanced Features** - AI matching, notifications, analytics

Just let me know, and I'll continue building! 🚀

---

**Need Help?** Check PROJECT_STATUS.md for detailed progress
