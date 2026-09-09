import React, { useState } from 'react';
import { Upload, MessageSquare, Brain, GitBranch, Play, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(3);

  const steps = [
    {
      num: 1,
      title: 'Upload Images',
      icon: Upload,
      desc: 'Single, bi-temporal or optical + SAR pairs in GeoTIFF or standard formats.',
    },
    {
      num: 2,
      title: 'Ask a Question',
      icon: MessageSquare,
      desc: 'Natural language prompt (e.g. "What changed here between 2022 and 2024?").',
    },
    {
      num: 3,
      title: 'Agent Understands',
      icon: Brain,
      desc: 'Semantic router classifies task intent, modalities, and spatial scope.',
    },
    {
      num: 4,
      title: 'Selects Right Models',
      icon: GitBranch,
      desc: 'Dynamic tool dispatch to specialist VLM, grounding, or bi-temporal models.',
    },
    {
      num: 5,
      title: 'Runs Analysis',
      icon: Play,
      desc: 'High-throughput tensor inference across registered satellite tiles.',
    },
    {
      num: 6,
      title: 'Generates Evidence',
      icon: ShieldCheck,
      desc: 'Computes localized bounding boxes, heatmaps, and confidence calibrations.',
    },
    {
      num: 7,
      title: 'Clear Answer',
      icon: CheckCircle2,
      desc: 'Synthesizes plain-English insights backed by highlighted visual proofs.',
    },
  ];

  return (
    <section
      id="how-it-works"
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
            marginBottom: '56px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span className="eyebrow">HOW IT WORKS</span>
            <h2 className="section-title" style={{ marginBottom: '12px' }}>
              From Your Question to Real Answers
            </h2>
            <p className="section-subtitle">
              Our agentic system interprets your query, selects the right tools, runs the analysis, and delivers clear, visual answers.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10.5px',
                color: 'var(--text-muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              SEAMLESS & DIRECT
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.12em',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              ORCHESTRATION
            </span>
          </div>
        </div>

        {/* 7-Step Connected Flow */}
        <div
          style={{
            position: 'relative',
            padding: '24px 0',
          }}
        >
          {/* Horizontal Connecting Line (Desktop) */}
          <div
            className="horizontal-connector"
            style={{
              position: 'absolute',
              top: '52px',
              left: '4%',
              right: '4%',
              height: '2px',
              background: 'linear-gradient(to right, rgba(0, 229, 255, 0.15), rgba(0, 229, 255, 0.5) 50%, rgba(0, 229, 255, 0.15))',
              zIndex: 1,
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '12px',
              position: 'relative',
              zIndex: 2,
            }}
            className="steps-grid"
          >
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.num;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  className="step-node"
                >
                  {/* Circular Node */}
                  <div
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '50%',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.25), rgba(8, 17, 34, 0.95))'
                        : 'rgba(5, 11, 24, 0.9)',
                      border: isActive ? '2px solid #00e5ff' : '1px solid rgba(0, 229, 255, 0.25)',
                      boxShadow: isActive
                        ? '0 0 24px rgba(0, 229, 255, 0.45)'
                        : '0 0 10px rgba(0, 229, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? '#00e5ff' : '#94a3b8',
                      marginBottom: '18px',
                      transition: 'all 0.3s ease',
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  {/* Step label */}
                  <span
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      marginBottom: '6px',
                      lineHeight: 1.3,
                    }}
                  >
                    {step.num}. {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Step Details Panel */}
          <div
            style={{
              marginTop: '36px',
              padding: '20px 28px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(8, 16, 32, 0.75)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--accent-cyan)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  background: 'rgba(0, 229, 255, 0.1)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                }}
              >
                PHASE 0{activeStep}
              </div>
              <div style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 500 }}>
                {steps[activeStep - 1].title}:{' '}
                <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
                  {steps[activeStep - 1].desc}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveStep((prev) => (prev > 1 ? prev - 1 : 7))}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                ← PREV
              </button>
              <button
                onClick={() => setActiveStep((prev) => (prev < 7 ? prev + 1 : 1))}
                style={{
                  background: 'rgba(0, 229, 255, 0.12)',
                  border: '1px solid rgba(0, 229, 255, 0.35)',
                  color: '#00e5ff',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                NEXT →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .horizontal-connector {
            display: none !important;
          }
          .steps-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
          .step-node {
            align-items: flex-start !important;
            text-align: left !important;
          }
        }
      `}</style>
    </section>
  );
};
