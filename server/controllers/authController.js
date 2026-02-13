import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Company from '../models/Company.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;
  
  // Validate required fields
  if (!name || !email || !password || !role) {
    return next(new ErrorResponse('Please provide all required fields', 400));
  }
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('Email already registered', 400));
  }
  
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    isApproved: role === 'company' ? false : true // Companies need approval
  });
  
  // Create role-specific profile
  if (role === 'student') {
    // Additional student fields will be added when they complete profile
    await StudentProfile.create({
      user: user._id,
      rollNumber: `TEMP_${user._id}`, // Temporary, will be updated
      department: 'Other',
      batch: new Date().getFullYear(),
      cgpa: 0
    });
  } else if (role === 'company') {
    // Additional company fields will be added when they complete profile
    await Company.create({
      user: user._id,
      companyName: name, // Use user name as default
      hrName: name,
      hrEmail: email,
      industry: 'Other'
    });
  }
  
  // Generate token and send response
  sendTokenResponse(user, 201, res, 'Registration successful');
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }
  
  // Check for user (include password for verification)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  
  // Check if user is active
  if (!user.isActive) {
    return next(new ErrorResponse('Your account has been deactivated. Please contact admin', 401));
  }
  
  // Check if user is approved (for companies)
  if (!user.isApproved) {
    return next(new ErrorResponse('Your account is pending approval', 401));
  }
  
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  
  // Update last login
  user.lastLogin = Date.now();
  await user.save();
  
  // Generate token and send response
  sendTokenResponse(user, 200, res, 'Login successful');
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res, next) => {
  // User is already available in req.user from protect middleware
  let user = req.user;
  
  // Populate role-specific profile
  if (user.role === 'student') {
    user = await User.findById(user._id).populate('studentProfile');
  } else if (user.role === 'company') {
    user = await User.findById(user._id).populate('companyProfile');
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Update user details
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
export const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };
  
  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );
  
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: user,
    message: 'Profile updated successfully'
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  
  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }
  
  // Set new password
  user.password = req.body.newPassword;
  await user.save();
  
  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// ==========================================
// HELPER FUNCTION
// ==========================================

/**
 * Get token from model, create cookie and send response
 */
const sendTokenResponse = (user, statusCode, res, message = '') => {
  // Create token
  const token = user.getSignedJwtToken();
  
  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'strict' // CSRF protection
  };
  
  // Remove password from output
  user.password = undefined;
  
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user,
      message
    });
};
