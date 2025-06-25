import express from 'express';
import uploads from '../middlewares/multer.vps.middleware.js'; // Use VPS storage middleware
import fs from 'fs';
import path from 'path';

const router = express.Router();

// ✅ Upload file to VPS bucket
router.post('/upload', uploads.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Return the full public URL to access the file
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  return res.status(200).json({ success: true, url: fileUrl });
});

// ✅ Delete file from VPS bucket
router.delete('/delete', (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl || !imageUrl.includes('/uploads/')) {
    return res.status(400).json({ success: false, message: 'Invalid image URL' });
  }

  const filename = imageUrl.split('/uploads/')[1];
  const filePath = path.join(process.cwd(), 'backend', 'public', 'uploads', filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.status(200).json({ success: true, message: 'File deleted successfully' });
  } else {
    return res.status(404).json({ success: false, message: 'File not found' });
  }
});

export default router;
