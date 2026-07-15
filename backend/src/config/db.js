const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is required in environment variables');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log('MongoDB connected');
};

module.exports = connectDB;
