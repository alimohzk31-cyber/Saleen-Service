import { Router } from 'express';
import { register, login, getMe, loginPhone, loginGoogle, adminLogin } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/admin-login', adminLogin);
router.post('/register', register);
router.post('/login', login);
router.post('/login-phone', loginPhone);
router.post('/google', loginGoogle);
router.get('/me', authenticateToken, getMe);

export default router;
