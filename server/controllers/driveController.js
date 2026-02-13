import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Drive from '../models/Drive.js';
import Company from '../models/Company.js';
import StudentProfile from '../models/StudentProfile.js';

/**
 * @desc    Create a new drive
 * @route   POST /api/drives
 * @access  Private (TPO/Company)
 */
export const createDrive = asyncHandler(async (req, res, next) => {
  // Get company based on user role
  let company;
  if (req.user.role === 'company') {
    company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return next(new ErrorResponse('Company profile not found', 404));
    }
    req.body.company = company._id;
  } else if (req.user.role === 'tpo') {
    // TPO can create drive for any company
    if (!req.body.company) {
      return next(new ErrorResponse('Please specify company', 400));
    }
  }

  req.body.createdBy = req.user.id;

  const drive = await Drive.create(req.body);

  // Update company stats
  if (company) {
    company.totalDrivesPosted += 1;
    await company.save();
  }

  res.status(201).json({
    success: true,
    data: drive,
    message: 'Drive created successfully'
  });
});

/**
 * @desc    Get all drives with filters
 * @route   GET /api/drives
 * @access  Public
 */
export const getDrives = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from filtering
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Add filters for active drives by default
  if (!reqQuery.status) {
    reqQuery.status = 'Active';
    reqQuery.isPublished = true;
  }

  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Drive.find(JSON.parse(queryStr))
    .populate('company', 'companyName logo industry')
    .populate('createdBy', 'name email');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Drive.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const drives = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: drives.length,
    total,
    pagination,
    data: drives
  });
});

/**
 * @desc    Get eligible drives for a student
 * @route   GET /api/drives/eligible
 * @access  Private (Student)
 */
export const getEligibleDrives = asyncHandler(async (req, res, next) => {
  // Get student profile
  const studentProfile = await StudentProfile.findOne({ user: req.user.id });
  
  if (!studentProfile) {
    return next(new ErrorResponse('Student profile not found', 404));
  }

  // Find active drives
  const drives = await Drive.find({
    status: 'Active',
    isPublished: true,
    applicationDeadline: { $gte: new Date() }
  }).populate('company', 'companyName logo industry');

  // Filter eligible drives and calculate match percentage
  const eligibleDrives = drives.filter(drive => {
    // Check CGPA
    if (studentProfile.cgpa < drive.eligibility.minCGPA) return false;

    // Check department
    if (
      drive.eligibility.allowedDepartments.length > 0 &&
      !drive.eligibility.allowedDepartments.includes('All') &&
      !drive.eligibility.allowedDepartments.includes(studentProfile.department)
    ) {
      return false;
    }

    // Check batch
    if (
      drive.eligibility.allowedBatches.length > 0 &&
      !drive.eligibility.allowedBatches.includes(studentProfile.batch)
    ) {
      return false;
    }

    // Check backlogs
    if (!drive.eligibility.allowBacklogs && studentProfile.hasBacklogs) {
      return false;
    }

    if (
      drive.eligibility.maxBacklogs &&
      studentProfile.numberOfBacklogs > drive.eligibility.maxBacklogs
    ) {
      return false;
    }

    return true;
  }).map(drive => {
    const driveObj = drive.toObject();
    driveObj.matchPercentage = drive.calculateMatchPercentage(studentProfile);
    return driveObj;
  });

  // Sort by match percentage
  eligibleDrives.sort((a, b) => b.matchPercentage - a.matchPercentage);

  res.status(200).json({
    success: true,
    count: eligibleDrives.length,
    data: eligibleDrives
  });
});

/**
 * @desc    Get single drive
 * @route   GET /api/drives/:id
 * @access  Public
 */
export const getDrive = asyncHandler(async (req, res, next) => {
  const drive = await Drive.findById(req.params.id)
    .populate('company', 'companyName logo industry website description')
    .populate('createdBy', 'name email');

  if (!drive) {
    return next(new ErrorResponse('Drive not found', 404));
  }

  // Increment view count
  drive.views += 1;
  await drive.save();

  res.status(200).json({
    success: true,
    data: drive
  });
});

/**
 * @desc    Update drive
 * @route   PUT /api/drives/:id
 * @access  Private (TPO/Company owner)
 */
