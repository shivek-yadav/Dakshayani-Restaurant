import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { useApp } from '../../../context/AppContext';
export function AccountHome() {
    const { user, setUser } = useApp(), [name, setName] = useState(user.name), [phone, setPhone] = useState(user.phone || ''), [busy, setBusy] = useState(false);
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const r = await api.patch('/account', { name, phone });
            setUser(r.data.data);
            toast.success(r.data.message);
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <div className="account-panel"><h2>My Profile</h2><p>Keep your details updated for a smoother experience.</p><form onSubmit={submit} className="form-stack profile-form"><label>Full Name<input required minLength={2} value={name} onChange={e => setName(e.target.value)}/></label><label>Email Address<input disabled value={user.email}/></label><label>Phone Number<input value={phone} onChange={e => setPhone(e.target.value)}/></label><button className="btn btn-gold" disabled={busy}>Save Changes <ArrowRight size={17}/></button></form></div>;
}
