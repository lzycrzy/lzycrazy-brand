import express from 'express';
import { deleteMessage, getConnectedBusinessPartner, getCurrentUserDetails, getMessages, markMessagesAsRead,blockUser, sendMessage, undreadMessage } from '../controllers/businesschat.controler.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
const router = express.Router();


router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/get/:id').get(isAuthenticated, getMessages);
router.route('/unread').get(isAuthenticated, undreadMessage);
router.route('/get-business-partner').post(isAuthenticated, getConnectedBusinessPartner);
router.route('/user/:userId').get(isAuthenticated, getCurrentUserDetails);
router.route('/delete/:messageId').delete(isAuthenticated, deleteMessage)
router.route('/read/:userId').patch(isAuthenticated, markMessagesAsRead)
router.route('/block/:userId').put(isAuthenticated, blockUser);
export default router;