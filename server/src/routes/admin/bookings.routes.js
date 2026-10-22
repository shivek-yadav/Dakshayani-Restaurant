import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import * as controller from '../../controllers/admin/bookings.controller.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/bookings', controller.get_bookings);
router.patch('/bookings/:id/status', controller.patch_bookings_id_status);
export default router;
