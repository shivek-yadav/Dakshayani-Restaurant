import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateTotals,ORDER_TRANSITIONS,BOOKING_TRANSITIONS,mayTransition} from '../src/services/order.service.js';

test('subtotal is calculated from trusted line snapshot prices',()=>{
 assert.deepEqual(calculateTotals([{price:349,quantity:2},{price:89,quantity:1}],'pickup',50),{subtotal:787,deliveryFee:0,total:787});
});
test('delivery fee is applied only for delivery fulfillment',()=>{
 assert.deepEqual(calculateTotals([{price:299,quantity:1}],'delivery',40),{subtotal:299,deliveryFee:40,total:339});
});
test('negative delivery fee cannot lower the order price',()=>{
 assert.equal(calculateTotals([{price:250,quantity:1}],'delivery',-100).total,250);
});
test('order status cannot skip or reverse production workflow',()=>{
 assert.equal(mayTransition(ORDER_TRANSITIONS,'placed','accepted'),true);
 assert.equal(mayTransition(ORDER_TRANSITIONS,'placed','completed'),false);
 assert.equal(mayTransition(ORDER_TRANSITIONS,'completed','placed'),false);
});
test('booking confirmation is admin-controlled and terminal states stay terminal',()=>{
 assert.equal(mayTransition(BOOKING_TRANSITIONS,'pending','confirmed'),true);
 assert.equal(mayTransition(BOOKING_TRANSITIONS,'rejected','confirmed'),false);
});
