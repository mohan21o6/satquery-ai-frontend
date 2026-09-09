import React from 'react';
import { ArrowRight, Image as ImageIcon, Layers, Clock, FileCode, CheckCircle } from 'lucide-react';

interface SupportedInputsProps {
  onViewDocs?: () => void;
}

export const SupportedInputs: React.FC<SupportedInputsProps> = ({ onViewDocs }) => {
  const inputTypes = [
    {
      id: 'single',
      icon: ImageIcon,
      title: 'Single Image',
      desc: 'Optical, multispectral or SAR image for VQA, captioning or grounding.',
      bands: 'RGB, NIR, RedEdge, SWIR, C-Band / L-Band VV+VH polarizations',
    },
    {
      id: 'pair-sar',
      icon: Layers,
      title: 'Optical + SAR Pair',
      desc: 'Co-registered optical and SAR images for joint analysis.',
      bands: 'Optical multispectral aligned with SAR amplitude and interferometric phase',
    },
    {
      id: 'bitemporal',
      icon: Clock,
      title: 'Bi-temporal Pair',
      desc: 'Two images of the same area at different dates for change detection and VQA.',
      bands: 'Timestamp T1 vs T2 co-referenced with spatial distortion correction',
    },
  ];

  const formats = [
    { name: 'GeoTIFF', badge: 'Recommended', color: 'var(--accent-cyan)' },
    { name: 'TIFF', badge: null, color: null },
    { name: 'PNG', badge: 'Benchmark datasets', color: 'var(--text-muted)' },
    { name: 'JPEG', badge: 'Benchmark datasets', color: 'var(--text-muted)' },
  ];

  return (
    <section
      id="inputs"
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
            <span className="eyebrow">SUPPORTED INPUTS</span>
            <h2 className="section-title" style={{ marginBottom: '12px' }}>
              Flexible Inputs. Broad Compatibility.
            </h2>
            <p className="section-subtitle">
              SatQuery AI supports single images, paired images, and multiple formats for remote sensing data.
            </p>
          </div>

          <button
            onClick={onViewDocs}
            className="btn-pill-cyan"
            style={{
              padding: '9px 22px',
              fontSize: '0.875rem',
            }}
          >
            <span>View Documentation</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Layout: 3 Input Cards Left, 1 Formats Panel Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2.4fr 1fr',
            gap: '24px',
            alignItems: 'stretch',
          }}
          className="inputs-layout"
        >
          {/* 3 Main Input Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '18px',
            }}
            className="input-cards-grid"
          >
            {inputTypes.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="glass-panel"
                  style={{
                    padding: '30px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(0, 229, 255, 0.08)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                      flex: 1,
                    }}
                  >
                    {item.desc}
                  </p>

                  <div
                    style={{
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.bands}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Formats Panel */}
          <div
            className="glass-panel"
            style={{
              padding: '30px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}
              >
                SUPPORTED FORMATS
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {formats.map((fmt, fIdx) => (
                  <div
                    key={fIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(4, 9, 21, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileCode size={16} color="var(--accent-cyan)" />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                        {fmt.name}
                      </span>
                    </div>

                    {fmt.badge && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background:
                            fmt.badge === 'Recommended'
                              ? 'rgba(0, 229, 255, 0.15)'
                              : 'rgba(255, 255, 255, 0.06)',
                          color: fmt.badge === 'Recommended' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                          border:
                            fmt.badge === 'Recommended'
                              ? '1px solid rgba(0, 229, 255, 0.35)'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                          fontWeight: 500,
                        }}
                      >
                        {fmt.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}
            >
              <CheckCircle size={14} color="#00e5ff" />
              <span>Full EPSG coordinate & CRS preservation</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 990px) {
          .inputs-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 680px) {
          .input-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
