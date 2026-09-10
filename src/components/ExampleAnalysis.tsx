import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

export const ExampleAnalysis: React.FC = () => {
  const [queryText, setQueryText] = useState('What changed between these two satellite images?');
  const [isExecuting, setIsExecuting] = useState(false);
  const [traceStep, setTraceStep] = useState(5);

  const queries = [
    'Detect bi-temporal changes between T1 (2022) and T2 (2024)',
    'Extract 256x256 binary change mask and pixel count',
    'Calculate surface change ratio and pixel statistics',
  ];

  const traceItems = [
    'Bi-temporal satellite image pair detected (2022 vs 2024)',
    'Spatial dimension co-registration and 256×256 tensor alignment',
    'ChangeFormer V6 Siamese ViT forward inference executed',
    'Pixel-level binary change mask generated (255 / 0 values)',
    'Quantitative statistics: 12.4% surface change (8,126 / 65,536 px)',
  ];

  const handleRunQuery = (q: string) => {
    setQueryText(q);
    setIsExecuting(true);
    setTraceStep(0);
  };

  useEffect(() => {
    if (!isExecuting) return;
    const interval = setInterval(() => {
      setTraceStep((prev) => {
        if (prev >= 5) {
          setIsExecuting(false);
          clearInterval(interval);
          return 5;
        }
        return prev + 1;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isExecuting]);

  return (
    <section
      id="example-analysis"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: '120px 0 140px',
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
          <span className="eyebrow">EXAMPLE ANALYSIS</span>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>
            See the Power in Action
          </h2>
          <p className="section-subtitle">
            Ask complex questions. Get evidence-backed answers.
          </p>
        </div>

        {/* Outer Analysis Frame */}
        <div
          className="glass-panel"
          style={{
            padding: '36px',
            border: '1px solid rgba(0, 229, 255, 0.28)',
            boxShadow: '0 20px 60px rgba(3, 7, 18, 0.8), 0 0 40px rgba(0, 229, 255, 0.08)',
            position: 'relative',
          }}
        >
          {/* Top Query Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 20px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(3, 7, 18, 0.85)',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)',
              marginBottom: '36px',
            }}
          >
            <input
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Ask a question about the satellite imagery..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '1rem',
                fontFamily: 'var(--font-sans)',
              }}
            />

            {/* Run Button */}
            <button
              onClick={() => handleRunQuery(queryText)}
              disabled={isExecuting}
              aria-label="Submit Query"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#030712',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Quick preset suggestions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '32px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              SAMPLE QUERIES:
            </span>
            {queries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleRunQuery(q)}
                style={{
                  background: queryText === q ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: queryText === q ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: queryText === q ? '#00e5ff' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-full)',
                  padding: '5px 14px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Core Analysis Layout: Left Images, Right Trace & Results */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr 1fr',
              gap: '32px',
              alignItems: 'start',
            }}
            className="analysis-grid"
          >
            {/* Left: 3 Satellite Tiles */}
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  marginBottom: '16px',
                }}
                className="imagery-tiles-grid"
              >
                {/* Tile 1: Image 1 (2022) */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: '#040d1a',
                      position: 'relative',
                    }}
                  >
                    <img
                      src="/assets/bitemporal_2022.svg"
                      alt="Satellite imagery 2022"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        color: '#94a3b8',
                      }}
                    >
                      T1
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
                    Image 1 (2022)
                  </span>
                </div>

                {/* Tile 2: Image 2 (2024) */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: '#040d1a',
                      position: 'relative',
                    }}
                  >
                    <img
                      src="/assets/bitemporal_2024.svg"
                      alt="Satellite imagery 2024"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        color: '#94a3b8',
                      }}
                    >
                      T2
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
                    Image 2 (2024)
                  </span>
                </div>

                {/* Tile 3: Change Map */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      aspectRatio: '1/1',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      boxShadow: '0 0 16px rgba(239, 68, 68, 0.2)',
                      background: '#040d1a',
                      position: 'relative',
                    }}
                  >
                    <img
                      src="/assets/bitemporal_change.svg"
                      alt="Detected Change Map"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: 'rgba(239, 68, 68, 0.85)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    >
                      DELTA
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#f87171', fontWeight: 600 }}>
                    Change Map
                  </span>
                </div>
              </div>

              {/* Status footer info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}
              >
                <span>SENSOR: Sentinel-2 Multispectral MSI</span>
                <span>RESOLUTION: 10m Ground Sample Distance (GSD)</span>
              </div>
            </div>

            {/* Right: Result Box & Agent Execution Trace */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {/* Result Container */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: '12px',
                  background: 'rgba(4, 9, 21, 0.8)',
                  border: '1px solid rgba(0, 229, 255, 0.25)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.1em',
                    marginBottom: '8px',
                  }}
                >
                  RESULT
                </div>

                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.35,
                    marginBottom: '16px',
                  }}
                >
                  "ChangeFormer binary change mask and pixel metrics generated."
                </div>

                {/* Change Metric Meter */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '11.5px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                      marginBottom: '8px',
                    }}
                  >
                    <span>Surface Change Ratio</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>12.4% (8,126 px)</span>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '12.4%',
                        height: '100%',
                        borderRadius: '4px',
                        background: 'linear-gradient(to right, #0284c7, #00e5ff)',
                        boxShadow: '0 0 12px rgba(0, 229, 255, 0.5)',
                        transition: 'width 1s ease',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Agent Execution Trace */}
              <div
                style={{
                  padding: '24px',
                  borderRadius: '12px',
                  background: 'rgba(4, 9, 21, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      color: 'var(--accent-cyan)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Agent Execution Trace
                  </span>
                  {isExecuting && (
                    <RefreshCw size={12} color="#00e5ff" style={{ animation: 'orbitSpin 1.2s linear infinite' }} />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {traceItems.map((step, idx) => {
                    const isPassed = idx < traceStep;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '0.85rem',
                          color: isPassed ? '#cbd5e1' : 'var(--text-muted)',
                          transition: 'all 0.3s ease',
                          opacity: isPassed ? 1 : 0.45,
                        }}
                      >
                        <CheckCircle2
                          size={15}
                          color={isPassed ? '#00e5ff' : '#475569'}
                          style={{
                            marginTop: '2px',
                            flexShrink: 0,
                            filter: isPassed ? 'drop-shadow(0 0 4px rgba(0, 229, 255, 0.5))' : 'none',
                          }}
                        />
                        <span style={{ fontWeight: isPassed ? 500 : 400 }}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .analysis-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .imagery-tiles-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
