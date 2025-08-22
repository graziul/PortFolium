const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

console.log('HomeContentRoutes: Module loading...');

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/profile');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Load collaborators from file
const loadCollaborators = () => {
  try {
    const collaboratorsPath = path.join(__dirname, '../data/collaborators.json');
    console.log('HomeContentRoutes: Loading collaborators from:', collaboratorsPath);
    
    if (!fs.existsSync(collaboratorsPath)) {
      console.log('HomeContentRoutes: Collaborators file not found, creating default');
      const defaultData = { collaborators: [] };
      fs.writeFileSync(collaboratorsPath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    
    const data = fs.readFileSync(collaboratorsPath, 'utf8');
    const parsed = JSON.parse(data);
    console.log('HomeContentRoutes: Collaborators loaded successfully:', parsed.collaborators?.length || 0);
    return parsed;
  } catch (error) {
    console.error('HomeContentRoutes: Error loading collaborators:', error);
    return { collaborators: [] };
  }
};

// Calculate collaborator statistics
const calculateCollaboratorStats = (collaborators) => {
  console.log('HomeContentRoutes: Calculating collaborator stats for:', collaborators.length, 'collaborators');
  
  const stats = {
    academia: {
      total: 0,
      subcategories: {
        postdoc: 0,
        junior_faculty: 0,
        senior_faculty: 0
      }
    },
    industry: {
      total: 0,
      subcategories: {
        industry_tech: 0,
        industry_finance: 0,
        industry_healthcare: 0
      }
    },
    students: {
      total: 0,
      subcategories: {
        undergraduate: 0,
        graduate: 0
      }
    },
    others: {
      total: 0,
      subcategories: {
        professional_ethicist: 0,
        journalist: 0
      }
    }
  };

  collaborators.forEach(collaborator => {
    const category = collaborator.category;
    const subcategory = collaborator.subcategory;

    if (stats[category]) {
      stats[category].total++;
      if (stats[category].subcategories[subcategory] !== undefined) {
        stats[category].subcategories[subcategory]++;
      }
    }
  });

  console.log('HomeContentRoutes: Collaborator stats calculated:', JSON.stringify(stats, null, 2));
  return stats;
};

// GET /api/home-content - Get home content
router.get('/', auth, async (req, res) => {
  try {
    console.log('HomeContentRoutes: GET /api/home-content - Request received');
    console.log('HomeContentRoutes: User ID:', req.user.id);

    let homeContent = await HomeContent.findOne({ userId: req.user.id });
    console.log('HomeContentRoutes: Home content found in DB:', !!homeContent);

    if (!homeContent) {
      console.log('HomeContentRoutes: No home content found, creating default');
      homeContent = new HomeContent({
        userId: req.user.id,
        name: 'Your Name',
        tagline: 'Your professional tagline here',
        bio: 'Tell your professional story here...',
        yearsExperience: 0,
        coreExpertise: [],
        socialLinks: {
          linkedin: '',
          github: '',
          twitter: '',
          website: ''
        }
      });
      await homeContent.save();
      console.log('HomeContentRoutes: Default home content created');
    }

    // Load collaborators and calculate stats
    const collaboratorsData = loadCollaborators();
    const collaboratorStats = calculateCollaboratorStats(collaboratorsData.collaborators || []);

    // Add collaborator stats to response
    const responseData = {
      ...homeContent.toObject(),
      collaboratorStats
    };

    console.log('HomeContentRoutes: Sending home content response');
    res.json({
      success: true,
      homeContent: responseData
    });

  } catch (error) {
    console.error('HomeContentRoutes: Error fetching home content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch home content'
    });
  }
});

// PUT /api/home-content - Update home content
router.put('/', auth, upload.single('profileImage'), async (req, res) => {
  try {
    console.log('HomeContentRoutes: PUT /api/home-content - Request received');
    console.log('HomeContentRoutes: User ID:', req.user.id);
    console.log('HomeContentRoutes: Request body:', req.body);
    console.log('HomeContentRoutes: File uploaded:', !!req.file);

    const {
      name,
      tagline,
      bio,
      yearsExperience,
      coreExpertise,
      socialLinks
    } = req.body;

    // Parse arrays and objects from form data
    let parsedCoreExpertise = [];
    let parsedSocialLinks = {};

    try {
      parsedCoreExpertise = typeof coreExpertise === 'string' ? JSON.parse(coreExpertise) : coreExpertise || [];
      parsedSocialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks || {};
    } catch (parseError) {
      console.error('HomeContentRoutes: Error parsing form data:', parseError);
      return res.status(400).json({
        success: false,
        error: 'Invalid form data format'
      });
    }

    let homeContent = await HomeContent.findOne({ userId: req.user.id });

    const updateData = {
      name: name || 'Your Name',
      tagline: tagline || 'Your professional tagline here',
      bio: bio || 'Tell your professional story here...',
      yearsExperience: parseInt(yearsExperience) || 0,
      coreExpertise: parsedCoreExpertise,
      socialLinks: parsedSocialLinks
    };

    // Handle profile image upload
    if (req.file) {
      console.log('HomeContentRoutes: Processing uploaded profile image:', req.file.filename);
      
      // Delete old profile image if it exists
      if (homeContent && homeContent.profileImageUrl) {
        const oldImagePath = path.join(__dirname, '..', homeContent.profileImageUrl);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
            console.log('HomeContentRoutes: Old profile image deleted');
          } catch (deleteError) {
            console.error('HomeContentRoutes: Error deleting old profile image:', deleteError);
          }
        }
      }

      updateData.profileImageUrl = `/uploads/profile/${req.file.filename}`;
    }

    if (homeContent) {
      console.log('HomeContentRoutes: Updating existing home content');
      Object.assign(homeContent, updateData);
      await homeContent.save();
    } else {
      console.log('HomeContentRoutes: Creating new home content');
      homeContent = new HomeContent({
        userId: req.user.id,
        ...updateData
      });
      await homeContent.save();
    }

    // Load collaborators and calculate stats for response
    const collaboratorsData = loadCollaborators();
    const collaboratorStats = calculateCollaboratorStats(collaboratorsData.collaborators || []);

    const responseData = {
      ...homeContent.toObject(),
      collaboratorStats
    };

    console.log('HomeContentRoutes: Home content updated successfully');
    res.json({
      success: true,
      message: 'Home content updated successfully',
      homeContent: responseData
    });

  } catch (error) {
    console.error('HomeContentRoutes: Error updating home content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update home content'
    });
  }
});

