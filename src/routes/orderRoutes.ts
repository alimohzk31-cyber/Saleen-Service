import { Router } from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createOrder);
router.get('/user', authenticateToken, getUserOrders);

export default router;
