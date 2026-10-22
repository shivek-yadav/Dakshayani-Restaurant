import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { AuthPanel } from '../components/AuthPanel';
export function ForgotPassword() {
    const [email, setEmail] = useState(''), [sent, setSent] = useState(false), [busy, setBusy] = useState(false);
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <AuthPanel title="Forgot password?" subtitle="We'll help you get back to the table.">{sent ? <div className="success-box"><Mail size={33}/><h3>Check your inbox</h3><p>If your email is registered, we've sent password reset instructions. Development installations without SMTP log a reset link to the API terminal.</p><Link to="/login" className="text-link">Return to login <ArrowRight size={17}/></Link></div> : <form className="form-stack auth-form" onSubmit={submit}><label>Email Address<input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}/></label><button className="btn btn-gold full-width" disabled={busy}>Send Reset Instructions <ArrowRight size={17}/></button><Link to="/login" className="forgot-link">Back to Sign In</Link></form>}</AuthPanel>;
}
