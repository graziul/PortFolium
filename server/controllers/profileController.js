const User = require('../models/User');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    console.log('ProfileController: getUserProfile called');
    console.log('ProfileController: Request user object:', req.user);
    console.log('ProfileController: User ID from token:', req.user?.id);

    if (!req.user || !req.user.id) {
      console.error('ProfileController: No user ID found in request');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log('ProfileController: Searching for user in database with ID:', req.user.id);

    const user = await User.findById(req.user.id).select('-password');

    console.log('ProfileController: Database query completed');
    console.log('ProfileController: User found:', !!user);

    if (!user) {
      console.error('ProfileController: User not found in database with ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('ProfileController: User profile data:', {
      id: user._id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      location: user.location,
      phone: user.phone,
      hasExperiences: !!user.experiences,
      experiencesCount: user.experiences?.length || 0,
      hasEducation: !!user.education,
      educationCount: user.education?.length || 0
    });

    console.log('ProfileController: Sending user profile response');
    res.json(user);
  } catch (error) {
    console.error('ProfileController: Error in getUserProfile:', error.message);
    console.error('ProfileController: Error stack:', error.stack);
    console.error('ProfileController: Full error object:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    console.log('ProfileController: Starting updateUserProfile');
    console.log('ProfileController: User ID from token:', req.user.id);
    console.log('ProfileController: Request body:', JSON.stringify(req.body, null, 2));

    const { name, bio, location, phone, socialLinks, experiences, education, certifications, languages } = req.body;

    console.log('ProfileController: Searching for user in database...');
    const user = await User.findById(req.user.id);

    if (!user) {
      console.error('ProfileController: User not found with ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('ProfileController: User found:', user.email);
    console.log('ProfileController: Current user data:', {
      name: user.name,
      bio: user.bio,
      location: user.location,
      phone: user.phone,
      socialLinks: user.socialLinks
    });

    // Update fields if provided
    if (name !== undefined) {
      console.log('ProfileController: Updating name from', user.name, 'to', name);
      user.name = name;
    }
    if (bio !== undefined) {
      console.log('ProfileController: Updating bio from', user.bio, 'to', bio);
      user.bio = bio;
    }
    if (location !== undefined) {
      console.log('ProfileController: Updating location from', user.location, 'to', location);
      user.location = location;
    }
    if (phone !== undefined) {
      console.log('ProfileController: Updating phone from', user.phone, 'to', phone);
      user.phone = phone;
    }
    if (socialLinks !== undefined) {
      console.log('ProfileController: Updating socialLinks from', user.socialLinks, 'to', socialLinks);
      user.socialLinks = socialLinks;
    }
    if (experiences !== undefined) {
      console.log('ProfileController: Updating experiences');
      user.experiences = experiences;
    }
    if (education !== undefined) {
      console.log('ProfileController: Updating education');
      user.education = education;
    }
    if (certifications !== undefined) {
      console.log('ProfileController: Updating certifications');
      user.certifications = certifications;
    }
    if (languages !== undefined) {
      console.log('ProfileController: Updating languages');
      user.languages = languages;
    }

    console.log('ProfileController: Saving user to database...');
    await user.save();
    console.log('ProfileController: User saved successfully');

    console.log('ProfileController: Fetching updated user data...');
    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    console.log('ProfileController: Updated user data fetched successfully');
    console.log('ProfileController: Sending response with updated user data');
    res.json(updatedUser);
  } catch (error) {
    console.error('ProfileController: Error updating user profile:', error.message);
    console.error('ProfileController: Error stack:', error.stack);
    console.error('ProfileController: Error details:', error);
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