// GET /api/home-content/collaborators - Get collaborators
router.get('/collaborators', auth, async (req, res) => {
  try {
    console.log('HomeContentRoutes: GET /api/home-content/collaborators - Request received');

    const collaboratorsData = loadCollaborators();
    const collaboratorStats = calculateCollaboratorStats(collaboratorsData.collaborators || []);

    console.log('HomeContentRoutes: Sending collaborators response');
    res.json({
      success: true,
      collaborators: collaboratorsData.collaborators || [],
      stats: collaboratorStats
    });

  } catch (error) {
    console.error('HomeContentRoutes: Error fetching collaborators:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collaborators'
    });
  }
});

// POST /api/home-content/collaborators - Add collaborator
router.post('/collaborators', auth, async (req, res) => {
  try {
    console.log('HomeContentRoutes: POST /api/home-content/collaborators - Request received');
    console.log('HomeContentRoutes: Request body:', req.body);

    const { name, category, subcategory } = req.body;

    if (!name || !category || !subcategory) {
      return res.status(400).json({
        success: false,
        error: 'Name, category, and subcategory are required'
      });
    }

    const collaboratorsData = loadCollaborators();
    const newCollaborator = {
      id: Date.now().toString(),
      name,
      category,
      subcategory,
      createdAt: new Date().toISOString()
    };

    collaboratorsData.collaborators = collaboratorsData.collaborators || [];
    collaboratorsData.collaborators.push(newCollaborator);

    // Save to file
    const collaboratorsPath = path.join(__dirname, '../data/collaborators.json');
    const dataDir = path.dirname(collaboratorsPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(collaboratorsPath, JSON.stringify(collaboratorsData, null, 2));
    console.log('HomeContentRoutes: Collaborator added successfully:', newCollaborator.name);

    const collaboratorStats = calculateCollaboratorStats(collaboratorsData.collaborators);

    res.json({
      success: true,
      message: 'Collaborator added successfully',
      collaborator: newCollaborator,
      stats: collaboratorStats
    });

  } catch (error) {
    console.error('HomeContentRoutes: Error adding collaborator:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add collaborator'
    });
  }
});

