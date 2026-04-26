const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * Connect to In-Memory MongoDB automatically
 * - Perfect for demos/portfolios when you don't want to configure Atlas.
 * - Auto-seeds the database on startup.
 */
const connectDB = async () => {
  try {
    console.log('🔄 Starting In-Memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri, {
      maxPoolSize: 10,
    });
    
    console.log(`✅ In-Memory MongoDB Connected: ${uri}`);
    
    // Auto-seed the memory database
    require('../seed_memory');
  } catch (error) {
    console.error(`❌ In-Memory MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
