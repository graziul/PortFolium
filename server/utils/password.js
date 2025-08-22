const bcryptjs = require('bcryptjs');

console.log('Password Utils: Loading password utility functions...');

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds (default: 10)
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password, saltRounds = 10) => {
  console.log('Password Utils: Hashing password with salt rounds:', saltRounds);
  try {
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    console.log('Password Utils: Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    console.error('Password Utils: Error hashing password:', error);
    throw error;
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} - True if passwords match
 */
const comparePassword = async (password, hashedPassword) => {
  console.log('Password Utils: Comparing password with hash');
  try {
    const isMatch = await bcryptjs.compare(password, hashedPassword);
    console.log('Password Utils: Password comparison result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Password Utils: Error comparing password:', error);
    throw error;
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and errors
 */
const validatePassword = (password) => {
  console.log('Password Utils: Validating password strength for password type:', typeof password);
  const errors = [];

  if (!password) {
    console.log('Password Utils: Password is missing or empty');
    errors.push('Password is required');
  } else {
    console.log('Password Utils: Checking password requirements for length:', password.length);
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
  }

  const isValid = errors.length === 0;
  console.log('Password Utils: Password validation result:', { isValid, errorCount: errors.length, errors });

  return {
    isValid,
    errors
  };
};

/**
 * Check password strength level
 * @param {string} password - Password to check
 * @returns {string} - Strength level: 'weak', 'medium', 'strong'
 */
const getPasswordStrength = (password) => {
  console.log('Password Utils: Checking password strength');

  if (!password) return 'weak';

  let score = 0;

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety checks
  if (/(?=.*[a-z])/.test(password)) score++;
  if (/(?=.*[A-Z])/.test(password)) score++;
  if (/(?=.*\d)/.test(password)) score++;
  if (/(?=.*[@$!%*?&])/.test(password)) score++;

  let strength;
  if (score < 3) {
    strength = 'weak';
  } else if (score < 5) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  console.log('Password Utils: Password strength:', strength, 'Score:', score);
  return strength;
};

console.log('Password Utils: All utility functions loaded successfully');
console.log('Password Utils: Exporting functions:', {
  hashPassword: typeof hashPassword,
  comparePassword: typeof comparePassword,
  validatePassword: typeof validatePassword,
  getPasswordStrength: typeof getPasswordStrength
});

module.exports = {
  hashPassword,
  comparePassword,
  validatePassword,
  getPasswordStrength
};