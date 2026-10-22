import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import * as controller from '../../controllers/admin/dashboard.controller.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/dashboard', controller.get_dashboard);
router.get('/reports', controller.get_reports);
router.get('/activity', controller.get_activity);
export default router;
