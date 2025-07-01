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
        console.log(error);
    }
}
export const getUserListing = async (req, res) => {
    try {
        
    } catch (error) {
        
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
      subCategory
    } = req.body;

    let user = req.user;
    const photos = req.files;

    if (!photos || photos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required.',
      });
    }

    if (user.productListed.length > 0) {

      return res.status(200).json({
        freeLimit: false,
        success: true,
        message: "You have out of free limit. Please pay amount"
      })

    }

    const coordinates = await getCoordinates(city, state);

    const location = {
      city,
      state,
      neighbourhood,
      coordinates: coordinates.error
        ? [0, 0]
        : coordinates,
    };

    const images = [];

    for (const file of photos) {
      const uploaded = await uploadToCloudinary(file.path, 'user_uploads');
      if (uploaded) {
        images.push({ url: uploaded }); // or include public_id if needed
      }
    }
    
    const parsedFeatures = typeof features === 'string'
      ? JSON.parse(features)
      : features;

    const userPayload = {
        name: user.fullName,
        memberSince: formatDate(user.createdAt),
        itemsListed: user.productListed.length+1
    }
      
    const newProductListing = ListModel({
      title,
      description: description || '',
      category: category,
      subcategory: subCategory,
      brand,
      price: price ? price.replace(/,/g, '') : '',
      images,
      state,
      city,
      features: parsedFeatures,
      location,
      postedBy: userPayload,
      isExpired: false,
      expiryDate: formatDate(new Date(Date.now() + 30*24*60*60*1000))
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
    });
  } catch (error) {
    console.error('Create Listing Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};


