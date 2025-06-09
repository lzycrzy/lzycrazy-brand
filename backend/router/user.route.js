import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  loginWithGoogle,
  loginWithFacebook,
  getMyProfile,
  getAdminDashboard,
  getSuperAdminDashboard,
  getAllUsers,
  updateUser,
  updatePassword,
  forgotPassword,
  
  resetPassword,
} from '../controllers/user.controller.js';
import {
  isAuthenticated,
  authorizeRoles,
} from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import multer from 'multer';

// multer setup (example: storing files in 'uploads/' folder with original name)

const router = express.Router();

// Public routes
// authorizeRoles("superAdmin")
router.post(
  '/register',
  // isAuthenticated,  // uncomment if you want auth middleware
  // authorizeRoles('superAdmin'),
  upload.single('profileImage'),  // Use 'profileImage' to match frontend
  registerUser,
);

router.post('/login', loginUser);

router.post('/logout', logoutUser);
router.post('/google-login',isAuthenticated, loginWithGoogle);
router.post('/facebook-login',isAuthenticated, loginWithFacebook);

router.put('/updateMe', isAuthenticated, upload.single('photo'), updateUser);
// Protected routes (any logged in user)
router.get('/me', isAuthenticated, getMyProfile);

// Admin-only routes
router.get(
  '/admin/dashboard',
  isAuthenticated,
  authorizeRoles('admin'),
  getAdminDashboard,
);
router.get(
  '/admin/users',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllUsers,
);

// SuperAdmin-only routes
router.get(
  '/superadmin/dashboard',
  isAuthenticated,
  authorizeRoles('superAdmin'),
  getSuperAdminDashboard,
);
router.get(
  '/superadmin/users',
  isAuthenticated,
  authorizeRoles('superAdmin'),
  getAllUsers,
);

// Protected routes (require authentication)
router.put('/update', isAuthenticated, updateUser);
router.put('/password/update', isAuthenticated, updatePassword);

// Password reset routes
router.post('/password/forgot', forgotPassword);
router.post('/password/reset/:token', resetPassword);





export default router;
