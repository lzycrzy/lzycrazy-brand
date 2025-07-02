import News from '../models/news.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import fs from 'fs/promises';

export const createNews = async (req, res) => {
  try {
    const { title, profileName, date } = req.body;
    const videoFile = req.files?.video?.[0];
    const imageFile = req.files?.profileImage?.[0];

    if (!videoFile || !imageFile) {
      return res.status(400).json({ message: 'Video and Profile Image are required' });
    }

    // Upload to Cloudinary
    const videoUrl = await uploadToCloudinary(videoFile.path, 'news/videos');
    const imageUrl = await uploadToCloudinary(imageFile.path, 'news/images');

    const newNews = await News.create({
      title,
      profileName,
      date,
      video: { url: videoUrl }, // You can extend this if you extract public_id separately
      profileImage: { url: imageUrl },
    });

    res.status(201).json(newNews);
  } catch (error) {
    console.error('Create News Error:', error);
    res.status(500).json({ message: 'News creation failed', error: error.message });
  }
};

export const getAllNews = async (req, res) => {
  try {
    const newsList = await News.find().sort({ createdAt: -1 });
    res.status(200).json(newsList);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news', error: error.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    // Delete media from Cloudinary
    await deleteFromCloudinary(news.video?.url);
    await deleteFromCloudinary(news.profileImage?.url);

    // Remove from DB
    await News.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete News Error:', error);
    res.status(500).json({ message: 'Failed to delete news', error: error.message });
  }
};
