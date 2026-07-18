import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User } from 'lucide-react';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const { register, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cfHandle, setCfHandle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !cfHandle) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, cfHandle.trim());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '420px',
      margin: '60px auto',
      width: '100%'
    }} className="animate-fade-in">
      <div className="glass-card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #fff 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            Create Account
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Setup tracker using your Codeforces ID
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            color: '#ef4444',
            fontSize: '0.85rem',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#64748b' }}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                className="form-input"
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '45px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Codeforces Handle</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#64748b' }}>
                <User size={18} />
              </span>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Tourist"
                value={cfHandle}
                onChange={(e) => setCfHandle(e.target.value)}
                style={{ paddingLeft: '45px' }}
                required
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px', paddingLeft: '2px' }}>
              We will sync your rating history and solved tags directly.
            </p>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#64748b' }}>
                <Lock size={18} />
              </span>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '45px' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Verifying & Registering...' : 'Register Account'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#64748b'
        }}>
          Already have an account?{' '}
          <span
            onClick={onSwitchToLogin}
            style={{
              color: 'var(--primary)',
              cursor: 'pointer',
              fontWeight: 600,
              textDecoration: 'underline'
            }}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};
