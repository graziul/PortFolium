const User = require('../models/User');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    console.log('Fetching user profile for user ID:', req.user.id);

    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User profile fetched successfully for:', user.email);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    console.log('Updating user profile for user ID:', req.user.id);
    console.log('Update data:', req.body);

    const { name, bio, location, phone, socialLinks, experiences, education, certifications, languages } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields if provided
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

    console.log('User profile updated successfully for:', user.email);

    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
};

// Add professional experience
const addExperience = async (req, res) => {
  try {
    console.log('Adding experience for user ID:', req.user.id);
    console.log('Experience data:', req.body);

    const { title, company, location, startDate, endDate, current, description, achievements } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      console.error('User not found with ID:', req.user.id);
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
    console.error('Error adding experience:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while adding experience' });
  }
};

// Update professional experience
const updateExperience = async (req, res) => {
  try {
    console.log('Updating experience for user ID:', req.user.id);
    console.log('Experience ID:', req.params.experienceId);
    console.log('Update data:', req.body);

    const user = await User.findById(req.user.id);

    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    const experienceIndex = user.experiences.findIndex(
      exp => exp._id.toString() === req.params.experienceId
    );

    if (experienceIndex === -1) {
      console.error('Experience not found with ID:', req.params.experienceId);
      return res.status(404).json({ error: 'Experience not found' });
    }

    const { title, company, location, startDate, endDate, current, description, achievements } = req.body;

    user.experiences[experienceIndex] = {
      ...user.experiences[experienceIndex].toObject(),
      title: title !== undefined ? title : user.experiences[experienceIndex].title,
      company: company !== undefined ? company : user.experiences[experienceIndex].company,
      location: location !== undefined ? location : user.experiences[experienceIndex].location,
      startDate: startDate !== undefined ? startDate : user.experiences[experienceIndex].startDate,
      endDate: current ? null : (endDate !== undefined ? endDate : user.experiences[experienceIndex].endDate),
      current: current !== undefined ? current : user.experiences[experienceIndex].current,
      description: description !== undefined ? description : user.experiences[experienceIndex].description,
      achievements: achievements !== undefined ? achievements : user.experiences[experienceIndex].achievements
    };

    await user.save();

    console.log('Experience updated successfully for user:', user.email);
    res.json(user.experiences[experienceIndex]);
  } catch (error) {
    console.error('Error updating experience:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while updating experience' });
  }
};

// Delete professional experience
const deleteExperience = async (req, res) => {
  try {
    console.log('Deleting experience for user ID:', req.user.id);
    console.log('Experience ID:', req.params.experienceId);

    const user = await User.findById(req.user.id);

    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    const experienceIndex = user.experiences.findIndex(
      exp => exp._id.toString() === req.params.experienceId
    );

    if (experienceIndex === -1) {
      console.error('Experience not found with ID:', req.params.experienceId);
      return res.status(404).json({ error: 'Experience not found' });
    }

    user.experiences.splice(experienceIndex, 1);
    await user.save();

    console.log('Experience deleted successfully for user:', user.email);
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while deleting experience' });
  }
};

// Add education
const addEducation = async (req, res) => {
  try {
    console.log('Adding education for user ID:', req.user.id);
    console.log('Education data:', req.body);

    const { degree, institution, location, startDate, endDate, gpa, description } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      console.error('User not found with ID:', req.user.id);
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
    console.error('Error adding education:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while adding education' });
  }
};

// Update education
const updateEducation = async (req, res) => {
  try {
    console.log('Updating education for user ID:', req.user.id);
    console.log('Education ID:', req.params.educationId);
    console.log('Update data:', req.body);

    const user = await User.findById(req.user.id);

    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    const educationIndex = user.education.findIndex(
      edu => edu._id.toString() === req.params.educationId
    );

    if (educationIndex === -1) {
      console.error('Education not found with ID:', req.params.educationId);
      return res.status(404).json({ error: 'Education not found' });
    }

    const { degree, institution, location, startDate, endDate, gpa, description } = req.body;

    user.education[educationIndex] = {
      ...user.education[educationIndex].toObject(),
      degree: degree !== undefined ? degree : user.education[educationIndex].degree,
      institution: institution !== undefined ? institution : user.education[educationIndex].institution,
      location: location !== undefined ? location : user.education[educationIndex].location,
      startDate: startDate !== undefined ? startDate : user.education[educationIndex].startDate,
      endDate: endDate !== undefined ? endDate : user.education[educationIndex].endDate,
      gpa: gpa !== undefined ? gpa : user.education[educationIndex].gpa,
      description: description !== undefined ? description : user.education[educationIndex].description
    };

    await user.save();

    console.log('Education updated successfully for user:', user.email);
    res.json(user.education[educationIndex]);
  } catch (error) {
    console.error('Error updating education:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while updating education' });
  }
};

// Delete education
const deleteEducation = async (req, res) => {
  try {
    console.log('Deleting education for user ID:', req.user.id);
    console.log('Education ID:', req.params.educationId);

    const user = await User.findById(req.user.id);

    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    const educationIndex = user.education.findIndex(
      edu => edu._id.toString() === req.params.educationId
    );

    if (educationIndex === -1) {
      console.error('Education not found with ID:', req.params.educationId);
      return res.status(404).json({ error: 'Education not found' });
    }

    user.education.splice(educationIndex, 1);
    await user.save();

    console.log('Education deleted successfully for user:', user.email);
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error.message, error.stack);
    res.status(500).json({ error: 'Server error while deleting education' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation
};