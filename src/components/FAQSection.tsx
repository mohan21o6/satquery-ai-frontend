import React, { useState } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    // Column 1
    {
      q: 'What types of satellite images can I upload?',
      a: 'You can upload high-resolution optical (RGB, multispectral), Synthetic Aperture Radar (SAR Sentinel-1, TerraSAR-X), and hyperspectral imagery in GeoTIFF, TIFF, PNG, or JPEG formats. Full geospatial coordinate systems (CRS) are preserved.',
      col: 1,
    },
    {
      q: 'Is there a file size limit?',
      a: 'The cloud interactive platform supports individual file uploads up to 2GB via chunked streaming. Enterprise self-hosted or dedicated deployments handle terabyte-scale imagery tiles and continuous raster pipelines without restrictions.',
      col: 1,
    },
    {
      q: 'Can I analyze change between two dates?',
      a: 'Yes. SatQuery AI features specialized bi-temporal Siamese Vision-Language models. Simply provide two co-registered scenes from different dates (e.g. 2022 vs 2024), and ask natural questions like "What changed in this industrial zone?".',
      col: 1,
    },
    {
      q: 'Do I need GIS expertise to use SatQuery AI?',
      a: 'No GIS experience is required. The vision-language assistant translates complex geospatial raster operations, spectral indices, and bounding-box queries into intuitive natural language conversations and visual evidence overlays.',
      col: 1,
    },

    // Column 2
    {
      q: 'What models power SatQuery AI?',
      a: 'SatQuery AI orchestrates a multi-agent suite of domain-tuned models: Remote-Sensing VLM for visual dialogue, SAM-Geo / Grounding-DINO-RS for spatial localization, Siamese ViT for bi-temporal change detection, and cross-attention SAR-Optical encoders.',
      col: 2,
    },
    {
      q: 'Can I use optical and SAR images together?',
      a: 'Absolutely. SatQuery AI is engineered for multi-sensor fusion. It co-registers optical imagery with SAR polarizations (VV/VH), letting you penetrate cloud cover and obtain all-weather structural roughness and surface moisture readings.',
      col: 2,
    },
    {
      q: 'Is my data stored or shared?',
      a: 'Your imagery and queries are processed in isolated, encrypted ephemeral containers with TLS 1.3 in-transit and AES-256 at rest. We never use proprietary customer satellite imagery to train baseline public models.',
      col: 2,
    },
    {
      q: 'How can I get support?',
      a: 'Our engineering support team is reachable 24/7 at support@satquery.ai. We provide dedicated onboarding, API documentation, and integration support for aerospace organizations and research institutes.',
      col: 2,
    },
  ];

  const col1Faqs = faqs.filter((f) => f.col === 1);
  const col2Faqs = faqs.filter((f) => f.col === 2);

  return (
    <section
      id="faq"
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
            <span className="eyebrow">FAQ</span>
            <h2 className="section-title" style={{ marginBottom: '12px' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <button
            onClick={() => setOpenItems([0, 1, 2, 3, 4, 5, 6, 7])}
            className="btn-pill-cyan"
            style={{
              padding: '9px 22px',
              fontSize: '0.875rem',
            }}
          >
            <span>View All FAQs</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* 2-Column Accordion */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
          className="faq-grid"
        >
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {col1Faqs.map((item, idx) => {
              const actualIdx = idx;
              const isOpen = openItems.includes(actualIdx);
              return (
                <div
                  key={actualIdx}
                  onClick={() => toggleItem(actualIdx)}
                  className="glass-panel"
                  style={{
                    padding: '22px 24px',
                    cursor: 'pointer',
                    borderColor: isOpen ? 'rgba(0, 229, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isOpen ? '0 8px 24px rgba(0, 229, 255, 0.1)' : 'none',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: isOpen ? '#ffffff' : '#e2e8f0',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item.q}
                    </span>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isOpen ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: isOpen ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isOpen ? '#00e5ff' : 'var(--text-secondary)',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </div>

                  {isOpen && (
                    <div
                      style={{
                        marginTop: '14px',
                        paddingTop: '14px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.65,
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {col2Faqs.map((item, idx) => {
              const actualIdx = idx + 4;
              const isOpen = openItems.includes(actualIdx);
              return (
                <div
                  key={actualIdx}
                  onClick={() => toggleItem(actualIdx)}
                  className="glass-panel"
                  style={{
                    padding: '22px 24px',
                    cursor: 'pointer',
                    borderColor: isOpen ? 'rgba(0, 229, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isOpen ? '0 8px 24px rgba(0, 229, 255, 0.1)' : 'none',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: isOpen ? '#ffffff' : '#e2e8f0',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item.q}
                    </span>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isOpen ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: isOpen ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isOpen ? '#00e5ff' : 'var(--text-secondary)',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </div>

                  {isOpen && (
                    <div
                      style={{
                        marginTop: '14px',
                        paddingTop: '14px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.65,
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .faq-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
