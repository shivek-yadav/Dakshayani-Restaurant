
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

import {
  notFound,
  errorHandler,
} from './middlewares/error.middleware.js';

import { trustedOrigin } from './middlewares/origin.middleware.js';

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Define allowed frontend origins BEFORE using them.
const origins = [
  'https://dakshayani-restaurant-mn1k.vercel.app',
  'http://localhost:5173',
];

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Use ONE CORS configuration only.
app.use(
  cors({
    origin: origins,
    credentials: true,
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

// Body and cookie parsing
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Validate origins for protected cross-origin mutations
app.use('/api', trustedOrigin(origins));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});

// Rate limiting
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many attempts. Try again later.',
  },
});

const formLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many messages. Please try again later.',
  },
});

// API routes
app.use('/api/v1/inquiries', formLimit);

app.use('/api/v1/auth', authLimit, authRoutes);

app.use('/api/v1', publicRoutes);

app.use('/api/v1', customerRoutes);

app.use('/api/v1/admin', adminRoutes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

export { app };
