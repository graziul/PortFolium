const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

console.log('Auth Utils: Loading auth utility functions...');

/**
 * Generate access token
 * @param {string} userId - User ID
 * @returns {string} - JWT access token
 */
const generateAccessToken = (userId) => {
  console.log('Auth Utils: Generating access token for user:', userId);
  try {
    const token = jwt.sign(
      { id: userId },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    console.log('Auth Utils: Access token generated successfully');
    return token;
  } catch (error) {
    console.error('Auth Utils: Error generating access token:', error);
    throw error;
  }
};

/**
 * Generate refresh token
 * @param {string} userId - User ID
 * @returns {string} - JWT refresh token
 */
const generateRefreshToken = (userId) => {
  console.log('Auth Utils: Generating refresh token for user:', userId);
  try {
    const token = jwt.sign(
      { id: userId },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    console.log('Auth Utils: Refresh token generated successfully');
    return token;
  } catch (error) {
    console.error('Auth Utils: Error generating refresh token:', error);
    throw error;
  }
};

/**
 * Verify access token
 * @param {string} token - JWT access token
 * @returns {object} - Decoded token payload
 */
const verifyAccessToken = (token) => {
  console.log('Auth Utils: Verifying access token');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Auth Utils: Access token verified successfully for user:', decoded.id);
    return decoded;
  } catch (error) {
    console.error('Auth Utils: Error verifying access token:', error.message);
    throw error;
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {object} - Decoded token payload
 */
const verifyRefreshToken = (token) => {
  console.log('Auth Utils: Verifying refresh token');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Auth Utils: Refresh token verified successfully for user:', decoded.id);
    return decoded;
  } catch (error) {
    console.error('Auth Utils: Error verifying refresh token:', error.message);
    throw error;
  }
};

console.log('Auth Utils: All auth utility functions loaded successfully');

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};