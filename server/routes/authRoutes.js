import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  registerValidation,
  loginValidation,
  updatePasswordValidation
} from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePasswordValidation, updatePassword);

export default router;
