import express from 'express';
import { firebaseSocialLogin, verifyFirebaseToken } from '../controllers/firebase.auth.controller.js';

const router = express.Router();

// Firebase authentication routes
router.post('/social-login', firebaseSocialLogin);
router.post('/verify-token', verifyFirebaseToken);

export default router;
