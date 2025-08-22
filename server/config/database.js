const mongoose = require('mongoose');

console.log('Database: Loading database configuration...');

let isConnected = false;

const connectDB = async () => {
  console.log('Database: Attempting to connect to MongoDB...');
  
  if (isConnected) {
    console.log('Database: Already connected to MongoDB');
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolium';
    console.log('Database: Connection string:', mongoURI);

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('Database: Using connection options:', options);

    await mongoose.connect(mongoURI, options);
    
    isConnected = true;
    console.log('Database: Successfully connected to MongoDB');
    console.log('Database: Connection state:', mongoose.connection.readyState);
    
    mongoose.connection.on('error', (err) => {
      console.error('Database: MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Database: MongoDB disconnected');
      isConnected = false;
    });

  } catch (error) {
    console.error('Database: Failed to connect to MongoDB:', error);
    console.error('Database: Error details:', error.message);
    isConnected = false;
    throw error;
  }
};

const disconnectDB = async () => {
  console.log('Database: Attempting to disconnect from MongoDB...');
  
  if (!isConnected) {
    console.log('Database: Not connected to MongoDB');
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Database: Successfully disconnected from MongoDB');
  } catch (error) {
    console.error('Database: Error disconnecting from MongoDB:', error);
    throw error;
  }
};

const getConnectionStatus = () => {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name
  };
};

console.log('Database: Configuration loaded successfully');
console.log('Database: Exporting functions:', {
  connectDB: typeof connectDB,
  disconnectDB: typeof disconnectDB,
  getConnectionStatus: typeof getConnectionStatus
});

module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus
};