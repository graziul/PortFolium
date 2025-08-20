const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  console.log('Auth Middleware: Request received:', {
    method: req.method,
    url: req.url,
    headers: {
      authorization: req.headers.authorization ? 'Bearer [PRESENT]' : 'NOT PRESENT',
      'content-type': req.headers['content-type']
    },
    body: req.body ? 'PRESENT' : 'NOT PRESENT',
    timestamp: new Date().toISOString()
  });

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('Auth Middleware: No authorization header found');
      return res.status(401).json({ 
        error: 'Access denied. No authorization header provided.',
        timestamp: new Date().toISOString()
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('Auth Middleware: Invalid authorization header format:', authHeader.substring(0, 20));
      return res.status(401).json({ 
        error: 'Access denied. Invalid authorization header format.',
        timestamp: new Date().toISOString()
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('Auth Middleware: Token extracted, length:', token.length);

    if (!token) {
      console.log('Auth Middleware: Empty token after extraction');
      return res.status(401).json({ 
        error: 'Access denied. No token provided.',
        timestamp: new Date().toISOString()
      });
    }

    console.log('Auth Middleware: Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware: Token verified successfully, user ID:', decoded.id);

    console.log('Auth Middleware: Looking up user in database...');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('Auth Middleware: User not found in database for ID:', decoded.id);
      return res.status(401).json({ 
        error: 'Access denied. User not found.',
        timestamp: new Date().toISOString()
      });
    }

    console.log('Auth Middleware: User found:', user.email);
    req.user = user;
    console.log('Auth Middleware: Authentication successful, proceeding to next middleware');
    next();
  } catch (error) {
    console.error('Auth Middleware: Error occurred:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    if (error.name === 'JsonWebTokenError') {
      console.log('Auth Middleware: Invalid token error');
      return res.status(401).json({ 
        error: 'Access denied. Invalid token.',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }

    if (error.name === 'TokenExpiredError') {
      console.log('Auth Middleware: Token expired error');
      return res.status(401).json({ 
        error: 'Access denied. Token expired.',
        timestamp: new Date().toISOString()
      });
    }

    console.log('Auth Middleware: Unexpected error');
    res.status(500).json({ 
      error: 'Internal server error during authentication.',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = auth;