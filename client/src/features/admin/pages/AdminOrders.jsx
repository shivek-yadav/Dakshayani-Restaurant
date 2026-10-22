import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, money } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';
import { safeDate, AdminHeading, Card, AdminTable, text, Modal } from '../components/AdminShared';
export function AdminOrders() {
    const { data, loading, error, reload } = useFetch('/admin/orders'), [filter, setFilter] = useState('all'), [selected, setSelected] = useState(null), [busy, setBusy] = useState(false);
    const shown = data.filter(x => filter === 'all' || x.status === filter);
    const transitions = { placed: ['accepted', 'rejected', 'cancelled'], accepted: ['preparing', 'cancelled'], preparing: ['ready'], ready: ['completed'], completed: [], rejected: [], cancelled: [] };
    const change = async (order, status) => {
        setBusy(true);
        try {
            await api.patch(`/admin/orders/${order._id}/status`, { status });
            toast.success('Order status updated');
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
    const markPaid = async (order, paymentStatus) => {
        setBusy(true);
        try {
            await api.patch(`/admin/orders/${order._id}/payment`, { paymentStatus });
            toast.success('Payment record updated');
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
    return <><AdminHeading title="Orders" subtitle="Manage kitchen orders from placement to completion."/><Card title={`Orders (${shown.length})`} action={<select className="admin-filter" value={filter} onChange={e => setFilter(e.target.value)}>{['all', 'placed', 'accepted', 'preparing', 'ready', 'completed', 'rejected', 'cancelled'].map(x => <option key={x} value={x}>{x === 'all' ? 'All statuses' : x}</option>)}</select>}>{loading ? <Loading /> : error ? <Empty text={error}/> : <AdminTable rows={shown} columns={[{ label: 'Order', render: x => <div><strong>{x.orderNumber}</strong><small className="table-sub">{safeDate(x.createdAt)}</small></div> }, { label: 'Customer', render: x => <div>{x.customer?.name}<small className="table-sub">{x.customer?.email}</small></div> }, { label: 'Total', render: x => <strong>{money(x.total)}</strong> }, { label: 'Payment', render: x => <Status value={x.paymentStatus}/> }, { label: 'Status', render: x => <Status value={x.status}/> }, { label: 'Actions', render: x => <button className="admin-outline-small" onClick={() => setSelected(x)}>Manage</button> }]}/>}</Card>{selected && <Modal title={`Order ${selected.orderNumber}`} onClose={() => setSelected(null)}><div className="order-detail"><p><strong>Customer:</strong> {selected.customer?.name || 'Guest'} ({selected.customer?.email})</p><p><strong>Fulfillment:</strong> {selected.fulfillment}</p><p><strong>Placed:</strong> {safeDate(selected.createdAt)}</p>{selected.address?.line1 && <p><strong>Deliver to:</strong> {selected.address.line1}, {selected.address.city} {selected.address.pincode} | {selected.address.phone}</p>}{selected.notes && <p><strong>Notes:</strong> {selected.notes}</p>}{selected.items?.map((item, i) => <div key={i} className="detail-line"><span>{item.quantity} × {item.name}</span><strong>{money(item.lineTotal)}</strong></div>)}<div className="detail-line total"><span>Total</span><strong>{money(selected.total)}</strong></div><div className="detail-line"><span>Payment</span><Status value={selected.paymentStatus}/></div><div className="detail-line"><span>Order status</span><Status value={selected.status}/></div><div className="modal-actions wrap">{transitions[selected.status]?.map(s => <button disabled={busy} key={s} className={['rejected', 'cancelled'].includes(s) ? 'admin-secondary' : 'admin-primary'} onClick={() => change(selected, s)}>{s}</button>)}{selected.paymentStatus === 'unpaid' && !['cancelled', 'rejected'].includes(selected.status) && <button disabled={busy} className="admin-secondary" onClick={() => markPaid(selected, 'paid')}>Mark as paid (manual)</button>}{selected.paymentStatus === 'paid' && <button disabled={busy} className="admin-secondary" onClick={() => markPaid(selected, 'refunded')}>Record refund (manual)</button>}</div><small>Online payments are not enabled. Payment changes represent manual records, not gateway transactions.</small></div></Modal>}</>;
}
