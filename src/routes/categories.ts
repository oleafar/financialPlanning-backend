import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { validateCategory, validateCategoryUpdate } from '../middleware/validation';

const router = Router();

router.get('/', getCategories);
router.post('/', validateCategory, createCategory);
router.put('/:id', validateCategoryUpdate, updateCategory);
router.delete('/:id', deleteCategory);

export default router;
