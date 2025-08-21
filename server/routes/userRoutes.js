const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
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

// Get current user's profile
router.get('/profile', auth, getUserProfile);

// Update current user's profile
router.put('/profile', auth, updateUserProfile);

// Experience management
router.post('/profile/experience', auth, addExperience);
router.put('/profile/experience/:experienceId', auth, updateExperience);
router.delete('/profile/experience/:experienceId', auth, deleteExperience);

// Education management
router.post('/profile/education', auth, addEducation);
router.put('/profile/education/:educationId', auth, updateEducation);
router.delete('/profile/education/:educationId', auth, deleteEducation);

module.exports = router;