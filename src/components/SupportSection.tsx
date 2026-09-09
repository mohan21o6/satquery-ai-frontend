import React, { useState } from 'react';
import { Mail, BookOpen, MessageCircle, Copy, Check } from 'lucide-react';

interface SupportSectionProps {
  onContactSupport?: () => void;
  onViewDocs?: () => void;
}

export const SupportSection: React.FC<SupportSectionProps> = ({ onContactSupport, onViewDocs }) => {
  const [copied, setCopied] = useState(false);
  const email = 'support@satquery.ai';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="support"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: '0 0 100px',
      }}
    >
      <div className="container">
        <div
          className="glass-panel"
          style={{
            padding: '36px 44px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            background: 'linear-gradient(135deg, rgba(8, 17, 34, 0.85) 0%, rgba(4, 9, 21, 0.7) 100%)',
            flexWrap: 'wrap',
          }}
        >
          {/* Left: Heading & description */}
          <div>
            <span className="eyebrow" style={{ marginBottom: '6px' }}>
              ASSISTANCE & ENTERPRISE
            </span>
            <h3
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '8px',
                letterSpacing: '-0.02em',
              }}
            >
              Need Help?
            </h3>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                maxWidth: '480px',
                lineHeight: 1.6,
              }}
            >
              Have a question about supported imagery, models, or remote sensing workflows?
              Our scientific team is available for custom deployment support.
            </p>
          </div>

          {/* Right: Actions & Email */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={onContactSupport}
                className="btn-primary"
                style={{ padding: '10px 22px', fontSize: '0.9rem' }}
              >
                <MessageCircle size={16} />
                <span>Contact Support</span>
              </button>

              <button
                onClick={onViewDocs}
                className="btn-secondary"
                style={{ padding: '10px 22px', fontSize: '0.9rem' }}
              >
                <BookOpen size={16} />
                <span>Documentation</span>
              </button>
            </div>

            {/* Clickable and copyable email */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Mail size={15} color="var(--accent-cyan)" />
              <a
                href={`mailto:${email}`}
                style={{
                  color: '#f8fafc',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                {email}
              </a>
              <button
                onClick={handleCopyEmail}
                title="Copy email to clipboard"
                aria-label="Copy support email"
                style={{
                  background: 'none',
                  border: 'none',
                  color: copied ? '#00e5ff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
              {copied && (
                <span style={{ fontSize: '11px', color: '#00e5ff', fontFamily: 'var(--font-mono)' }}>
                  Copied!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
