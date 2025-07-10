import express from 'express';
// import { updatePost } from '../controllers/user.controller.js';
// import { uploadEditedImage } from '../controllers/user.controller.js';
// import {createPost, posts, comments,likes, likePost, commentPost} from '../controllers/postController.js';
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
  // createPost,
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
  storyView,
  getUserStories,
  getStoryViews,
  submitApplication,
  getMe,
  // likePost,
  // addComment,
  checkEmail
  // getAdminDashboard,
  // getSuperAdminDashboard,
  // getAllUsers,
} from '../controllers/user.controller.js';
import { createEnquiry } from '../controllers/Enquiry.controller.js';

import {
  isAuthenticated
} from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';


// multer setup (example: storing files in 'uploads/' folder with original name)

const router = express.Router();
//Post Routes
// router
// .post("/createPost", createPost)
// .post("/post", posts)
// .post("/comments/:post_id", isAuthenticated, comments)
// .post("/likes/:post_id", isAuthenticated, likes)
// .post("/likePost/:post_id", isAuthenticated, likePost)
// .post("/commentPost/:post_id", isAuthenticated, commentPost)
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
// router.put('/post/:postId', isAuthenticated, upload.single('media'), updatePost);

router.post('/logout', logoutUser);
// Social login routes
router.post('/google-login', loginWithGoogle);
router.post('/facebook-login',isAuthenticated, loginWithFacebook);

// Post routes
// router.post('/post', isAuthenticated, upload.array('media'), createPost);

// router.post("/", upload.single("file"), isAuthenticated, createPost);

// router.put('/post/:postId', isAuthenticated, upload.single('media'), updatePost);
router.get('/posts', isAuthenticated, getPosts);
// router.post('/upload-edited-image', isAuthenticated, upload.single('image'), uploadEditedImage);

// Protected routes (any logged in user)
router.get('/me', isAuthenticated, getMyProfile);
router.get('/getMe',isAuthenticated,  getMe);

//story
router.get('/story', isAuthenticated, getStories);
// router.post('/story',isAuthenticated,upload.single('image'), uploadStory);
router.post(
  '/story',
  isAuthenticated,
  upload.fields([
    { name: 'image', maxCount: 1 },  // for photo stories
    { name: 'media', maxCount: 1 },  // for video stories, or you can use 'video' if you prefer
  ]),
  uploadStory
);


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

//story
router.post('/story/view/:storyId', isAuthenticated,storyView )
router.get('/stories/view/:storyId', isAuthenticated, getStoryViews);
router.get('/story/view/:userId', isAuthenticated,getUserStories )



//aplicant
router.post('/hiring', upload.single('video'), submitApplication);

//enquiry
router.post('/enquiry', createEnquiry);
     
router.post('/company-id-by-email',checkEmail)


export default router;
