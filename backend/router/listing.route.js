import express from "express";
import { createListing, getAllListing, getUserListing } from "../controllers/listing.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import uploads from "../middlewares/multer.middleware.js";
const router = express.Router();

router.route('/').get(isAuthenticated, getAllListing);

router.route('/:userId').get(isAuthenticated, getUserListing);

router.route('/create').post(isAuthenticated, uploads.array('photos', 8), createListing);

export default router;