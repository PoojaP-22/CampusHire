import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are no longer needed in Mongoose 6+
      // but kept for backward compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // Connection error handling
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB Connection Error: ${err}`);
    });

    // Disconnection handling
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected. Attempting to reconnect...');
    });

    // Successful reconnection
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB Reconnected');
    });

  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
