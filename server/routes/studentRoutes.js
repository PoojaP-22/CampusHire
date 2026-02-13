import express from 'express';
import {
  updateProfile,
  getMyProfile,
  getStudentProfile,
  getStudents,
  addSkills,
  removeSkill
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { studentProfileValidation } from '../middleware/validator.js';

const router = express.Router();

// Student routes
router.get('/profile', protect, authorize('student'), getMyProfile);
router.put('/profile', protect, authorize('student'), studentProfileValidation, updateProfile);
router.post('/profile/skills', protect, authorize('student'), addSkills);
router.delete('/profile/skills/:skill', protect, authorize('student'), removeSkill);

// TPO/Company/Admin routes
router.get('/', protect, authorize('tpo', 'company', 'admin'), getStudents);
router.get('/:id', protect, authorize('tpo', 'company', 'admin'), getStudentProfile);

export default router;
