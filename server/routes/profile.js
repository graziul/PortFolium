const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user.id);
    
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Profile fetched successfully for user:', user.email);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    console.log('Updating profile for user:', req.user.id);
    console.log('Update data:', req.body);

    const { name, bio, location, phone, socialLinks, experiences, education, certifications, languages } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for update:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    // Update basic profile fields
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (socialLinks !== undefined) user.socialLinks = socialLinks;
    if (experiences !== undefined) user.experiences = experiences;
    if (education !== undefined) user.education = education;
    if (certifications !== undefined) user.certifications = certifications;
    if (languages !== undefined) user.languages = languages;

    await user.save();

    console.log('Profile updated successfully for user:', user.email);
    
    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
});

// Add professional experience
router.post('/experience', auth, async (req, res) => {
  try {
    console.log('Adding experience for user:', req.user.id);
    console.log('Experience data:', req.body);

    const { title, company, location, startDate, endDate, current, description, achievements } = req.body;

    if (!title || !company || !startDate) {
      return res.status(400).json({ error: 'Title, company, and start date are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for adding experience:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    const newExperience = {
      title,
      company,
      location,
      startDate,
      endDate: current ? null : endDate,
      current: current || false,
      description,
      achievements: achievements || []
    };

    if (!user.experiences) {
      user.experiences = [];
    }

    user.experiences.push(newExperience);
    await user.save();

    console.log('Experience added successfully for user:', user.email);
    res.json(user.experiences[user.experiences.length - 1]);
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ error: 'Server error while adding experience' });
  }
});

// Update professional experience
router.put('/experience/:experienceId', auth, async (req, res) => {
  try {
    console.log('Updating experience for user:', req.user.id, 'experience:', req.params.experienceId);
    console.log('Update data:', req.body);

    const { title, company, location, startDate, endDate, current, description, achievements } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for updating experience:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    const experience = user.experiences.id(req.params.experienceId);
    if (!experience) {
      console.log('Experience not found:', req.params.experienceId);
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Update experience fields
    if (title !== undefined) experience.title = title;
    if (company !== undefined) experience.company = company;
    if (location !== undefined) experience.location = location;
    if (startDate !== undefined) experience.startDate = startDate;
    if (current !== undefined) {
      experience.current = current;
      experience.endDate = current ? null : endDate;
    } else if (endDate !== undefined) {
      experience.endDate = endDate;
    }
    if (description !== undefined) experience.description = description;
    if (achievements !== undefined) experience.achievements = achievements;

    await user.save();

    console.log('Experience updated successfully for user:', user.email);
    res.json(experience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Server error while updating experience' });
  }
});

// Delete professional experience
router.delete('/experience/:experienceId', auth, async (req, res) => {
  try {
    console.log('Deleting experience for user:', req.user.id, 'experience:', req.params.experienceId);

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for deleting experience:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    const experience = user.experiences.id(req.params.experienceId);
    if (!experience) {
      console.log('Experience not found:', req.params.experienceId);
      return res.status(404).json({ error: 'Experience not found' });
    }

    experience.deleteOne();
    await user.save();

    console.log('Experience deleted successfully for user:', user.email);
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Server error while deleting experience' });
  }
});

// Add education
router.post('/education', auth, async (req, res) => {
  try {
    console.log('Adding education for user:', req.user.id);
    console.log('Education data:', req.body);

    const { degree, institution, location, startDate, endDate, gpa, description } = req.body;

    if (!degree || !institution || !startDate) {
      return res.status(400).json({ error: 'Degree, institution, and start date are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for adding education:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    const newEducation = {
      degree,
      institution,
      location,
      startDate,
      endDate,
      gpa,
      description
    };

    if (!user.education) {
      user.education = [];
    }

    user.education.push(newEducation);
    await user.save();

    console.log('Education added successfully for user:', user.email);
    res.json(user.education[user.education.length - 1]);
  } catch (error) {
    console.error('Error adding education:', error);
    res.status(500).json({ error: 'Server error while adding education' });
  }
});

// Update education
router.put('/education/:educationId', auth, async (req, res) => {
  try {
    console.log('Updating education for user:', req.user.id, 'education:', req.params.educationId);
    console.log('Update data:', req.body);

    const { degree, institution, location, startDate, endDate, gpa, description } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for updating education:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    const education = user.education.id(req.params.educationId);
    if (!education) {
      console.log('Education not found:', req.params.educationId);
      return res.status(404).json({ error: 'Education not found' });
    }

    // Update education fields
    if (degree !== undefined) education.degree = degree;
    if (institution !== undefined) education.institution = institution;
    if (location !== undefined) education.location = location;
    if (startDate !== undefined) education.startDate = startDate;
    if (endDate !== undefined) education.endDate = endDate;
    if (gpa !== undefined) education.gpa = gpa;
    if (description !== undefined) education.description = description;

    await user.save();

    console.log('Education updated successfully for user:', user.email);
    res.json(education);
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(500).json({ error: 'Server error while updating education' });
  }
});

// Delete education
router.delete('/education/:educationId', auth, async (req, res) => {
  try {
    console.log('Deleting education for user:', req.user.id, 'education:', req.params.educationId);

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for deleting education:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    const education = user.education.id(req.params.educationId);
    if (!education) {
      console.log('Education not found:', req.params.educationId);
      return res.status(404).json({ error: 'Education not found' });
    }

    education.deleteOne();
    await user.save();

    console.log('Education deleted successfully for user:', user.email);
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(500).json({ error: 'Server error while deleting education' });
  }
});

module.exports = router;