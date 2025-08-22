// Load environment variables first
require("dotenv").config();

console.log('Server: Starting PortFolium server...');
console.log('Server: Environment:', process.env.NODE_ENV || 'development');
console.log('Server: Port:', process.env.PORT || 3000);

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/database');

console.log('Server: Starting PortFolium server...');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic request logging middleware (instead of using logger module)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Static file serving - serve uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Server: Static files served from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Verify projects uploads directory exists
const projectsUploadsPath = path.join(uploadsPath, 'projects');
console.log('Server: Projects uploads directory:', projectsUploadsPath);
if (!fs.existsSync(projectsUploadsPath)) {
  console.log('Server: Creating projects uploads directory...');
  fs.mkdirSync(projectsUploadsPath, { recursive: true });
}

// Routes
console.log('Server: Loading routes...');

// Load main routes
const indexRoutes = require('./routes/index');
app.use('/api', indexRoutes);

// Load auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
console.log('Server: Auth routes loaded');

// Load blog routes
const blogRoutes = require('./routes/blogRoutes');
app.use('/api/blog', blogRoutes);
console.log('Server: Blog routes loaded');

// Load project routes
const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);
console.log('Server: Project routes loaded');

// Load collaborator routes
const collaboratorRoutes = require('./routes/collaboratorRoutes');
app.use('/api/collaborators', collaboratorRoutes);
console.log('Server: Collaborator routes loaded');

// Load home content routes
const homeContentRoutes = require('./routes/homeContentRoutes');
app.use('/api/home-content', homeContentRoutes);
console.log('Server: Home content routes loaded');

// Load skill routes
const skillRoutes = require('./routes/skillRoutes');
app.use('/api/skills', skillRoutes);
console.log('Server: Skill routes loaded');

// Load user routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
console.log('Server: User routes loaded');

// Load profile routes
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);
console.log('Server: Profile routes loaded');

console.log('Server: All routes loaded successfully');

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log('Server: 404 - Route not found:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

// 404 handler for static files
app.use('/uploads/*', (req, res) => {
  console.log('Server: 404 - File not found:', req.originalUrl);
  res.status(404).json({ error: 'File not found' });
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error('Server: Error occurred:', err);
  res.status(500).json({ error: 'Internal server error' });
});

console.log('Server: Error handlers configured');

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Server: Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Server: Unhandled Rejection:', err);
  process.exit(1);
});

console.log('Server: Exception handlers configured');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server: PortFolium server running on port ${PORT}`);
  console.log('Server: Server startup completed successfully');
});

module.exports = app;