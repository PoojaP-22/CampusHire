import { body, validationResult } from 'express-validator';
import ErrorResponse from '../utils/errorResponse.js';

/**
 * Validation Result Handler
 * Checks for validation errors and returns them
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return next(new ErrorResponse(errorMessages, 400));
  }
  next();
};

/**
 * Registration Validation Rules
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['student', 'tpo', 'company', 'admin'])
    .withMessage('Invalid role'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  
  validate
];

/**
 * Login Validation Rules
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

/**
 * Update Password Validation Rules
 */
export const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required'),
  
  validate
];

/**
 * Student Profile Validation Rules
 */
export const studentProfileValidation = [
  body('rollNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Roll number is required'),
  
  body('department')
    .optional()
    .notEmpty()
    .withMessage('Department is required')
    .isIn([
      'Computer Science', 'Information Technology', 'Electronics',
      'Electrical', 'Mechanical', 'Civil', 'Chemical',
      'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT',
      'AIDS', 'AIML', 'CSM', 'CSD',
      'Other'
    ])
    .withMessage('Invalid department'),
  
  body('batch')
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Invalid batch year'),
  
  body('cgpa')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('CGPA must be between 0 and 10'),
  
  body('numberOfBacklogs')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Number of backlogs cannot be negative'),
  
  validate
];

/**
 * Drive Creation Validation Rules
 */
export const driveValidation = [
  body('jobTitle')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 100 })
    .withMessage('Job title cannot exceed 100 characters'),
  
  body('jobDescription')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ max: 2000 })
    .withMessage('Job description cannot exceed 2000 characters'),
  
  body('jobType')
    .notEmpty()
    .withMessage('Job type is required')
    .isIn(['Full-time', 'Internship', 'Part-time', 'Contract'])
    .withMessage('Invalid job type'),
  
  body('salary.min')
    .notEmpty()
    .withMessage('Minimum salary is required')
    .isNumeric()
    .withMessage('Salary must be a number'),
  
  body('jobLocation')
    .trim()
    .notEmpty()
    .withMessage('Job location is required'),
  
  body('applicationDeadline')
    .notEmpty()
    .withMessage('Application deadline is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Application deadline must be in the future');
      }
      return true;
    }),
  
  body('numberOfPositions')
    .notEmpty()
    .withMessage('Number of positions is required')
    .isInt({ min: 1 })
    .withMessage('At least 1 position is required'),
  
  body('eligibility.minCGPA')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Minimum CGPA must be between 0 and 10'),
  
  validate
];
