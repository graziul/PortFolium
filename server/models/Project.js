const mongoose = require('mongoose');

console.log('Project Model: Loading Project schema...');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['researching', 'planning', 'in-progress', 'completed', 'on-hold'],
    default: 'planning'
  },
  technologies: [{
    type: String,
    trim: true
  }],
  liveUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  paperUrl: {
    type: String,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    trim: true
  },
  bannerUrl: {
    type: String,
    trim: true
  },
  archived: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  openToCollaborators: {
    type: Boolean,
    default: false
  },
  acceptingSponsors: {
    type: Boolean,
    default: false
  },
  collaboratorCount: {
    type: Number,
    default: 1,
    min: 1
  },
  collaborators: [{
    name: {
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
    }
  }],
  enthusiasmLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Very High'],
    default: 'Medium'
  },
  mediaCoverage: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    publication: {
      type: String,
      trim: true
    },
    publishedDate: {
      type: Date
    },
    description: {
      type: String,
      trim: true
    }
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ userId: 1, status: 1 });
projectSchema.index({ userId: 1, archived: 1 });
projectSchema.index({ userId: 1, featured: 1 });
projectSchema.index({ userId: 1, order: 1 });
projectSchema.index({ userId: 1, enthusiasmLevel: 1 });

console.log('Project Model: Schema created with indexes including enthusiasmLevel and mediaCoverage fields');

const Project = mongoose.model('Project', projectSchema);

console.log('Project Model: Model exported successfully with enhanced fields for user-requested features');
module.exports = Project;