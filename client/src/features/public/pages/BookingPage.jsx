import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CalendarDays, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { useApp } from '../../../context/AppContext';
import { SectionTitle, PageHero } from '../../../components/UI';
const images = { hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=90', story: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85', spice: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85' };
export function BookingPage() {
    const { user, settings } = useApp(), navigate = useNavigate(), [searchParams] = useSearchParams();
    const [form, setForm] = useState({ date: searchParams.get('date') || '', time: searchParams.get('time') || '19:00', guests: Math.min(12, Math.max(1, Number(searchParams.get('guests') || 2))), name: user?.name || '', email: user?.email || '', phone: user?.phone || '', occasion: '', notes: '' }), [busy, setBusy] = useState(false), [success, setSuccess] = useState(null);
    const minDay = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const submit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login', { state: { from: `/booking?${searchParams.toString()}` } });
            return;
        }
        setBusy(true);
        try {
            const r = await api.post('/bookings', { ...form, guests: Number(form.guests) });
            setSuccess(r.data.data);
            toast.success(r.data.message);
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <><PageHero eyebrow="MAKE MEMORIES TOGETHER" title="Reserve a Table" description="Your favourite seat and a memorable meal are just a few clicks away."/><section className="section section-cream"><div className="container booking-layout"><div><SectionTitle eyebrow="YOUR TABLE AWAITS" title={<>Every occasion <em>deserves a little magic.</em></>} description="A date night, a family get-together, or just because — we'd love to host you."/><img className="booking-side-img" src={images.story} alt="Beautifully laid restaurant tables"/><div className="booking-notice"><CalendarDays size={22}/><div><strong>Reservation requests</strong><p>Submitting a request doesn't guarantee a table. Our team will review it and confirm availability. Track the status in your account.</p></div></div></div><div className="booking-card">{success ? <div className="booking-success"><CheckCircle2 size={56}/><h2>Request received!</h2><p>We've received booking <strong>{success.bookingNumber}</strong>. Our team will confirm your reservation soon.</p><Link to="/account/bookings" className="btn btn-gold">Track My Reservation <ArrowRight size={17}/></Link></div> : <><h3>Let's save you a seat</h3><p>Complete the details below to request a table.</p><form className="form-stack" onSubmit={submit}><div className="form-row"><label>Preferred Date *<input required type="date" min={minDay()} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}/></label><label>Preferred Time *<input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}/></label></div><div className="form-row"><label>Number of Guests *<select value={form.guests} onChange={e => setForm({ ...form, guests: Number(e.target.value) })}>{Array.from({ length: settings.reservationMaxGuests || 12 }, (_, i) => <option value={i + 1} key={i}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>)}</select></label><label>Occasion<select value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })}><option value="">Just a meal</option><option>Birthday</option><option>Anniversary</option><option>Family Gathering</option><option>Business Meal</option><option>Other</option></select></label></div><div className="form-row"><label>Your Name *<input required minLength={2} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></label><label>Phone Number *<input required minLength={7} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/></label></div><label>Email Address *<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/></label><label>Special Requests<textarea rows={3} placeholder="Anything we should know?" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}/></label><button disabled={busy || settings.bookingEnabled === false} className="btn btn-gold full-width">{busy ? 'Submitting...' : settings.bookingEnabled === false ? 'Reservations paused' : 'Request My Table'} <ArrowRight size={18}/></button>{!user && <p className="form-help">You'll be asked to sign in before submitting.</p>}</form></>}</div></div></section></>;
}
