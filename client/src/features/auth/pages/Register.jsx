import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';
import { AuthPanel, PasswordInput } from '../components/AuthPanel';
export function Register() {
    const { register, user } = useApp(), [form, setForm] = useState({ name: '', email: '', phone: '', password: '' }), [busy, setBusy] = useState(false), navigate = useNavigate();
    if (user?.role === 'customer')
        return <Navigate to="/account"/>;
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await register(form);
            toast.success('Your account is ready!');
            navigate('/account');
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <AuthPanel title="Join our table." subtitle="Create your account for a more personal dining experience."><form onSubmit={submit} className="form-stack auth-form"><label>Full Name<input required minLength={2} autoComplete="name" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></label><label>Email Address<input required type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/></label><label>Phone Number (optional)<input type="tel" autoComplete="tel" placeholder="Your mobile number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/></label><label>Password<PasswordInput value={form.password} onChange={value => setForm({ ...form, password: value })} placeholder="At least 8 characters"/></label><button className="btn btn-gold full-width" disabled={busy}>{busy ? 'Creating account...' : 'Create My Account'} <ArrowRight size={18}/></button></form><p className="auth-switch">Already part of our family? <Link to="/login">Sign in</Link></p></AuthPanel>;
}
