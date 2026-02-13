import mongoose from 'mongoose';

/**
 * Application Schema
 * Tracks student applications to placement drives
 */
const applicationSchema = new mongoose.Schema(
  {
    // References
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Application must have a student']
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      required: [true, 'Application must be for a drive']
    },
    
    // Application Status Flow
    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview Scheduled',
        'Interview Completed',
        'Selected',
        'Rejected',
        'Withdrawn',
        'On Hold'
      ],
      default: 'Applied'
    },
    
    // Status History (Track all status changes)
    statusHistory: [{
      status: {
        type: String,
        enum: [
          'Applied',
          'Under Review',
          'Shortlisted',
          'Interview Scheduled',
          'Interview Completed',
          'Selected',
          'Rejected',
          'Withdrawn',
          'On Hold'
        ]
      },
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      remarks: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Application Details
    coverLetter: {
      type: String,
      maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
    },
    
    // Resume at time of application
    resumeSnapshot: {
      url: String,
      publicId: String
    },
    
    // Interview Details
    interview: {
      scheduledDate: Date,
      scheduledTime: String,
      venue: String,
      mode: {
        type: String,
        enum: ['Online', 'Offline', 'Hybrid']
      },
      meetingLink: String,
      interviewers: [{
        name: String,
        designation: String
      }],
      round: {
        type: String,
        enum: ['Aptitude', 'Technical Test', 'Group Discussion', 'Technical Interview', 'HR Interview', 'Final Interview']
      },
      feedback: String,
      score: Number
    },
    
    // Selection Details (if selected)
    selection: {
      offerLetterUrl: String,
      package: Number, // In LPA
      joiningDate: Date,
      location: String,
      acceptedByStudent: {
        type: Boolean,
        default: false
      },
      acceptedDate: Date
    },
    
    // Rejection Details
    rejection: {
      reason: String,
      rejectedAt: Date,
      rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    
    // Match Score (AI-based)
    matchPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    
    // TPO Notes (internal)
    tpoNotes: [{
      note: String,
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Flags
    isEligible: {
      type: Boolean,
      default: true
    },
    isViewed: {
      type: Boolean,
      default: false
    },
    viewedAt: Date,
    
    // Priority (for sorting)
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ==========================================
// COMPOUND INDEXES
// ==========================================
applicationSchema.index({ student: 1, drive: 1 }, { unique: true }); // One application per student per drive
applicationSchema.index({ drive: 1, status: 1 });
applicationSchema.index({ student: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });

// ==========================================
// VIRTUAL FIELDS
// ==========================================

// Check if application is in final stage
applicationSchema.virtual('isFinal').get(function() {
  return ['Selected', 'Rejected', 'Withdrawn'].includes(this.status);
});

// Check if application is active
applicationSchema.virtual('isActive').get(function() {
  return !this.isFinal;
});

// ==========================================
// MIDDLEWARE
// ==========================================

// Add to status history when status changes
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Update drive statistics when application status changes
applicationSchema.post('save', async function(doc) {
  const Drive = mongoose.model('Drive');
  
  // Count applications for this drive
  const stats = await mongoose.model('Application').aggregate([
    { $match: { drive: doc.drive } },
    {
      $group: {
        _id: '$drive',
        totalApplications: { $sum: 1 },
        totalShortlisted: {
          $sum: {
            $cond: [
              { $in: ['$status', ['Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected']] },
              1,
              0
            ]
          }
        },
        totalSelected: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Selected'] }, 1, 0]
          }
        }
      }
    }
  ]);
  
  if (stats.length > 0) {
    await Drive.findByIdAndUpdate(doc.drive, {
      totalApplications: stats[0].totalApplications,
      totalShortlisted: stats[0].totalShortlisted,
      totalSelected: stats[0].totalSelected
    });
  }
});

// ==========================================
// STATIC METHODS
// ==========================================

// Get application statistics for a drive
applicationSchema.statics.getDriveStats = async function(driveId) {
  return await this.aggregate([
    { $match: { drive: mongoose.Types.ObjectId(driveId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Get student application history
applicationSchema.statics.getStudentHistory = async function(studentId) {
  return await this.find({ student: studentId })
    .populate('drive', 'jobTitle company applicationDeadline')
    .sort({ createdAt: -1 });
};

export default mongoose.model('Application', applicationSchema);
