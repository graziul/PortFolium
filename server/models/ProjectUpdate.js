const mongoose = require('mongoose');

console.log('ProjectUpdate Model: Loading ProjectUpdate schema...');

const projectUpdateSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  type: {
    type: String,
    enum: ['question', 'blocker', 'update', 'findings'],
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  blockerType: {
    type: String,
    enum: ['Code', 'Use Case', 'Interest', 'Funding', 'Ethics'],
    required: function() {
      return this.type === 'blocker';
    }
  },
  blockerDetails: {
    type: String,
    trim: true
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
projectUpdateSchema.index({ projectId: 1, createdAt: -1 });
projectUpdateSchema.index({ userId: 1, createdAt: -1 });
projectUpdateSchema.index({ projectId: 1, type: 1 });

console.log('ProjectUpdate Model: Schema created with indexes');

const ProjectUpdate = mongoose.model('ProjectUpdate', projectUpdateSchema);

console.log('ProjectUpdate Model: Model exported successfully');
module.exports = ProjectUpdate;