import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Store, MapPin, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, money } from '../../../api';
import { useApp } from '../../../context/AppContext';
import { PageHero, Empty } from '../../../components/UI';
export function Checkout() {
    const { cart, cartTotal, clearCart, settings, user } = useApp(), navigate = useNavigate(), [fulfillment, setFulfillment] = useState('pickup'), [address, setAddress] = useState({ name: user?.name || '', phone: user?.phone || '', line1: '', city: '', pincode: '' }), [notes, setNotes] = useState(''), [busy, setBusy] = useState(false), [order, setOrder] = useState(null);
    const fee = fulfillment === 'delivery' ? settings.deliveryFee || 0 : 0;
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const r = await api.post('/orders', { items: cart.map(x => ({ id: x.id, quantity: x.quantity })), fulfillment, address: fulfillment === 'delivery' ? address : undefined, notes });
            setOrder(r.data.data);
            clearCart();
            toast.success('Order placed successfully!');
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <><PageHero eyebrow="JUST ONE MORE STEP" title="Checkout" description="We're excited to prepare something special for you."/><section className="section section-cream"><div className="container">{order ? <div className="checkout-success"><CheckCircle2 size={65}/><h2>Order placed with love!</h2><p>Your order <strong>{order.orderNumber}</strong> has reached our kitchen. Payment will be collected {order.fulfillment === 'delivery' ? 'on delivery' : 'at pickup'}.</p><Link className="btn btn-gold" to="/account/orders">Track My Order <ArrowRight size={17}/></Link></div> : cart.length === 0 ? <Empty title="Your cart is empty" text="Add a few dishes from the menu to get started."/> : <form onSubmit={submit} className="checkout-layout"><div><div className="checkout-panel"><h3>1. How would you like your food?</h3><div className="fulfillment-options"><button type="button" onClick={() => setFulfillment('pickup')} className={fulfillment === 'pickup' ? 'selected' : ''}><Store size={24}/><strong>Restaurant Pickup</strong><small>Collect it fresh from our kitchen</small></button>{settings.deliveryEnabled && <button type="button" onClick={() => setFulfillment('delivery')} className={fulfillment === 'delivery' ? 'selected' : ''}><Truck size={24}/><strong>Home Delivery</strong><small>Delivered to your door</small></button>}</div>{fulfillment === 'pickup' && <div className="info-note"><MapPin size={18}/> {settings.address}</div>}</div>{fulfillment === 'delivery' && <div className="checkout-panel"><h3>2. Delivery Address</h3><div className="form-stack"><div className="form-row"><label>Full Name *<input required value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })}/></label><label>Phone *<input required minLength={7} value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })}/></label></div><label>Street Address *<input required minLength={5} value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })}/></label><div className="form-row"><label>City *<input required minLength={2} value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })}/></label><label>PIN Code *<input required minLength={4} value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })}/></label></div></div></div>}<div className="checkout-panel"><h3>{fulfillment === 'delivery' ? '3' : '2'}. Anything else?</h3><label className="form-stack">Special instructions<textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Spice preferences, allergies, or extra notes..."/></label></div></div><aside className="summary-card checkout-summary"><h3>Your Order</h3>{cart.map(x => <div className="checkout-summary-item" key={x.id}><span>{x.quantity} × {x.name}</span><strong>{money(x.price * x.quantity)}</strong></div>)}<hr /><div className="summary-line"><span>Subtotal</span><span>{money(cartTotal)}</span></div><div className="summary-line"><span>{fulfillment === 'delivery' ? 'Delivery Fee' : 'Pickup'}</span><span>{fulfillment === 'delivery' ? money(fee) : 'Free'}</span></div><div className="summary-total"><span>Total</span><strong>{money(cartTotal + fee)}</strong></div><div className="payment-notice"><strong>Pay {fulfillment === 'delivery' ? 'on delivery' : 'at restaurant'}</strong><p>Online payment is coming later. No advance payment required.</p></div><button className="btn btn-gold full-width" disabled={busy || settings.orderingEnabled === false}>{busy ? 'Placing your order...' : 'Place Your Order'} <ArrowRight size={18}/></button></aside></form>}</div></section></>;
}
