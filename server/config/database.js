const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @param {string} connectionString - MongoDB connection string
 * @returns {Promise} - Connection promise
 */
const connectDatabase = async (connectionString) => {
  try {
    console.log('Database: Attempting to connect to MongoDB...');
    console.log('Database: Connection string:', connectionString?.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    await mongoose.connect(connectionString, {
      // Remove deprecated options
      // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
    });
    
    console.log('Database: Successfully connected to MongoDB');
    
    // Set up connection event listeners
    mongoose.connection.on('error', (error) => {
      console.error('Database: MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('Database: MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('Database: MongoDB reconnected');
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('Database: Failed to connect to MongoDB:', error);
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 * @returns {Promise} - Disconnection promise
 */
const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('Database: Disconnected from MongoDB');
  } catch (error) {
    console.error('Database: Error disconnecting from MongoDB:', error);
    throw error;
  }
};

/**
 * Get database connection status
 * @returns {string} - Connection status
 */
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  getConnectionStatus
};