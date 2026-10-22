import 'dotenv/config';
import { connectDatabase } from './config/database.js';
import { app } from './app.js';
if (process.env.NODE_ENV !== 'test') {
    const port = Number(process.env.PORT || 5000);
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is missing. Copy server/.env.example to server/.env');
        process.exit(1);
    }
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        console.error('JWT_SECRET must have at least 32 characters');
        process.exit(1);
    }
    try {
        await connectDatabase();
        console.log('MongoDB connected');
        app.listen(port, () => console.log(`Dakshayani API listening on http://localhost:${port}`));
    }
    catch (e) {
        console.error('MongoDB connection failed:', e.message);
        process.exit(1);
    }
}
