const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/auth');

const router = express.Router();

console.log('AuthRoutes: Module loading...');

// Register route
router.post('/register', async (req, res) => {
  console.log('AuthRoutes: POST /register - Registration request received');
  console.log('AuthRoutes: Request body keys:', Object.keys(req.body));
  console.log('AuthRoutes: Request body:', {
    email: req.body.email ? 'PRESENT' : 'MISSING',
    password: req.body.password ? 'PRESENT' : 'MISSING',
    name: req.body.name ? 'PRESENT' : 'MISSING',
    timestamp: new Date().toISOString()
  });

  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email) {
      console.log('AuthRoutes: Registration failed - missing email');
      return res.status(400).json({
        error: 'Email is required',
        field: 'email',
        timestamp: new Date().toISOString()
      });
    }

    if (!password) {
      console.log('AuthRoutes: Registration failed - missing password');
      return res.status(400).json({
        error: 'Password is required',
        field: 'password',
        timestamp: new Date().toISOString()
      });
    }

    if (!name) {
      console.log('AuthRoutes: Registration failed - missing name');
      return res.status(400).json({
        error: 'Name is required',
        field: 'name',
        timestamp: new Date().toISOString()
      });
    }

    console.log('AuthRoutes: Validation passed, checking if user exists...');

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('AuthRoutes: Registration failed - user already exists:', email);
      return res.status(400).json({
        error: 'User already exists with this email',
        timestamp: new Date().toISOString()
      });
    }

    console.log('AuthRoutes: User does not exist, creating new user...');

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('AuthRoutes: Password hashed successfully');

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim()
    });

    const savedUser = await user.save();
    console.log('AuthRoutes: User created successfully:', savedUser._id);

    // Generate tokens
    const accessToken = generateAccessToken(savedUser._id);
    console.log('AuthRoutes: Access token generated');

    // Return user data (excluding password)
    const userData = {
      id: savedUser._id,
      email: savedUser.email,
      name: savedUser.name
    };

    console.log('AuthRoutes: Registration successful for user:', userData.email);
    res.status(201).json({
      accessToken,
      user: userData,
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('AuthRoutes: Registration error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      error: 'Internal server error during registration',
      timestamp: new Date().toISOString()
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('AuthRoutes: POST /login - Login request received');
  console.log('AuthRoutes: Request body:', {
    email: req.body.email ? 'PRESENT' : 'MISSING',
    password: req.body.password ? 'PRESENT' : 'MISSING',
    timestamp: new Date().toISOString()
  });

  try {
    const { email, password } = req.body;

    // Validation
    if (!email) {
      console.log('AuthRoutes: Login failed - missing email');
      return res.status(400).json({
        error: 'Email is required',
        field: 'email',
        timestamp: new Date().toISOString()
      });
    }

    if (!password) {
      console.log('AuthRoutes: Login failed - missing password');
      return res.status(400).json({
        error: 'Password is required',
        field: 'password',
        timestamp: new Date().toISOString()
      });
    }

    console.log('AuthRoutes: Validation passed, looking up user...');

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('AuthRoutes: Login failed - user not found:', email);
      return res.status(400).json({
        error: 'Invalid email or password',
        timestamp: new Date().toISOString()
      });
    }

    console.log('AuthRoutes: User found, verifying password...');

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('AuthRoutes: Login failed - invalid password for user:', email);
      return res.status(400).json({
        error: 'Invalid email or password',
        timestamp: new Date().toISOString()
      });
    }

    console.log('AuthRoutes: Password verified, generating tokens...');

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    console.log('AuthRoutes: Tokens generated successfully');

    // Return user data (excluding password)
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name
    };

    console.log('AuthRoutes: Login successful for user:', userData.email);
    res.json({
      accessToken,
      refreshToken,
      user: userData,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('AuthRoutes: Login error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      error: 'Internal server error during login',
      timestamp: new Date().toISOString()
    });
  }
});

// Token refresh route
router.post('/refresh', async (req, res) => {
  console.log('AuthRoutes: POST /refresh - Token refresh request received');
  console.log('AuthRoutes: Request body:', {
    refreshToken: req.body.refreshToken ? 'PRESENT' : 'MISSING',
    timestamp: new Date().toISOString()
  });

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      console.log('AuthRoutes: Token refresh failed - missing refresh token');
      return res.status(400).json({
        error: 'Refresh token is required',
        timestamp: new Date().toISOString()
      });
    }

    console.log('AuthRoutes: Verifying refresh token...');
    const decoded = verifyRefreshToken(refreshToken);
    console.log('AuthRoutes: Refresh token verified, user ID:', decoded.id);

    // Generate new access token
    const accessToken = generateAccessToken(decoded.id);
    console.log('AuthRoutes: New access token generated');

    res.json({
      accessToken,
      message: 'Token refreshed successfully'
    });

  } catch (error) {
    console.error('AuthRoutes: Token refresh error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(401).json({
      error: 'Invalid refresh token',
      timestamp: new Date().toISOString()
    });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  console.log('AuthRoutes: POST /logout - Logout request received');
  res.json({
    message: 'Logged out successfully',
    timestamp: new Date().toISOString()
  });
});

console.log('AuthRoutes: Module loaded successfully');
module.exports = router;