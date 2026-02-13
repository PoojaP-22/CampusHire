import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

/**
 * Protect Routes - Verify JWT Token
 * Makes sure user is authenticated
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies (alternative method)
  else if (req.cookies.token) {
    token = req.cookies.token;
  }
  
  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token (exclude password)
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return next(new ErrorResponse('User no longer exists', 401));
    }
    
    // Check if user is active
    if (!req.user.isActive) {
      return next(new ErrorResponse('Your account has been deactivated', 401));
    }
    
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

/**
 * Role-based Authorization
 * Grant access to specific roles
 * Usage: authorize('admin', 'tpo')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

/**
 * Optional Authentication
 * Adds user to request if authenticated, but doesn't require it
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Token invalid, but continue without user
      req.user = null;
    }
  }
  
  next();
});

/**
 * Check if user owns the resource
 * Compare user ID with resource owner
 */
export const checkOwnership = (modelName) => {
  return asyncHandler(async (req, res, next) => {
    const Model = mongoose.model(modelName);
    const resource = await Model.findById(req.params.id);
    
    if (!resource) {
      return next(new ErrorResponse(`${modelName} not found`, 404));
    }
    
    // Check if user owns the resource or is admin/tpo
    if (
      resource.user.toString() !== req.user.id &&
      !['admin', 'tpo'].includes(req.user.role)
    ) {
      return next(
        new ErrorResponse(
          `User is not authorized to access this ${modelName}`,
          403
        )
      );
    }
    
    next();
  });
};
