/** Price calculations always occur on the server with current menu prices. */
export function calculateTotals(orderLines, fulfillment, deliveryFee = 0) {
    const subtotal = Math.round(orderLines.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0) * 100) / 100;
    const fee = fulfillment === 'delivery' ? Math.max(0, Number(deliveryFee) || 0) : 0;
    return { subtotal, deliveryFee: fee, total: Math.round((subtotal + fee) * 100) / 100 };
}
export const ORDER_TRANSITIONS = {
    placed: ['accepted', 'rejected', 'cancelled'],
    accepted: ['preparing', 'cancelled'],
    preparing: ['ready'],
    ready: ['completed'],
    completed: [], rejected: [], cancelled: [],
};
export const BOOKING_TRANSITIONS = {
    pending: ['confirmed', 'rejected', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    rejected: [], cancelled: [], completed: [],
};
export const mayTransition = (transitions, current, next) => (transitions[current] || []).includes(next);
