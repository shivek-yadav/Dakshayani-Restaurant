import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import * as controller from '../../controllers/admin/content.controller.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/content', controller.get_content);
router.put('/content/:slug', controller.put_content_slug);
export default router;