// PUT /api/home-content/collaborators/:id - Update collaborator
router.put('/collaborators/:id', auth, async (req, res) => {
  try {
    console.log('HomeContentRoutes: PUT /api/home-content/collaborators/:id - Request received');
    console.log('HomeContentRoutes: Collaborator ID:', req.params.id);
    console.log('HomeContentRoutes: Request body:', req.body);

    const { name, category, subcategory } = req.body;
    const collaboratorId = req.params.id;

    if (!name || !category || !subcategory) {
      return res.status(400).json({
        success: false,
        error: 'Name, category, and subcategory are required'
      });
    }

    const collaboratorsData = loadCollaborators();
    const collaboratorIndex = collaboratorsData.collaborators.findIndex(c => c.id === collaboratorId);

    if (collaboratorIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Collaborator not found'
      });
    }

    collaboratorsData.collaborators[collaboratorIndex] = {
      ...collaboratorsData.collaborators[collaboratorIndex],
      name,
      category,
      subcategory,
      updatedAt: new Date().toISOString()
    };

    // Save to file
    const collaboratorsPath = path.join(__dirname, '../data/collaborators.json');
    fs.writeFileSync(collaboratorsPath, JSON.stringify(collaboratorsData, null, 2));
    console.log('HomeContentRoutes: Collaborator updated successfully:', name);

    const collaboratorStats = calculateCollaboratorStats(collaboratorsData.collaborators);

    res.json({
      success: true,
      message: 'Collaborator updated successfully',
      collaborator: collaboratorsData.collaborators[collaboratorIndex],
      stats: collaboratorStats
    });

  } catch (error) {
    console.error('HomeContentRoutes: Error updating collaborator:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update collaborator'
    });
  }
});

// DELETE /api/home-content/collaborators/:id - Delete collaborator
router.delete('/collaborators/:id', auth, async (req, res) => {
  try {
    console.log('HomeContentRoutes: DELETE /api/home-content/collaborators/:id - Request received');
    console.log('HomeContentRoutes: Collaborator ID:', req.params.id);

    const collaboratorId = req.params.id;
    const collaboratorsData = loadCollaborators();
    const collaboratorIndex = collaboratorsData.collaborators.findIndex(c => c.id === collaboratorId);

    if (collaboratorIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Collaborator not found'
      });
    }

    const deletedCollaborator = collaboratorsData.collaborators.splice(collaboratorIndex, 1)[0];

    // Save to file
    const collaboratorsPath = path.join(__dirname, '../data/collaborators.json');
    fs.writeFileSync(collaboratorsPath, JSON.stringify(collaboratorsData, null, 2));
    console.log('HomeContentRoutes: Collaborator deleted successfully:', deletedCollaborator.name);

    const collaboratorStats = calculateCollaboratorStats(collaboratorsData.collaborators);

    res.json({
      success: true,
      message: 'Collaborator deleted successfully',
      stats: collaboratorStats
    });

  } catch (error) {
    console.error('HomeContentRoutes: Error deleting collaborator:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete collaborator'
    });
  }
});

console.log('HomeContentRoutes: Module loaded successfully');

module.exports = router;