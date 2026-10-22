import { useState } from 'react';
import { FileText, ChevronRight, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { useFetch } from '../../../components/UI';
import { AdminHeading, text, boolean, Modal, Field } from '../components/AdminShared';
export function AdminContent() {
    const { data, loading, error, reload } = useFetch('/admin/content'), [selected, setSelected] = useState(null), [form, setForm] = useState(null), [busy, setBusy] = useState(false);
    const pages = [...new Set(['home', 'about', 'menu', ...data.map(x => x.slug)])];
    const open = (slug) => { const d = data.find(x => x.slug === slug); setSelected(slug); setForm({ title: d?.title || '', subtitle: d?.subtitle || '', description: d?.description || '', heroImage: d?.heroImage || '', body: d?.body || '', published: d?.published ?? true }); };
    const save = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await api.put(`/admin/content/${selected}`, form);
            toast.success('Page content saved');
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
    return <><AdminHeading title="Page Content" subtitle="Edit the words and hero visuals on your public pages."/><div className="content-card-grid">{pages.map(slug => <button className="content-card" onClick={() => open(slug)} key={slug}><FileText size={27}/><strong>{slug.charAt(0).toUpperCase() + slug.slice(1)} Page</strong><span>Manage copy and hero image <ChevronRight size={17}/></span></button>)}</div>{selected && <Modal title={`Edit ${selected} page`} onClose={() => setSelected(null)}><form className="form-stack" onSubmit={save}>{[text('title', 'Page title'), text('subtitle', 'Eyebrow / kicker'), { key: 'description', label: 'Description', type: 'textarea' }, { key: 'heroImage', label: 'Hero image', type: 'image' }, { key: 'body', label: 'Additional text', type: 'textarea' }, boolean('published', 'Published')].map(f => <Field key={f.key} field={f} value={form[f.key]} onChange={v => setForm(x => ({ ...x, [f.key]: v }))}/>)}<button className="admin-primary" disabled={busy}><Save size={17}/> Save Page</button></form></Modal>}</>;
}
