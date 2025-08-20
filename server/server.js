// Load environment variables first
require("dotenv").config();

console.log('Server: Starting PortFolium server...');
console.log('Server: Environment:', process.env.NODE_ENV || 'development');
console.log('Server: Port:', process.env.PORT || 3000);

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDatabase } = require('./config/database');
const { requestLogger, errorLogger, serverLogger } = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Routes
app.use('/api', require('./routes/index'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users/profile', require('./routes/profile')); // Add this line if not present

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use(errorLogger);

// Global error handler
app.use((error, req, res, next) => {
  serverLogger.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase(process.env.MONGODB_URI);
    serverLogger.info('Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      serverLogger.info(`Server running on port ${PORT}`);
      serverLogger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    serverLogger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  serverLogger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  serverLogger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();

module.exports = app;