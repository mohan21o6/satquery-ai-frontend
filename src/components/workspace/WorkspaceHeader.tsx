import React, { useState, useRef, useEffect } from 'react';
import { Crown, ChevronDown, LogOut, User as UserIcon, Shield } from 'lucide-react';
import type { UserSession } from '../AuthModal';

interface WorkspaceHeaderProps {
  onBackToLanding: () => void;
  currentUser: UserSession | null;
  onLogout: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  onBackToLanding,
  currentUser,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const displayName = currentUser?.name || 'Siddharth';
  const displayEmail = currentUser?.email || 'siddharth@satquery.ai';

  // Compute initials e.g. "Mohan Nagidi" -> "MN", "Siddharth" -> "S"
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join('') || 'U';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '68px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        background: 'rgba(3, 7, 18, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.1)',
      }}
    >
      {/* Left: Logo & Tagline (Clickable to return to Landing Page) */}
      <div
        onClick={onBackToLanding}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        title="Return to SatQuery AI Landing Page"
      >
        {/* Orbit Satellite Icon */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 35% 35%, rgba(0, 229, 255, 0.25), rgba(15, 23, 42, 0.8))',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            boxShadow: '0 0 14px rgba(0, 229, 255, 0.2)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <ellipse
              cx="12"
              cy="12"
              rx="10"
              ry="4"
              stroke="#00e5ff"
              strokeWidth="1.6"
              transform="rotate(-30 12 12)"
            />
            <circle cx="17.5" cy="8.5" r="2.2" fill="#00e5ff" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
            SatQuery <span style={{ color: '#00e5ff', textShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}>AI</span>
          </span>
          <span style={{ fontSize: '9.5px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
            See Earth · Ask More · Discover Together
          </span>
        </div>
      </div>

      {/* Right: Upgrade Button & Dynamic User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* Upgrade Button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(234, 179, 8, 0.08)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            color: '#fef08a',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(234, 179, 8, 0.16)';
            e.currentTarget.style.borderColor = '#facc15';
            e.currentTarget.style.boxShadow = '0 0 16px rgba(234, 179, 8, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(234, 179, 8, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(234, 179, 8, 0.35)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Crown size={15} color="#facc15" />
          <span>Upgrade</span>
        </button>

        {/* User Profile Area with Dropdown */}
        <div ref={menuRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: menuOpen ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              transition: 'background 0.2s ease',
            }}
          >
            {/* Avatar Circle with Initials */}
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 100%)',
                border: '1px solid rgba(147, 197, 253, 0.4)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)',
                letterSpacing: '0.02em',
              }}
            >
              {initials}
            </div>

            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
              {displayName}
            </span>

            <ChevronDown
              size={14}
              color="var(--text-secondary)"
              style={{
                transform: menuOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </div>

          {/* Profile Dropdown Menu */}
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '230px',
                borderRadius: '12px',
                background: 'rgba(5, 11, 24, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 229, 255, 0.15)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 110,
              }}
            >
              {/* User Identity Info */}
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                  {displayName}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                  {displayEmail}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '6px',
                    fontSize: '9.5px',
                    fontFamily: 'var(--font-mono)',
                    color: '#00e5ff',
                  }}
                >
                  <Shield size={11} />
                  <span>SESSION ACTIVE</span>
                </div>
              </div>

              {/* Menu items */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onBackToLanding();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#cbd5e1',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#cbd5e1';
                }}
              >
                <UserIcon size={14} color="var(--accent-cyan)" />
                <span>Landing Page</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                }}
              >
                <LogOut size={14} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
