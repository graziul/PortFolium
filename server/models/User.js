const mongoose = require('mongoose');
const { validatePassword } = require('../utils/password');

console.log('User Model: Loading User schema...');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    validate: {
      validator: function(password) {
        const validation = validatePassword(password);
        return validation.isValid;
      },
      message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'
    }
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  location: {
    type: String,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    trim: true
  },
  experiences: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      trim: true
    }
  }],
  education: [{
    institution: {
      type: String,
      required: true,
      trim: true
    },
    degree: {
      type: String,
      required: true,
      trim: true
    },
    field: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
userSchema.index({ email: 1 });

// Transform output to remove password and add id
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  user.id = user._id;
  return user;
};

console.log('User Model: Schema created successfully');

const User = mongoose.model('User', userSchema);

console.log('User Model: Model exported successfully');
module.exports = User;