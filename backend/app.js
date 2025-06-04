import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dbConnection from './dataBase/dbConnection.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

// import routes
import userRoutes from './router/user.route.js';
import firebaseAuthRoutes from './router/firebase.auth.route.js';

dotenv.config(); //--

const app = express();

//--

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL, 'http://localhost:8080', 'http://127.0.0.1:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use(cookieParser()); //--for accessing cokkies--
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ extended: true })); //--

// File upload handling is now done in individual routes using multer

//--

//--
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth/firebase', firebaseAuthRoutes);

dbConnection(); //--
app.use(errorMiddleware); //--

export default app;
