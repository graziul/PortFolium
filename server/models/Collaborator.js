const mongoose = require('mongoose');

console.log('Collaborator Model: Loading Collaborator schema...');

const collaboratorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  type: {
    type: String,
    enum: [
      'postdoc', 
      'junior_faculty', 
      'senior_faculty',
      'industry_tech',
      'industry_finance', 
      'industry_healthcare',
      'undergraduate',
      'graduate',
      'professional_ethicist',
      'journalist'
    ],
    required: true
  },
  institution: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  profileUrl: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  projectIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
collaboratorSchema.index({ userId: 1, type: 1 });
collaboratorSchema.index({ userId: 1, isActive: 1 });
collaboratorSchema.index({ email: 1, userId: 1 });

console.log('Collaborator Model: Schema created with indexes');

const Collaborator = mongoose.model('Collaborator', collaboratorSchema);

console.log('Collaborator Model: Model exported successfully');
module.exports = Collaborator;