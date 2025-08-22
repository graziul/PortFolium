const mongoose = require('mongoose');

console.log('HomeContent Model: Loading HomeContent schema...');

const homeContentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true,
    trim: true
  },
  profileImageUrl: {
    type: String,
    trim: true
  },
  yearsExperience: {
    type: Number,
    default: 0
  },
  coreExpertise: [{
    type: String,
    trim: true
  }],
  socialLinks: {
    linkedin: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  collaboratorStats: {
    academia: {
      total: { type: Number, default: 0 },
      subcategories: {
        postdoc: { type: Number, default: 0 },
        junior_faculty: { type: Number, default: 0 },
        senior_faculty: { type: Number, default: 0 }
      }
    },
    industry: {
      total: { type: Number, default: 0 },
      subcategories: {
        industry_tech: { type: Number, default: 0 },
        industry_finance: { type: Number, default: 0 },
        industry_healthcare: { type: Number, default: 0 }
      }
    },
    students: {
      total: { type: Number, default: 0 },
      subcategories: {
        undergraduate: { type: Number, default: 0 },
        graduate: { type: Number, default: 0 }
      }
    },
    others: {
      total: { type: Number, default: 0 },
      subcategories: {
        professional_ethicist: { type: Number, default: 0 },
        journalist: { type: Number, default: 0 }
      }
    }
  },
  heroBackgroundColor: {
    type: String,
    default: 'from-blue-50 via-indigo-50 to-purple-50'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
homeContentSchema.index({ userId: 1 });

// Pre-save middleware to calculate totals from subcategories
homeContentSchema.pre('save', function(next) {
  console.log('HomeContent Model: Pre-save middleware - calculating collaborator totals');
  
  try {
    // Calculate academia total
    if (this.collaboratorStats && this.collaboratorStats.academia) {
      this.collaboratorStats.academia.total = 
        (this.collaboratorStats.academia.subcategories.postdoc || 0) +
        (this.collaboratorStats.academia.subcategories.junior_faculty || 0) +
        (this.collaboratorStats.academia.subcategories.senior_faculty || 0);
    }

    // Calculate industry total
    if (this.collaboratorStats && this.collaboratorStats.industry) {
      this.collaboratorStats.industry.total = 
        (this.collaboratorStats.industry.subcategories.industry_tech || 0) +
        (this.collaboratorStats.industry.subcategories.industry_finance || 0) +
        (this.collaboratorStats.industry.subcategories.industry_healthcare || 0);
    }

    // Calculate students total
    if (this.collaboratorStats && this.collaboratorStats.students) {
      this.collaboratorStats.students.total = 
        (this.collaboratorStats.students.subcategories.undergraduate || 0) +
        (this.collaboratorStats.students.subcategories.graduate || 0);
    }

    // Calculate others total
    if (this.collaboratorStats && this.collaboratorStats.others) {
      this.collaboratorStats.others.total = 
        (this.collaboratorStats.others.subcategories.professional_ethicist || 0) +
        (this.collaboratorStats.others.subcategories.journalist || 0);
    }

    console.log('HomeContent Model: Collaborator totals calculated successfully');
    next();
  } catch (error) {
    console.error('HomeContent Model: Error calculating collaborator totals:', error);
    next(error);
  }
});

console.log('HomeContent Model: Schema created with indexes and middleware');

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

console.log('HomeContent Model: Model exported successfully');
module.exports = HomeContent;