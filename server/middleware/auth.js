const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Auth Middleware: ===== AUTHENTICATION CHECK STARTED =====');
    console.log('Auth Middleware: Request method:', req.method);
    console.log('Auth Middleware: Request URL:', req.originalUrl);
    console.log('Auth Middleware: Request headers authorization:', req.headers.authorization ? 'Present' : 'Missing');

    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth Middleware: Token extraction result:', token ? 'Token extracted successfully' : 'No token found');

    if (!token) {
      console.error('Auth Middleware: AUTHENTICATION FAILED - No token provided');
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    console.log('Auth Middleware: Verifying JWT token...');
    console.log('Auth Middleware: JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth Middleware: Token verification successful');
      console.log('Auth Middleware: Decoded token payload:', { id: decoded.id, email: decoded.email });
    } catch (jwtError) {
      console.error('Auth Middleware: JWT verification failed:', jwtError.message);
      console.error('Auth Middleware: JWT error name:', jwtError.name);
      return res.status(401).json({ error: 'Token is not valid - JWT verification failed' });
    }

    console.log('Auth Middleware: Looking up user in database...');
    console.log('Auth Middleware: User ID from token:', decoded.id);
    
    const user = await User.findById(decoded.id).select('-password');
    console.log('Auth Middleware: Database lookup result:', user ? 'User found' : 'User not found');
    
    if (user) {
      console.log('Auth Middleware: User details:', {
        id: user._id,
        email: user.email,
        name: user.name
      });
    }

    if (!user) {
      console.error('Auth Middleware: AUTHENTICATION FAILED - User not found in database');
      console.error('Auth Middleware: Searched for user ID:', decoded.id);
      return res.status(401).json({ error: 'Account is not active' });
    }

    console.log('Auth Middleware: Authentication successful, setting req.user');
    req.user = user;
    console.log('Auth Middleware: ===== AUTHENTICATION CHECK COMPLETED SUCCESSFULLY =====');
    next();
  } catch (error) {
    console.error('Auth Middleware: ===== AUTHENTICATION ERROR =====');
    console.error('Auth Middleware: Error type:', error.constructor.name);
    console.error('Auth Middleware: Error message:', error.message);
    console.error('Auth Middleware: Error stack:', error.stack);
    console.error('Auth Middleware: ===== END AUTHENTICATION ERROR =====');
    res.status(401).json({ error: 'Token is not valid - Server error' });
  }
};

module.exports = auth;