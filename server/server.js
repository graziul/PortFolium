// Load environment variables first
require("dotenv").config();

console.log('Server: Starting PortFolium server...');
console.log('Server: Environment:', process.env.NODE_ENV || 'development');
console.log('Server: Port:', process.env.PORT || 3000);

const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { connectDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
const skillRoutes = require('./routes/skillRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profile');
const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Server: Starting PortFolium server...');
console.log('Server: Environment:', process.env.NODE_ENV || 'development');
console.log('Server: Port:', PORT);

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const projectsUploadDir = path.join(__dirname, 'uploads/projects');

console.log('Server: Checking uploads directories...');
console.log('Server: Main uploads dir:', uploadsDir);
console.log('Server: Projects uploads dir:', projectsUploadDir);

if (!fs.existsSync(uploadsDir)) {
  console.log('Server: Creating main uploads directory');
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(projectsUploadDir)) {
  console.log('Server: Creating projects uploads directory');
  fs.mkdirSync(projectsUploadDir, { recursive: true });
}

console.log('Server: Uploads directories ready');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files with logging
app.use('/uploads', (req, res, next) => {
  console.log('Server: Static file request received');
  console.log('Server: Request URL:', req.url);
  console.log('Server: Request method:', req.method);
  console.log('Server: Request headers:', req.headers);
  
  const filePath = path.join(__dirname, 'uploads', req.url);
  const resolvedPath = path.resolve(filePath);
  
  console.log('Server: Looking for file at:', filePath);
  console.log('Server: Resolved file path:', resolvedPath);

  if (fs.existsSync(filePath)) {
    console.log('Server: File found, serving:', filePath);
    const stats = fs.statSync(filePath);
    console.log('Server: File size:', stats.size, 'bytes');
    console.log('Server: File modified:', stats.mtime);
  } else {
    console.log('Server: File NOT found:', filePath);
    
    // List directory contents for debugging
    const dirPath = path.dirname(filePath);
    console.log('Server: Checking directory:', dirPath);
    try {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        console.log('Server: Directory contents:', files);
      } else {
        console.log('Server: Directory does not exist:', dirPath);
      }
    } catch (error) {
      console.error('Server: Error reading directory:', error);
    }
  }

  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server: Unhandled error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('Server: 404 - Route not found:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

const startServer = async () => {
  try {
    console.log('Server: Attempting to connect to database...');
    
    // Try to connect to MongoDB
    await connectDatabase();
    console.log('Server: Database connection successful');
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server: PortFolium server running on port ${PORT}`);
      console.log(`Server: API available at http://localhost:${PORT}/api`);
      console.log(`Server: Static files served from http://localhost:${PORT}/uploads`);
      console.log('Server: Server started successfully');
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`Server: Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('Server: HTTP server closed');
        
        try {
          const { disconnectDatabase } = require('./config/database');
          await disconnectDatabase();
          console.log('Server: Database disconnected');
        } catch (error) {
          console.error('Server: Error disconnecting database:', error.message);
        }
        
        console.log('Server: Graceful shutdown complete');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Server: Failed to start server:', error.message);
    console.error('Server: Error details:', error.message);
    console.error('Server: Error stack:', error.stack);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('');
      console.error('='.repeat(60));
      console.error('MongoDB CONNECTION ERROR');
      console.error('='.repeat(60));
      console.error('MongoDB is not running. Please start MongoDB first:');
      console.error('');
      console.error('Windows:');
      console.error('  net start MongoDB');
      console.error('  OR: mongod --dbpath "C:\\data\\db"');
      console.error('');
      console.error('macOS:');
      console.error('  brew services start mongodb-community');
      console.error('');
      console.error('Linux:');
      console.error('  sudo systemctl start mongod');
      console.error('');
      console.error('Then restart this server with: npm run server');
      console.error('='.repeat(60));
    }
    
    console.error('Server: Exiting due to startup failure...');
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Server: Uncaught Exception:', error.message);
  console.error('Server: Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Server: Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

module.exports = app;