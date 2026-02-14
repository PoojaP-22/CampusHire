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
import Company from '../models/Company.js';

const router = express.Router();

// Middleware to map frontend field names to model field names before validation
const mapDriveFields = (req, res, next) => {
  const b = req.body;
  if (b.title && !b.jobTitle) b.jobTitle = b.title;
  if (b.description && !b.jobDescription) b.jobDescription = b.description;
  if (b.location && !b.jobLocation) b.jobLocation = b.location;
  if (b.deadline && !b.applicationDeadline) b.applicationDeadline = b.deadline;
  if (b.positions && !b.numberOfPositions) b.numberOfPositions = b.positions;
  if (b.type && !b.jobType) {
    const typeMap = { 'Full-Time': 'Full-time', 'Internship': 'Internship', 'Intern + FTE': 'Full-time', 'Part-Time': 'Part-time' };
    b.jobType = typeMap[b.type] || b.type;
  }
  if (b.salary?.ctc && !b.salary?.min) {
    b.salary = { ...b.salary, min: b.salary.ctc };
  }
  next();
};

// Static routes MUST come before /:id to avoid being caught by the param route
// List all companies (for TPO drive creation dropdown)
router.get('/companies/list', protect, authorize('tpo', 'admin'), async (req, res) => {
  const companies = await Company.find({}, 'companyName industry logo').sort('companyName');
  res.json({ success: true, data: companies });
});

// Student routes
router.get('/student/eligible', protect, authorize('student'), getEligibleDrives);

// TPO/Company routes
router.post('/', protect, authorize('tpo', 'company'), mapDriveFields, driveValidation, createDrive);
router.get('/me/my-drives', protect, authorize('tpo', 'company'), getMyDrives);

// Public routes
router.get('/', getDrives);
router.get('/:id', getDrive);
router.get('/:id/eligible-students', protect, authorize('tpo', 'company', 'admin'), getEligibleStudents);

// Update/Delete routes
router.put('/:id', protect, authorize('tpo', 'company', 'admin'), updateDrive);
router.delete('/:id', protect, authorize('tpo', 'company', 'admin'), deleteDrive);
router.patch('/:id/publish', protect, authorize('tpo', 'company', 'admin'), togglePublish);
router.patch('/:id/close', protect, authorize('tpo', 'company', 'admin'), closeDrive);

export default router;
