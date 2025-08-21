const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    console.log('Database: Attempting to connect to MongoDB...');
    
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolium';
    console.log('Database: Connection string:', connectionString);

    // Use only supported connection options for current Mongoose version
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      // Removed deprecated options: bufferMaxEntries, bufferCommands
    };

    console.log('Database: Using connection options:', options);

    await mongoose.connect(connectionString, options);
    
    console.log('Database: Successfully connected to MongoDB');
    console.log('Database: Connection state:', mongoose.connection.readyState);
    
    return true;
  } catch (error) {
    console.error('Database: Failed to connect to MongoDB:', error.message);
    console.error('Database: Error details:', {
      name: error.name,
      code: error.code,
      codeName: error.codeName
    });
    
    // Provide helpful error messages
    if (error.message.includes('ECONNREFUSED')) {
      console.error('Database: MongoDB service is not running. Please start MongoDB:');
      console.error('Database: Windows: net start MongoDB');
      console.error('Database: macOS: brew services start mongodb-community');
      console.error('Database: Linux: sudo systemctl start mongod');
    } else if (error.message.includes('not supported')) {
      console.error('Database: MongoDB connection option error - using updated options');
    }
    
    throw error;
  }
};

const disconnectDatabase = async () => {
  try {
    console.log('Database: Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Database: Successfully disconnected from MongoDB');
  } catch (error) {
    console.error('Database: Error disconnecting from MongoDB:', error.message);
    throw error;
  }
};

const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  const state = mongoose.connection.readyState;
  console.log('Database: Current connection state:', states[state] || 'unknown');
  return {
    state,
    status: states[state] || 'unknown',
    isConnected: state === 1
  };
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  getConnectionStatus
};