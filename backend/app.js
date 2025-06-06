import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnection from './dataBase/dbConnection.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

// import routes
import userRoutes from './router/user.route.js';
import adminRoutes from './router/admin.route.js';

//--env file configuration
dotenv.config(); 

const app = express();
import './utils/cloudinary.js';
//--
import helmet from 'helmet';

app.use(
  helmet({
    crossOriginOpenerPolicy: false // disables the COOP header
  })
);

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use(cookieParser()); //--for accessing cokkies--
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ extended: true })); //--

// File upload handling is now done in individual routes using multer

//--

//--

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);

dbConnection(); //--
app.use(errorMiddleware); //--

export default app;
