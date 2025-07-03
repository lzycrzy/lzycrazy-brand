import express from 'express'
import { capturePayment, verifyPayment } from '../controllers/payment.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.route('/capture').post(capturePayment)
router.route('/verify').post(isAuthenticated, verifyPayment)

export default router;