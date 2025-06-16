import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  toggleServiceStatus,
  getServiceStats
} from '../controllers/services.controller.js';

import {
  isAuthenticatedAdmin
} from '../middlewares/auth.middleware.admin.js';

const router = express.Router();

// /api/services
router
  .route('/')
  .post(isAuthenticatedAdmin, createService)
  .get(getAllServices);

// /api/services/stats
router
  .route('/stats')
  .get(isAuthenticatedAdmin, getServiceStats);

// /api/services/:id
router
  .route('/:id')
  .get(getServiceById)
  .put(isAuthenticatedAdmin, updateService)
  .delete(isAuthenticatedAdmin, deleteService);

// /api/services/:id/toggle
router
  .route('/:id/toggle')
  .patch(isAuthenticatedAdmin, toggleServiceStatus);

export default router;
