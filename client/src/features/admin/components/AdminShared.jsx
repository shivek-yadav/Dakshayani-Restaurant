import { useState } from 'react';
import { LayoutDashboard, Utensils, Tags, CalendarDays, ShoppingBag, Users, Images, FileText, MessageSquare, BarChart3, Settings, X, Plus, Pencil, Trash2, Save, Upload, Search, HelpCircle, Star, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { Loading, Empty, useFetch } from '../../../components/UI';
export const text = (key, label, required = false, other = {}) => ({ key, label, type: 'text', required, ...other });
export const boolean = (key, label) => ({ key, label, type: 'boolean' });
export const navGroups = [{ heading: 'OVERVIEW', items: [['', 'Dashboard', LayoutDashboard]] }, { heading: 'RESTAURANT', items: [['menu', 'Menu Items', Utensils], ['categories', 'Categories', Tags], ['orders', 'Orders', ShoppingBag], ['bookings', 'Reservations', CalendarDays], ['customers', 'Customers', Users]] }, { heading: 'WEBSITE & CONTENT', items: [['gallery', 'Gallery', Images], ['content', 'Page Content', FileText], ['faqs', 'FAQs', HelpCircle], ['testimonials', 'Testimonials', Star]] }, { heading: 'BUSINESS', items: [['inquiries', 'Inquiries', MessageSquare], ['reports', 'Reports', BarChart3], ['activity', 'Activity Log', Activity], ['settings', 'Settings', Settings]] }];
export const safeDate = (x) => x ? new Date(x).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
export function AdminHeading({ title, subtitle, action }) { return <div className="admin-heading"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>; }
export function Card({ children, title, action }) { return <section className="admin-card"><div className="admin-card-head"><h3>{title}</h3>{action}</div>{children}</section>; }
export function IconButton({ icon: Icon, label, onClick, danger = false }) { return <button className={`table-action ${danger ? 'danger' : ''}`} onClick={onClick} title={label} type="button"><Icon size={17}/></button>; }
export function AdminTable({ columns, rows, empty = 'No records available' }) { return <div className="table-scroll"><table className="admin-table"><thead><tr>{columns.map(c => <th key={c.key || c.label}>{c.label}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={row._id || row.id || index}>{columns.map(c => <td key={c.key || c.label}>{c.render ? c.render(row) : String(row[c.key] ?? '—')}</td>)}</tr>) : <tr><td colSpan={columns.length} className="no-results">{empty}</td></tr>}</tbody></table></div>; }
export function AdminCrud({ title, subtitle, endpoint, fields, columns, defaults = {}, prepare = (v) => v, headingLabel }) {
    const { data, loading, error, reload } = useFetch(`/admin/${endpoint}`), [editing, setEditing] = useState(null), [form, setForm] = useState(null), [busy, setBusy] = useState(false), [search, setSearch] = useState('');
    const filtered = data.filter(x => JSON.stringify(x).toLowerCase().includes(search.toLowerCase()));
    const open = (record) => { setEditing(record || null); setForm(record ? Object.fromEntries(fields.map(f => [f.key, record[f.key] ?? (f.type === 'boolean' ? false : '')])) : { ...Object.fromEntries(fields.map(f => [f.key, f.type === 'boolean' ? false : ''])), ...defaults }); };
    const save = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const d = prepare({ ...form });
            if (editing)
                await api.patch(`/admin/${endpoint}/${editing._id}`, d);
            else
                await api.post(`/admin/${endpoint}`, d);
            toast.success('Saved successfully');
            setForm(null);
            reload();
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    const remove = async (x) => {
        if (!window.confirm(`Delete ${x.name || x.title || x.question || 'this record'}?`))
            return;
        try {
            await api.delete(`/admin/${endpoint}/${x._id}`);
            toast.success('Deleted');
            reload();
        }
        catch (e) {
            toast.error(e.message);
        }
    };
    return <><AdminHeading title={title} subtitle={subtitle} action={<button className="admin-primary" onClick={() => open(null)}><Plus size={18}/> Add {headingLabel || 'New'}</button>}/><Card title={`${title} (${filtered.length})`} action={<label className="admin-search"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..."/></label>}>{loading ? <Loading /> : error ? <Empty text={error}/> : <AdminTable rows={filtered} columns={[...columns, { label: 'Actions', render: x => <div className="table-actions"><IconButton icon={Pencil} label="Edit" onClick={() => open(x)}/><IconButton icon={Trash2} label="Delete" danger onClick={() => remove(x)}/></div> }]} empty="No records yet. Create your first one."/>}</Card>{form && <Modal title={editing ? `Edit ${headingLabel || 'Record'}` : `Add ${headingLabel || 'Record'}`} onClose={() => setForm(null)}><form className="form-stack" onSubmit={save}>{fields.map(f => <Field key={f.key} field={f} value={form[f.key]} onChange={v => setForm(x => ({ ...x, [f.key]: v }))} onUpload={fileId => setForm(x => ({ ...x, imageFileId: fileId }))}/>)}<div className="modal-actions"><button type="button" className="admin-secondary" onClick={() => setForm(null)}>Cancel</button><button disabled={busy} className="admin-primary" type="submit"><Save size={17}/> {busy ? 'Saving...' : 'Save Changes'}</button></div></form></Modal>}</>;
}
export function Modal({ title, children, onClose }) {
    return <div className="modal-overlay" onMouseDown={e => {
            if (e.target === e.currentTarget)
                onClose();
        }}><div className="admin-modal" role="dialog" aria-modal="true"><div className="modal-heading"><h2>{title}</h2><button onClick={onClose} aria-label="Close"><X size={21}/></button></div>{children}</div></div>;
}
export function Field({ field: f, value, onChange, onUpload }) {
    if (f.type === 'boolean')
        return <label className="admin-checkbox"><input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)}/>{f.label}</label>;
    if (f.type === 'select')
        return <label>{f.label}{f.required && ' *'}<select required={f.required} value={value || ''} onChange={e => onChange(e.target.value)}><option value="">Choose an option</option>{(f.options || []).map(x => <option key={x.value} value={x.value}>{x.label}</option>)}</select></label>;
    if (f.type === 'image')
        return <ImageField label={f.label} value={value} onChange={onChange} onUpload={onUpload}/>;
    if (f.type === 'textarea')
        return <label>{f.label}{f.required && ' *'}<textarea rows={f.rows || 4} value={value || ''} required={f.required} onChange={e => onChange(e.target.value)}/></label>;
    return <label>{f.label}{f.required && ' *'}<input required={f.required} type={f.type === 'number' ? 'number' : f.type === 'email' ? 'email' : 'text'} min={f.type === 'number' ? 0 : undefined} step={f.type === 'number' ? 'any' : undefined} value={value ?? ''} onChange={e => onChange(f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}/></label>;
}
export function ImageField({ label, value, onChange, onUpload }) {
    const [busy, setBusy] = useState(false);
    const upload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setBusy(true);
        try {
            const body = new FormData();
            body.append('image', file);
            const r = await api.post('/admin/upload', body);
            onChange(r.data.data.url);
            onUpload?.(r.data.data.fileId);
            toast.success('Image uploaded');
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <div className="image-control"><span>{label}</span><div className="image-field">{value && <img src={value} alt="Current upload"/>}<input type="url" placeholder="ImageKit URL or any https:// image URL" value={value || ''} onChange={e => onChange(e.target.value)}/><label className="upload-trigger"><Upload size={17}/> {busy ? 'Uploading...' : 'Upload to ImageKit'}<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" hidden onChange={upload}/></label></div></div>;
}
