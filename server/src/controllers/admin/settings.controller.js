/** Admin settings controllers. */
import { z } from 'zod';
import { SiteSettings } from '../../models/index.js';
import { wrap, parse } from '../../lib/utils.js';
import { log } from '../../services/audit.service.js';
export const get_settings = wrap(async (req, res) => res.json({ data: await SiteSettings.findOne({ key: 'primary' }) }));
export const patch_settings = wrap(async (req, res) => {
    const schema = z.object({ restaurantName: z.string().max(150).optional(), tagline: z.string().max(250).optional(), phone: z.string().max(30).optional(), email: z.string().email().optional(), address: z.string().max(300).optional(), city: z.string().max(100).optional(), mapUrl: z.string().max(2000).optional(), instagram: z.string().max(500).optional(), facebook: z.string().max(500).optional(), openingHours: z.array(z.object({ day: z.string(), open: z.string(), close: z.string(), closed: z.boolean().optional() })).max(7).optional(), bookingEnabled: z.boolean().optional(), orderingEnabled: z.boolean().optional(), deliveryEnabled: z.boolean().optional(), deliveryFee: z.number().min(0).optional(), reservationMaxGuests: z.number().int().min(1).max(20).optional(), minReservationLeadHours: z.number().min(0).max(72).optional() });
    const d = parse(schema, req.body);
    const record = await SiteSettings.findOneAndUpdate({ key: 'primary' }, { $set: d }, { new: true, upsert: true, runValidators: true });
    await log(req, 'update', 'settings', record._id);
    res.json({ data: record, message: 'Settings saved' });
});
