import express from "express";
import { createListing, getAllListing, getListingResponse, getUserListing, updateListing, updateViews, renewListing } from "../controllers/listing.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route('/').get(isAuthenticated, getAllListing);

router.route('/my-adds').get(isAuthenticated, getUserListing);

router.route('/create').post(isAuthenticated, createListing);

router.route('/update').put(isAuthenticated, updateListing)

router.route('/listing-response').get(isAuthenticated, getListingResponse);

router.route('/views/:id').post(isAuthenticated, updateViews);

router.route('/renew/:id').put(isAuthenticated, renewListing);

export default router;