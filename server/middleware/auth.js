const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Auth Middleware: Starting authentication check');
    console.log('Auth Middleware: Request headers:', req.headers);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth Middleware: Extracted token:', token ? 'Token present' : 'No token');

    if (!token) {
      console.error('Auth Middleware: No token provided');
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    console.log('Auth Middleware: Verifying token with JWT_SECRET');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware: Token decoded successfully:', decoded);

    console.log('Auth Middleware: Looking up user in database with ID:', decoded.id);
    const user = await User.findById(decoded.id).select('-password');
    console.log('Auth Middleware: User lookup result:', user ? 'User found' : 'User not found');

    if (!user) {
      console.error('Auth Middleware: User not found in database');
      return res.status(401).json({ error: 'Token is not valid' });
    }

    console.log('Auth Middleware: Setting req.user and proceeding');
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware: Error during authentication:', error.message);
    console.error('Auth Middleware: Error stack:', error.stack);
    console.error('Auth Middleware: Full error object:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;