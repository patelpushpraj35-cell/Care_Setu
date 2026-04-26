const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas with retry logic
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
    console.error('❌  MONGO_URI is pointing to localhost. Please use a MongoDB Atlas connection string.');
    console.error('   Get a free cluster at: https://cloud.mongodb.com');
    process.exit(1);
  }

  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
  };

  let retries = 3;
  while (retries > 0) {
    try {
      const conn = await mongoose.connect(uri, options);
      console.log(`✅  MongoDB Atlas Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries -= 1;
      if (retries === 0) {
        console.error(`❌  MongoDB Connection Failed after 3 attempts: ${error.message}`);
        process.exit(1);
      }
      console.warn(`⚠️   MongoDB connection attempt failed. Retrying... (${retries} left)`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
};

module.exports = connectDB;
