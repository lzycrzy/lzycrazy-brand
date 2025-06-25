import multer, { diskStorage } from 'multer';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Define VPS upload path
const uploadDir = join(__dirname, '../public/uploads');

// ✅ Create uploads folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi', '.mkv', '.webm'];

  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'));
  }
};

const uploads = multer({ storage, fileFilter });

export default uploads;
