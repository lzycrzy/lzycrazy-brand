import express from 'express'
import { capturePayment, verifyPayment } from '../controllers/payment.controller.js';
const router = express.Router();

router.route('/capture').post(capturePayment).post(verifyPayment)

export default router;