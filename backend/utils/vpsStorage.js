// backend/utils/vpsStorage.js

import fs from 'fs';
import path from 'path';

// 📤 Upload a file already saved by multer (optional helper for building URL)
export const uploadToVps = (file, req) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  return fileUrl;
};

// 🗑️ Delete a file from VPS uploads
export const deleteFromVps = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('/uploads/')) {
    throw new Error('Invalid image URL');
  }

  const filename = imageUrl.split('/uploads/')[1];
  const filePath = path.join(process.cwd(), 'backend', 'public', 'uploads', filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  } else {
    throw new Error('File not found');
  }
};
