import { Router } from 'express';
import { createService, getServices, deleteService, updateService, incrementViews } from '../controllers/serviceController';
import { authenticateToken, optionalAuth, isAdmin } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, createService);
router.get('/', getServices);
router.patch('/:id/view', incrementViews);
router.put('/:id', authenticateToken, isAdmin, updateService);
router.delete('/:id', authenticateToken, isAdmin, deleteService);

export default router;
