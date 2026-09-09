import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, Lock, Mail, User, AlertCircle, Sparkles } from 'lucide-react';

export interface UserSession {
  name: string;
  email: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'success'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<UserSession | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Validate email format
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  // Handle Signup
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Frontend simulation: register user into localStorage accounts list
    const newUser: UserSession = { name: trimmedName, email: trimmedEmail };
    try {
      const stored = localStorage.getItem('satquery_registered_users');
      const users: UserSession[] = stored ? JSON.parse(stored) : [];
      // Replace or add user
      const filtered = users.filter((u) => u.email !== trimmedEmail);
      filtered.push(newUser);
      localStorage.setItem('satquery_registered_users', JSON.stringify(filtered));
      localStorage.setItem('satquery_active_user', JSON.stringify(newUser));
    } catch {
      // Local storage fallback
    }

    setCreatedUser(newUser);
    setMode('success');
  };

  // Handle Login
  const handleLogIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    // Check simulated accounts
    try {
      const stored = localStorage.getItem('satquery_registered_users');
      const users: UserSession[] = stored ? JSON.parse(stored) : [];
      const found = users.find((u) => u.email === trimmedEmail);

      if (found) {
        localStorage.setItem('satquery_active_user', JSON.stringify(found));
        onAuthSuccess(found);
        onClose();
        return;
      }
    } catch {
      // ignore
    }

    // If email is not in registered list, show clean message
    setError('No account found with this email. Create an account to continue.');
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(2, 6, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px 32px',
          borderRadius: '20px',
          border: '1px solid rgba(0, 229, 255, 0.35)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 229, 255, 0.12)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <X size={15} />
        </button>

        {/* MODE: SUCCESS */}
        {mode === 'success' ? (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)',
                border: '2px solid #00e5ff',
                boxShadow: '0 0 24px rgba(0, 229, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00e5ff',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <span
              className="eyebrow"
              style={{
                marginBottom: '8px',
                color: 'var(--accent-cyan)',
              }}
            >
              ACCOUNT CREATED
            </span>

            <h2
              style={{
                fontSize: '1.65rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '10px',
                letterSpacing: '-0.02em',
              }}
            >
              Welcome to SatQuery <span className="cyan-text">AI</span>
            </h2>

            <p
              style={{
                fontSize: '0.925rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '28px',
              }}
            >
              Hello, <strong style={{ color: '#ffffff' }}>{createdUser?.name}</strong>. Your workspace
              profile has been initialized and is ready for remote sensing queries.
            </p>

            <button
              onClick={() => {
                if (createdUser) {
                  onAuthSuccess(createdUser);
                  onClose();
                }
              }}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '1rem',
                gap: '8px',
              }}
            >
              <span>Start Exploring</span>
              <ArrowRight size={17} />
            </button>
          </div>
        ) : mode === 'signup' ? (
          /* MODE: SIGN UP */
          <div>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} color="var(--accent-cyan)" />
                <span className="eyebrow" style={{ margin: 0 }}>
                  NEW RESEARCHER ACCESS
                </span>
              </div>

              <h2
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '6px',
                  letterSpacing: '-0.02em',
                }}
              >
                Create your SatQuery AI account
              </h2>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Start exploring satellite imagery with AI.
              </p>
            </div>

            {/* Error message if any */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5',
                  fontSize: '0.825rem',
                  marginBottom: '18px',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Full Name */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '12px' }}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mohan Nagidi"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      background: 'rgba(3, 7, 18, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '12px' }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      background: 'rgba(3, 7, 18, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '12px' }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      background: 'rgba(3, 7, 18, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '12px' }}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      background: 'rgba(3, 7, 18, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary"
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.95rem',
                  gap: '8px',
                }}
              >
                <span>Create Account</span>
                <ArrowRight size={16} />
              </button>

              {/* Switch to Login Link */}
              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-cyan)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* MODE: LOGIN */
          <div>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Lock size={16} color="var(--accent-cyan)" />
                <span className="eyebrow" style={{ margin: 0 }}>
                  PORTAL ACCESS
                </span>
              </div>

              <h2
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '6px',
                  letterSpacing: '-0.02em',
                }}
              >
                Log in to SatQuery AI
              </h2>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Enter your account credentials to access satellite workspaces.
              </p>
            </div>

            {/* Error message if any */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5',
                  fontSize: '0.825rem',
                  marginBottom: '18px',
                  lineHeight: 1.45,
                }}
              >
                <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div>{error}</div>
                  {error.includes('No account found') && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setError(null);
                      }}
                      style={{
                        marginTop: '6px',
                        background: 'rgba(0, 229, 255, 0.15)',
                        border: '1px solid #00e5ff',
                        color: '#00e5ff',
                        borderRadius: '4px',
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Switch to Sign Up →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Email */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '12px' }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      background: 'rgba(3, 7, 18, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '12px' }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      background: 'rgba(3, 7, 18, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary"
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.95rem',
                  gap: '8px',
                }}
              >
                <span>Log In</span>
                <ArrowRight size={16} />
              </button>

              {/* Switch to Sign Up Link */}
              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-cyan)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Create one
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
