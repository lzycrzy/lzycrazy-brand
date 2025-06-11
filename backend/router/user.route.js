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
  updateMe,
  resetPassword,
} from '../controllers/user.controller.js';
import {
  isAuthenticated
} from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

// Public routes
router.post(
  '/register',
  upload.single('profileImage'),  // Use 'profileImage' to match frontend
  registerUser,
);

// Login routes
router.post('/login', loginUser);
// Logout route
router.post('/logout', logoutUser);
// Social login routes
router.post('/google-login',isAuthenticated, loginWithGoogle);
router.post('/facebook-login',isAuthenticated, loginWithFacebook);


// Protected routes (require authentication)
// Update user profile
router.put('/updateMe', isAuthenticated, upload.single('photo'), updateUser);

// Protected routes (any logged in user)
router.get('/me', isAuthenticated, getMyProfile);

// User profile update route
router.put('/updateMe', isAuthenticated, upload.single('photo'), updateMe);

// Protected routes (require authentication)
router.put('/update', isAuthenticated, updateUser);

// Update password route
router.put('/password/update', isAuthenticated, updatePassword);

// Password reset routes
router.post('/password/forgot', forgotPassword);
// Reset password route
router.post('/password/reset/:token', resetPassword);

export default router;
