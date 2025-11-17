// config/database.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const mongoURI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/codementor';

  if (!mongoURI) {
    console.error('❌ MONGO_URI is missing in .env file.');
    process.exit(1);
  }

  try {
    // Modern mongoose (v6+) does not require extra config options
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`📦 DB Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }

  // Connection events (helps you debug)
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB Disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB Reconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Error:', err);
  });
};

module.exports = connectDB;
