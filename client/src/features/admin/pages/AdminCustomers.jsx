import { useState } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, prettyDate } from '../../../api';
import { Loading, Empty, Status, useFetch } from '../../../components/UI';
import { AdminHeading, Card, AdminTable, text } from '../components/AdminShared';
export function AdminCustomers() {
    const { data, loading, error, reload } = useFetch('/admin/customers'), [search, setSearch] = useState('');
    const change = async (x) => {
        if (!window.confirm(`${x.status === 'active' ? 'Block' : 'Activate'} ${x.name}?`))
            return;
        try {
            await api.patch(`/admin/customers/${x._id}/status`, { status: x.status === 'active' ? 'blocked' : 'active' });
            toast.success('Customer updated');
            reload();
        }
        catch (e) {
            toast.error(e.message);
        }
    };
    return <><AdminHeading title="Customers" subtitle="The people who make Dakshayani special."/><Card title={`Registered Customers (${data.length})`} action={<label className="admin-search"><Search size={17}/><input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}/></label>}>{loading ? <Loading /> : error ? <Empty text={error}/> : <AdminTable rows={data.filter(x => `${x.name} ${x.email}`.toLowerCase().includes(search.toLowerCase()))} columns={[{ label: 'Name', render: x => <strong>{x.name}</strong> }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { label: 'Joined', render: x => prettyDate(x.createdAt) }, { label: 'Status', render: x => <Status value={x.status}/> }, { label: 'Actions', render: x => <button className="admin-outline-small" onClick={() => change(x)}>{x.status === 'active' ? 'Block' : 'Activate'}</button> }]}/>}</Card></>;
}
