import { BOOKING_TRANSITIONS, mayTransition } from '../../services/order.service.js';
/** Admin bookings controllers. */
import { z } from 'zod';
import { Booking } from '../../models/index.js';
import { wrap, parse, ensure, validId } from '../../lib/utils.js';
import { log } from '../../services/audit.service.js';
export const get_bookings = wrap(async (req, res) => {
    const data = await Booking.find(req.query.status ? { status: req.query.status } : {}).populate('customer', 'name email').sort({ date: -1, time: -1 }).limit(300).lean();
    res.json({ data });
});
export const patch_bookings_id_status = wrap(async (req, res) => {
    const d = parse(z.object({ status: z.enum(['pending', 'confirmed', 'rejected', 'cancelled', 'completed']), adminNote: z.string().max(500).optional() }), req.body);
    ensure(validId(req.params.id), 400, 'Invalid ID');
    const booking = await Booking.findById(req.params.id);
    ensure(booking, 404, 'Booking not found');
    const allowed = { pending: ['confirmed', 'rejected', 'cancelled'], confirmed: ['completed', 'cancelled'], rejected: [], cancelled: [], completed: [] };
    ensure(mayTransition(BOOKING_TRANSITIONS, booking.status, d.status), 400, 'Invalid booking status transition');
    booking.status = d.status;
    if (d.adminNote !== undefined)
        booking.adminNote = d.adminNote;
    await booking.save();
    await log(req, 'status_change', 'bookings', booking._id, d.status);
    res.json({ data: booking, message: 'Reservation updated' });
});
