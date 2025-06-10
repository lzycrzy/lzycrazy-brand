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

  // getAdminDashboard,
  // getSuperAdminDashboard,
  // getAllUsers,
} from '../controllers/user.controller.js';
import {
  isAuthenticated,
  authorizeRoles,
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

// // SuperAdmin-only routes
// router.get(
//   '/superadmin/dashboard',
//   isAuthenticated,
//   authorizeRoles('superAdmin'),
//   getSuperAdminDashboard,
// );
// router.get(
//   '/superadmin/users',
//   isAuthenticated,
//   authorizeRoles('superAdmin'),
//   getAllUsers,
// );

// // Admin-only routes
// router.get(
//   '/admin/dashboard',
//   isAuthenticated,
//   authorizeRoles('admin'),
//   getAdminDashboard,
// );
// router.get(
//   '/admin/users',
//   isAuthenticated,
//   authorizeRoles('admin'),
//   getAllUsers,
// );

export default router;
