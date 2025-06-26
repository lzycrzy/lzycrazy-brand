import express from 'express';
import { createNews, getAllNews, deleteNews } from '../controllers/news.controller.js';

import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post(
  '/news',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 }
  ]),
  createNews
);

router.get('/news', getAllNews);
router.delete('/news/:id', deleteNews);

export default router;