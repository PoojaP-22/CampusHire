import express from 'express';
import {
  createDrive,
  getDrives,
  getDrive,
  updateDrive,
  deleteDrive,
  togglePublish,
  closeDrive,
  getMyDrives,
  getEligibleDrives,
  getEligibleStudents
} from '../controllers/driveController.js';
import { protect, authorize } from '../middleware/auth.js';
import { driveValidation } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.get('/', getDrives);
router.get('/:id', getDrive);

// Student routes
router.get('/student/eligible', protect, authorize('student'), getEligibleDrives);

// TPO/Company routes
router.post('/', protect, authorize('tpo', 'company'), driveValidation, createDrive);
router.get('/me/my-drives', protect, authorize('tpo', 'company'), getMyDrives);
router.get('/:id/eligible-students', protect, authorize('tpo', 'company', 'admin'), getEligibleStudents);

// Update/Delete routes
router.put('/:id', protect, authorize('tpo', 'company', 'admin'), updateDrive);
router.delete('/:id', protect, authorize('tpo', 'company', 'admin'), deleteDrive);
router.patch('/:id/publish', protect, authorize('tpo', 'company', 'admin'), togglePublish);
router.patch('/:id/close', protect, authorize('tpo', 'company', 'admin'), closeDrive);

export default router;
