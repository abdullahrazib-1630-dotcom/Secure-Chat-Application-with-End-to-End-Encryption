const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGO_URI is required');

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    autoIndex: process.env.NODE_ENV !== 'production',
  });
};

module.exports = connectDB;
