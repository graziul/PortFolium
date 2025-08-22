// Load environment variables first
require("dotenv").config();

console.log('Server: Starting PortFolium server...');
console.log('Server: Environment:', process.env.NODE_ENV || 'development');
console.log('Server: Port:', process.env.PORT || 3000);

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Server: Basic setup completed');

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('Server: Middleware configured');

// Static file serving
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Server: Setting up static file serving for uploads at:', uploadsPath);

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsPath)) {
  console.log('Server: Creating uploads directory:', uploadsPath);
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Create projects subdirectory if it doesn't exist
const projectsUploadsPath = path.join(uploadsPath, 'projects');
if (!fs.existsSync(projectsUploadsPath)) {
  console.log('Server: Creating projects uploads directory:', projectsUploadsPath);
  fs.mkdirSync(projectsUploadsPath, { recursive: true });
}

app.use('/uploads', express.static(uploadsPath, {
  maxAge: '1d',
  etag: false
}));

console.log('Server: Static file serving configured');

// Database connection
try {
  console.log('Server: Connecting to database...');
  const { connectDB } = require('./config/database');
  connectDB();
  console.log('Server: Database connection initiated');
} catch (error) {
  console.error('Server: Database connection error:', error);
}

// Load routes one by one with error handling
console.log('Server: Loading routes...');

try {
  const indexRoutes = require('./routes/index');
  app.use('/', indexRoutes);
  console.log('Server: Index routes loaded');
} catch (error) {
  console.error('Server: Error loading index routes:', error);
}

try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('Server: Auth routes loaded');
} catch (error) {
  console.error('Server: Error loading auth routes:', error);
}

try {
  const projectRoutes = require('./routes/projectRoutes');
  app.use('/api/projects', projectRoutes);
  console.log('Server: Project routes loaded');
} catch (error) {
  console.error('Server: Error loading project routes:', error);
}

try {
  const blogRoutes = require('./routes/blogRoutes');
  app.use('/api/blog', blogRoutes);
  console.log('Server: Blog routes loaded');
} catch (error) {
  console.error('Server: Error loading blog routes:', error);
}

try {
  const skillRoutes = require('./routes/skillRoutes');
  app.use('/api/skills', skillRoutes);
  console.log('Server: Skill routes loaded');
} catch (error) {
  console.error('Server: Error loading skill routes:', error);
}

try {
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
  console.log('Server: User routes loaded');
} catch (error) {
  console.error('Server: Error loading user routes:', error);
}

try {
  const profileRoutes = require('./routes/profile');
  app.use('/api/profile', profileRoutes);
  console.log('Server: Profile routes loaded');
} catch (error) {
  console.error('Server: Error loading profile routes:', error);
}

console.log('Server: All routes loaded successfully');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server: Unhandled error:', err);
  console.error('Server: Error stack:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('Server: 404 - Route not found:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

console.log('Server: Error handlers configured');

app.listen(PORT, () => {
  console.log(`Server: PortFolium server running on port ${PORT}`);
  console.log(`Server: Static files served from: ${uploadsPath}`);
  console.log(`Server: Projects uploads directory: ${projectsUploadsPath}`);
  console.log('Server: Server startup completed successfully');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Server: Uncaught Exception:', error);
  console.error('Server: Error stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Server: Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Server: Exception handlers configured');

module.exports = app;