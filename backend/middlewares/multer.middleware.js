import multer, { diskStorage } from 'multer';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = diskStorage({
  destination: (req, file, cb) => {
    const tempDir = join(__dirname, '../temp');
    cb(null, tempDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
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

//const uploads = multer({ storage, fileFilter });
const uploads = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

export default uploads;
