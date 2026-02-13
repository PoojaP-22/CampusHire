import mongoose from 'mongoose';

/**
 * Drive Schema
 * Represents a placement drive/job posting
 */
const driveSchema = new mongoose.Schema(
  {
    // Company Reference
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Drive must belong to a company']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Job Details
    jobTitle: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    jobDescription: {
      type: String,
      required: [true, 'Please provide job description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Part-time', 'Contract'],
      required: [true, 'Please specify job type']
    },
    
    // Job Category
    category: {
      type: String,
      enum: [
        'Software Development',
        'Data Science',
        'Web Development',
        'Mobile Development',
        'DevOps',
        'Cybersecurity',
        'Business Analyst',
        'Consulting',
        'Marketing',
        'Sales',
        'HR',
        'Finance',
        'Other'
      ],
      default: 'Other'
    },
    
    // Skills Required
    requiredSkills: [{
      type: String,
      trim: true
    }],
    
    // Eligibility Criteria
    eligibility: {
      minCGPA: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
      },
      allowedDepartments: [{
        type: String,
        enum: [
          'Computer Science',
          'Information Technology',
          'Electronics',
          'Electrical',
          'Mechanical',
          'Civil',
          'Chemical',
          'Other',
          'All'
        ]
      }],
      allowedBatches: [{
        type: Number,
        min: 2020,
        max: 2030
      }],
      allowBacklogs: {
        type: Boolean,
        default: true
      },
      maxBacklogs: {
        type: Number,
        default: 0
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'All'],
        default: 'All'
      }
    },
    
    // Compensation
    salary: {
      min: {
        type: Number,
        required: [true, 'Please provide minimum salary']
      },
      max: {
        type: Number
      },
      currency: {
        type: String,
        default: 'INR'
      },
      period: {
        type: String,
        enum: ['Per Annum', 'Per Month'],
        default: 'Per Annum'
      }
    },
    
    // Location
    jobLocation: {
      type: String,
      required: [true, 'Please provide job location']
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'On-site'
    },
    
    // Important Dates
    applicationDeadline: {
      type: Date,
      required: [true, 'Please provide application deadline']
    },
    driveDate: {
      type: Date
    },
    expectedJoiningDate: {
      type: Date
    },
    
    // Positions
    numberOfPositions: {
      type: Number,
      required: [true, 'Please provide number of positions'],
      min: 1,
      default: 1
    },
    positionsFilled: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Drive Status
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Closed', 'Cancelled', 'Completed'],
      default: 'Active'
    },
    
    // Visibility
    isPublished: {
      type: Boolean,
      default: false
    },
    publishedDate: {
      type: Date
    },
    
    // Selection Process
    selectionProcess: [{
      round: {
        type: String,
        enum: ['Aptitude', 'Technical Test', 'Group Discussion', 'Technical Interview', 'HR Interview', 'Final Interview'],
        required: true
      },
      description: String,
      date: Date
    }],
    
    // Additional Requirements
    additionalRequirements: {
      type: String,
      maxlength: [500, 'Additional requirements cannot exceed 500 characters']
    },
    
    // Contact Info
    contactPerson: {
      name: String,
      email: String,
      phone: String
    },
    
    // Stats
    totalApplications: {
      type: Number,
      default: 0
    },
    totalShortlisted: {
      type: Number,
      default: 0
    },
    totalSelected: {
      type: Number,
      default: 0
    },
    
    // Views
    views: {
      type: Number,
      default: 0
    },
    
    // Is this drive visible to all or specific students
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ==========================================
// INDEXES
// ==========================================
driveSchema.index({ company: 1 });
driveSchema.index({ status: 1 });
driveSchema.index({ applicationDeadline: 1 });
driveSchema.index({ 'eligibility.minCGPA': 1 });
driveSchema.index({ createdAt: -1 });

// ==========================================
// VIRTUAL FIELDS
// ==========================================

// Virtual for applications
driveSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'drive'
});

// Check if drive is active
driveSchema.virtual('isActive').get(function() {
  return (
    this.status === 'Active' &&
    this.isPublished &&
    new Date() <= this.applicationDeadline
  );
});

// Calculate match percentage for a student (method will be added)
driveSchema.methods.calculateMatchPercentage = function(studentProfile) {
  let matchScore = 0;
  let totalCriteria = 0;
  
  // CGPA Check (30%)
  totalCriteria += 30;
  if (studentProfile.cgpa >= this.eligibility.minCGPA) {
    matchScore += 30;
  } else {
    matchScore += (studentProfile.cgpa / this.eligibility.minCGPA) * 30;
  }
  
  // Department Check (20%)
  totalCriteria += 20;
  if (
    this.eligibility.allowedDepartments.includes('All') ||
    this.eligibility.allowedDepartments.includes(studentProfile.department)
  ) {
    matchScore += 20;
  }
  
  // Backlogs Check (20%)
  totalCriteria += 20;
  if (!studentProfile.hasBacklogs || this.eligibility.allowBacklogs) {
    matchScore += 20;
  }
  
  // Skills Match (30%)
  totalCriteria += 30;
  if (this.requiredSkills.length > 0 && studentProfile.skills.length > 0) {
    const matchedSkills = this.requiredSkills.filter(skill =>
      studentProfile.skills.some(studentSkill =>
        studentSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    matchScore += (matchedSkills.length / this.requiredSkills.length) * 30;
  } else {
    matchScore += 15; // Partial credit if no skills specified
  }
  
  return Math.round((matchScore / totalCriteria) * 100);
};

// ==========================================
// MIDDLEWARE
// ==========================================

// Auto-close drive after deadline
driveSchema.pre('save', function(next) {
  if (this.applicationDeadline < new Date() && this.status === 'Active') {
    this.status = 'Closed';
  }
  next();
});

export default mongoose.model('Drive', driveSchema);
