const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Auth Middleware: Starting authentication check');
    
    const authHeader = req.header('Authorization');
    console.log('Auth Middleware: Authorization header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('Auth Middleware: No authorization header found');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Auth Middleware: Extracted token length:', token.length);

    if (!token) {
      console.log('Auth Middleware: No token found after Bearer extraction');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    console.log('Auth Middleware: Verifying JWT token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware: Token decoded successfully:', {
      id: decoded.id,
      email: decoded.email,
      exp: decoded.exp,
      currentTime: Math.floor(Date.now() / 1000)
    });

    // Ensure the decoded ID is a valid string
    if (!decoded.id || typeof decoded.id !== 'string') {
      console.error('Auth Middleware: Invalid user ID in token:', {
        id: decoded.id,
        type: typeof decoded.id
      });
      return res.status(401).json({ error: 'Invalid token payload.' });
    }

    console.log('Auth Middleware: Looking up user with ID:', decoded.id);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('Auth Middleware: User not found with ID:', decoded.id);
      return res.status(401).json({ error: 'User not found.' });
    }

    console.log('Auth Middleware: User found successfully:', {
      id: user._id,
      email: user.email,
      isActive: user.isActive
    });

    if (!user.isActive) {
      console.log('Auth Middleware: User account is inactive:', user.email);
      return res.status(401).json({ error: 'Account is inactive.' });
    }

    // Set the user object on the request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name
    };
    
    console.log('Auth Middleware: Authentication successful for user:', req.user.email);
    next();
  } catch (error) {
    console.error('Auth Middleware: Authentication failed', {
      error: error.message,
      name: error.name,
      stack: error.stack
    });

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }

    if (error.name === 'CastError') {
      console.error('Auth Middleware: MongoDB Cast Error - Invalid ObjectId format');
      return res.status(401).json({ error: 'Invalid user identifier.' });
    }

    res.status(500).json({ error: 'Server error during authentication.' });
  }
};

module.exports = auth;