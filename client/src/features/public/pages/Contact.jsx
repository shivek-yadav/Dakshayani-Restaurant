import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Clock3, MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { useApp } from '../../../context/AppContext';
import { SectionTitle, PageHero } from '../../../components/UI';
const images = { hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=90', story: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85', spice: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85' };
export function Contact() {
    const { settings } = useApp(), [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' }), [busy, setBusy] = useState(false);
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const r = await api.post('/inquiries', form);
            toast.success(r.data.message);
            setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <><PageHero eyebrow="WE'D LOVE TO HEAR FROM YOU" title="Let's Connect" description="Questions, celebrations, or just a hello — our doors are always open."/><section className="section"><div className="container contact-layout"><div><SectionTitle eyebrow="SAY HELLO" title={<>A conversation <em>starts here.</em></>} description="Reach out with a question or special request, and we'll be happy to help."/><div className="contact-info"><div><span><MapPin size={22}/></span><div><strong>Find Us</strong><p>{settings.address}</p></div></div><div><span><Phone size={22}/></span><div><strong>Call Us</strong><p><a href={`tel:${settings.phone}`}>{settings.phone}</a></p></div></div><div><span><Mail size={22}/></span><div><strong>Write to Us</strong><p><a href={`mailto:${settings.email}`}>{settings.email}</a></p></div></div><div><span><Clock3 size={22}/></span><div><strong>Opening Hours</strong><p>See our schedule below</p></div></div></div><div className="hours-card"><h3>When we're open</h3>{settings.openingHours?.map(h => <div key={h.day}><span>{h.day}</span><span>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span></div>)}</div></div><div className="contact-form-card"><h3>Send us a message</h3><p>Fill out the form and we'll reply as soon as we can.</p><form onSubmit={submit} className="form-stack"><div className="form-row"><label>Full Name *<input required minLength={2} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name"/></label><label>Email Address *<input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"/></label></div><div className="form-row"><label>Phone Number<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Your phone number"/></label><label>Subject<select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}><option>General Inquiry</option><option>Private Events</option><option>Feedback</option><option>Other</option></select></label></div><label>Message *<textarea minLength={10} required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..."/></label><button className="btn btn-gold" disabled={busy}>{busy ? 'Sending...' : 'Send Your Message'} <ArrowRight size={18}/></button></form></div></div></section>{settings.mapUrl && <div className="container map-link"><a href={settings.mapUrl} target="_blank" rel="noreferrer">View location on Google Maps <ArrowUpRight size={17}/></a></div>}</>;
}
