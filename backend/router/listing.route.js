import express from "express";
import { createListing, getAllListing, getListingResponse, getUserListing, updateViews } from "../controllers/listing.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route('/').get(isAuthenticated, getAllListing);

router.route('/my-adds').get(isAuthenticated, getUserListing);

router.route('/create').post(isAuthenticated, createListing);

router.route('/listing-response').get(isAuthenticated, getListingResponse);

router.route('/views/:id').post(isAuthenticated, updateViews);

export default router;