const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/payrecover';
        
        await mongoose.connect(mongoURI);
        
        console.log(' MongoDB Connected Successfully!');
        console.log(' Database:', mongoose.connection.db.databaseName);
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log(' MongoDB disconnected');
        });

    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        
        // Fallback to in-memory MongoDB if Atlas fails
        if (process.env.NODE_ENV !== 'production') {
            console.log('Falling back to in-memory MongoDB...');
            try {
                const { MongoMemoryServer } = require('mongodb-memory-server');
                const mongoServer = await MongoMemoryServer.create();
                const mongoUri = mongoServer.getUri();
                await mongoose.connect(mongoUri);
                console.log('In-Memory MongoDB Connected!');
            } catch (fallbackError) {
                console.error('Fallback failed:', fallbackError.message);
                process.exit(1);
            }
        } else {
            process.exit(1);
        }
    }
};

module.exports = connectDB;