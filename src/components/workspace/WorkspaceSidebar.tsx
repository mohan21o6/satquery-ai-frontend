import React from 'react';
import { MessageSquarePlus, Compass, FolderKanban, Database, Settings } from 'lucide-react';

interface WorkspaceSidebarProps {
  activeNav: string;
  onSelectNav: (nav: string) => void;
  onNewChat: () => void;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  activeNav,
  onSelectNav,
  onNewChat,
}) => {
  const navItems = [
    { id: 'new-chat', label: 'New Chat', icon: MessageSquarePlus, isPrimary: true },
    { id: 'explore', label: 'Explore Examples', icon: Compass },
    { id: 'analyses', label: 'My Analyses', icon: FolderKanban },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        top: '68px',
        left: 0,
        bottom: 0,
        width: '210px',
        zIndex: 90,
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'rgba(3, 7, 18, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(56, 189, 248, 0.08)',
        pointerEvents: 'auto',
      }}
    >
      {/* Top Nav Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isPrimary ? activeNav === 'new-chat' : activeNav === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={onNewChat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.18) 0%, rgba(2, 132, 199, 0.25) 100%)',
                  border: '1px solid rgba(0, 229, 255, 0.45)',
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '10px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 28px rgba(0, 229, 255, 0.35)';
                  e.currentTarget.style.borderColor = '#00e5ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.45)';
                }}
              >
                <Icon size={18} color="#00e5ff" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectNav(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: 'none',
                color: isActive ? '#ffffff' : 'rgba(203, 213, 225, 0.75)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isActive ? '#ffffff' : 'rgba(203, 213, 225, 0.75)';
                e.currentTarget.style.background = isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent';
              }}
            >
              <Icon size={17} color={isActive ? '#00e5ff' : 'currentColor'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Technical Tagline */}
      <div
        style={{
          padding: '12px 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9.5px',
          letterSpacing: '0.04em',
          lineHeight: 1.6,
          color: 'rgba(148, 163, 184, 0.65)',
        }}
      >
        <div style={{ color: '#e2e8f0', fontWeight: 600 }}>Earth for a</div>
        <div style={{ color: '#e2e8f0', fontWeight: 600 }}>Better Tomorrow</div>
        <div style={{ width: '16px', height: '1px', background: 'rgba(56, 189, 248, 0.4)', margin: '6px 0' }} />
        <div>Powered by</div>
        <div>Satellite Data & AI</div>
      </div>
    </aside>
  );
};
