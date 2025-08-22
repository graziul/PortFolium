const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/auth');
const router = express.Router();

console.log('AuthRoutes: Module loading...');

// Register route
router.post('/register', async (req, res) => {
  console.log('AuthRoutes: POST /register - Registration request received');
  console.log('AuthRoutes: Request body:', req.body);

  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      console.log('AuthRoutes: Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    console.log('AuthRoutes: Checking if user exists with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('AuthRoutes: User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    console.log('AuthRoutes: Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    console.log('AuthRoutes: Password hashed successfully');

    // Create user
    console.log('AuthRoutes: Creating new user...');
    const user = new User({
      email,
      password: hashedPassword,
      name
    });

    const savedUser = await user.save();
    console.log('AuthRoutes: User created successfully:', savedUser._id);

    // Generate tokens
    console.log('AuthRoutes: Generating tokens...');
    const accessToken = generateAccessToken(savedUser._id);
    const refreshToken = generateRefreshToken(savedUser._id);
    console.log('AuthRoutes: Tokens generated successfully');

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name
      }
    });
  } catch (error) {
    console.error('AuthRoutes: Error during registration:', error);
    console.error('AuthRoutes: Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('AuthRoutes: POST /login - Login request received');
  console.log('AuthRoutes: Request body:', req.body);

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('AuthRoutes: Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    console.log('AuthRoutes: Looking up user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('AuthRoutes: User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('AuthRoutes: User found, verifying password...');

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('AuthRoutes: Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('AuthRoutes: Password verified successfully');

    // Generate tokens
    console.log('AuthRoutes: Generating tokens...');
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    console.log('AuthRoutes: Tokens generated successfully');

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('AuthRoutes: Error during login:', error);
    console.error('AuthRoutes: Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token route
router.post('/refresh', async (req, res) => {
  console.log('AuthRoutes: POST /refresh - Token refresh request received');

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      console.log('AuthRoutes: No refresh token provided');
      return res.status(401).json({ error: 'Refresh token required' });
    }

    console.log('AuthRoutes: Verifying refresh token...');
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      console.log('AuthRoutes: Invalid refresh token');
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    console.log('AuthRoutes: Refresh token verified, user ID:', decoded.id);

    // Generate new access token
    const newAccessToken = generateAccessToken(decoded.id);
    console.log('AuthRoutes: New access token generated');

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('AuthRoutes: Error during token refresh:', error);
    console.error('AuthRoutes: Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  console.log('AuthRoutes: POST /logout - Logout request received');
  
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('AuthRoutes: Error during logout:', error);
    console.error('AuthRoutes: Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

console.log('AuthRoutes: Module loaded successfully');
module.exports = router;