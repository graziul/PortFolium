const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const auth = require('./middleware/auth');

// Add logging to check if BlogService is being imported correctly
console.log('BlogRoutes: Starting to load BlogService...');
try {
  const { BlogService } = require('../services/blogService');
  console.log('BlogRoutes: BlogService loaded successfully:', typeof BlogService);
  console.log('BlogRoutes: BlogService methods:', Object.getOwnPropertyNames(BlogService));
} catch (error) {
  console.error('BlogRoutes: CRITICAL ERROR - Failed to load BlogService:', error);
  console.error('BlogRoutes: Error stack:', error.stack);
}

const { BlogService } = require('../services/blogService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/blog');

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
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

// Upload blog post image
router.post('/upload-image', auth, upload.single('image'), async (req, res) => {
  console.log('Blog Routes: ===== POST /api/blog-posts/upload-image ROUTE CALLED =====');
  
  try {
    console.log('Blog Routes: Image upload request received');
    console.log('File:', req.file);

    if (!req.file) {
      console.log('Blog Routes: No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/blog/${req.file.filename}`;
    console.log('Blog Routes: Image uploaded:', imageUrl);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Blog Routes: ===== ERROR IN POST /api/blog-posts/upload-image =====');
    console.error('Blog Routes: Error:', error);
    console.error('Blog Routes: Error stack:', error.stack);
    console.error('Blog Routes: ===== END ERROR LOG =====');
    
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message
    });
  }
});

// Get all blog posts
router.get('/', auth, async (req, res) => {
  console.log('Blog Routes: ===== GET /api/blog-posts ROUTE CALLED =====');
  console.log('Blog Routes: Request received at:', new Date().toISOString());
  console.log('Blog Routes: User from auth middleware:', req.user);
  console.log('Blog Routes: User ID:', req.user?.id);
  console.log('Blog Routes: BlogService type:', typeof BlogService);
  console.log('Blog Routes: BlogService.getPostsByUser type:', typeof BlogService?.getPostsByUser);

  try {
    console.log('Blog Routes: About to call BlogService.getPostsByUser');

    if (!BlogService) {
      console.error('Blog Routes: CRITICAL - BlogService is undefined!');
      return res.status(500).json({ error: 'BlogService not available' });
    }

    if (!BlogService.getPostsByUser) {
      console.error('Blog Routes: CRITICAL - BlogService.getPostsByUser is undefined!');
      console.error('Blog Routes: Available methods:', Object.getOwnPropertyNames(BlogService));
      return res.status(500).json({ error: 'getPostsByUser method not available' });
    }

    const posts = await BlogService.getPostsByUser(req.user.id);
    console.log('Blog Routes: BlogService.getPostsByUser completed successfully');
    console.log('Blog Routes: Found', posts?.length || 0, 'blog posts');

    res.json({
      success: true,
      posts
    });
    console.log('Blog Routes: Response sent successfully');
  } catch (error) {
    console.error('Blog Routes: ===== ERROR IN GET /api/blog-posts =====');
    console.error('Blog Routes: Error type:', error.constructor.name);
    console.error('Blog Routes: Error message:', error.message);
    console.error('Blog Routes: Error stack:', error.stack);
    console.error('Blog Routes: Error details:', error);
    console.error('Blog Routes: User ID that caused error:', req.user?.id);
    console.error('Blog Routes: ===== END ERROR LOG =====');
    
    res.status(500).json({ 
      error: 'Failed to fetch blog posts',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get single blog post
router.get('/:id', auth, async (req, res) => {
  console.log('Blog Routes: ===== GET /api/blog-posts/:id ROUTE CALLED =====');
  console.log('Blog Routes: Post ID:', req.params.id);
  console.log('Blog Routes: User ID:', req.user?.id);

  try {
    const post = await BlogService.getPostById(req.params.id, req.user.id);

    if (!post) {
      console.log('Blog Routes: Blog post not found:', req.params.id);
      return res.status(404).json({ error: 'Blog post not found' });
    }

    console.log('Blog Routes: Blog post found:', post.title);
    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Blog Routes: ===== ERROR IN GET /api/blog-posts/:id =====');
    console.error('Blog Routes: Error:', error);
    console.error('Blog Routes: Error stack:', error.stack);
    console.error('Blog Routes: ===== END ERROR LOG =====');
    
    res.status(500).json({ 
      error: 'Failed to fetch blog post',
      details: error.message
    });
  }
});

// Create new blog post
router.post('/', auth, async (req, res) => {
  console.log('Blog Routes: ===== POST /api/blog-posts ROUTE CALLED =====');
  console.log('Blog Routes: User ID:', req.user?.id);
  console.log('Blog Routes: Request body:', req.body);

  try {
    const postData = {
      ...req.body,
      userId: req.user.id
    };

    const post = await BlogService.createPost(postData);

    console.log('Blog Routes: Blog post created successfully:', post.title);
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      post
    });
  } catch (error) {
    console.error('Blog Routes: ===== ERROR IN POST /api/blog-posts =====');
    console.error('Blog Routes: Error:', error);
    console.error('Blog Routes: Error stack:', error.stack);
    console.error('Blog Routes: ===== END ERROR LOG =====');
    
    res.status(500).json({ 
      error: 'Failed to create blog post',
      details: error.message
    });
  }
});

// Update blog post
router.put('/:id', auth, async (req, res) => {
  console.log('Blog Routes: ===== PUT /api/blog-posts/:id ROUTE CALLED =====');
  console.log('Blog Routes: Post ID:', req.params.id);
  console.log('Blog Routes: User ID:', req.user?.id);
  console.log('Blog Routes: Update data:', req.body);

  try {
    const post = await BlogService.updatePost(req.params.id, req.body, req.user.id);

    if (!post) {
      console.log('Blog Routes: Blog post not found for update:', req.params.id);
      return res.status(404).json({ error: 'Blog post not found' });
    }

    console.log('Blog Routes: Blog post updated successfully:', post.title);
    res.json({
      success: true,
      message: 'Blog post updated successfully',
      post
    });
  } catch (error) {
    console.error('Blog Routes: ===== ERROR IN PUT /api/blog-posts/:id =====');
    console.error('Blog Routes: Error:', error);
    console.error('Blog Routes: Error stack:', error.stack);
    console.error('Blog Routes: ===== END ERROR LOG =====');
    
    res.status(500).json({ 
      error: 'Failed to update blog post',
      details: error.message
    });
  }
});

// Delete blog post
router.delete('/:id', auth, async (req, res) => {
  console.log('Blog Routes: ===== DELETE /api/blog-posts/:id ROUTE CALLED =====');
  console.log('Blog Routes: Post ID:', req.params.id);
  console.log('Blog Routes: User ID:', req.user?.id);

  try {
    const post = await BlogService.deletePost(req.params.id, req.user.id);

    if (!post) {
      console.log('Blog Routes: Blog post not found for deletion:', req.params.id);
      return res.status(404).json({ error: 'Blog post not found' });
    }

    console.log('Blog Routes: Blog post deleted successfully:', post.title);
    res.json({
      success: true,
      message: 'Blog post deleted successfully',
      post
    });
  } catch (error) {
    console.error('Blog Routes: ===== ERROR IN DELETE /api/blog-posts/:id =====');
    console.error('Blog Routes: Error:', error);
    console.error('Blog Routes: Error stack:', error.stack);
    console.error('Blog Routes: ===== END ERROR LOG =====');
    
    res.status(500).json({ 
      error: 'Failed to delete blog post',
      details: error.message
    });
  }
});

console.log('Blog Routes: Module loaded successfully');
module.exports = router;