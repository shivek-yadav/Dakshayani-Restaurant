import mongoose from 'mongoose';
export async function connectDatabase() {
    const uri = process.env.MONGO_URI;
    if (!uri)
        throw new Error('MONGO_URI is missing. Copy .env.example to .env.');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    return mongoose.connection;
}
