import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

/**
 * User Schema
 * Handles authentication for all roles: Student, TPO, Company, Admin
 */
const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false // Don't return password by default
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'tpo', 'company', 'admin'],
        message: 'Role must be student, tpo, company, or admin'
      },
      default: 'student'
    },
    
    // Contact Info
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    
    // Profile Status
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isApproved: {
      type: Boolean,
      default: true // Auto-approve students, manual for companies
    },
    
    // Profile Picture
    avatar: {
      type: String,
      default: 'default-avatar.png'
    },
    
    // Last Login
    lastLogin: {
      type: Date
    },
    
    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    // Verification Token
    verificationToken: String,
    verificationTokenExpire: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ==========================================
// INDEXES for Performance
// ==========================================
userSchema.index({ role: 1 });

// ==========================================
// VIRTUAL FIELDS
// ==========================================

// Virtual populate for student profile
userSchema.virtual('studentProfile', {
  ref: 'StudentProfile',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

// Virtual populate for company profile
userSchema.virtual('companyProfile', {
  ref: 'Company',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

// ==========================================
// MIDDLEWARE - Pre-save Hook
// ==========================================

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ==========================================
// INSTANCE METHODS
// ==========================================

// Match password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

export default mongoose.model('User', userSchema);
