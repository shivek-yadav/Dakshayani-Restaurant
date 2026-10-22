import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import rateLimit from 'express-rate-limit';
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, message: { message: 'Too many login attempts' } });
import * as controller from '../../controllers/admin/auth.controller.js';
const router = Router();
router.post('/auth/login', loginLimiter, controller.post_auth_login);
router.get('/auth/me', requireAuth, requireAdmin, controller.get_auth_me);
export default router;
