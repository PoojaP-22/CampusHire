import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017/campus-hire';

  try {
    const conn = await mongoose.connect(primaryUri || fallbackUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    if (primaryUri && primaryUri !== fallbackUri && conn.connection.host === '127.0.0.1') {
      console.warn('⚠️ Falling back to local MongoDB because the configured remote URI was unavailable.');
    }

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
    if (primaryUri && primaryUri !== fallbackUri) {
      try {
        const conn = await mongoose.connect(fallbackUri);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database Name: ${conn.connection.name}`);
        console.warn('⚠️ Remote MongoDB connection failed, so the app is using local MongoDB instead.');
        return;
      } catch (fallbackError) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        console.error(`❌ Local MongoDB fallback failed: ${fallbackError.message}`);
        process.exit(1); // Exit with failure
      }
    }

    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
