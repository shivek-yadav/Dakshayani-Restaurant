import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';
export function AdminLogin() {
    const { login, user } = useApp(), [form, setForm] = useState({ email: '', password: '' }), [busy, setBusy] = useState(false), navigate = useNavigate();
    if (user?.role === 'admin')
        return <Navigate to="/admin" replace/>;
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await login(form, true);
            toast.success('Welcome to your dashboard');
            navigate('/admin', { replace: true });
        }
        catch (e) {
            toast.error(e.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <div className="admin-login-screen"><div className="admin-login-brand"><div className="brand-emblem large">D<span>✦</span></div><span>DAKSHAYANI</span><small>MANAGEMENT CONSOLE</small></div><form className="admin-login-card form-stack" onSubmit={submit}><div className="admin-login-icon"><Settings size={25}/></div><h1>Welcome back</h1><p>Sign in to manage your restaurant.</p><label>Admin Email<input type="email" required placeholder="admin@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/></label><label>Password<input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/></label><button disabled={busy} className="btn btn-gold full-width">{busy ? 'Signing in...' : 'Sign In to Dashboard'} <ChevronRight size={17}/></button><Link to="/" className="admin-back"><ArrowLeft size={16}/> Back to website</Link></form></div>;
}
