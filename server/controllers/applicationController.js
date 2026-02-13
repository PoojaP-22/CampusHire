import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Application from '../models/Application.js';
import Drive from '../models/Drive.js';
import StudentProfile from '../models/StudentProfile.js';

/**
 * @desc    Apply to a drive
 * @route   POST /api/applications
 * @access  Private (Student)
 */
export const applyToDrive = asyncHandler(async (req, res, next) => {
  const { drive, coverLetter } = req.body;

  // Check if drive exists and is active
  const driveData = await Drive.findById(drive);
  
  if (!driveData) {
    return next(new ErrorResponse('Drive not found', 404));
  }

  if (!driveData.isActive) {
    return next(new ErrorResponse('This drive is not accepting applications', 400));
  }

  // Get student profile
  const studentProfile = await StudentProfile.findOne({ user: req.user.id });
  
  if (!studentProfile) {
    return next(new ErrorResponse('Please complete your profile first', 400));
  }

  // Check eligibility
  let isEligible = true;
  let eligibilityReason = '';

  // CGPA check
  if (studentProfile.cgpa < driveData.eligibility.minCGPA) {
    isEligible = false;
    eligibilityReason = `CGPA requirement not met. Required: ${driveData.eligibility.minCGPA}, Your CGPA: ${studentProfile.cgpa}`;
  }

  // Department check
  if (
    driveData.eligibility.allowedDepartments.length > 0 &&
    !driveData.eligibility.allowedDepartments.includes('All') &&
    !driveData.eligibility.allowedDepartments.includes(studentProfile.department)
  ) {
    isEligible = false;
    eligibilityReason = 'Your department is not eligible for this drive';
  }

  // Batch check
  if (
    driveData.eligibility.allowedBatches.length > 0 &&
    !driveData.eligibility.allowedBatches.includes(studentProfile.batch)
  ) {
    isEligible = false;
    eligibilityReason = 'Your batch is not eligible for this drive';
  }

  // Backlog check
  if (!driveData.eligibility.allowBacklogs && studentProfile.hasBacklogs) {
    isEligible = false;
    eligibilityReason = 'Students with backlogs are not allowed';
  }

  if (
    driveData.eligibility.maxBacklogs &&
    studentProfile.numberOfBacklogs > driveData.eligibility.maxBacklogs
  ) {
    isEligible = false;
    eligibilityReason = `Maximum ${driveData.eligibility.maxBacklogs} backlogs allowed`;
  }

  // Check if already applied
  const existingApplication = await Application.findOne({
    student: req.user.id,
    drive: drive
  });

  if (existingApplication) {
    return next(new ErrorResponse('You have already applied to this drive', 400));
  }

  // Calculate match percentage
  const matchPercentage = driveData.calculateMatchPercentage(studentProfile);

  // Create application
  const application = await Application.create({
    student: req.user.id,
    drive,
    coverLetter,
    isEligible,
    matchPercentage,
    resumeSnapshot: studentProfile.resume
  });

  res.status(201).json({
    success: true,
    data: application,
    message: isEligible 
      ? 'Application submitted successfully' 
      : `Application submitted but you may not be eligible: ${eligibilityReason}`
  });
});

/**
 * @desc    Get my applications
 * @route   GET /api/applications/my-applications
 * @access  Private (Student)
 */
export const getMyApplications = asyncHandler(async (req, res, next) => {
  const applications = await Application.find({ student: req.user.id })
    .populate({
      path: 'drive',
      select: 'jobTitle company applicationDeadline status salary jobLocation',
      populate: {
        path: 'company',
        select: 'companyName logo'
      }
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications
  });
});

/**
 * @desc    Get all applications for a drive
 * @route   GET /api/applications/drive/:driveId
 * @access  Private (TPO/Company)
 */
export const getApplicationsForDrive = asyncHandler(async (req, res, next) => {
  const drive = await Drive.findById(req.params.driveId);
  
  if (!drive) {
    return next(new ErrorResponse('Drive not found', 404));
  }

  // Check authorization
  if (
    req.user.role !== 'tpo' &&
    req.user.role !== 'admin' &&
    drive.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Build query with filters
  const queryObj = { drive: req.params.driveId };

  if (req.query.status) {
    queryObj.status = req.query.status;
  }

  if (req.query.isEligible) {
    queryObj.isEligible = req.query.isEligible === 'true';
  }

  const applications = await Application.find(queryObj)
    .populate({
      path: 'student',
      select: 'name email phone',
      populate: {
        path: 'studentProfile',
        select: 'rollNumber department batch cgpa skills hasBacklogs numberOfBacklogs resume'
      }
    })
    .sort('-matchPercentage -createdAt');

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications
  });
});

/**
 * @desc    Get single application
 * @route   GET /api/applications/:id
 * @access  Private
 */
export const getApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id)
    .populate('student', 'name email phone')
    .populate({
      path: 'drive',
      populate: {
        path: 'company',
        select: 'companyName logo'
      }
    });

  if (!application) {
    return next(new ErrorResponse('Application not found', 404));
  }

  // Check authorization
  if (
    req.user.id !== application.student._id.toString() &&
    req.user.role !== 'tpo' &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  res.status(200).json({
    success: true,
    data: application
  });
});

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id/status
 * @access  Private (TPO/Company)
 */
