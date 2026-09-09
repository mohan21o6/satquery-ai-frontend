import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Satellite,
} from 'lucide-react';
import type { UserSession } from '../AuthModal';

type Screen = 'prompt' | 'login' | 'signup';

interface WorkspaceAuthGateProps {
  isOpen: boolean;
  onClose: () => void; // "Maybe later" — dismisses without auth
  onAuthSuccess: (user: UserSession) => void;
}

// ── Shared Input Style ──────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px 11px 40px',
  borderRadius: '10px',
  background: 'rgba(2, 6, 18, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  color: 'var(--text-secondary)',
  display: 'block',
  marginBottom: '6px',
  fontWeight: 500,
};

const iconWrapStyle: React.CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: 'var(--text-muted)',
};

// ── Google Button ────────────────────────────────────────────────
const GoogleButton: React.FC<{ label?: string }> = ({ label = 'Continue with Google' }) => (
  <button
    type="button"
    style={{
      width: '100%',
      padding: '11px 16px',
      borderRadius: '10px',
      background: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      color: '#f1f5f9',
      fontSize: '0.9rem',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'var(--font-sans)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.11)';
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
    }}
  >
    {/* Google "G" SVG */}
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
    {label}
  </button>
);

// ── Divider ──────────────────────────────────────────────────────
const OrDivider: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '4px 0',
    }}
  >
    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
      OR
    </span>
    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
  </div>
);

