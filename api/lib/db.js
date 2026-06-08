import mongoose from 'mongoose';
import dns from 'dns';

let cachedConnection = null;

/**
 * Attempts MongoDB connection with fallback strategies:
 * 1. Try with default DNS (uses mongodb+srv:// SRV lookup)
 * 2. If SRV fails, retry with Google Public DNS (8.8.8.8 / 8.8.4.4)
 * 3. If still failing, try direct connection string format (non-SRV)
 */
const connectToDatabase = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    // Reset stale cached connection
    cachedConnection = null;

    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    const connectOptions = {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        retryWrites: true,
    };

    // Strategy 1: Try default DNS with the SRV URI
    try {
        cachedConnection = await mongoose.connect(MONGODB_URI, connectOptions);
        console.log('✅ Connected to MongoDB Atlas (default DNS)');
        return cachedConnection;
    } catch (error) {
        console.warn('⚠️  Default DNS failed:', error.message);
    }

    // Strategy 2: Switch to Google Public DNS and retry SRV
    try {
        dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
        console.log('🔄 Retrying with Google/Cloudflare public DNS...');
        cachedConnection = await mongoose.connect(MONGODB_URI, connectOptions);
        console.log('✅ Connected to MongoDB Atlas (public DNS)');
        return cachedConnection;
    } catch (error) {
        console.warn('⚠️  Public DNS also failed:', error.message);
    }

    // Strategy 3: Convert SRV URI to direct connection string
    try {
        // mongodb+srv://user:pass@cluster.xxx.mongodb.net/...
        // → mongodb://user:pass@cluster-shard-00-00.xxx.mongodb.net:27017,...
        const srvMatch = MONGODB_URI.match(
            /mongodb\+srv:\/\/([^@]+)@([^/]+)(\/.*)?/
        );
        if (srvMatch) {
            const [, credentials, host, rest = ''] = srvMatch;
            const baseDomain = host; // e.g. portfolio.g3sfcqe.mongodb.net
            const shardHosts = [0, 1, 2]
                .map(i => `${baseDomain.split('.')[0]}-shard-00-0${i}.${baseDomain.split('.').slice(1).join('.')}:27017`)
                .join(',');
            const directURI = `mongodb://${credentials}@${shardHosts}${rest}${rest.includes('?') ? '&' : '?'}ssl=true&authSource=admin&replicaSet=atlas-${baseDomain.split('.')[0]}-shard-0`;
            
            console.log('🔄 Trying direct connection (non-SRV)...');
            cachedConnection = await mongoose.connect(directURI, {
                ...connectOptions,
                directConnection: false,
            });
            console.log('✅ Connected to MongoDB Atlas (direct connection)');
            return cachedConnection;
        }
    } catch (error) {
        console.error('❌ Direct connection also failed:', error.message);
    }

    throw new Error(
        'Could not connect to MongoDB after all retry strategies. ' +
        'Please check: 1) Your MONGODB_URI is correct, 2) Your IP is whitelisted in MongoDB Atlas, ' +
        '3) Your network allows outbound connections on port 27017.'
    );
};

export default connectToDatabase;
