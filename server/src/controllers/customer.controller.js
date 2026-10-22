/** Business controllers for customer. Route wiring is kept separately. */
import { calculateTotals } from '../services/order.service.js';
import { z } from 'zod';
import { MenuItem, Order, Booking, SiteSettings } from '../models/index.js';
import { wrap, parse, uid, clean, ensure, validId } from '../lib/utils.js';
const orderSchema = z.object({ items: z.array(z.object({ id: z.string(), quantity: z.number().int().min(1).max(20) })).min(1).max(40), fulfillment: z.enum(['pickup', 'delivery']), address: z.object({ name: z.string().min(2).max(100), phone: z.string().min(7).max(25), line1: z.string().min(5).max(250), city: z.string().min(2).max(100), pincode: z.string().min(4).max(12) }).optional(), notes: z.string().max(500).optional().default('') });
const bookingSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), guests: z.number().int().min(1).max(20), name: z.string().min(2).max(100), email: z.string().email(), phone: z.string().min(7).max(25), occasion: z.string().max(100).optional().default(''), notes: z.string().max(500).optional().default('') });
export const get_account = (req, res) => res.json({ data: clean(req.user) });
export const patch_account = wrap(async (req, res) => {
    const d = parse(z.object({ name: z.string().trim().min(2).max(100).optional(), phone: z.string().max(25).optional() }).strict(), req.body);
    Object.assign(req.user, d);
    await req.user.save();
    res.json({ data: clean(req.user), message: 'Profile updated' });
});
export const get_orders_my = wrap(async (req, res) => res.json({ data: await Order.find({ customer: req.user._id }).sort({ createdAt: -1 }).limit(100).lean() }));
export const get_orders_my_id = wrap(async (req, res) => {
    ensure(validId(req.params.id), 400, 'Invalid order');
    const o = await Order.findOne({ _id: req.params.id, customer: req.user._id }).lean();
    ensure(o, 404, 'Order not found');
    res.json({ data: o });
});
export const post_orders = wrap(async (req, res) => {
    const d = parse(orderSchema, req.body);
    const s = await SiteSettings.findOne({ key: 'primary' });
    ensure(s?.orderingEnabled !== false, 400, 'Online ordering is currently unavailable');
    ensure(d.fulfillment !== 'delivery' || s?.deliveryEnabled, 400, 'Delivery is currently unavailable');
    if (d.fulfillment === 'delivery')
        ensure(d.address, 400, 'Delivery address required');
    const ids = d.items.map(x => x.id);
    ensure(ids.every(validId), 400, 'Invalid dish selection');
    ensure(new Set(ids).size === ids.length, 400, 'Duplicate dishes are not allowed');
    const products = await MenuItem.find({ _id: { $in: ids }, published: true, available: true });
    ensure(products.length === ids.length, 400, 'Some dishes are no longer available');
    const byId = new Map(products.map(p => [String(p._id), p]));
    const lines = d.items.map(item => {
        const p = byId.get(item.id);
        return { menuItem: p._id, name: p.name, price: p.price, quantity: item.quantity, image: p.image, lineTotal: Math.round(p.price * item.quantity * 100) / 100 };
    });
    const { subtotal, deliveryFee: fee, total } = calculateTotals(lines, d.fulfillment, s?.deliveryFee);
    const order = await Order.create({ orderNumber: uid('DKO'), customer: req.user._id, items: lines, fulfillment: d.fulfillment, address: d.fulfillment === 'delivery' ? d.address : undefined, notes: d.notes, subtotal, deliveryFee: fee, total, paymentMethod: d.fulfillment === 'delivery' ? 'cash_on_delivery' : 'pay_on_pickup', statusHistory: [{ status: 'placed', at: new Date(), by: 'customer' }] });
    res.status(201).json({ data: order, message: 'Your order has been placed!' });
});
export const get_bookings_my = wrap(async (req, res) => res.json({ data: await Booking.find({ customer: req.user._id }).sort({ createdAt: -1 }).limit(100).lean() }));
export const post_bookings = wrap(async (req, res) => {
    const d = parse(bookingSchema, req.body);
    const settings = await SiteSettings.findOne({ key: 'primary' });
    ensure(settings?.bookingEnabled !== false, 400, 'Reservations are temporarily paused');
    ensure(d.guests <= Number(settings?.reservationMaxGuests || 12), 400, `Maximum ${settings?.reservationMaxGuests || 12} guests per booking`);
    const when = new Date(`${d.date}T${d.time}:00+05:30`);
    ensure(!Number.isNaN(when.getTime()) && when.getTime() > Date.now() + Number(settings?.minReservationLeadHours || 2) * 3600000, 400, 'Choose a valid future date and time');
    ensure(new Date(when.getTime() + 330 * 60000).toISOString().slice(0, 10) === d.date, 400, 'Invalid reservation date');
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' }).format(when);
    const hours = settings?.openingHours?.find(h => h.day === weekday);
    ensure(!hours?.closed, 400, 'Restaurant is closed on this day');
    if (hours?.open && hours?.close)
        ensure(d.time >= hours.open && d.time <= hours.close, 400, 'Booking time is outside opening hours');
    const booking = await Booking.create({ bookingNumber: uid('DKB'), customer: req.user._id, ...d });
    res.status(201).json({ data: booking, message: 'Booking request sent! We will confirm shortly.' });
});
export const patch_bookings_my_id_cancel = wrap(async (req, res) => {
    ensure(validId(req.params.id), 400, 'Invalid booking');
    const b = await Booking.findOne({ _id: req.params.id, customer: req.user._id });
    ensure(b, 404, 'Booking not found');
    ensure(['pending', 'confirmed'].includes(b.status), 400, 'This reservation can no longer be cancelled');
    b.status = 'cancelled';
    await b.save();
    res.json({ data: b, message: 'Reservation cancelled' });
});
