import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import * as controller from '../../controllers/admin/customers.controller.js';
const router = Router();
router.use(requireAuth, requireAdmin);
router.get('/customers', controller.get_customers);
router.patch('/customers/:id/status', controller.patch_customers_id_status);
export default router;
