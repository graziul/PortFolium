const { spawn } = require('child_process');

console.log('Checking MongoDB installation and status...\n');

// Check if MongoDB is installed
const checkMongoDB = () => {
  return new Promise((resolve) => {
    const mongod = spawn('mongod', ['--version'], { stdio: 'pipe' });
    
    let output = '';
    mongod.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    mongod.on('close', (code) => {
      if (code === 0) {
        console.log('✅ MongoDB is installed');
        console.log('Version info:', output.split('\n')[0]);
        resolve(true);
      } else {
        console.log('❌ MongoDB is not installed or not in PATH');
        resolve(false);
      }
    });
    
    mongod.on('error', () => {
      console.log('❌ MongoDB is not installed or not in PATH');
      resolve(false);
    });
  });
};

// Check if MongoDB service is running
const checkMongoService = () => {
  return new Promise((resolve) => {
    const mongo = spawn('mongo', ['--eval', 'db.runCommand("ping")'], { stdio: 'pipe' });
    
    mongo.on('close', (code) => {
      if (code === 0) {
        console.log('✅ MongoDB service is running');
        resolve(true);
      } else {
        console.log('❌ MongoDB service is not running');
        resolve(false);
      }
    });
    
    mongo.on('error', () => {
      console.log('❌ MongoDB service is not running');
      resolve(false);
    });
  });
};

const main = async () => {
  const isInstalled = await checkMongoDB();
  
  if (isInstalled) {
    const isRunning = await checkMongoService();
    
    if (!isRunning) {
      console.log('\n📋 To start MongoDB:');
      console.log('Windows: net start MongoDB');
      console.log('macOS: brew services start mongodb-community');
      console.log('Linux: sudo systemctl start mongod');
    }
  } else {
    console.log('\n📋 To install MongoDB:');
    console.log('Visit: https://docs.mongodb.com/manual/installation/');
  }
};

main().catch(console.error);