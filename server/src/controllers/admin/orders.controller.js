/** Admin orders controllers. */
import { z } from 'zod';
import { Order } from '../../models/index.js';
import { wrap, parse, ensure, validId } from '../../lib/utils.js';
import { log } from '../../services/audit.service.js';
import { ORDER_TRANSITIONS, mayTransition } from '../../services/order.service.js';
export const get_orders = wrap(async (req, res) => {
    const filter = req.query.status ? { status: req.query.status } : {};
    const data = await Order.find(filter).populate('customer', 'name email phone').sort({ createdAt: -1 }).limit(300).lean();
    res.json({ data });
});
export const patch_orders_id_status = wrap(async (req, res) => {
    const d = parse(z.object({ status: z.enum(['placed', 'accepted', 'preparing', 'ready', 'completed', 'rejected', 'cancelled']) }), req.body);
    ensure(validId(req.params.id), 400, 'Invalid ID');
    const order = await Order.findById(req.params.id);
    ensure(order, 404, 'Order not found');
    ensure(mayTransition(ORDER_TRANSITIONS, order.status, d.status), 400, `Cannot change ${order.status} to ${d.status}`);
    order.status = d.status;
    order.statusHistory.push({ status: d.status, at: new Date(), by: 'admin' });
    await order.save();
    await log(req, 'status_change', 'orders', order._id, d.status);
    res.json({ data: order, message: 'Order status updated' });
});
export const patch_orders_id_payment = wrap(async (req, res) => {
    const d = parse(z.object({ paymentStatus: z.enum(['unpaid', 'paid', 'refunded']) }), req.body);
    ensure(validId(req.params.id), 400, 'Invalid ID');
    const order = await Order.findById(req.params.id);
    ensure(order, 404, 'Order not found');
    ensure(!(d.paymentStatus === 'paid' && ['rejected', 'cancelled'].includes(order.status)), 400, 'Cannot mark a cancelled/rejected order paid');
    order.paymentStatus = d.paymentStatus;
    await order.save();
    await log(req, 'payment_status', 'orders', order._id, d.paymentStatus);
    res.json({ data: order, message: 'Payment record updated manually' });
});
