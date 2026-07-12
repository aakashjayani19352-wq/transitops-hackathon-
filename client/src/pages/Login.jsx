import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ROLES = ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'];

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: ROLES[0] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        const { data } = await api.post('/auth/signup', form);
        login(data.token, data.user);
      } else {
        const { data } = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        });
        login(data.token, data.user);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1><span className="brand">TransitOps</span></h1>
        <p className="subtitle">
          {isSignup ? 'Create your account to get started' : 'Sign in to your account'}
        </p>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait…' : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="toggle-auth">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => { setIsSignup(v => !v); setError(''); }}>
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
