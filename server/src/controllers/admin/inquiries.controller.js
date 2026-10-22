/** Admin inquiries controllers. */
import { z } from 'zod';
import { Inquiry } from '../../models/index.js';
import { wrap, parse, ensure, validId } from '../../lib/utils.js';
import { log } from '../../services/audit.service.js';
export const get_inquiries = wrap(async (req, res) => res.json({ data: await Inquiry.find().sort({ createdAt: -1 }).limit(300).lean() }));
export const patch_inquiries_id = wrap(async (req, res) => {
    const d = parse(z.object({ status: z.enum(['new', 'in_progress', 'resolved']).optional(), adminNote: z.string().max(2000).optional() }), req.body);
    ensure(validId(req.params.id), 400, 'Invalid ID');
    const entry = await Inquiry.findByIdAndUpdate(req.params.id, { $set: d }, { new: true, runValidators: true });
    ensure(entry, 404, 'Inquiry not found');
    await log(req, 'update', 'inquiries', entry._id);
    res.json({ data: entry });
});
