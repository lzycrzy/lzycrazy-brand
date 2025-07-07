import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Original function for uploading from file path
export const uploadToCloudinary = async (filePath, folderName = 'user_uploads') => {
  try {
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set');
    console.log('API secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set');
    console.log('Uploading file:', filePath);

    // Get file extension to determine if it's a video
    const ext = path.extname(filePath).toLowerCase();
    const isVideo = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv'].includes(ext);

    let result;

    if (isVideo) {
      // Upload video with better optimization
      result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        folder: folderName,
        chunk_size: 6000000, // 6MB chunks for better upload reliability
        eager: [
          { width: 300, height: 300, crop: 'pad' },
          { width: 160, height: 100, crop: 'crop', gravity: 'south' }
        ],
        eager_async: true,
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
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
    console.log(filePath);
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

// New function for uploading video from buffer (for form uploads)
export const uploadVideoFromBuffer = async (buffer, fileName, folderName = 'hiring_videos') => {
  return new Promise((resolve, reject) => {
    console.log('Uploading video from buffer to Cloudinary...');
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set');
    console.log('API secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: folderName,
        public_id: `${folderName}_${Date.now()}_${fileName.split('.')[0]}`,
        chunk_size: 6000000, // 6MB chunks for better upload reliability
        eager: [
          { width: 300, height: 300, crop: 'pad' },
          { width: 160, height: 100, crop: 'crop', gravity: 'south' }
        ],
        eager_async: true,
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ],
        // Add some basic video optimization
        video_codec: 'auto',
        format: 'mp4'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary video upload error:', error);
          reject(error);
        } else {
          console.log('Video uploaded successfully:', result.secure_url);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            duration: result.duration,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height
          });
        }
      }
    );
    
    uploadStream.end(buffer);
  });
};

// New function for uploading image from buffer
export const uploadImageFromBuffer = async (buffer, fileName, folderName = 'user_uploads') => {
  return new Promise((resolve, reject) => {
    console.log('Uploading image from buffer to Cloudinary...');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: folderName,
        public_id: `${folderName}_${Date.now()}_${fileName.split('.')[0]}`,
        width: 500,
        height: 500,
        crop: 'limit',
        quality: 'auto:good',
        format: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary image upload error:', error);
          reject(error);
        } else {
          console.log('Image uploaded successfully:', result.secure_url);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height
          });
        }
      }
    );
    
    uploadStream.end(buffer);
  });
};

// Enhanced function to delete from cloudinary (handles both images and videos)
export const deleteFromCloudinary = async (imageUrl, resourceType = 'auto') => {
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

    // Determine resource type if not specified
    if (resourceType === 'auto') {
      // Try to determine from URL or folder name
      if (folder.includes('video') || imageUrl.includes('/video/')) {
        resourceType = 'video';
      } else {
        resourceType = 'image';
      }
    }

    const result = await cloudinary.uploader.destroy(fullPublicId, {
      resource_type: resourceType
    });
    
    console.log(`${resourceType} deleted from Cloudinary:`, result);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return null;
  }
};

// New function specifically for deleting videos
export const deleteVideoFromCloudinary = async (videoUrl) => {
  return await deleteFromCloudinary(videoUrl, 'video');
};

// Function to delete using public_id directly
export const deleteByPublicId = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    
    console.log(`${resourceType} deleted from Cloudinary by public_id:`, result);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary by public_id:', error);
    return null;
  }
};

// Function to get video info
export const getVideoInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'video'
    });
    
    return {
      url: result.secure_url,
      duration: result.duration,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      createdAt: result.created_at
    };
  } catch (error) {
    console.error('Error getting video info:', error);
    return null;
  }
};

// Function to generate video thumbnail
export const generateVideoThumbnail = async (publicId, options = {}) => {
  try {
    const {
      width = 300,
      height = 300,
      crop = 'fill',
      gravity = 'auto',
      quality = 'auto'
    } = options;

    const thumbnailUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      transformation: [
        { width, height, crop, gravity, quality },
        { format: 'jpg' }
      ]
    });

    return thumbnailUrl;
  } catch (error) {
    console.error('Error generating video thumbnail:', error);
    return null;
  }
};

export default cloudinary;