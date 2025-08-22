const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth');
const auth = require('../middleware/auth');

const router = express.Router();

console.log('AuthRoutes: Module loading...');

// Register route
router.post('/register', async (req, res) => {
  console.log('AuthRoutes: POST /register - Registration request received');
  console.log('AuthRoutes: Request body keys:', Object.keys(req.body));
  console.log('AuthRoutes: Request body:', { 
    name: req.body.name, 
    email: req.body.email, 
    password: req.body.password ? '[REDACTED]' : 'missing' 
  });

  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('AuthRoutes: Missing required fields - name:', !!name, 'email:', !!email, 'password:', !!password);
      return res.status(400).json({ 
        error: 'Name, email, and password are required',
        received: { name: !!name, email: !!email, password: !!password }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('AuthRoutes: Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('AuthRoutes: User already exists with email:', email);
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    await user.save();
    console.log('AuthRoutes: User created successfully:', user._id);

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email, user.name);

    // Return success response (only accessToken for register)
    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('AuthRoutes: Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('AuthRoutes: POST /login - Login request received');
  console.log('AuthRoutes: Request body keys:', Object.keys(req.body));
  console.log('AuthRoutes: Request body:', req.body);

  try {
    const { email, password } = req.body;

    console.log('AuthRoutes: Extracted email:', email, 'password present:', !!password);

    // Validate required fields
    if (!email || !password) {
      console.log('AuthRoutes: Missing email or password');
      console.log('AuthRoutes: Email provided:', !!email, 'Password provided:', !!password);
      return res.status(400).json({ 
        error: 'Email and password are required',
        received: { email: !!email, password: !!password }
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('AuthRoutes: User not found with email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('AuthRoutes: User found:', user._id);

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('AuthRoutes: Invalid password for user:', user._id);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('AuthRoutes: Password valid for user:', user._id);

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email, user.name);
    const refreshToken = generateRefreshToken(user._id);

    console.log('AuthRoutes: Tokens generated successfully');

    // Return success response
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('AuthRoutes: Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Refresh token route
router.post('/refresh', async (req, res) => {
  console.log('AuthRoutes: POST /refresh - Refresh token request received');

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      console.log('AuthRoutes: No refresh token provided');
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log('AuthRoutes: Refresh token verified for user:', decoded.id);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('AuthRoutes: User not found for refresh token');
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id, user.email, user.name);

    console.log('AuthRoutes: New access token generated');

    res.json({ accessToken });

  } catch (error) {
    console.error('AuthRoutes: Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Logout route
router.post('/logout', auth, async (req, res) => {
  console.log('AuthRoutes: POST /logout - Logout request received');
  console.log('AuthRoutes: User ID:', req.user?.id);

  try {
    // In a production app, you might want to blacklist the token
    // For now, we'll just return success
    console.log('AuthRoutes: Logout successful');
    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('AuthRoutes: Logout error:', error);
    res.status(500).json({ error: 'Internal server error during logout' });
  }
});

console.log('AuthRoutes: Module loaded successfully');
module.exports = router;