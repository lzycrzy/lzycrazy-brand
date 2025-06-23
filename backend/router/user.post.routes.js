import express from 'express';
import { addComment, likePost } from '../controllers/user.controller.js';

import {
  isAuthenticated
} from '../middlewares/auth.middleware.js';
const router = express.Router();
router.post('/:id/comment',isAuthenticated, addComment);
router.post('/:id/like',isAuthenticated, likePost);
export default router;
