const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const auth = require('../middleware/auth');
const HomeContentService = require('../services/homeContentService');

console.log('HomeContentRoutes: Module loading...');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/profile');
console.log('HomeContentRoutes: Checking uploads directory:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  console.log('HomeContentRoutes: Creating uploads directory:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
} else {
  console.log('HomeContentRoutes: Uploads directory exists');
}

// Collaborators data file path (will be in .gitignore)
const collaboratorsDataPath = path.join(__dirname, '../data/collaborators.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  console.log('HomeContentRoutes: Creating data directory:', dataDir);
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper function to read collaborators data
const readCollaboratorsData = (userId) => {
  try {
    if (fs.existsSync(collaboratorsDataPath)) {
      const data = JSON.parse(fs.readFileSync(collaboratorsDataPath, 'utf8'));
      return data[userId] || [];
    }
    return [];
  } catch (error) {
    console.error('Error reading collaborators data:', error);
    return [];
  }
};

// Helper function to write collaborators data
const writeCollaboratorsData = (userId, collaborators) => {
  try {
    let allData = {};
    if (fs.existsSync(collaboratorsDataPath)) {
      allData = JSON.parse(fs.readFileSync(collaboratorsDataPath, 'utf8'));
    }
    allData[userId] = collaborators;
    fs.writeFileSync(collaboratorsDataPath, JSON.stringify(allData, null, 2));
  } catch (error) {
    console.error('Error writing collaborators data:', error);
  }
};

// Helper function to calculate collaborator stats
const calculateCollaboratorStats = (collaborators) => {
  const stats = {
    academia: { total: 0, subcategories: { postdoc: 0, junior_faculty: 0, senior_faculty: 0 } },
    industry: { total: 0, subcategories: { industry_tech: 0, industry_finance: 0, industry_healthcare: 0 } },
    students: { total: 0, subcategories: { undergraduate: 0, graduate: 0 } },
    others: { total: 0, subcategories: { professional_ethicist: 0, journalist: 0 } }
  };

  collaborators.forEach(collab => {
    if (['postdoc', 'junior_faculty', 'senior_faculty'].includes(collab.type)) {
      stats.academia.total += 1;
      stats.academia.subcategories[collab.type] += 1;
    } else if (['industry_tech', 'industry_finance', 'industry_healthcare'].includes(collab.type)) {
      stats.industry.total += 1;
      stats.industry.subcategories[collab.type] += 1;
    } else if (['undergraduate', 'graduate'].includes(collab.type)) {
      stats.students.total += 1;
      stats.students.subcategories[collab.type] += 1;
    } else if (['professional_ethicist', 'journalist'].includes(collab.type)) {
      stats.others.total += 1;
      stats.others.subcategories[collab.type] += 1;
    }
  });

  return stats;
};

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profile');
    console.log('HomeContentRoutes: Upload directory:', uploadDir);

    if (!fs.existsSync(uploadDir)) {
      console.log('HomeContentRoutes: Creating upload directory:', uploadDir);
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = 'profile-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    console.log('HomeContentRoutes: Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('HomeContentRoutes: File filter - mimetype:', file.mimetype);

    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const allowedMimeTypes = /^image\/(jpeg|jpg|png|gif|webp)$/;

    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.test(file.mimetype);

    if (mimetype && extname) {
      console.log('HomeContentRoutes: File accepted');
      return cb(null, true);
    } else {
      console.log('HomeContentRoutes: File rejected - invalid type');
      cb(new Error(`File type not allowed. Uploaded: ${file.mimetype}. Allowed: image/jpeg, image/png, image/gif, image/webp`));
    }
  }
});

// Upload profile image
router.post('/upload-profile-image', auth, upload.single('profileImage'), async (req, res) => {
  console.log('HomeContentRoutes: POST /upload-profile-image - Profile image upload request received');
  console.log('HomeContentRoutes: User ID:', req.user?.id);
  console.log('HomeContentRoutes: File info:', req.file ? {
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
    path: req.file.path
  } : 'No file');

  try {
    if (!req.file) {
      console.log('HomeContentRoutes: No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/profile/${req.file.filename}`;
    console.log('HomeContentRoutes: Profile image URL:', imageUrl);

    res.json({ imageUrl });
  } catch (error) {
    console.error('HomeContentRoutes: Error uploading profile image:', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// Get home content
router.get('/', auth, async (req, res) => {
  console.log('HomeContentRoutes: GET / - Get home content request received');
  console.log('HomeContentRoutes: User ID:', req.user?.id);

  try {
    const homeContent = await HomeContentService.getHomeContentByUserId(req.user.id);

    if (!homeContent) {
      console.log('HomeContentRoutes: No home content found, returning default');
      return res.json({
        homeContent: {
          name: req.user.name || 'Your Name',
          tagline: 'Your professional tagline here',
          bio: 'Tell your story here...',
          profileImageUrl: null,
          yearsExperience: 0,
          coreExpertise: [],
          socialLinks: {
            linkedin: '',
            github: '',
            twitter: '',
            website: ''
          },
          collaboratorStats: {
            academia: { total: 0, subcategories: { postdoc: 0, junior_faculty: 0, senior_faculty: 0 } },
            industry: { total: 0, subcategories: { industry_tech: 0, industry_finance: 0, industry_healthcare: 0 } },
            students: { total: 0, subcategories: { undergraduate: 0, graduate: 0 } },
            others: { total: 0, subcategories: { professional_ethicist: 0, journalist: 0 } }
          }
        }
      });
    }

    console.log('HomeContentRoutes: Home content retrieved successfully');
    res.json({ homeContent });
  } catch (error) {
    console.error('HomeContentRoutes: Error fetching home content:', error);
    res.status(500).json({ error: 'Failed to fetch home content' });
  }
});

// Update home content
router.put('/', auth, async (req, res) => {
  console.log('HomeContentRoutes: PUT / - Update home content request received');
  console.log('HomeContentRoutes: User ID:', req.user?.id);
  console.log('HomeContentRoutes: Update data:', req.body);

  try {
    // Handle collaborators data separately
    if (req.body.collaborators) {
      console.log('HomeContentRoutes: Updating collaborators data');
      writeCollaboratorsData(req.user.id, req.body.collaborators);
      
      // Calculate stats and add to home content
      const collaboratorStats = calculateCollaboratorStats(req.body.collaborators);
      req.body.collaboratorStats = collaboratorStats;
      
      // Remove collaborators from the data to be saved in DB
      delete req.body.collaborators;
    }

    const homeContent = await HomeContentService.upsertHomeContent(req.user.id, req.body);
    console.log('HomeContentRoutes: Home content updated successfully');

    res.json({
      homeContent,
      message: 'Home content updated successfully'
    });
  } catch (error) {
    console.error('HomeContentRoutes: Error updating home content:', error);
    res.status(500).json({ error: 'Failed to update home content' });
  }
});

// Get collaborators data for editing
router.get('/collaborators', auth, async (req, res) => {
  console.log('HomeContentRoutes: GET /collaborators - Get collaborators data request received');
  console.log('HomeContentRoutes: User ID:', req.user?.id);

  try {
    const collaborators = readCollaboratorsData(req.user.id);
    console.log('HomeContentRoutes: Collaborators data retrieved:', collaborators.length);
    res.json({ collaborators });
  } catch (error) {
    console.error('HomeContentRoutes: Error fetching collaborators data:', error);
    res.status(500).json({ error: 'Failed to fetch collaborators data' });
  }
});

console.log('HomeContentRoutes: Module loaded successfully');
module.exports = router;