import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, UserRound, Clock3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, prettyDate } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';
export function MyBookings() {
    const { data, loading, error, reload } = useFetch('/bookings/my'), [busy, setBusy] = useState(null);
    const cancel = async (b) => {
        if (!window.confirm(`Cancel reservation ${b.bookingNumber}?`))
            return;
        setBusy(b._id);
        try {
            await api.patch(`/bookings/my/${b._id}/cancel`);
            toast.success('Reservation cancelled');
            reload();
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setBusy(null);
        }
    };
    return <div className="account-panel"><h2>My Reservations</h2><p>All your planned moments, beautifully organized.</p>{loading ? <Loading /> : error ? <Empty text={error}/> : data.length === 0 ? <Empty title="No reservations yet" text="Save your seat for something special."/> : <div className="order-list">{data.map(b => <article className="history-card" key={b._id}><div className="history-header"><div><strong>{b.bookingNumber}</strong><small>Requested {prettyDate(b.createdAt)}</small></div><Status value={b.status}/></div><div className="booking-history-meta"><span><CalendarDays size={16}/>{b.date}</span><span><Clock3 size={16}/>{b.time}</span><span><UserRound size={16}/>{b.guests} guests</span></div>{b.adminNote && <p className="booking-admin-note">Note: {b.adminNote}</p>}{['pending', 'confirmed'].includes(b.status) && <button className="small-link-danger" disabled={busy === b._id} onClick={() => cancel(b)}>Cancel reservation</button>}</article>)}</div>}<Link to="/booking" className="text-link history-new">Request another table <ArrowRight size={17}/></Link></div>;
}
