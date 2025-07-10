// import express from 'express';
// import { addComment, likePost } from '../controllers/user.controller.js';

// import {
//   isAuthenticated
// } from '../middlewares/auth.middleware.js';
// const router = express.Router();
// router.post('/:id/comment',isAuthenticated, addComment);
// router.post('/:id/like',isAuthenticated, likePost);
// export default router;
import express from 'express';
// import { addComment, likePost } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import {createPost,posts,likes,comments, likePost, commentPost} from "../controllers/postController.js";
import upload from "../middlewares/multer.middleware.js"

const router = express.Router();

// // Route to add a comment on a post
// router.post('/:id/comment', isAuthenticated, async (req, res) => {
//   try {
//     const postId = req.params.id;  // Post ID from the route
//     const { text } = req.body;  // Assuming the comment text is sent in the request body

//     if (!text || text.trim() === '') {
//       return res.status(400).json({ success: false, message: 'Comment text is required' });
//     }

//     const newComment = await addComment(postId, req.user.id, text);  // Pass the postId, userId, and comment text to controller
//     res.status(200).json({ success: true, comment: newComment });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Failed to add comment' });
//   }
// });

// // Route to like a post
// router.post('/:id/like', isAuthenticated, async (req, res) => {
//   try {
//     const postId = req.params.id;  // Post ID from the route

//     const likedPost = await likePost(postId, req.user.id);  // Pass postId and userId to the controller
//     res.status(200).json({ success: true, post: likedPost });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Failed to like post' });
//   }
// });
router
.get("/", posts)
.post("/createPost",upload.single("file"), createPost)
.get("/comments/:post_id", isAuthenticated, comments)
.get("/likes/:post_id", isAuthenticated, likes)
.post("/likePost/:post_id", isAuthenticated, likePost)
.post("/commentPost/:post_id", isAuthenticated, commentPost)


export default router;
