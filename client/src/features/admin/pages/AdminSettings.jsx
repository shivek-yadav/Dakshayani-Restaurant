import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { useApp } from '../../../context/AppContext';
import { Loading, Empty, useFetch } from '../../../components/UI';
import { AdminHeading, Card, text, boolean, Field } from '../components/AdminShared';
export function AdminSettings() {
    const { data, loading, error } = useFetch('/admin/settings', {}), { setSettings } = useApp(), [form, setForm] = useState(null), [busy, setBusy] = useState(false);
    useEffect(() => {
        if (data?._id)
            setForm({ restaurantName: data.restaurantName || '', tagline: data.tagline || '', phone: data.phone || '', email: data.email || '', address: data.address || '', city: data.city || '', mapUrl: data.mapUrl || '', instagram: data.instagram || '', facebook: data.facebook || '', bookingEnabled: !!data.bookingEnabled, orderingEnabled: !!data.orderingEnabled, deliveryEnabled: !!data.deliveryEnabled, deliveryFee: data.deliveryFee || 0, reservationMaxGuests: data.reservationMaxGuests || 12, minReservationLeadHours: data.minReservationLeadHours ?? 2, openingHours: data.openingHours || [] });
    }, [data]);
    const set = (k, v) => setForm(x => ({ ...x, [k]: v }));
    const save = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const r = await api.patch('/admin/settings', form);
            setSettings(x => ({ ...x, ...r.data.data }));
            toast.success('Settings saved');
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <><AdminHeading title="Restaurant Settings" subtitle="Your business details and operational preferences."/>{loading || !form ? <Loading /> : error ? <Empty text={error}/> : <form className="admin-settings-grid" onSubmit={save}><Card title="Business Information"><div className="form-stack">{[text('restaurantName', 'Restaurant Name'), text('tagline', 'Tagline'), text('phone', 'Phone'), text('email', 'Email', false, { type: 'email' }), text('address', 'Full Address'), text('city', 'City'), text('mapUrl', 'Google Maps URL'), text('instagram', 'Instagram URL'), text('facebook', 'Facebook URL')].map(f => <Field key={f.key} field={f} value={form[f.key]} onChange={v => set(f.key, v)}/>)}</div></Card><div className="admin-settings-side"><Card title="Operations"><div className="form-stack">{[boolean('orderingEnabled', 'Enable online ordering'), boolean('bookingEnabled', 'Accept table bookings'), boolean('deliveryEnabled', 'Enable home delivery'), { key: 'deliveryFee', label: 'Delivery fee (₹)', type: 'number' }, { key: 'reservationMaxGuests', label: 'Max guests per booking', type: 'number' }, { key: 'minReservationLeadHours', label: 'Minimum booking lead time (hours)', type: 'number' }].map(f => <Field key={f.key} field={f} value={form[f.key]} onChange={v => set(f.key, v)}/>)}</div></Card><Card title="Opening Hours"><div className="form-stack">{form.openingHours.map((h, i) => <div className="hours-setting-row" key={h.day}><strong>{h.day}</strong><input type="time" disabled={h.closed} value={h.open} onChange={e => set('openingHours', form.openingHours.map((x, j) => i === j ? { ...x, open: e.target.value } : x))}/><input type="time" disabled={h.closed} value={h.close} onChange={e => set('openingHours', form.openingHours.map((x, j) => i === j ? { ...x, close: e.target.value } : x))}/><label><input type="checkbox" checked={!!h.closed} onChange={e => set('openingHours', form.openingHours.map((x, j) => i === j ? { ...x, closed: e.target.checked } : x))}/> Closed</label></div>)}</div></Card><button disabled={busy} className="admin-primary settings-save"><Save size={18}/> {busy ? 'Saving...' : 'Save All Settings'}</button></div></form>}</>;
}
