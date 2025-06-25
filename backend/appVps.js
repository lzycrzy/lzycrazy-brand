import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnection from './dataBase/dbConnection.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import categoryRoutes from './router/category.route.js';
import serviceRoutes from './router/service.routes.js';
import imagesRoute from './router/vpsUploadRoutes.js'; // ✅ Replaced Cloudinary with VPS
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import userRoutes from './router/user.route.js';
import aboutRoutes from './router/user.about.js';
import adminRoutes from './router/admin.route.js';
import postRoutes from './router/user.post.routes.js';

// Config setup
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security headers
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
  })
);

// CORS config
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5174',
      process.env.DASHBOARD_URL || 'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// ✅ Serve VPS-stored uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users/about', aboutRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/image', imagesRoute); // ✅ This now uses VPS routes

// DB and error middleware
dbConnection();
app.use(errorMiddleware);

export default app;
