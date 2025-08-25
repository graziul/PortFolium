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
  headerText: {
    type: String,
    default: 'Chronos Archive',
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
    bluesky: {
      type: String,
      trim: true
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