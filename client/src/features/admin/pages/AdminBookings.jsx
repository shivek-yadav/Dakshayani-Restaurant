import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';
import { AdminHeading, Card, AdminTable, text, Modal } from '../components/AdminShared';
export function AdminBookings() {
    const { data, loading, error, reload } = useFetch('/admin/bookings'), [filter, setFilter] = useState('all'), [selected, setSelected] = useState(null), [note, setNote] = useState(''), [busy, setBusy] = useState(false);
    const shown = data.filter(x => filter === 'all' || x.status === filter);
    const allowed = { pending: ['confirmed', 'rejected', 'cancelled'], confirmed: ['completed', 'cancelled'], rejected: [], cancelled: [], completed: [] };
    const change = async (status) => {
        setBusy(true);
        try {
            await api.patch(`/admin/bookings/${selected._id}/status`, { status, adminNote: note });
            toast.success('Reservation updated');
            setSelected(null);
            reload();
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <><AdminHeading title="Reservations" subtitle="Review incoming table requests and keep guests informed."/><Card title={`Table Requests (${shown.length})`} action={<select className="admin-filter" value={filter} onChange={e => setFilter(e.target.value)}>{['all', 'pending', 'confirmed', 'rejected', 'cancelled', 'completed'].map(x => <option key={x} value={x}>{x === 'all' ? 'All reservations' : x}</option>)}</select>}>{loading ? <Loading /> : error ? <Empty text={error}/> : <AdminTable rows={shown} columns={[{ label: 'Guest', render: x => <div><strong>{x.name}</strong><small className="table-sub">{x.phone}</small></div> }, { label: 'Date', render: x => <strong>{x.date} · {x.time}</strong> }, { key: 'guests', label: 'Guests' }, { label: 'Occasion', render: x => x.occasion || '—' }, { label: 'Status', render: x => <Status value={x.status}/> }, { label: 'Actions', render: x => <button className="admin-outline-small" onClick={() => { setSelected(x); setNote(x.adminNote || ''); }}>Review</button> }]}/>}</Card>{selected && <Modal title={`Reservation ${selected.bookingNumber}`} onClose={() => setSelected(null)}><div className="order-detail"><p><strong>Guest:</strong> {selected.name}</p><p><strong>Contact:</strong> {selected.email} · {selected.phone}</p><p><strong>When:</strong> {selected.date} at {selected.time}</p><p><strong>Party size:</strong> {selected.guests} guests</p><p><strong>Occasion:</strong> {selected.occasion || 'None specified'}</p>{selected.notes && <p><strong>Guest notes:</strong> {selected.notes}</p>}<label className="form-stack">Admin note<textarea rows={3} value={note} onChange={e => setNote(e.target.value)}/></label><div className="modal-actions wrap">{allowed[selected.status]?.map(s => <button disabled={busy} className={s === 'confirmed' || s === 'completed' ? 'admin-primary' : 'admin-secondary'} key={s} onClick={() => change(s)}>{s === 'confirmed' ? 'Confirm Table' : s === 'rejected' ? 'Reject Request' : s}</button>)}</div></div></Modal>}</>;
}
