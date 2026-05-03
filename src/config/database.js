const mongoose = require('mongoose');
const config = require('./env');

async function connectDatabase() {
  if (!config.mongoUri) {
    throw new Error('MONGODB_URI is required to start the backend');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUri);
  console.log('MongoDB Atlas connected');
}

module.exports = connectDatabase;
