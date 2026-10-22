import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../api';
import { AuthPanel, PasswordInput } from '../components/AuthPanel';
export function ResetPassword() {
    const [params] = useSearchParams(), [password, setPassword] = useState(''), [busy, setBusy] = useState(false), [done, setDone] = useState(false);
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await api.post('/auth/reset-password', { token: params.get('token'), password });
            setDone(true);
            toast.success('Password reset successfully');
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setBusy(false);
        }
    };
    return <AuthPanel title="Create a new password." subtitle="Choose a secure password for your account.">{done ? <Link to="/login" className="btn btn-gold">Sign In <ArrowRight size={17}/></Link> : <form className="form-stack auth-form" onSubmit={submit}><label>New Password<PasswordInput value={password} onChange={setPassword}/></label><button disabled={busy || !params.get('token')} className="btn btn-gold full-width">Update Password <ArrowRight size={17}/></button></form>}</AuthPanel>;
}
