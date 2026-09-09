import React from 'react';
import { ArrowRight, Cpu, Clock, ShieldCheck, Globe2 } from 'lucide-react';

interface AboutSectionProps {
  onLearnMore?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore }) => {
  const features = [
    {
      icon: Cpu,
      title: 'MULTI-SENSOR\nANALYSIS',
      description: 'Fuse optical, SAR, and multispectral payloads seamlessly.',
    },
    {
      icon: Clock,
      title: 'MULTI-TEMPORAL\nINSIGHTS',
      description: 'Quantify bi-temporal structural shifts and environmental change.',
    },
    {
      icon: ShieldCheck,
      title: 'EVIDENCE-BASED\nANSWERS',
      description: 'Generate verifiable bounding boxes and segmented heatmaps.',
    },
    {
      icon: Globe2,
      title: 'REAL-WORLD\nAPPLICATIONS',
      description: 'Accelerate decision-making for climate, urban, and emergency response.',
    },
  ];

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: '100px 0 120px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}
          className="about-grid"
        >
          {/* Left Column: Heading & Mission Copy */}
          <div>
            <span className="eyebrow">ABOUT SATQUERY AI</span>
            <h2
              className="section-title"
              style={{
                fontSize: 'clamp(2.2rem, 3.6vw, 3.1rem)',
                maxWidth: '520px',
                marginBottom: '22px',
              }}
            >
              Turning Satellite Data<br />
              into Real-World Intelligence
            </h2>
            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                maxWidth: '490px',
              }}
            >
              SatQuery AI combines state-of-the-art vision-language models with specialized
              remote-sensing AI tools to make Earth observation accessible to everyone —
              from researchers to policymakers.
            </p>

            <button
              onClick={onLearnMore}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-cyan)',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '4px 0',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span>Learn more</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right Column: 4 Compact Feature Blocks */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
            }}
            className="feature-blocks-grid"
          >
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(0, 229, 255, 0.08)',
                      border: '1px solid rgba(0, 229, 255, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    <Icon size={20} strokeWidth={1.75} />
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: '#ffffff',
                      lineHeight: 1.35,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {feat.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55,
                    }}
                  >
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 540px) {
          .feature-blocks-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
