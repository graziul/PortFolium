const express = require('express');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
  console.log('Index Routes: Home route accessed');
  res.json({
    message: 'PortFolium API Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check route
router.get('/health', (req, res) => {
  console.log('Index Routes: Health check accessed');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;