import ListModel from '../models/Listing.js'
import { userModel } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { formatDate } from '../utils/formatDate.js';
import { getCoordinates } from '../utils/getLatitudeAndLongitude.js';
export const getAllListing = async (req, res) => {
    try {
        const response = await ListModel.find();

        return res.status(200).json({message: 'Total Listing', response});
    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
          message: "Error in fetching all listrings",
          errror: error.message
        })
    }
}
export const getUserListing = async (req, res) => {
    try {
      const userId = req.user._id;

      const user = await userModel.find(userId).populate('productListed');
      return res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
          message: "Error in fetching listings",
          error: error.message
        })
    }
}

export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      brand,
      price,
      state,
      city,
      neighbourhood,
      features,
      category,
      subCategory,
      payment,
      photos
    } = req.body;

    let user = req.user;

    const parsedImages = typeof photos === 'string' ? JSON.parse(photos): photos
    console.log(parsedImages);
    
    const coordinates = await getCoordinates(city, state);

    const location = {
      city,
      state,
      neighbourhood,
      coordinates: coordinates.error
        ? [0, 0]
        : coordinates,
    };

    const parsedFeatures = typeof features === 'string'
      ? JSON.parse(features)
      : features;

    const userPayload = {
        name: user.fullName,
        memberSince: formatDate(user.createdAt)
    }

    const expiryDate = formatDate(new Date(Date.now() + 30*24*60*60*1000))
      
    const newProductListing = ListModel({
      title,
      description: description || '',
      category: category,
      subcategory: subCategory,
      brand,
      price: price ? price.replace(/,/g, '') : '',
      images: parsedImages,
      state,
      city,
      features: parsedFeatures,
      location,
      postedBy: userPayload,
      isExpired: false,
      expiryDate: expiryDate
    });

    await newProductListing.save();

    const userDetails = await userModel.findByIdAndUpdate(user._id, {
        $push: {
          productListed: newProductListing._id
        }
    })

    user = await userModel.findById(user._id);
    console.log(user);
    return res.status(201).json({
      success: true,
      freeLimit: true,
      message: 'Product listed successfully',
      data: newProductListing,
      userDetails
    });
  } catch (error) {
    console.error('Create Listing Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};


export const updateViews = async (req, res) => {
  try {
    const userId = req.user._id;
    const listingId = req.params.id;

    const listing = await ListModel.findByIdAndUpdate(listingId, {
      $push: {
        views: {
          userId
        }
      }
    })

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found."
      })
    }

    return res.status(200).json({
      success: true,
      message: "Listing views updated"
    })
  } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      })
  }
}