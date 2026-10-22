/** Admin dashboard controllers. */
import { User, Booking, Order, ActivityLog } from '../../models/index.js';
import { wrap } from '../../lib/utils.js';
export const get_dashboard = wrap(async (req, res) => {
    const nowIST = new Date(Date.now() + 330 * 60000);
    const start = new Date(Date.UTC(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate()) - 330 * 60000);
    const [ordersToday, pendingBookings, customers, openOrders, revenues, recentOrders, recentBookings] = await Promise.all([Order.countDocuments({ createdAt: { $gte: start } }), Booking.countDocuments({ status: 'pending' }), User.countDocuments({ role: 'customer' }), Order.countDocuments({ status: { $in: ['placed', 'accepted', 'preparing', 'ready'] } }), Order.aggregate([{ $match: { status: { $nin: ['cancelled', 'rejected'] }, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]), Order.find().populate('customer', 'name').sort({ createdAt: -1 }).limit(6).lean(), Booking.find().sort({ createdAt: -1 }).limit(5).lean()]);
    res.json({ data: { ordersToday, pendingBookings, customers, openOrders, revenue: revenues[0]?.total || 0, paidOrders: revenues[0]?.count || 0, recentOrders, recentBookings } });
});
export const get_reports = wrap(async (req, res) => {
    const [statuses, revenueByDay, topDishes, bookings] = await Promise.all([Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]), Order.aggregate([{ $match: { paymentStatus: 'paid', status: { $nin: ['cancelled', 'rejected'] } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } }, { $sort: { _id: -1 } }, { $limit: 30 }]), Order.aggregate([{ $unwind: '$items' }, { $group: { _id: '$items.name', quantity: { $sum: '$items.quantity' }, revenue: { $sum: '$items.lineTotal' } } }, { $sort: { quantity: -1 } }, { $limit: 10 }]), Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])]);
    res.json({ data: { statuses, revenueByDay: revenueByDay.reverse(), topDishes, bookings } });
});
export const get_activity = wrap(async (req, res) => res.json({ data: await ActivityLog.find().populate('actor', 'name email').sort({ createdAt: -1 }).limit(100).lean() }));
