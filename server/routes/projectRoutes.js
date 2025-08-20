const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const auth = require('../middleware/auth');
const ProjectService = require('../services/projectService');

console.log('ProjectRoutes: Module loading...');

// Add middleware to log all requests to this router
router.use((req, res, next) => {
  console.log(`ProjectRoutes: Request received - ${req.method} ${req.originalUrl} - Route path: ${req.route?.path || req.url}`);
  console.log('ProjectRoutes: Request headers:', req.headers);
  console.log('ProjectRoutes: Request body:', req.body);
  next();
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/projects');
    console.log('ProjectRoutes: Upload directory:', uploadDir);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      console.log('ProjectRoutes: Creating upload directory:', uploadDir);
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    console.log('ProjectRoutes: Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('ProjectRoutes: File filter - mimetype:', file.mimetype);
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      console.log('ProjectRoutes: File accepted');
      return cb(null, true);
    } else {
      console.log('ProjectRoutes: File rejected - invalid type');
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload project image
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  console.log('ProjectRoutes: POST /upload - File upload request received');
  console.log('ProjectRoutes: User ID:', req.user?.id);
  console.log('ProjectRoutes: File info:', req.file ? {
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  } : 'No file');

  try {
    if (!req.file) {
      console.log('ProjectRoutes: No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/projects/${req.file.filename}`;
    console.log('ProjectRoutes: Image uploaded successfully:', imageUrl);

    res.json({ imageUrl });
  } catch (error) {
    console.error('ProjectRoutes: Error uploading image:', error);
    console.error('ProjectRoutes: Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Update project order - MOVED BEFORE /:id route
router.put('/order', auth, async (req, res) => {
  console.log('ProjectRoutes: PUT /order - Update project order request received');
  console.log('ProjectRoutes: User ID:', req.user?.id);
  console.log('ProjectRoutes: Project IDs:', req.body.projectIds);

  try {
    const { projectIds } = req.body;

    if (!Array.isArray(projectIds)) {
      console.log('ProjectRoutes: Invalid projectIds - not an array');
      return res.status(400).json({ error: 'Project IDs must be an array' });
    }

    await ProjectService.updateProjectsOrder(projectIds, req.user.id);
    console.log('ProjectRoutes: Project order updated successfully');

    res.json({ message: 'Project order updated successfully' });
  } catch (error) {
    console.error('ProjectRoutes: Error updating project order:', error);
    console.error('ProjectRoutes: Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to update project order' });
  }
});

// Get all projects for authenticated user
router.get('/', auth, async (req, res) => {
  console.log('ProjectRoutes: GET / - Get projects request received');
  console.log('ProjectRoutes: User ID:', req.user?.id);
  console.log('ProjectRoutes: Full request URL:', req.originalUrl);
  console.log('ProjectRoutes: Route path:', req.route?.path);

  try {
    console.log('ProjectRoutes: Calling ProjectService.getProjectsByUserId...');
    const projects = await ProjectService.getProjectsByUserId(req.user.id);
    console.log('ProjectRoutes: Projects retrieved:', projects.length, 'projects');
    console.log('ProjectRoutes: Sending response with projects data');
    res.json({ projects });
  } catch (error) {
    console.error('ProjectRoutes: Error fetching projects:', error);
    console.error('ProjectRoutes: Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  console.log('ProjectRoutes: GET /:id - Get single project request received');
  console.log('ProjectRoutes: Project ID:', req.params.id);
  console.log('ProjectRoutes: User ID:', req.user?.id);

  try {
    const project = await ProjectService.getProjectById(req.params.id, req.user.id);

    if (!project) {
      console.log('ProjectRoutes: Project not found');
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('ProjectRoutes: Project retrieved:', project.title);
    res.json({ project });
  } catch (error) {
    console.error('ProjectRoutes: Error fetching project:', error);
    console.error('ProjectRoutes: Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create new project
router.post('/', auth, async (req, res) => {
  console.log('ProjectRoutes: POST / - Create project request received');
  console.log('ProjectRoutes: User ID:', req.user?.id);
  console.log('ProjectRoutes: Project data:', req.body);

  try {
    const projectData = {
      ...req.body,
      userId: req.user.id
    };

    const project = await ProjectService.createProject(projectData);
    console.log('ProjectRoutes: Project created successfully:', project._id, project.title);

    res.status(201).json({
      project,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('ProjectRoutes: Error creating project:', error);
    console.error('ProjectRoutes: Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  console.log('ProjectRoutes: PUT /:id - Update project request received');
  console.log('ProjectRoutes: Project ID:', req.params.id);
  console.log('ProjectRoutes: User ID:', req.user?.id);
  console.log('ProjectRoutes: Update data:', req.body);

  try {
    const project = await ProjectService.updateProject(req.params.id, req.body, req.user.id);

    if (!project) {
      console.log('ProjectRoutes: Project not found for update');
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('ProjectRoutes: Project updated successfully:', project.title);
    res.json({
      project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('ProjectRoutes: Error updating project:', error);
    console.error('ProjectRoutes: Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  console.log('ProjectRoutes: DELETE /:id - Delete project request received');
  console.log('ProjectRoutes: Project ID:', req.params.id);
  console.log('ProjectRoutes: User ID:', req.user?.id);

  try {
    const result = await ProjectService.deleteProject(req.params.id, req.user.id);

    if (!result) {
      console.log('ProjectRoutes: Project not found for deletion');
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('ProjectRoutes: Project deleted successfully');
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('ProjectRoutes: Error deleting project:', error);
    console.error('ProjectRoutes: Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

console.log('ProjectRoutes: Module loaded successfully');
module.exports = router;