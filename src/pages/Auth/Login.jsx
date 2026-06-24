import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import vglLogo from '../../assets/images/vgl-logo.jpg';

export default function Login() {
  const [email, setEmail] = useState('demo@vglcrm.in');
  const [password, setPassword] = useState('demo1234');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      alert('Invalid email or password. If you haven\'t created an account yet, please sign up.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden', padding: 'var(--space-6)'
    }}>
      <div className="hero-grid" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div className="hero-glow hero-glow-primary" />
      <div className="hero-glow hero-glow-secondary" />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-3" style={{ marginBottom: 'var(--space-8)' }}>
          <img src={vglLogo} alt="VGL" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-2xl)' }}>VGL CRM</span>
        </div>

        <div className="glass-strong" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', animation: 'slideUp 0.5s ease' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 4 }}>Welcome back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>Sign in to your workspace</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-group">
                <Lock size={16} className="input-icon" />
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--brand-primary)' }} />
                Remember me
              </label>
              <span style={{ color: 'var(--text-brand)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>Forgot password?</span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? (
                <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="divider" style={{ margin: 'var(--space-5) 0' }} />

          {/* Demo hint */}
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-brand)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-brand)', textAlign: 'center' }}>
              🚀 Demo credentials pre-filled — just click Sign In
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-5)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Don't have an account?{' '}
            <span style={{ color: 'var(--text-brand)', cursor: 'pointer', fontWeight: 'var(--font-semibold)' }} onClick={() => navigate('/register')}>
              Sign up free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
