// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { errorMiddleware } from './middlewares/error.middleware.js';

// Route imports
import userRoutes from './router/user.route.js';
import postRoutes from './router/user.post.routes.js';
import aboutRoutes from './router/user.about.js';
import adminRoutes from './router/admin.route.js';
import newsRoute from './router/news.route.js';
import categoryRoutes from './router/category.route.js';
import serviceRoutes from './router/service.routes.js';
import imagesRoute from './router/cloudinaryRoutes.js';
import hiringRoutes from './router/hiring.route.js';
import categoryListingRoute from './router/listing.route.js';
import paymentRoutes from './router/payment.route.js';
import tempAssetRoutes from './router/temp.asset.route.js';
import BusinessChatRoutes from './router/businesschat.route.js'

import './utils/cloudinary.js';

dotenv.config();

const app = express();

app.use(
  helmet({
    crossOriginOpenerPolicy: false,
  })
);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      process.env.DASHBOARD_URL || 'http://localhost:5174',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users/about', aboutRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', newsRoute);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/image', imagesRoute);
app.use('/api/v1/hiring', hiringRoutes);
app.use('/api/v1/listing', categoryListingRoute);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/assets', tempAssetRoutes);
app.use('/api/v1/message', BusinessChatRoutes);

// Error handler
app.use(errorMiddleware);

export default app;
