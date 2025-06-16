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



export const uploadToCloudinary = async (filePath, folderName = 'admin_profiles') => {
  try {
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set');
    console.log('Uploading file:', filePath);

    const ext = path.extname(filePath).toLowerCase();
    const isVideo = ['.mp4', '.mov', '.avi', '.mkv'].includes(ext);

    let result;

    if (isVideo) {
      result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',  // ❗ Force video here
        folder: folderName,
       
      });
    } else {
      result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'image',  // ❗ Force image here
        folder: folderName,
        width: 500,
        height: 500,
        crop: 'limit',
        quality: 'auto:good',
      });
    }

    console.log('Cloudinary Upload Result:', result); // ✅ Debug log
    console.log('Cloudinary upload result:', result);
if (!result || !result.secure_url) {
  console.error('Upload failed or no URL returned.');
  return res.status(500).json({ message: 'Upload failed' });
}
    console.log("error")

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn('Safe unlink failed (may be already deleted):', err.message);
    }
    console.log('File uploaded and local file deleted');

    return result?.secure_url || null;
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