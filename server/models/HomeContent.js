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

console.log('HomeContent Model: Schema created with indexes');

const HomeContent = mongoose.model('HomeContent', homeContentSchema);

console.log('HomeContent Model: Model exported successfully');
module.exports = HomeContent;