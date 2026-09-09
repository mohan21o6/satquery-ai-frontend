import React from 'react';
import { Image as ImageIcon, Layers, Network, MessageSquare, Sparkles } from 'lucide-react';

interface CapabilityBarProps {
  onSelectCapability?: (cap: string) => void;
}

export const CapabilityBar: React.FC<CapabilityBarProps> = ({ onSelectCapability }) => {
  const capabilities = [
    {
      id: 'single-image',
      icon: ImageIcon,
      title: 'Single Image\nUnderstanding',
    },
    {
      id: 'change-detection',
      icon: Layers,
      title: 'Change\nDetection',
    },
    {
      id: 'optical-sar',
      icon: Network,
      title: 'Optical + SAR\nFusion',
    },
    {
      id: 'natural-language',
      icon: MessageSquare,
      title: 'Ask in\nNatural Language',
    },
    {
      id: 'real-world',
      icon: Sparkles,
      title: 'Real-World\nImpact',
    },
  ];

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 10,
        marginTop: '-70px',
        paddingBottom: '80px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px',
            alignItems: 'start',
            maxWidth: '1040px',
            margin: '0 auto',
          }}
          className="capabilities-grid"
        >
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onSelectCapability?.(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {/* Icon Badge */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(8, 17, 34, 0.75)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 229, 255, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)',
                    boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)',
                    marginBottom: '14px',
                    transition: 'all 0.25s ease',
                  }}
                  className="cap-icon-box"
                >
                  <Icon size={21} strokeWidth={1.75} />
                </div>

                {/* Title */}
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    lineHeight: 1.35,
                    color: '#f1f5f9',
                    whiteSpace: 'pre-line',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .capabilities-grid {
            grid-templateColumns: repeat(3, 1fr) !important;
            gap: 20px 8px !important;
          }
        }
        @media (max-width: 480px) {
          .capabilities-grid {
            grid-templateColumns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};
