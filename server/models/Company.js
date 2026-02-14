import mongoose from 'mongoose';

/**
 * Company Schema
 * Stores company information and credentials
 */
const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    
    // Company Details
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      unique: true
    },
    companyType: {
      type: String,
      enum: ['Product', 'Service', 'Startup', 'MNC', 'Government', 'Other'],
      default: 'Other'
    },
    industry: {
      type: String,
      required: [true, 'Please provide industry'],
      enum: [
        'IT/Software',
        'Consulting',
        'Finance',
        'Manufacturing',
        'Healthcare',
        'Education',
        'E-commerce',
        'Telecommunications',
        'Other'
      ]
    },
    
    // Company Info
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    website: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid URL'
      ]
    },
    logo: {
      type: String,
      default: 'default-company-logo.png'
    },
    
    // Contact Person
    hrName: {
      type: String,
      required: [true, 'Please provide HR contact name'],
      trim: true
    },
    hrEmail: {
      type: String,
      required: [true, 'Please provide HR email'],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    hrPhone: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    
    // Location
    headquarters: {
      city: String,
      state: String,
      country: {
        type: String,
        default: 'India'
      }
    },
    
    // Company Size
    employeeCount: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      default: '1-10'
    },
    
    // Verification
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDocuments: [{
      name: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Social Links
    linkedIn: String,
    twitter: String,
    
    // Stats
    totalDrivesPosted: {
      type: Number,
      default: 0
    },
    totalHires: {
      type: Number,
      default: 0
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
companySchema.index({ industry: 1 });

// ==========================================
// VIRTUAL FIELDS
// ==========================================
companySchema.virtual('drives', {
  ref: 'Drive',
  localField: '_id',
  foreignField: 'company'
});

export default mongoose.model('Company', companySchema);
