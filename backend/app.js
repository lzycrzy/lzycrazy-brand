import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnection from './dataBase/dbConnection.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

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
              process.env.FRONTEND_URL || 'https://lzycrazy-brand-frontend.netlify.app', 
             process.env.DASHBOARD_URL
            ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use(cookieParser()); //--for accessing cokkies--
app.use(express.json({ limit: '10mb' })); //--for parsing JSON bodies
app.use(express.urlencoded({ limit: '10mb', extended: true })); //--for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true })); 

//--setting up routes
app.use('/api/v1/users', userRoutes);  //--user routes
app.use('/api/v1/users/about', aboutRoutes); //--user about routes
app.use('/api/v1/admin', adminRoutes);  //--admin routes

//--connecting to the database
dbConnection(); //--

app.use(errorMiddleware); //--error handling middleware

export default app;
