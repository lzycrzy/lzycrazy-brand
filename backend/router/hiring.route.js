// router/hiring.route.js
import express from 'express';
import multer from 'multer';
import { uploadVideoFromBuffer, deleteVideoFromCloudinary } from '../utils/cloudinary.js';
import Hiring from '../models/hiring.model.js';

const router = express.Router();

// Configure multer for memory storage (since we're uploading to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for video files
  },
  fileFilter: (req, file, cb) => {
    // Check if file is a video
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  }
});

// DELETE /api/v1/hiring/:id - Delete hiring submission (for admin use)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission ID format'
      });
    }

    // Find the submission first to get video info
    const hiringSubmission = await Hiring.findById(id);

    if (!hiringSubmission) {
      return res.status(404).json({
        success: false,
        message: 'Hiring submission not found'
      });
    }

    // Delete video from Cloudinary first
    if (hiringSubmission.videoPublicId) {
      console.log('Deleting video from Cloudinary...');
      await deleteVideoFromCloudinary(hiringSubmission.videoUrl);
    }

    // Delete the submission from database
    await Hiring.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Hiring submission deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting hiring submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});


// POST /api/v1/hiring - Create new hiring form submission
router.post('/', upload.single('video'), async (req, res) => {
  try {
    // Check if video file is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Video file is required'
      });
    }

    // Extract form data from request body
    const {
      country,
      state,
      city,
      education,
      experienceLevel,
      jobCategory,
      introduction
    } = req.body;

    // Validate required fields
    if (!country || !state || !city || !education || !experienceLevel || !jobCategory || !introduction) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate introduction word count
    const wordCount = introduction.split(' ').filter(word => word.length > 0).length;
    if (wordCount > 50) {
      return res.status(400).json({
        success: false,
        message: 'Introduction must not exceed 50 words'
      });
    }

    // Upload video to Cloudinary
    console.log('Uploading video to Cloudinary...');
    const cloudinaryResult = await uploadVideoFromBuffer(req.file.buffer, req.file.originalname, 'hiring_videos');

    // Create new hiring record
    const newHiring = new Hiring({
      country: country.trim(),
      state: state.trim(),
      city: city.trim(),
      education: education.trim(),
      experienceLevel: experienceLevel.trim(),
      jobCategory: jobCategory.trim(),
      introduction: introduction.trim(),
      videoUrl: cloudinaryResult.url,
      videoPublicId: cloudinaryResult.publicId
    });

    // Save to database
    const savedHiring = await newHiring.save();

    res.status(201).json({
      success: true,
      message: 'Hiring form submitted successfully',
      data: {
        id: savedHiring._id,
        country: savedHiring.country,
        state: savedHiring.state,
        city: savedHiring.city,
        education: savedHiring.education,
        experienceLevel: savedHiring.experienceLevel,
        jobCategory: savedHiring.jobCategory,
        introduction: savedHiring.introduction,
        videoUrl: savedHiring.videoUrl,
        status: savedHiring.status,
        submittedAt: savedHiring.submittedAt
      }
    });

  } catch (error) {
    console.error('Error in hiring form submission:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// GET /api/v1/hiring - Get all hiring form submissions
router.get('/', async (req, res) => {
  try {
    // Parse query parameters for pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.country) filter.country = { $regex: req.query.country, $options: 'i' };
    if (req.query.state) filter.state = { $regex: req.query.state, $options: 'i' };
    if (req.query.city) filter.city = { $regex: req.query.city, $options: 'i' };
    if (req.query.jobCategory) filter.jobCategory = { $regex: req.query.jobCategory, $options: 'i' };
    if (req.query.experienceLevel) filter.experienceLevel = req.query.experienceLevel;
    if (req.query.status) filter.status = req.query.status;

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.submittedAt = {};
      if (req.query.startDate) filter.submittedAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.submittedAt.$lte = new Date(req.query.endDate);
    }

    // Execute query with pagination
    const [hiringSubmissions, totalCount] = await Promise.all([
      Hiring.find(filter)
        .select('-videoPublicId') // Exclude internal cloudinary ID from response
        .sort({ submittedAt: -1 }) // Latest first
        .skip(skip)
        .limit(limit)
        .lean(),
      Hiring.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: 'Hiring submissions retrieved successfully',
      data: hiringSubmissions,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching hiring submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// GET /api/v1/hiring/:id - Get specific hiring form submission
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission ID format'
      });
    }

    const hiringSubmission = await Hiring.findById(id).select('-videoPublicId');

    if (!hiringSubmission) {
      return res.status(404).json({
        success: false,
        message: 'Hiring submission not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hiring submission retrieved successfully',
      data: hiringSubmission
    });

  } catch (error) {
    console.error('Error fetching hiring submission:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// PUT /api/v1/hiring/:id/status - Update hiring submission status (for admin use)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission ID format'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, reviewed, shortlisted, rejected'
      });
    }

    const updatedSubmission = await Hiring.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select('-videoPublicId');

    if (!updatedSubmission) {
      return res.status(404).json({
        success: false,
        message: 'Hiring submission not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: updatedSubmission
    });

  } catch (error) {
    console.error('Error updating hiring submission status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

export default router;