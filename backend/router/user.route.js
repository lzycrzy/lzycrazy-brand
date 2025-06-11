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
  createPost,
  getPosts,
  getStories,
  uploadStory,
  resetPassword,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
  getFriendsList,
  getPendingRequests,
  searchUsers,
} from '../controllers/user.controller.js';

import {
  isAuthenticated
} from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';


// multer setup (example: storing files in 'uploads/' folder with original name)

const router = express.Router();

//friends
router.post('/friends/send/:targetId',  isAuthenticated, sendFriendRequest);
router.post('/friends/accept/:targetId',  isAuthenticated, acceptFriendRequest);
router.post('/friends/reject/:targetId',  isAuthenticated, rejectFriendRequest);
router.post('/friends/unfriend/:targetId',  isAuthenticated, unfriendUser);
router.get('/friends/list',  isAuthenticated, getFriendsList);
router.get('/friends/pending',  isAuthenticated, getPendingRequests);
router.get('/friends/search',  isAuthenticated, searchUsers);

// Public routes
router.post(
  '/register',
   // Use 'profileImage' to match frontend
  registerUser,
);

// Login routes
router.post('/login', loginUser);
router.post('/post', isAuthenticated, upload.single('media'), createPost);

router.post('/logout', logoutUser);
// Social login routes
router.post('/google-login',isAuthenticated, loginWithGoogle);
router.post('/facebook-login',isAuthenticated, loginWithFacebook);


//get posts
router.get('/posts', isAuthenticated, getPosts);

// Protected routes (any logged in user)
router.get('/me', isAuthenticated, getMyProfile);


//story
router.get('/story', isAuthenticated, getStories);
router.post('/story',isAuthenticated,upload.single('image'), uploadStory);

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
