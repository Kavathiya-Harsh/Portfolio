import mongoose from 'mongoose';

let cachedConnection = null;

const connectToDatabase = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    try {
        cachedConnection = await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('Connected to MongoDB Atlas');
        return cachedConnection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export default connectToDatabase;
