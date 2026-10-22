import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import publicRoutes from './routes/public.js';
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customer.js';
import adminRoutes from './routes/admin/index.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';
import { trustedOrigin } from './middlewares/origin.middleware.js';
const app = express();
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: [
      "https://dakshayani-restaurant-mn1k.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cors({ origin: (origin, callback) => !origin || origins.includes(origin) ? callback(null, true) : callback(new Error('CORS origin not allowed')), credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/api', trustedOrigin(origins));
app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many attempts. Try again later.' } });
const formLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many messages. Please try again later.' } });
app.use('/api/v1/inquiries', formLimit);
app.use('/api/v1/auth', authLimit, authRoutes);
app.use('/api/v1', publicRoutes);
app.use('/api/v1', customerRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use(notFound);
app.use(errorHandler);
export { app };
