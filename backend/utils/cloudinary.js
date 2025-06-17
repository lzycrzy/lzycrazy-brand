import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



export const uploadToCloudinary = async (filePath, folderName = 'user_uploads') => {
  try {
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set');
    console.log('API secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set');
    console.log('Uploading file:', filePath);

    // Get file extension to determine if it's a video
    const ext = path.extname(filePath).toLowerCase();
    const isVideo = ['.mp4', '.mov', '.avi', '.mkv'].includes(ext);

    let result;

    if (isVideo) {
      // Upload large video using chunked upload
       result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        folder: folderName,
      });
    } else {
      // Upload small images normally
      result = await cloudinary.uploader.upload(filePath, {
        folder: folderName,
        resource_type: 'auto', 
        width: 500,
        height: 500,
        crop: 'limit',
        quality: 'auto:good',
        
      });
    }

    // Delete local file after upload
    await fs.unlink(filePath);
    console.log('File uploaded and local file deleted');

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    try {
      await fs.unlink(filePath);
      console.log('Local file deleted after failed upload');
    } catch (unlinkError) {
      console.error('Error deleting local file:', unlinkError);
    }
    throw error;
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