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
      title: 'Agriculture\nMonitoring',
      shortTitle: 'Agriculture Monitoring',
      image: '/assets/usecase_agriculture.svg',
      icon: Sprout,
      payload: 'Sentinel-2 & Landsat-9 (Multispectral)',
      query: 'Detect crop yield health, NDVI anomalies, and soil moisture stress.',
      detail: 'Monitors parcel-level vegetative indices, nitrogen deficiency, and circular pivot irrigation performance over regional farming belts.',
    },
    {
      id: 'disaster',
      title: 'Disaster\nManagement',
      shortTitle: 'Disaster Management',
      image: '/assets/usecase_disaster.svg',
      icon: AlertTriangle,
      payload: 'SAR (Sentinel-1) + Optical Post-Event',
      query: 'Delineate flash flood extent and identify submerged residential zones.',
      detail: 'Rapid synthetic aperture radar penetration through storm cloud cover to output emergency responder evacuation routes and flood inundation masks.',
    },
    {
      id: 'urban',
      title: 'Urban\nPlanning',
      shortTitle: 'Urban Planning',
      image: '/assets/usecase_urban.svg',
      icon: Building2,
      payload: 'Very High Resolution (VHR 30cm)',
      query: 'Trace impervious surface growth and unauthorized zoning encroachment.',
      detail: 'Extracts 3D building heights, road infrastructure densification, and green space loss for municipal GIS administration.',
    },
    {
      id: 'forest',
      title: 'Forest\nMonitoring',
      shortTitle: 'Forest Monitoring',
      image: '/assets/usecase_forest.svg',
      icon: Trees,
      payload: 'PlanetScope + SAR L-Band',
      query: 'Quantify illegal canopy loss and wildfire burn perimeter progression.',
      detail: 'Daily persistent orbital tracking of deforestation corridors, carbon sequestration reserves, and selective logging margins.',
    },
    {
      id: 'water',
      title: 'Water Resource\nAssessment',
      shortTitle: 'Water Resource Assessment',
      image: '/assets/usecase_water.svg',
      icon: Droplets,
      payload: 'MODIS + Sentinel-3 Ocean Land Colour',
      query: 'Measure reservoir bathymetry depletion and algal bloom proliferation.',
      detail: 'Quantifies inland freshwater reservoir volume depletion, coastal sediment discharge, and turbidity levels across river deltas.',
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure\nMapping',
      shortTitle: 'Infrastructure Mapping',
      image: '/assets/usecase_infrastructure.svg',
      icon: Compass,
      payload: 'Stereo Optical & Interferometric SAR',
      query: 'Inspect structural deformation on bridges, railways, and ports.',
      detail: 'Millimeter-accurate InSAR subsidence measurements across critical transport corridors, highway interchanges, and maritime terminals.',
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
