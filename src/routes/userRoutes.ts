import { Router } from 'express';
import { getAllUsers, updateUserStatus, toggleUserVerification, getStats } from '../controllers/userController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/stats', authenticateToken, isAdmin, getStats);
router.patch('/:id/status', authenticateToken, isAdmin, updateUserStatus);
router.patch('/:id/verify', authenticateToken, isAdmin, toggleUserVerification);

export default router;
