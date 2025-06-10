import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnection from './dataBase/dbConnection.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

// import routes
import userRoutes from './router/user.route.js';
import aboutRoutes from './router/user.about.js';
import adminRoutes from './router/admin.route.js';

//--env file configuration
dotenv.config();

const app = express();

import './utils/cloudinary.js';

//-- Security Headers
import helmet from 'helmet';
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
  })
);

//-- CORS Configuration
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

//-- Middleware
app.use(cookieParser()); //--for accessing cookies--
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

//-- Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/users/about', aboutRoutes);
app.use('/api/v1/admin', adminRoutes); // <-- Uncomment and enable this line

//-- Database Connection
dbConnection();

//-- Error Middleware (should be last)
app.use(errorMiddleware);

//-- Test Route (Optional - for debugging)
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

export default app;