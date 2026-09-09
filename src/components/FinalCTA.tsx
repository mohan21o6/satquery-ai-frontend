import React from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';

interface FinalCTAProps {
  onOpenTry: () => void;
  onContactUs: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenTry, onContactUs }) => {
  return (
    <section
      id="cta"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: '120px 0 160px',
        overflow: 'hidden',
      }}
    >
      {/* Lower Orbital Satellite (on the left side in the reference image) */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '6vw',
          width: '180px',
          height: '180px',
          pointerEvents: 'none',
          transform: 'rotate(25deg)',
          zIndex: 2,
          animation: 'floatSlow 16s ease-in-out infinite alternate',
        }}
      >
        <img
          src="/assets/satellite.jpg"
          alt="Satellite in lower orbit"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '50%',
            maskImage: 'radial-gradient(circle at 50% 50%, black 40%, rgba(0,0,0,0.8) 55%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 40%, rgba(0,0,0,0.8) 55%, transparent 75%)',
            filter: 'drop-shadow(0 0 20px rgba(0, 229, 255, 0.3)) brightness(0.85)',
          }}
        />
      </div>

      {/* Right Side Metadata */}
      <div
        className="technical-side-text"
        style={{
          top: '160px',
          right: '54px',
          textAlign: 'right',
        }}
      >
        <div>REAL DATA</div>
        <div>REAL INSIGHTS</div>
        <div>A BRIGHTER</div>
        <div>TOMORROW</div>
        <div style={{ marginTop: '12px', marginLeft: 'auto', width: '24px', height: '1px', background: 'rgba(56, 189, 248, 0.4)' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        {/* Main CTA Center Card */}
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '56px 40px',
            borderRadius: '24px',
            background: 'rgba(4, 9, 21, 0.72)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 229, 255, 0.12)',
          }}
        >
          {/* Eyebrow */}
          <span
            className="eyebrow"
            style={{
              letterSpacing: '0.2em',
              marginBottom: '16px',
            }}
          >
            BE A PART OF A CLEARER, BRIGHTER PLANET
          </span>

          {/* Heading */}
          <h2
            style={{
              fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '18px',
            }}
          >
            Start Exploring Earth with SatQuery <span className="cyan-text">AI</span>
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              color: '#cbd5e1',
              maxWidth: '560px',
              margin: '0 auto 36px',
              lineHeight: 1.65,
            }}
          >
            Upload your images, ask your questions, and discover what's possible.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={onOpenTry}
              className="btn-primary"
              style={{
                padding: '13px 32px',
                fontSize: '1rem',
              }}
            >
              <span>Try SatQuery AI</span>
              <ArrowUpRight size={18} />
            </button>

            <button
              onClick={onContactUs}
              className="btn-secondary"
              style={{
                padding: '12px 28px',
                fontSize: '1rem',
              }}
            >
              <Mail size={16} />
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
