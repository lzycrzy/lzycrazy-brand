import express from 'express';
import {
    isAuthenticated,
    authorizeRoles,
  } from '../middlewares/auth.middleware.js';
import { getUserAbout, updateUserAbout } from '../controllers/userAboutController.js';

const router = express.Router();

router.get('/',isAuthenticated, getUserAbout);
router.put('/',isAuthenticated, updateUserAbout);

export default router;
