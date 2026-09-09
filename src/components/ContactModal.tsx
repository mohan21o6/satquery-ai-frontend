import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'contact' | 'login';
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, mode = 'contact' }) => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(2, 6, 18, 0.85)',
        backdropFilter: 'blur(16px)',
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
          maxWidth: '480px',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid rgba(0, 229, 255, 0.35)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 229, 255, 0.15)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={15} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(0, 229, 255, 0.15)',
                border: '1px solid #00e5ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00e5ff',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
              {mode === 'login' ? 'Authentication Requested' : 'Transmission Received'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {mode === 'login'
                ? 'Magic link sent to your aerospace organization account.'
                : 'Our remote sensing engineering team will contact you shortly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span className="eyebrow" style={{ marginBottom: '4px' }}>
                {mode === 'login' ? 'PORTAL ACCESS' : 'CONNECT WITH TEAM'}
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#fff' }}>
                {mode === 'login' ? 'Log in to SatQuery AI' : 'Contact SatQuery AI'}
              </h2>
            </div>

            {mode === 'contact' && (
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Full Name / Organization
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. A. Sharma / Space Applications Centre"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(3, 7, 18, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Work / Institutional Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.gov or name@domain.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(3, 7, 18, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {mode === 'contact' && (
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Inquiry Details
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your remote sensing imagery format, research project, or enterprise query..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(3, 7, 18, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.9rem',
                    resize: 'none',
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
              }}
            >
              <span>{mode === 'login' ? 'Request Login Link' : 'Send Message'}</span>
              <Send size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
