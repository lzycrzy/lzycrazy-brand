import express from 'express';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import uploads from '../middlewares/multer.middleware.js';

const router = express.Router();


router.post('/upload', uploads.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const cloudUrl = await uploadToCloudinary(req.file.path);
    res.status(200).json({ success: true, url: cloudUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});


router.delete('/delete', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'No imageUrl provided' });
    }

    const result = await deleteFromCloudinary(imageUrl);
    if (result.result === 'ok') {
      res.status(200).json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(400).json({ success: false, message: 'File not found or already deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Deletion failed', error: error.message });
  }
});

export default router;
