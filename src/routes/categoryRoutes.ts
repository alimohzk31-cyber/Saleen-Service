import { Router } from 'express';
import { createCategory, getCategories, seedCategories } from '../controllers/categoryController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/seed', seedCategories);
router.post('/', authenticateToken, createCategory);
router.get('/', getCategories);

export default router;