// ── Main Component ───────────────────────────────────────────────
export const WorkspaceAuthGate: React.FC<WorkspaceAuthGateProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [screen, setScreen] = useState<Screen>('prompt');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<UserSession | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScreen('prompt');
      setName('');
      setEmail('');
      setPassword('');
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimEmail)) { setError('Enter a valid email address.'); return; }
    if (!password) { setError('Password is required.'); return; }

    try {
      const stored = localStorage.getItem('satquery_registered_users');
      const users: UserSession[] = stored ? JSON.parse(stored) : [];
      const found = users.find((u) => u.email === trimEmail);
      if (found) {
        localStorage.setItem('satquery_active_user', JSON.stringify(found));
        onAuthSuccess(found);
        return;
      }
    } catch { /* ignore */ }
    setError('No account found with this email. Try signing up.');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimName = name.trim();
    const trimEmail = email.trim().toLowerCase();
    if (!trimName) { setError('Please enter your name.'); return; }
    if (!isValidEmail(trimEmail)) { setError('Enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    const newUser: UserSession = { name: trimName, email: trimEmail };
    try {
      const stored = localStorage.getItem('satquery_registered_users');
      const users: UserSession[] = stored ? JSON.parse(stored) : [];
      const filtered = users.filter((u) => u.email !== trimEmail);
      filtered.push(newUser);
      localStorage.setItem('satquery_registered_users', JSON.stringify(filtered));
      localStorage.setItem('satquery_active_user', JSON.stringify(newUser));
    } catch { /* ignore */ }
    setSuccess(newUser);
  };

  const goTo = (s: Screen) => { setScreen(s); setError(null); };

  // ── Overlay ────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(2, 6, 18, 0.82)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        animation: 'agFadeIn 0.22s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '20px',
          background: 'rgba(6, 12, 28, 0.95)',
          border: '1px solid rgba(0, 229, 255, 0.22)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.9), 0 0 40px rgba(0, 229, 255, 0.08)',
          padding: '36px 32px 32px',
          position: 'relative',
          animation: 'agSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ── Close Button ─────────────────────────────────────── */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          <X size={14} />
        </button>

        {/* ════════════════════════════════════════════════════════
            SCREEN: SUCCESS (post-signup)
        ════════════════════════════════════════════════════════ */}
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,229,255,0.18), rgba(34,197,94,0.18))',
                border: '2px solid #00e5ff',
                boxShadow: '0 0 24px rgba(0,229,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00e5ff',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={30} />
            </div>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '8px',
                letterSpacing: '-0.02em',
              }}
            >
              Welcome, <span style={{ color: '#00e5ff' }}>{success.name.split(' ')[0]}</span>!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '28px', lineHeight: 1.55 }}>
              Your account is ready. Returning you to your analysis…
            </p>
            <button
              onClick={() => onAuthSuccess(success)}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', gap: '8px' }}
            >
              <span>Continue to Workspace</span>
              <ArrowRight size={16} />
            </button>
          </div>

        /* ═══════════════════════════════════════════════════════
            SCREEN: PROMPT (default gate)
        ═══════════════════════════════════════════════════════ */
        ) : screen === 'prompt' ? (
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, rgba(0,229,255,0.25), rgba(15,23,42,0.8))',
                  border: '1px solid rgba(0,229,255,0.4)',
                  boxShadow: '0 0 16px rgba(0,229,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Satellite size={19} color="#00e5ff" />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                  SatQuery <span style={{ color: '#00e5ff' }}>AI</span>
                </div>
              </div>
            </div>

            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.025em',
                marginBottom: '8px',
                lineHeight: 1.25,
              }}
            >
              Continue with SatQuery AI
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.88rem',
                marginBottom: '26px',
                lineHeight: 1.5,
              }}
            >
              Sign in or create a free account to run analyses and save your results.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <GoogleButton />
              <OrDivider />

              {/* Log in */}
              <button
                onClick={() => goTo('login')}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.14) 0%, rgba(56,189,248,0.22) 100%)',
                  border: '1px solid rgba(0,229,255,0.45)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,229,255,0.25) 0%, rgba(56,189,248,0.38) 100%)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,229,255,0.14) 0%, rgba(56,189,248,0.22) 100%)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Log in
              </button>

              {/* Sign up */}
              <button
                onClick={() => goTo('signup')}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#e2e8f0',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                Sign up — it's free
              </button>

              {/* Maybe later */}
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '6px',
                  marginTop: '2px',
                  transition: 'color 0.2s ease',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                Maybe later
              </button>
            </div>
          </div>

        /* ═══════════════════════════════════════════════════════
            SCREEN: LOGIN
        ═══════════════════════════════════════════════════════ */
        ) : screen === 'login' ? (
          <div>
            {/* Back link */}
            <button
              onClick={() => goTo('prompt')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-sans)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              ← Back
            </button>

            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.025em',
                marginBottom: '6px',
              }}
            >
              Log in
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '22px' }}>
              Welcome back to SatQuery AI.
            </p>

            {/* Google */}
            <div style={{ marginBottom: '14px' }}>
              <GoogleButton />
            </div>
            <OrDivider />

            {/* Error */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5',
                  fontSize: '0.82rem',
                  margin: '10px 0',
                  lineHeight: 1.45,
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                <div>
                  {error}
                  {error.includes('signing up') && (
                    <button
                      type="button"
                      onClick={() => goTo('signup')}
                      style={{
                        marginLeft: '6px',
                        background: 'none',
                        border: 'none',
                        color: '#00e5ff',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline',
                      }}
                    >
                      Sign up
                    </button>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapStyle}><Mail size={15} /></span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapStyle}><Lock size={15} /></span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.9rem', gap: '8px', marginTop: '2px' }}
              >
                <span>Log in</span>
                <ArrowRight size={15} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <button
                onClick={() => goTo('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.83rem',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Sign up
              </button>
            </div>
          </div>

        /* ═══════════════════════════════════════════════════════
            SCREEN: SIGN UP
        ═══════════════════════════════════════════════════════ */
        ) : (
          <div>
            {/* Back link */}
            <button
              onClick={() => goTo('prompt')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-sans)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              ← Back
            </button>

            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.025em',
                marginBottom: '6px',
              }}
            >
              Create account
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '22px' }}>
              Free forever. No credit card required.
            </p>

            {/* Google */}
            <div style={{ marginBottom: '14px' }}>
              <GoogleButton label="Continue with Google" />
            </div>
            <OrDivider />

            {/* Error */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5',
                  fontSize: '0.82rem',
                  margin: '10px 0',
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapStyle}><User size={15} /></span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mohan Nagidi"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapStyle}><Mail size={15} /></span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapStyle}><Lock size={15} /></span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.9rem', gap: '8px', marginTop: '2px' }}
              >
                <span>Create account</span>
                <ArrowRight size={15} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <button
                onClick={() => goTo('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.83rem',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Log in
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes agFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes agSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
