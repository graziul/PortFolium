const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation
} = require('../controllers/profileController');

// Get user profile
router.get('/profile', auth, getUserProfile);

// Update user profile
router.put('/profile', auth, updateUserProfile);

// Experience routes
router.post('/profile/experience', auth, addExperience);
router.put('/profile/experience/:experienceId', auth, updateExperience);
router.delete('/profile/experience/:experienceId', auth, deleteExperience);

// Education routes
router.post('/profile/education', auth, addEducation);
router.put('/profile/education/:educationId', auth, updateEducation);
router.delete('/profile/education/:educationId', auth, deleteEducation);

module.exports = router;