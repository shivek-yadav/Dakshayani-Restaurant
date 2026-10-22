import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import * as controller from '../../controllers/admin/settings.controller.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/settings', controller.get_settings);
router.patch('/settings', controller.patch_settings);
export default router;
