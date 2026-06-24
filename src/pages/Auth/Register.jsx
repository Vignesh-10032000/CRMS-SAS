import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Building2, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import vglLogo from '../../assets/images/vgl-logo.jpg';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(form);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      alert('Registration failed. The email might already be in use.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden', padding: 'var(--space-6)'
    }}>
      <div className="hero-grid" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div className="hero-glow hero-glow-primary" />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
        <div className="flex items-center justify-center gap-3" style={{ marginBottom: 'var(--space-8)' }}>
          <img src={vglLogo} alt="VGL" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-2xl)' }}>VGL CRM</span>
        </div>

        <div className="glass-strong" style={{ borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', animation: 'slideUp 0.5s ease' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 4 }}>Start your free trial</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>14 days free. No credit card required.</p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-group">
                  <User size={15} className="input-icon" />
                  <input className="input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Alex Morgan" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Company</label>
                <div className="input-group">
                  <Building2 size={15} className="input-icon" />
                  <input className="input" type="text" name="company" value={form.company} onChange={handleChange} placeholder="Acme Inc." required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Work Email</label>
              <div className="input-group">
                <Mail size={15} className="input-icon" />
                <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-group">
                <Lock size={15} className="input-icon" />
                <input className="input" type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
              {loading ? <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <>Create Free Account <ArrowRight size={18} /></>}
            </button>

            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: -4 }}>
              By creating an account, you agree to our Terms & Privacy Policy
            </p>
          </form>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-5)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Already have an account?{' '}
            <span style={{ color: 'var(--text-brand)', cursor: 'pointer', fontWeight: 'var(--font-semibold)' }} onClick={() => navigate('/login')}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
