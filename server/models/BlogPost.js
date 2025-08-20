const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    trim: true
  },
  readTime: {
    type: Number,
    default: 1
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  author: {
    name: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
blogPostSchema.index({ userId: 1, createdAt: -1 });
blogPostSchema.index({ userId: 1, published: 1 });
blogPostSchema.index({ userId: 1, category: 1 });
blogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;