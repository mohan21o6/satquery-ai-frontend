import React, { useState, useEffect } from 'react';
import { CheckCircle2, RefreshCw, Cpu } from 'lucide-react';

interface WorkspaceLoadingStateProps {
  onComplete: () => void;
}

export const WorkspaceLoadingState: React.FC<WorkspaceLoadingStateProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Satellite imagery tiles ingested and CRS verified',
    'Semantic query parsed · Intent classified',
    'Specialist AI model selected (Remote-Sensing Engine)',
    'Tile-level tensor inference & spectral difference executed',
    'Visual evidence and confidence bounds synthesized',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 450);
          return steps.length;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '80px auto',
        padding: '36px',
        borderRadius: '16px',
        background: 'rgba(6, 13, 27, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 229, 255, 0.35)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 229, 255, 0.15)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'rgba(0, 229, 255, 0.1)',
          border: '1px solid #00e5ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00e5ff',
          margin: '0 auto 20px',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
        }}
      >
        <RefreshCw size={24} style={{ animation: 'orbitSpin 1.2s linear infinite' }} />
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--accent-cyan)',
          letterSpacing: '0.12em',
          marginBottom: '6px',
        }}
      >
        AUTONOMOUS AGENTIC EXECUTION
      </div>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>
        Analyzing Satellite Imagery...
      </h2>

      {/* Progress Steps Checklist */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          textAlign: 'left',
          background: 'rgba(3, 7, 18, 0.6)',
          padding: '18px 20px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.85rem',
                color: isDone ? '#ffffff' : isCurrent ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: isDone || isCurrent ? 500 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              {isDone ? (
                <CheckCircle2 size={16} color="#00e5ff" />
              ) : isCurrent ? (
                <Cpu size={16} color="#38bdf8" style={{ animation: 'pulseCyan 1s infinite' }} />
              ) : (
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #334155' }} />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
