const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const HomeContentService = require('../services/homeContentService');

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

// GET /api/home-content - Get home content
router.get('/', auth, async (req, res) => {
  try {
    console.log('HomeContentRoutes: GET / - Get home content request received');
    console.log('HomeContentRoutes: User ID:', req.user.id);

    const homeContent = await HomeContentService.getHomeContentByUserId(req.user.id);
    console.log('HomeContentRoutes: HomeContent service result:', homeContent);

    if (!homeContent) {
      console.log('HomeContentRoutes: No home content found, creating default');
      const defaultHomeContent = await HomeContentService.createOrUpdateHomeContent(req.user.id, {
        name: 'Your Name',
        tagline: 'Your professional tagline here',
        bio: 'Tell your professional story here...',
        yearsExperience: 0,
        coreExpertise: [],
        socialLinks: {
          linkedin: '',
          github: '',
          twitter: '',
          bluesky: ''
        }
      });
      console.log('HomeContentRoutes: Default home content created');
      
      return res.json({
        success: true,
        homeContent: defaultHomeContent
      });
    }

    console.log('HomeContentRoutes: Home content retrieved successfully');
    console.log('HomeContentRoutes: Sending response:', homeContent);
    
    res.json({
      success: true,
      homeContent: homeContent
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
    console.log('HomeContentRoutes: PUT / - Update home content request received');
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

      // Get existing home content to delete old image
      const existingHomeContent = await HomeContentService.getHomeContentByUserId(req.user.id);
      if (existingHomeContent && existingHomeContent.profileImageUrl) {
        const oldImagePath = path.join(__dirname, '..', existingHomeContent.profileImageUrl);
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

    const homeContent = await HomeContentService.createOrUpdateHomeContent(req.user.id, updateData);

    console.log('HomeContentRoutes: Home content updated successfully');
    res.json({
      success: true,
      message: 'Home content updated successfully',
      homeContent: homeContent
    });

  } catch (error) {
    console.error('HomeContentRoutes: Error updating home content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update home content'
    });
  }
});

// POST /api/home-content/upload-profile-image - Upload profile image
router.post('/upload-profile-image', auth, upload.single('profileImage'), async (req, res) => {
  try {
    console.log('HomeContentRoutes: POST /upload-profile-image - Upload profile image request received');
    console.log('HomeContentRoutes: User ID:', req.user.id);
    console.log('HomeContentRoutes: File uploaded:', !!req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const profileImageUrl = `/uploads/profile/${req.file.filename}`;
    console.log('HomeContentRoutes: Profile image uploaded:', profileImageUrl);

    res.json({
      success: true,
      profileImageUrl: profileImageUrl
    });

  } catch (error) {
    console.error('HomeContentRoutes: Error uploading profile image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload profile image'
    });
  }
});

console.log('HomeContentRoutes: Module loaded successfully');

module.exports = router;