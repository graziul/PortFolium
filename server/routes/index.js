const express = require('express');
const router = express.Router();

// Root route
router.get('/', (req, res) => {
  res.json({
    message: 'PortFolium API Server',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      users: '/api/users', 
      projects: '/api/projects',
      blog: '/api/blog',
      skills: '/api/skills'
    }
  });
});

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;