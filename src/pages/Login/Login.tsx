import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/api';
import './Login.css';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser(email, password);
      login(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2.5 L22 10 L22 22 L2 22 L2 10 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="0.9"/>
            <circle cx="12" cy="16.5" r="4.8" stroke="currentColor" strokeWidth="1.1"/>
            <circle cx="12" cy="16.5" r="2.2" stroke="currentColor" strokeWidth="0.9"/>
            <circle cx="12" cy="16.5" r="0.7" fill="currentColor"/>
            <line x1="13.56" y1="14.94" x2="14.97" y2="13.53" stroke="currentColor" strokeWidth="0.85"/>
            <line x1="13.56" y1="18.06" x2="14.97" y2="19.47" stroke="currentColor" strokeWidth="0.85"/>
            <line x1="10.44" y1="18.06" x2="9.03"  y2="19.47" stroke="currentColor" strokeWidth="0.85"/>
            <line x1="10.44" y1="14.94" x2="9.03"  y2="13.53" stroke="currentColor" strokeWidth="0.85"/>
          </svg>
          <span className="auth-brand-name">Photo<span>house</span></span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your travel journal</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <p className="auth-error" role="alert">{error}</p>}

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="auth-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="auth-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          New to Photo House?{' '}
          <Link to="/signup" className="auth-switch-link">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
