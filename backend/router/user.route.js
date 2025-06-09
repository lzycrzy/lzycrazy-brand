import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  loginWithGoogle,
  loginWithFacebook,
  getMyProfile,
  updateUser,
  updatePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/user.controller.js';
import {
  isAuthenticated
} from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

// Public routes For user registration
router.post(
  '/register',
  upload.single('profileImage'),  // Use 'profileImage' to match frontend
  registerUser,
);

// User Login routes
router.post('/login', loginUser);
// User Logout route
router.post('/logout', logoutUser);
// Social login routes--google and facebook
router.post('/google-login',isAuthenticated, loginWithGoogle);
router.post('/facebook-login',isAuthenticated, loginWithFacebook);

// Protected routes (require authentication)
// Update user profile
router.put('/updateMe', isAuthenticated, upload.single('photo'), updateUser);

// Protected routes (any logged in user)
router.get('/me', isAuthenticated, getMyProfile);

// Protected routes (require authentication)
router.put('/update', isAuthenticated, updateUser);
router.put('/password/update', isAuthenticated, updatePassword);

// Password reset routes
router.post('/password/forgot', forgotPassword);
router.post('/password/reset/:token', resetPassword);

export default router;
