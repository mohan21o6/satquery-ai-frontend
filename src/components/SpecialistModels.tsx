import React, { useState } from 'react';
import { Eye, Target, Clock4, Layers, Check, Cpu } from 'lucide-react';

export const SpecialistModels: React.FC = () => {
  const [activeModel, setActiveModel] = useState<number>(0);

  const models = [
    {
      id: 'model-01',
      num: '01',
      name: 'Siamese ViT Encoder',
      tag: 'FEATURE EXTRACTION',
      icon: Eye,
      arch: 'Dual-Branch Siamese Vision Transformer',
      params: 'ChangeFormer Encoder',
      capabilities: [
        'Hierarchical multi-scale feature maps',
        'Co-registered patch embedding',
        'Dual-temporal weight sharing',
        'Long-range spatial relation modeling',
      ],
    },
    {
      id: 'model-02',
      num: '02',
      name: 'Spatial Difference Neck',
      tag: 'TEMPORAL COMPARISON',
      icon: Target,
      arch: 'Multi-Scale Feature Subtraction',
      params: '4-Stage Difference Module',
      capabilities: [
        'Scale-wise feature differential mapping',
        'Spatial distortion alignment',
        'Suppression of seasonal illumination shifts',
        'Fine structural boundary preservation',
      ],
    },
    {
      id: 'model-03',
      num: '03',
      name: 'Contextual Transformer',
      tag: 'ATTENTION REFINEMENT',
      icon: Clock4,
      arch: 'Multi-Head Self-Attention Decoder',
      params: 'Transformer Decoder',
      capabilities: [
        'Global contextual attention fusion',
        'Cross-scale feature upsampling',
        'Noise filtering & edge sharpening',
        'Bitemporal change correlation',
      ],
    },
    {
      id: 'model-04',
      num: '04',
      name: 'Binary Pixel Head',
      tag: 'OUTPUT MASK GENERATION',
      icon: Layers,
      arch: '256×256 Segmentation Classifier',
      params: 'Sigmoid Probability Output',
      capabilities: [
        '256×256 binary change mask (0 / 255)',
        'Precise changed pixel count calculation',
        'Total pixel surface ratio telemetry',
        'Exportable lossless PNG change maps',
      ],
    },
  ];

  return (
    <section
      id="models"
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
            maxWidth: '680px',
            marginBottom: '52px',
          }}
        >
          <span className="eyebrow">CHANGEFORMER ARCHITECTURE</span>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            Siamese Transformer.<br />Pixel-Level Precision.
          </h2>
          <p className="section-subtitle">
            SatQuery AI leverages the ChangeFormer transformer architecture to deliver accurate, pixel-level binary change detection across bi-temporal satellite acquisitions.
          </p>
        </div>

        {/* 4 Clean Model Modules Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}
          className="models-grid"
        >
          {models.map((m, idx) => {
            const Icon = m.icon;
            const isSelected = activeModel === idx;
            return (
              <div
                key={m.id}
                onClick={() => setActiveModel(idx)}
                style={{
                  padding: '30px 24px',
                  borderRadius: '16px',
                  background: isSelected ? 'rgba(10, 20, 42, 0.85)' : 'rgba(6, 12, 26, 0.65)',
                  backdropFilter: 'blur(16px)',
                  border: isSelected ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? '0 8px 30px rgba(0, 229, 255, 0.2)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="model-card"
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                {/* Header: Model Number & Tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    MODEL {m.num}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#00e5ff',
                        boxShadow: '0 0 8px #00e5ff',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9.5px',
                        color: 'var(--accent-cyan)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      ONLINE
                    </span>
                  </div>
                </div>

                {/* Model Name & Category */}
                <div>
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
                      marginBottom: '14px',
                    }}
                  >
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      marginBottom: '6px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {m.name}
                  </h3>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10.5px',
                      color: 'var(--accent-cyan)',
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                    }}
                  >
                    {m.tag}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)' }} />

                {/* Capabilities Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Capabilities:
                  </span>
                  {m.capabilities.map((cap, cIdx) => (
                    <div
                      key={cIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '0.825rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                      }}
                    >
                      <Check size={14} color="#00e5ff" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>

                {/* Architecture stats */}
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(3, 7, 18, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Cpu size={14} color="#38bdf8" />
                  <span style={{ color: '#cbd5e1' }}>{m.params}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1040px) {
          .models-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .models-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
