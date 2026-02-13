import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';

/**
 * @desc    Update student profile
 * @route   PUT /api/students/profile
 * @access  Private (Student)
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  let profile = await StudentProfile.findOne({ user: req.user.id });

  if (!profile) {
    // Create profile if it doesn't exist (upsert)
    profile = await StudentProfile.create({
      user: req.user.id,
      rollNumber: req.body.rollNumber || `TEMP_${req.user.id}`,
      department: req.body.department || 'Other',
      batch: req.body.batch || new Date().getFullYear(),
      cgpa: req.body.cgpa || 0,
      ...req.body
    });
  } else {
    // Update existing profile
    Object.assign(profile, req.body);
    await profile.save();
  }

  profile = await StudentProfile.findOne({ user: req.user.id })
    .populate('user', 'name email phone avatar');

  res.status(200).json({
    success: true,
    data: profile,
    message: 'Profile updated successfully'
  });
});

/**
 * @desc    Get my profile
 * @route   GET /api/students/profile
 * @access  Private (Student)
 */
export const getMyProfile = asyncHandler(async (req, res, next) => {
  let profile = await StudentProfile.findOne({ user: req.user.id })
    .populate('user', 'name email phone avatar isVerified');

  if (!profile) {
    // Auto-create a blank profile for the student
    profile = await StudentProfile.create({
      user: req.user.id,
      rollNumber: `TEMP_${req.user.id}`,
      department: 'Other',
      batch: new Date().getFullYear(),
      cgpa: 0
    });
    profile = await StudentProfile.findOne({ user: req.user.id })
      .populate('user', 'name email phone avatar isVerified');
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

/**
 * @desc    Get student profile by ID
 * @route   GET /api/students/:id
 * @access  Private (TPO/Admin)
 */
export const getStudentProfile = asyncHandler(async (req, res, next) => {
  const profile = await StudentProfile.findById(req.params.id)
    .populate('user', 'name email phone avatar isVerified');

  if (!profile) {
    return next(new ErrorResponse('Student not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

/**
 * @desc    Get all students with filters
 * @route   GET /api/students
 * @access  Private (TPO/Company/Admin)
 */
export const getStudents = asyncHandler(async (req, res, next) => {
  let query = {};

  // Filters
  if (req.query.department) {
    query.department = req.query.department;
  }

  if (req.query.batch) {
    query.batch = parseInt(req.query.batch);
  }

  if (req.query.minCGPA) {
    query.cgpa = { $gte: parseFloat(req.query.minCGPA) };
  }

  if (req.query.isPlaced !== undefined) {
    query.isPlaced = req.query.isPlaced === 'true';
  }

  if (req.query.hasBacklogs !== undefined) {
    query.hasBacklogs = req.query.hasBacklogs === 'true';
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const total = await StudentProfile.countDocuments(query);

  const students = await StudentProfile.find(query)
    .populate('user', 'name email phone avatar')
    .select('-__v')
    .skip(startIndex)
    .limit(limit)
    .sort(req.query.sort || '-cgpa');

  res.status(200).json({
    success: true,
    count: students.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: students
  });
});

/**
 * @desc    Add skills
 * @route   POST /api/students/profile/skills
 * @access  Private (Student)
 */
export const addSkills = asyncHandler(async (req, res, next) => {
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills)) {
    return next(new ErrorResponse('Please provide skills array', 400));
  }

  const profile = await StudentProfile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Add unique skills
  skills.forEach(skill => {
    if (!profile.skills.includes(skill)) {
      profile.skills.push(skill);
    }
  });

  await profile.save();

  res.status(200).json({
    success: true,
    data: profile,
    message: 'Skills added successfully'
  });
});

/**
 * @desc    Remove skill
 * @route   DELETE /api/students/profile/skills/:skill
 * @access  Private (Student)
 */
export const removeSkill = asyncHandler(async (req, res, next) => {
  const profile = await StudentProfile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  profile.skills = profile.skills.filter(s => s !== req.params.skill);
  await profile.save();

  res.status(200).json({
    success: true,
    data: profile,
    message: 'Skill removed successfully'
  });
});
