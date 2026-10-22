/** Admin customers controllers. */
import { z } from 'zod';
import { User } from '../../models/index.js';
import { wrap, parse, ensure, clean, validId } from '../../lib/utils.js';
import { log } from '../../services/audit.service.js';
export const get_customers = wrap(async (req, res) => {
    const users = await User.find({ role: 'customer' }).select('name email phone status createdAt lastLogin').sort({ createdAt: -1 }).limit(500).lean();
    res.json({ data: users });
});
export const patch_customers_id_status = wrap(async (req, res) => {
    const d = parse(z.object({ status: z.enum(['active', 'blocked']) }), req.body);
    ensure(validId(req.params.id), 400, 'Invalid ID');
    const u = await User.findOneAndUpdate({ _id: req.params.id, role: 'customer' }, { $set: d }, { new: true });
    ensure(u, 404, 'Customer not found');
    await log(req, 'status_change', 'customers', u._id, d.status);
    res.json({ data: clean(u) });
});
