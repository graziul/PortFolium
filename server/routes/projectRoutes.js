const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/projects');
console.log('ProjectRoutes: Checking uploads directory:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  console.log('ProjectRoutes: Creating uploads directory:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
} else {
  console.log('ProjectRoutes: Uploads directory exists');
}

// Helper function to get local file path from URL or relative path
const getLocalFilePath = (imageUrl) => {
  if (!imageUrl) return null;

  // If it's a full URL, extract the path part
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    const url = new URL(imageUrl);
    // Fix: Use server/uploads path instead of root uploads
    return path.join(__dirname, '..', url.pathname);
  }

  // If it's already a relative path, use it directly
  // Fix: Use server/uploads path instead of root uploads
  return path.join(__dirname, '..', imageUrl);
};

// Helper function to resize image
const resizeImage = async (inputPath, outputPath, options = {}) => {
  const { width = 800, height = 600, quality = 85 } = options;
  
  try {
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toFile(outputPath);
    
    console.log('ProjectRoutes: Image resized successfully:', outputPath);
    return true;
  } catch (error) {
    console.error('ProjectRoutes: Error resizing image:', error);
    return false;
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Changed to match the static server path: server/uploads/projects
    const uploadDir = path.join(__dirname, '../uploads/projects');
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
    fileSize: 10 * 1024 * 1024 // 10MB limit (increased for processing)
  },
  fileFilter: (req, file, cb) => {
    console.log('ProjectRoutes: File filter - mimetype:', file.mimetype);
    console.log('ProjectRoutes: File filter - originalname:', file.originalname);

    // Updated to include SVG files
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const allowedMimeTypes = /^image\/(jpeg|jpg|png|gif|webp|svg\+xml)$/;

    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.test(file.mimetype);

    console.log('ProjectRoutes: File filter - extension test:', extname);
    console.log('ProjectRoutes: File filter - mimetype test:', mimetype);

    if (mimetype && extname) {
      console.log('ProjectRoutes: File accepted');
      return cb(null, true);
    } else {
      console.log('ProjectRoutes: File rejected - invalid type');
      console.log('ProjectRoutes: Allowed extensions: jpeg, jpg, png, gif, webp, svg');
      console.log('ProjectRoutes: Allowed mimetypes: image/jpeg, image/jpg, image/png, image/gif, image/webp, image/svg+xml');
      cb(new Error(`File type not allowed. Uploaded: ${file.mimetype}. Allowed: image/jpeg, image/png, image/gif, image/webp, image/svg+xml`));
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
    mimetype: req.file.mimetype,
    path: req.file.path,
    destination: req.file.destination
  } : 'No file');

  try {
    if (!req.file) {
      console.log('ProjectRoutes: No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Verify file was actually saved
    const filePath = req.file.path;
    console.log('ProjectRoutes: Checking if file exists at:', filePath);
    console.log('ProjectRoutes: File absolute path:', path.resolve(filePath));

    if (!fs.existsSync(filePath)) {
      console.error('ProjectRoutes: File was not saved properly:', filePath);
      return res.status(500).json({ error: 'File upload failed - file not saved' });
    }

    const fileStats = fs.statSync(filePath);
    console.log('ProjectRoutes: File saved successfully, size:', fileStats.size, 'bytes');
    console.log('ProjectRoutes: File mimetype:', req.file.mimetype);
    console.log('ProjectRoutes: Is SVG file:', req.file.mimetype.includes('svg'));

    // Process image if it's not SVG (SVG files don't need resizing)
    let finalImagePath = filePath;
    const isImageProcessable = !req.file.mimetype.includes('svg');
    console.log('ProjectRoutes: Should process image:', isImageProcessable);

    if (isImageProcessable) {
      const resizedFilename = 'resized-' + req.file.filename.replace(path.extname(req.file.filename), '.jpg');
      const resizedPath = path.join(path.dirname(filePath), resizedFilename);

      console.log('ProjectRoutes: Original file path:', filePath);
      console.log('ProjectRoutes: Resized file path:', resizedPath);
      console.log('ProjectRoutes: Resizing image to:', resizedPath);

      const resizeSuccess = await resizeImage(filePath, resizedPath, {
        width: 1200,
        height: 800,
        quality: 85
      });

      console.log('ProjectRoutes: Resize operation result:', resizeSuccess);

      if (resizeSuccess) {
        // Verify resized file exists
        if (fs.existsSync(resizedPath)) {
          console.log('ProjectRoutes: Resized file created successfully');
          const resizedStats = fs.statSync(resizedPath);
          console.log('ProjectRoutes: Resized file size:', resizedStats.size, 'bytes');
          
          // Delete original file and use resized version
          fs.unlinkSync(filePath);
          console.log('ProjectRoutes: Original file deleted');
          finalImagePath = resizedPath;
        } else {
          console.error('ProjectRoutes: Resized file was not created');
          finalImagePath = filePath;
        }
      } else {
        console.log('ProjectRoutes: Resize failed, using original image');
      }
    } else {
      console.log('ProjectRoutes: SVG file - skipping resize, using original');
    }

    const imageUrl = `/uploads/projects/${path.basename(finalImagePath)}`;
    console.log('ProjectRoutes: Final image URL:', imageUrl);
    console.log('ProjectRoutes: Final image path:', finalImagePath);

    // Test if the file can be accessed via the static route
    const staticServePath = path.join(__dirname, '..', imageUrl);
    console.log('ProjectRoutes: Static serve path:', staticServePath);
    console.log('ProjectRoutes: Static serve path resolved:', path.resolve(staticServePath));

    if (fs.existsSync(staticServePath)) {
      console.log('ProjectRoutes: File accessible via static route');
      const staticStats = fs.statSync(staticServePath);
      console.log('ProjectRoutes: Static file size:', staticStats.size, 'bytes');
    } else {
      console.error('ProjectRoutes: File NOT accessible via static route');
      console.error('ProjectRoutes: Expected static path:', staticServePath);
      console.error('ProjectRoutes: Actual file path:', finalImagePath);
      
      // List files in the directory to debug
      const uploadDir = path.join(__dirname, '../uploads/projects');
      console.log('ProjectRoutes: Upload directory contents:');
      try {
        const files = fs.readdirSync(uploadDir);
        files.forEach(file => {
          const fullPath = path.join(uploadDir, file);
          const stats = fs.statSync(fullPath);
          console.log('ProjectRoutes: - File:', file, 'Size:', stats.size, 'bytes');
        });
      } catch (error) {
        console.error('ProjectRoutes: Error reading upload directory:', error);
      }
    }

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

    // Verify image files exist for each project
    projects.forEach(project => {
      if (project.thumbnailUrl) {
        const imagePath = getLocalFilePath(project.thumbnailUrl);
        const exists = fs.existsSync(imagePath);
        console.log(`ProjectRoutes: Project ${project._id} thumbnail exists:`, exists, 'Path:', imagePath);
        if (!exists) {
          console.warn(`ProjectRoutes: WARNING - Missing thumbnail for project ${project._id}: ${project.thumbnailUrl}`);
        }
      }
      if (project.bannerUrl) {
        const imagePath = getLocalFilePath(project.bannerUrl);
        const exists = fs.existsSync(imagePath);
        console.log(`ProjectRoutes: Project ${project._id} banner exists:`, exists, 'Path:', imagePath);
        if (!exists) {
          console.warn(`ProjectRoutes: WARNING - Missing banner for project ${project._id}: ${project.bannerUrl}`);
        }
      }
    });

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

    // Verify image files exist for this project
    if (project.thumbnailUrl) {
      const imagePath = getLocalFilePath(project.thumbnailUrl);
      const exists = fs.existsSync(imagePath);
      console.log(`ProjectRoutes: Project ${project._id} thumbnail exists:`, exists, 'Path:', imagePath);
      if (!exists) {
        console.warn(`ProjectRoutes: WARNING - Missing thumbnail for project ${project._id}: ${project.thumbnailUrl}`);
      }
    }
    if (project.bannerUrl) {
      const imagePath = getLocalFilePath(project.bannerUrl);
      const exists = fs.existsSync(imagePath);
      console.log(`ProjectRoutes: Project ${project._id} banner exists:`, exists, 'Path:', imagePath);
      if (!exists) {
        console.warn(`ProjectRoutes: WARNING - Missing banner for project ${project._id}: ${project.bannerUrl}`);
      }
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