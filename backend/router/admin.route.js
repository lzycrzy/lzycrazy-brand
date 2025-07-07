import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  getAdminDashboard,
  updateAdminProfile,
  updateAdminPassword,
  forgotAdminPassword,
  resetAdminPassword,
  getAllUsersList,
  deleteSingleUser,
  getAllApplications,
  deleteApplication,
  createMarketPost,
  updateMarketPost,
  deleteMarketPost,
  getMarketPost
} from '../controllers/admin.controller.js';
import {
  isAuthenticatedAdmin,
  authorizeRolesAdimin,
} from '../middlewares/auth.middleware.admin.js';
import upload from '../middlewares/multer.middleware.js';
import { getAllEnquiries } from '../controllers/Enquiry.controller.js';
const router = express.Router();

// Public routes
// This route is for registering a new admin
router.post(
  '/register',
  upload.single('image'),
  registerAdmin,
);

router.get('/market-post', getMarketPost)
router.post('/market-post/create', upload.single('file'), createMarketPost);
router.put('/market-post/update/:id', upload.single('file'), updateMarketPost);
router.delete('/market-post/delete/:id', deleteMarketPost);

// Admin routes
router.post('/login', loginAdmin);
router.get('/logout', logoutAdmin);

// Protected routes
router.get('/me', isAuthenticatedAdmin, getAdminProfile);

// Protected routes (require authentication)
router.put('/profile/update', isAuthenticatedAdmin, updateAdminProfile);
router.put('/password/update', isAuthenticatedAdmin, updateAdminPassword);

// Password reset routes
router.post('/password/forgot', forgotAdminPassword);
router.put('/password/reset/:token', resetAdminPassword);

// Admin-only routes for User management Actions
router.get(
  '/dashboard',
  isAuthenticatedAdmin,
  authorizeRolesAdimin('admin'),
  getAdminDashboard,
);

router.get(
  '/userslist',
  isAuthenticatedAdmin,
  authorizeRolesAdimin('admin'),
  getAllUsersList,
);

router.delete(
  '/user/delete/:id',
  isAuthenticatedAdmin,
  authorizeRolesAdimin('admin'),
  deleteSingleUser,
);
router.get('/enquiry', isAuthenticatedAdmin, authorizeRolesAdimin('admin'), getAllEnquiries); 

router.get('/applications', isAuthenticatedAdmin, authorizeRolesAdimin('admin'), getAllApplications);

router.delete('/applications/:id', isAuthenticatedAdmin, authorizeRolesAdimin('admin'), deleteApplication);

export default router;
