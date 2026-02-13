import express from 'express';
import {
  applyToDrive,
  getMyApplications,
  getApplicationsForDrive,
  getApplication,
  updateApplicationStatus,
  bulkUpdateStatus,
  scheduleInterview,
  addFeedback,
  withdrawApplication,
  getApplicationStats
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Student routes
router.post('/', protect, authorize('student'), applyToDrive);
router.get('/my-applications', protect, authorize('student'), getMyApplications);
router.delete('/:id', protect, authorize('student'), withdrawApplication);

// TPO/Company routes
router.get('/drive/:driveId', protect, authorize('tpo', 'company', 'admin'), getApplicationsForDrive);
router.get('/stats/:driveId', protect, authorize('tpo', 'company', 'admin'), getApplicationStats);
router.put('/:id/status', protect, authorize('tpo', 'company', 'admin'), updateApplicationStatus);
router.post('/bulk-update', protect, authorize('tpo', 'company', 'admin'), bulkUpdateStatus);
router.post('/:id/schedule-interview', protect, authorize('tpo', 'company', 'admin'), scheduleInterview);
router.post('/:id/feedback', protect, authorize('tpo', 'company', 'admin'), addFeedback);

// Common routes
router.get('/:id', protect, getApplication);

export default router;
