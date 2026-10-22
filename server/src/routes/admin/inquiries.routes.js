import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import * as controller from '../../controllers/admin/inquiries.controller.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/inquiries', controller.get_inquiries);
router.patch('/inquiries/:id', controller.patch_inquiries_id);
export default router;
