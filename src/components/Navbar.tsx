import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenTry: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenTry, onOpenLogin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.35s ease',
        background: isScrolled
          ? 'rgba(4, 9, 21, 0.78)'
          : 'linear-gradient(to bottom, rgba(3, 7, 18, 0.75) 0%, rgba(3, 7, 18, 0) 100%)',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid transparent',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Left: Logo & Tagline */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: '#fff',
          }}
        >
          {/* Minimal Satellite/Orbit Icon */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at 35% 35%, rgba(0, 229, 255, 0.25), rgba(15, 23, 42, 0.8))',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              boxShadow: '0 0 16px rgba(0, 229, 255, 0.25)',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
            <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              SatQuery <span style={{ color: '#00e5ff', textShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }}>AI</span>
            </span>
            <span
              style={{
                fontSize: '9.5px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em',
                fontWeight: 400,
                whiteSpace: 'nowrap',
              }}
            >
              See Earth · Ask More · Discover Together
            </span>
          </div>
        </a>

        {/* Center: Navigation Links (Desktop) */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <button
            onClick={() => scrollToSection('about')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('models')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Models
          </button>
          <button
            onClick={() => scrollToSection('use-cases')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Use Cases
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Resources
          </button>
          <button
            onClick={() => scrollToSection('about')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            About
          </button>
        </nav>

        {/* Right: Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search SatQuery documentation"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Search size={16} />
          </button>

          {/* Log in Button */}
          <button
            onClick={onOpenLogin}
            className="btn-login"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#f8fafc',
              padding: '7px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ffffff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Log in
          </button>

          {/* Primary CTA: Try SatQuery AI */}
          <button
            onClick={onOpenTry}
            className="btn-try"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(56, 189, 248, 0.25) 100%)',
              border: '1px solid rgba(0, 229, 255, 0.5)',
              color: '#ffffff',
              padding: '7px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(0, 229, 255, 0.25)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 229, 255, 0.3) 0%, rgba(56, 189, 248, 0.4) 100%)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 229, 255, 0.45)';
              e.currentTarget.style.borderColor = '#00e5ff';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(56, 189, 248, 0.25) 100%)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 229, 255, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.5)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>Try SatQuery AI</span>
            <ArrowUpRight size={15} color="#00e5ff" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle Navigation Menu"
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              display: 'none',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(5, 11, 24, 0.96)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
            padding: '20px 24px 30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <button
            onClick={() => scrollToSection('about')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              textAlign: 'left',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('models')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              textAlign: 'left',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            Models
          </button>
          <button
            onClick={() => scrollToSection('use-cases')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              textAlign: 'left',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            Use Cases
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              textAlign: 'left',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            Resources
          </button>
          <button
            onClick={() => scrollToSection('about')}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '1rem',
              textAlign: 'left',
              padding: '10px 0',
            }}
          >
            About
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (max-width: 520px) {
          .btn-login {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
