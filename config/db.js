const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/subscription-manager', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('⚠️  Please make sure MongoDB is running or update MONGODB_URI in .env file');
    console.error('💡 To start MongoDB locally: brew services start mongodb-community');
    console.error('💡 Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
    // Don't exit - let the server start but log the error
    // The app will still work but database operations will fail
  }
};

module.exports = connectDB;

