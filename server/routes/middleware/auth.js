const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Auth Middleware: Starting authentication check');
    console.log('Auth Middleware: Authorization header present:', !!req.header('Authorization'));

    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth Middleware: Extracted token length:', token?.length || 0);

    if (!token) {
      console.error('Auth Middleware: No token provided');
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    console.log('Auth Middleware: Verifying JWT token...');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth Middleware: Token decoded successfully:', {
        id: decoded.id,
        email: decoded.email,
        exp: decoded.exp,
        currentTime: Math.floor(Date.now() / 1000)
      });
    } catch (jwtError) {
      console.error('Auth Middleware: JWT verification failed:', jwtError.message);
      return res.status(401).json({ error: 'Token is not valid' });
    }

    console.log('Auth Middleware: Looking up user with ID:', decoded.id);
    const user = await User.findById(decoded.id).select('-password');
    
    console.log('Auth Middleware: User found successfully:', user ? {
      id: user._id,
      email: user.email,
      name: user.name
    } : 'No user found');

    if (!user) {
      console.error('Auth Middleware: User not found in database');
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    console.log('Auth Middleware: Authentication successful');
    next();
  } catch (error) {
    console.error('Auth Middleware: Authentication error:', error.message);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;