export const updateApplicationStatus = asyncHandler(async (req, res, next) => {
  const { status, remarks } = req.body;

  const application = await Application.findById(req.params.id).populate('drive');

  if (!application) {
    return next(new ErrorResponse('Application not found', 404));
  }

  // Check authorization
  const drive = application.drive;
  if (
    req.user.role !== 'tpo' &&
    req.user.role !== 'admin' &&
    drive.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Update status
  application.status = status;
  
  // Add to status history
  application.statusHistory.push({
    status,
    changedBy: req.user.id,
    remarks,
    timestamp: new Date()
  });

  await application.save();

  res.status(200).json({
    success: true,
    data: application,
    message: 'Application status updated successfully'
  });
});

/**
 * @desc    Bulk update application status
 * @route   POST /api/applications/bulk-update
 * @access  Private (TPO/Company)
 */
export const bulkUpdateStatus = asyncHandler(async (req, res, next) => {
  const { applicationIds, status, remarks } = req.body;

  if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
    return next(new ErrorResponse('Please provide application IDs', 400));
  }

  const applications = await Application.find({ _id: { $in: applicationIds } }).populate('drive');

  // Check authorization for all applications
  for (const app of applications) {
    if (
      req.user.role !== 'tpo' &&
      req.user.role !== 'admin' &&
      app.drive.createdBy.toString() !== req.user.id
    ) {
      return next(new ErrorResponse('Not authorized to update all applications', 403));
    }
  }

  // Update all applications
  const updatePromises = applications.map(async (app) => {
    app.status = status;
    app.statusHistory.push({
      status,
      changedBy: req.user.id,
      remarks,
      timestamp: new Date()
    });
    return app.save();
  });

  await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    count: applications.length,
    message: `${applications.length} applications updated successfully`
  });
});

/**
 * @desc    Schedule interview
 * @route   POST /api/applications/:id/schedule-interview
 * @access  Private (TPO/Company)
 */
export const scheduleInterview = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id).populate('drive');

  if (!application) {
    return next(new ErrorResponse('Application not found', 404));
  }

  // Check authorization
  if (
    req.user.role !== 'tpo' &&
    req.user.role !== 'admin' &&
    application.drive.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Update interview details
  application.interview = {
    scheduledDate: req.body.scheduledDate,
    scheduledTime: req.body.scheduledTime,
    venue: req.body.venue,
    mode: req.body.mode,
    meetingLink: req.body.meetingLink,
    round: req.body.round,
    interviewers: req.body.interviewers
  };

  application.status = 'Interview Scheduled';

  await application.save();

  res.status(200).json({
    success: true,
    data: application,
    message: 'Interview scheduled successfully'
  });
});

/**
 * @desc    Add feedback to application
 * @route   POST /api/applications/:id/feedback
 * @access  Private (TPO/Company)
 */
export const addFeedback = asyncHandler(async (req, res, next) => {
  const { feedback, score } = req.body;

  const application = await Application.findById(req.params.id).populate('drive');

  if (!application) {
    return next(new ErrorResponse('Application not found', 404));
  }

  // Check authorization
  if (
    req.user.role !== 'tpo' &&
    req.user.role !== 'admin' &&
    application.drive.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  if (application.interview) {
    application.interview.feedback = feedback;
    if (score) application.interview.score = score;
  }

  await application.save();

  res.status(200).json({
    success: true,
    data: application,
    message: 'Feedback added successfully'
  });
});

/**
 * @desc    Withdraw application
 * @route   DELETE /api/applications/:id
 * @access  Private (Student - owner)
 */
export const withdrawApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return next(new ErrorResponse('Application not found', 404));
  }

  // Check ownership
  if (application.student.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Don't allow withdrawal if already selected
  if (application.status === 'Selected') {
    return next(new ErrorResponse('Cannot withdraw a selected application', 400));
  }

  application.status = 'Withdrawn';
  await application.save();

  res.status(200).json({
    success: true,
    message: 'Application withdrawn successfully'
  });
});

/**
 * @desc    Get application statistics for a drive
 * @route   GET /api/applications/stats/:driveId
 * @access  Private (TPO/Company)
 */
export const getApplicationStats = asyncHandler(async (req, res, next) => {
  const drive = await Drive.findById(req.params.driveId);

  if (!drive) {
    return next(new ErrorResponse('Drive not found', 404));
  }

  // Check authorization
  if (
    req.user.role !== 'tpo' &&
    req.user.role !== 'admin' &&
    drive.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  const stats = await Application.aggregate([
    { $match: { drive: drive._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const departmentStats = await Application.aggregate([
    { $match: { drive: drive._id } },
    {
      $lookup: {
        from: 'studentprofiles',
        localField: 'student',
        foreignField: 'user',
        as: 'profile'
      }
    },
    { $unwind: '$profile' },
    {
      $group: {
        _id: '$profile.department',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      statusStats: stats,
      departmentStats
    }
  });
});
