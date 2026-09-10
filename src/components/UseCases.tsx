import React, { useState } from 'react';
import { ArrowRight, Sprout, AlertTriangle, Building2, Trees, Droplets, Compass } from 'lucide-react';

interface UseCasesProps {
  onSelectCase?: (title: string) => void;
}

export const UseCases: React.FC<UseCasesProps> = ({ onSelectCase }) => {
  const [activeModalCase, setActiveModalCase] = useState<any | null>(null);

  const cases = [
    {
      id: 'agriculture',
      title: 'Agricultural\nLand Change',
      shortTitle: 'Agricultural Land Change',
      image: '/assets/usecase_agriculture.svg',
      icon: Sprout,
      payload: 'Sentinel-2 & Landsat-9 (Multispectral)',
      query: 'Detect agricultural parcel changes and land conversion over temporal seasons.',
      detail: 'Monitors parcel-level land use change, fallow field transitions, and agricultural development over multi-year satellite acquisitions.',
    },
    {
      id: 'disaster',
      title: 'Flood Impact\nChange Mapping',
      shortTitle: 'Flood Impact Change Mapping',
      image: '/assets/usecase_disaster.svg',
      icon: AlertTriangle,
      payload: 'Bi-Temporal Pre/Post-Event Optical',
      query: 'Detect flood impact extent and water coverage changes between pre- and post-flood imagery.',
      detail: 'Compares baseline and post-disaster acquisitions to map inundated surface change and infrastructure disruption.',
    },
    {
      id: 'urban',
      title: 'Urban Growth\nDetection',
      shortTitle: 'Urban Growth Detection',
      image: '/assets/usecase_urban.svg',
      icon: Building2,
      payload: 'Very High Resolution (VHR Optical)',
      query: 'Detect new built-up structures and infrastructure expansion over time.',
      detail: 'Identifies building footprints and road expansion by comparing bi-temporal high-resolution satellite imagery.',
    },
    {
      id: 'forest',
      title: 'Deforestation\nChange Tracking',
      shortTitle: 'Deforestation Change Tracking',
      image: '/assets/usecase_forest.svg',
      icon: Trees,
      payload: 'Bi-Temporal Satellite Optical',
      query: 'Detect canopy change and clear-cut boundaries between temporal acquisitions.',
      detail: 'Tracks changes in forest cover and cleared land boundaries between baseline and recent satellite passes.',
    },
    {
      id: 'water',
      title: 'Water Body\nSurface Shift',
      shortTitle: 'Water Body Surface Shift',
      image: '/assets/usecase_water.svg',
      icon: Droplets,
      payload: 'Bi-Temporal Multispectral Satellite',
      query: 'Detect reservoir surface area changes and shoreline shifts.',
      detail: 'Quantifies freshwater surface boundary changes and lake extent shifts across temporal satellite captures.',
    },
    {
      id: 'defense',
      title: 'Infrastructure\nMonitoring',
      shortTitle: 'Infrastructure Monitoring',
      image: '/assets/usecase_defense.svg',
      icon: Compass,
      payload: 'Optical Bi-Temporal Imagery',
      query: 'Detect new ground earthworks, construction pads, and perimeter alterations.',
      detail: 'Pinpoints physical surface changes, earthmoving activities, and structural developments across consecutive surveys.',
    },
  ];

  return (
    <section
      id="use-cases"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: '100px 0 120px',
      }}
    >
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '24px',
            marginBottom: '48px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span className="eyebrow">USE CASES</span>
            <h2 className="section-title" style={{ marginBottom: '12px' }}>
              Real Problems. Real Impact.
            </h2>
            <p className="section-subtitle">
              From agriculture to disaster response, SatQuery AI helps unlock the value of satellite data across diverse domains.
            </p>
          </div>

          <button
            onClick={() => setActiveModalCase(cases[0])}
            className="btn-pill-cyan"
            style={{
              padding: '9px 22px',
              fontSize: '0.875rem',
            }}
          >
            <span>View All Use Cases</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* 6 Image Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '16px',
          }}
          className="use-cases-grid"
        >
          {cases.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                onClick={() => {
                  setActiveModalCase(c);
                  onSelectCase?.(c.shortTitle);
                }}
                style={{
                  position: 'relative',
                  height: '270px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: '#0a101f',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="use-case-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.6)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 229, 255, 0.18)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                {/* Background Satellite Image */}
                <img
                  src={c.image}
                  alt={c.shortTitle}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />

                {/* Dark Vignette Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(3, 7, 18, 0.95) 0%, rgba(3, 7, 18, 0.3) 55%, rgba(3, 7, 18, 0.1) 100%)',
                  }}
                />

                {/* Content at Bottom */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    zIndex: 2,
                  }}
                >
                  {/* Small Circular Icon Badge */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(3, 7, 18, 0.75)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(0, 229, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    <Icon size={16} strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: '#ffffff',
                      whiteSpace: 'pre-line',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {c.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal if clicked */}
      {activeModalCase && (
        <div
          onClick={() => setActiveModalCase(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '32px',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              boxShadow: '0 20px 60px rgba(0, 229, 255, 0.2)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 229, 255, 0.1)',
                  border: '1px solid var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                }}
              >
                {React.createElement(activeModalCase.icon, { size: 24 })}
              </div>
              <div>
                <span className="eyebrow" style={{ marginBottom: '4px' }}>USE CASE INTEL</span>
                <h3 style={{ fontSize: '1.35rem', color: '#fff' }}>{activeModalCase.shortTitle}</h3>
              </div>
            </div>

            <div style={{ height: '180px', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
              <img src={activeModalCase.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                  TYPICAL PAYLOAD
                </div>
                <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{activeModalCase.payload}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                  SAMPLE NATURAL QUERY
                </div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', fontStyle: 'italic', background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '6px' }}>
                  "{activeModalCase.query}"
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                  ANALYSIS CAPABILITY
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {activeModalCase.detail}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setActiveModalCase(null)}
                className="btn-secondary"
                style={{ padding: '8px 20px', fontSize: '0.875rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1100px) {
          .use-cases-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 640px) {
          .use-cases-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};
