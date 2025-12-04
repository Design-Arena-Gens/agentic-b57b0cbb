const mongoose = require('mongoose');

const connectDatabase = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('Missing MongoDB connection string');
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};

module.exports = connectDatabase;
