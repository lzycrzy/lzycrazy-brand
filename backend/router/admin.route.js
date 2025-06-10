// import express from 'express';
// import {
//   registerAdmin,
//   loginAdmin,
//   logoutAdmin,
//   getAdminProfile,
//   getAdminDashboard,
//   updateAdminProfile,
//   updateAdminPassword,
//   forgotAdminPassword,
//   resetAdminPassword,
//   getAllUsersList,
//   deleteSingleUser
// } from '../controllers/admin.controller.js';
// import {
//   isAuthenticatedAdmin,
//   authorizeRolesAdimin,
// } from '../middlewares/auth.middleware.admin.js';
// import upload from '../middlewares/multer.middleware.js';

// const router = express.Router();

// // Public routes
// // This route is for registering a new admin
// // authorizeRoles("Admin")
// router.post(
//   '/register',
//   isAuthenticatedAdmin,
//   authorizeRolesAdimin('Admin'),
//   upload.single('image'),
//   registerAdmin,
// );

// // Admin routes
// router.post('/login', loginAdmin);
// router.get('/logout', logoutAdmin);

// // Protected routes
// router.get('/me', isAuthenticatedAdmin, getAdminProfile);

// // Admin-only routes for User management Actions
// router.get(
//   '/admin/dashboard',
//   isAuthenticatedAdmin,
//   authorizeRolesAdimin('admin'),
//   getAdminDashboard,
// );
// router.get(
//   '/admin/userslist',
//   isAuthenticatedAdmin,
//   authorizeRolesAdimin('admin'),
//   getAllUsersList,
// );
// router.delete(
//   '/admin/user/delete/:id',
//   isAuthenticatedAdmin,
//   authorizeRolesAdimin('admin'),
//   deleteSingleUser,
// );

// // Protected routes (require authentication)
// router.put('/profile/update', isAuthenticatedAdmin, updateAdminProfile);
// router.put('/password/update', isAuthenticatedAdmin, updateAdminPassword);

// // Password reset routes
// router.post('/password/forgot', forgotAdminPassword);
// router.put('/password/reset/:token', resetAdminPassword);

// export default router;
