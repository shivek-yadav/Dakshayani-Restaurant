import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';
import { AuthPanel, PasswordInput } from '../components/AuthPanel';
export function Login() {
    const { login, user } = useApp(), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [busy, setBusy] = useState(false), navigate = useNavigate(), location = useLocation();
    if (user?.role === 'customer')
        return <Navigate to={location.state?.from || '/account'}/>;
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await login({ email, password });
            toast.success('Welcome back!');
            navigate(location.state?.from || '/account', { replace: true });
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <AuthPanel title="Welcome back." subtitle="Sign in to enjoy easy ordering, reservations and more."><form className="form-stack auth-form" onSubmit={submit}><label>Email Address<input required type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}/></label><label>Password<PasswordInput value={password} onChange={setPassword}/></label><Link className="forgot-link" to="/forgot-password">Forgot password?</Link><button className="btn btn-gold full-width" disabled={busy}>{busy ? 'Signing in...' : 'Sign In'} <ArrowRight size={18}/></button></form><p className="auth-switch">New to Dakshayani? <Link to="/register">Create an account</Link></p></AuthPanel>;
}
