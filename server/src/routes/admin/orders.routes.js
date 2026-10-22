import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import * as controller from '../../controllers/admin/orders.controller.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/orders', controller.get_orders);
router.patch('/orders/:id/status', controller.patch_orders_id_status);
router.patch('/orders/:id/payment', controller.patch_orders_id_payment);
export default router;
