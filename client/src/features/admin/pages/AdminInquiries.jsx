import { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';
import { AdminHeading, Card, AdminTable, text, Modal } from '../components/AdminShared';
export function AdminInquiries() {
    const { data, loading, error, reload } = useFetch('/admin/inquiries'), [selected, setSelected] = useState(null), [status, setStatus] = useState('new'), [note, setNote] = useState('');
    const save = async () => {
        try {
            await api.patch(`/admin/inquiries/${selected._id}`, { status, adminNote: note });
            toast.success('Inquiry updated');
            setSelected(null);
            reload();
        }
        catch (e) {
            toast.error(e.message);
        }
    };
    return <><AdminHeading title="Contact Inquiries" subtitle="Every message from a guest, organized in one place."/><Card title={`Messages (${data.length})`}>{loading ? <Loading /> : error ? <Empty text={error}/> : <AdminTable rows={data} columns={[{ label: 'From', render: x => <div><strong>{x.name}</strong><small className="table-sub">{x.email}</small></div> }, { key: 'subject', label: 'Subject' }, { label: 'Message', render: x => <span className="table-truncate">{x.message}</span> }, { label: 'Status', render: x => <Status value={x.status}/> }, { label: 'Actions', render: x => <button className="admin-outline-small" onClick={() => { setSelected(x); setStatus(x.status); setNote(x.adminNote || ''); }}>Read</button> }]}/>}</Card>{selected && <Modal title={`Message from ${selected.name}`} onClose={() => setSelected(null)}><div className="form-stack"><p><strong>Contact:</strong> {selected.email} / {selected.phone || 'No phone'}</p><p><strong>Subject:</strong> {selected.subject}</p><div className="message-preview">{selected.message}</div><label>Progress<select value={status} onChange={e => setStatus(e.target.value)}><option value="new">New</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option></select></label><label>Internal notes<textarea value={note} onChange={e => setNote(e.target.value)} rows={4}/></label><button className="admin-primary" onClick={save}><Save size={17}/> Save</button></div></Modal>}</>;
}
