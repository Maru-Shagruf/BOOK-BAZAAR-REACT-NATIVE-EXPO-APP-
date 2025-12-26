import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import swapOfferRoutes from './routes/swapOfferRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const allowedOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: false
  })
);

// Serve uploaded images as static files FIRST
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes base: /api
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api', swapOfferRoutes);

// Error handler
app.use(errorHandler);

export default app;