export const updateDrive = asyncHandler(async (req, res, next) => {
  let drive = await Drive.findById(req.params.id);

  if (!drive) {
    return next(new ErrorResponse('Drive not found', 404));
  }

  // Check ownership
  if (
    req.user.role !== 'tpo' &&
    req.user.role !== 'admin' &&
    drive.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized to update this drive', 403));
  }

  drive = await Drive.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: drive,
    message: 'Drive updated successfully'
  });
});

/**
 * @desc    Delete drive
 * @route   DELETE /api/drives/:id
 * @access  Private (TPO/Company owner/Admin)
 */
export const deleteDrive = asyncHandler(async (req, res, next) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    return next(new ErrorResponse('Drive not found', 404));
  }

  // Check ownership
  if (
    req.user.role !== 'tpo' &&
    req.user.role !== 'admin' &&
    drive.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized to delete this drive', 403));
  }

  await drive.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Drive deleted successfully'
  });
});

/**
 * @desc    Publish/Unpublish drive
 * @route   PATCH /api/drives/:id/publish
 * @access  Private (TPO/Company owner)
 */
export const togglePublish = asyncHandler(async (req, res, next) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    return next(new ErrorResponse('Drive not found', 404));
  }

  // Check ownership
  if (
    req.user.role !== 'tpo' &&
    req.user.role !== 'admin' &&
    drive.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  drive.isPublished = !drive.isPublished;
  if (drive.isPublished) {
    drive.publishedDate = Date.now();
  }

  await drive.save();

  res.status(200).json({
    success: true,
    data: drive,
    message: `Drive ${drive.isPublished ? 'published' : 'unpublished'} successfully`
  });
});

/**
 * @desc    Close drive
 * @route   PATCH /api/drives/:id/close
 * @access  Private (TPO/Company owner)
 */
export const closeDrive = asyncHandler(async (req, res, next) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    return next(new ErrorResponse('Drive not found', 404));
  }

  // Check ownership
  if (
    req.user.role !== 'tpo' &&
    req.user.role !== 'admin' &&
    drive.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  drive.status = 'Closed';
  await drive.save();

  res.status(200).json({
    success: true,
    data: drive,
    message: 'Drive closed successfully'
  });
});

/**
 * @desc    Get drives created by current user
 * @route   GET /api/drives/my-drives
 * @access  Private (TPO/Company)
 */
export const getMyDrives = asyncHandler(async (req, res, next) => {
  let query = {};

  if (req.user.role === 'company') {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return next(new ErrorResponse('Company profile not found', 404));
    }
    query.company = company._id;
  } else if (req.user.role === 'tpo') {
    query.createdBy = req.user.id;
  } else {
    return next(new ErrorResponse('Not authorized', 403));
  }

  const drives = await Drive.find(query)
    .populate('company', 'companyName logo')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: drives.length,
    data: drives
  });
});

/**
 * @desc    Get eligible students for a drive
 * @route   GET /api/drives/:id/eligible-students
 * @access  Private (TPO/Company owner)
 */
export const getEligibleStudents = asyncHandler(async (req, res, next) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    return next(new ErrorResponse('Drive not found', 404));
  }

  // Check ownership
  if (
    req.user.role !== 'tpo' &&
    req.user.role !== 'admin' &&
    drive.createdBy.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  // Build eligibility query
  let query = {
    cgpa: { $gte: drive.eligibility.minCGPA }
  };

  // Department filter
  if (
    drive.eligibility.allowedDepartments.length > 0 &&
    !drive.eligibility.allowedDepartments.includes('All')
  ) {
    query.department = { $in: drive.eligibility.allowedDepartments };
  }

  // Batch filter
  if (drive.eligibility.allowedBatches.length > 0) {
    query.batch = { $in: drive.eligibility.allowedBatches };
  }

  // Backlog filter
  if (!drive.eligibility.allowBacklogs) {
    query.hasBacklogs = false;
  } else if (drive.eligibility.maxBacklogs) {
    query.numberOfBacklogs = { $lte: drive.eligibility.maxBacklogs };
  }

  const students = await StudentProfile.find(query)
    .populate('user', 'name email phone')
    .select('-__v')
    .lean();

  // Calculate match percentage for each student
  const studentsWithMatch = students.map(student => ({
    ...student,
    matchPercentage: drive.calculateMatchPercentage(student)
  }));

  // Sort by match percentage
  studentsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

  res.status(200).json({
    success: true,
    count: studentsWithMatch.length,
    data: studentsWithMatch
  });
});
