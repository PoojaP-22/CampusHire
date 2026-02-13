import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express app
const app = express();

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Helmet - Set security headers
app.use(helmet());

// Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS - Enable Cross-Origin Resource Sharing
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ==========================================
// GENERAL MIDDLEWARE
// ==========================================

// Body Parser - Parse JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie Parser - Parse cookies
app.use(cookieParser());

// Compression - Compress response bodies
app.use(compression());

// Morgan - HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==========================================
// API ROUTES
// ==========================================

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Campus Hire API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Import routes
import authRoutes from './routes/authRoutes.js';
import driveRoutes from './routes/driveRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/students', studentRoutes);

// 404 Handler - Route not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// ==========================================
// ERROR HANDLING MIDDLEWARE (Must be last)
// ==========================================
app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   🎓 CAMPUS HIRE API SERVER                   ║
║                                                ║
║   🚀 Server running on port ${PORT}              ║
║   📍 Environment: ${process.env.NODE_ENV || 'development'}               ║
║   🌐 URL: http://localhost:${PORT}              ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;
