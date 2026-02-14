import mongoose from 'mongoose';

/**
 * Student Profile Schema
 * Extends User model with student-specific fields
 */
const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    
    // Academic Info
    rollNumber: {
      type: String,
      required: [true, 'Please provide roll number'],
      unique: true,
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Please provide department'],
      enum: {
        values: [
          'Computer Science',
          'Information Technology',
          'Electronics',
          'Electrical',
          'Mechanical',
          'Civil',
          'Chemical',
          'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT',
          'AIDS', 'AIML', 'CSM', 'CSD',
          'Other'
        ],
        message: 'Please select a valid department'
      }
    },
    batch: {
      type: Number,
      required: [true, 'Please provide batch year'],
      min: [2020, 'Invalid batch year'],
      max: [2030, 'Invalid batch year']
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
      default: 1
    },
    cgpa: {
      type: Number,
      required: [true, 'Please provide CGPA'],
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10'],
      default: 0
    },
    
    // 10th & 12th Percentage
    tenthPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    twelfthPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    
    // Backlogs
    hasBacklogs: {
      type: Boolean,
      default: false
    },
    numberOfBacklogs: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Skills
    skills: [{
      type: String,
      trim: true
    }],
    
    // Resume
    resume: {
      url: String,
      publicId: String, // For cloudinary
      uploadedAt: Date
    },
    
    // Additional Documents
    documents: [{
      name: String,
      url: String,
      publicId: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Social Links
    linkedIn: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    portfolio: {
      type: String,
      trim: true
    },
    
    // Placement Status
    isPlaced: {
      type: Boolean,
      default: false
    },
    placedCompany: {
      type: String
    },
    placementPackage: {
      type: Number, // In LPA
      min: 0
    },
    placedDate: {
      type: Date
    },
    
    // Additional Info
    about: {
      type: String,
      maxlength: [500, 'About cannot exceed 500 characters']
    },
    interests: [{
      type: String,
      trim: true
    }],
    
    // Mock Test Performance (for ML prediction)
    mockTests: [{
      testName: String,
      score: Number,
      maxScore: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Address
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India'
      }
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
studentProfileSchema.index({ department: 1, batch: 1 });
studentProfileSchema.index({ cgpa: -1 });
studentProfileSchema.index({ isPlaced: 1 });

// ==========================================
// VIRTUAL FIELDS
// ==========================================

// Virtual for applications
studentProfileSchema.virtual('applications', {
  ref: 'Application',
  localField: 'user',
  foreignField: 'student'
});

// Calculate eligibility score (for ML prediction)
studentProfileSchema.virtual('eligibilityScore').get(function() {
  let score = 0;
  
  // CGPA weightage (40%)
  score += (this.cgpa / 10) * 40;
  
  // Skills weightage (30%)
  score += Math.min((this.skills.length / 10) * 30, 30);
  
  // No backlogs bonus (20%)
  if (!this.hasBacklogs) {
    score += 20;
  }
  
  // Mock test performance (10%)
  if (this.mockTests.length > 0) {
    const avgScore = this.mockTests.reduce((acc, test) => 
      acc + (test.score / test.maxScore) * 100, 0) / this.mockTests.length;
    score += (avgScore / 100) * 10;
  }
  
  return Math.round(score);
});

export default mongoose.model('StudentProfile', studentProfileSchema);
