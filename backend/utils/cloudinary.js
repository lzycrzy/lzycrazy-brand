import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath, folderName = 'admin_profiles') => {

  try {
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set');
    console.log('API secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set');
    console.log('Uploading file:', filePath);

    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME); 
    console.log('API key:', process.env.CLOUDINARY_API_KEY);
    console.log('API secret:', process.env.CLOUDINARY_API_SECRET);

    // Check if the file exists
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      width: 500,
      height: 500,
      crop: 'limit',
      quality: 'auto:good',
      format: 'jpg'
    });

    // Delete local file after successful upload
    await fs.unlink(filePath);
    console.log('File uploaded and local file deleted');

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    // Try to delete local file even if upload failed
    try {
      await fs.unlink(filePath);
      console.log('Local file deleted after failed upload');
    } catch (unlinkError) {
      console.error('Error deleting local file:', unlinkError);
    }
    
    throw error;
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// Function to delete image from cloudinary
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary')) {
      return null;
    }

    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const publicId = fileName.split('.')[0];
    const folder = urlParts[urlParts.length - 2];
    const fullPublicId = `${folder}/${publicId}`;

    const result = await cloudinary.uploader.destroy(fullPublicId);
    console.log('Image deleted from Cloudinary:', result);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return null;
  }
};