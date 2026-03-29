import { Router } from 'express';
import { createReview, getServiceReviews } from '../controllers/reviewController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createReview);
router.get('/service/:service_id', getServiceReviews);

export default router;
