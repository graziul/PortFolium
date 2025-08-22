// Load environment variables first
require("dotenv").config();

console.log('Server: Starting PortFolium server...');
console.log('Server: Environment:', process.env.NODE_ENV || 'development');
console.log('Server: Port:', process.env.PORT || 3000);

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { connectDatabase } = require('./config/database');
const { requestLogger, errorLogger } = require('./utils/logger');

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const projectsRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blogRoutes');
const skillRoutes = require('./routes/skillRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profile');

const app = express();

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(requestLogger);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Server: Created uploads directory');
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));
console.log('Server: Static file serving configured for uploads directory');

// Routes
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);

console.log('Server: All routes configured');

// Error handling middleware (should be last)
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server: Global error handler caught error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server: Server is running on port ${PORT}`);
  console.log(`Server: Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;