import express from 'express';
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  getCategoryById,
  toggleCategoryStatus,
} from '../controllers/category.controller.js';
import {
  isAuthenticatedAdmin,
  authorizeRolesAdimin,
} from '../middlewares/auth.middleware.admin.js';

const router = express.Router();

router
  .route('/')
  .post(isAuthenticatedAdmin, createCategory)
  .get(getAllCategories);

router
  .route('/stats')
  .get(isAuthenticatedAdmin, getCategoryStats);

router
  .route('/:id')
  .get(getCategoryById)
  .put(isAuthenticatedAdmin, updateCategory)
  .delete(isAuthenticatedAdmin, deleteCategory);
  
router
  .route('/:id/toggle')
  .patch(isAuthenticatedAdmin, toggleCategoryStatus); 
export default router;
