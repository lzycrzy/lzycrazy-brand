import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnection from './dataBase/dbConnection.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import categoryRoutes from './router/category.route.js';
import serviceRoutes from './router/service.routes.js';
import imagesRoute from './router/cloudinaryRoutes.js';
import ErrorHandler from './middlewares/error.middleware.js';
import newsRoute from './router/news.route.js';
//--importing cloudinary configuration
// This is where you would configure Cloudinary for file uploads
import './utils/cloudinary.js';
//--importing helmet for security headers
// Helmet helps secure Express apps by setting various HTTP headers
import helmet from 'helmet';

//--importing routes
import userRoutes from './router/user.route.js';
import aboutRoutes from './router/user.about.js';
import adminRoutes from './router/admin.route.js';
import postRoutes from './router/user.post.routes.js'
import hiringRoutes from './router/hiring.route.js';

//--env file configuration
// This loads environment variables from a .env file into process.env
dotenv.config(); 

//--creating an express app instance
// This is the main application object for your Express server
const app = express();

//--configuring security headers
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
  })
);

//--configuring CORS
// This allows requests from the specified origins and enables credentials
app.use(
  cors({
    origin: [
              process.env.FRONTEND_URL || 'http://localhost:5173', 
             process.env.DASHBOARD_URL || 'http://localhost:5174'
            ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  }),
);

app.use(cookieParser()); //--for accessing cokkies--
app.use(express.json({ limit: '500mb' })); //--for parsing JSON bodies
app.use(express.urlencoded({ limit: '500mb', extended: true })); //--for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true })); 

//--setting up routes
app.use('/api/v1/users', userRoutes);  //--user routes
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users/about', aboutRoutes); //--user about routes
app.use('/api/v1/admin', adminRoutes);  //--admin routes
app.use('/api/v1', newsRoute);  //--admin routes

app.use('/api/v1/categories', categoryRoutes); //--category routes
app.use('/api/v1/services', serviceRoutes); //--service routes
app.use('/api/v1/image', imagesRoute); //--service routes
app.use('/api/v1/hiring', hiringRoutes);

dbConnection(); 

// app.use((err, req, res, next) => {
//   console.error("🔥 Uncaught error:", err);
//   res.status(500).json({ message: "Unexpected server error" });
// });

app.use(errorMiddleware); //--error handling middleware

export default app;
