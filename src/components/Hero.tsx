import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onOpenTry: () => void;
  onScrollToUseCases: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTry, onScrollToUseCases }) => {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '138px',
        paddingBottom: '160px',
        overflow: 'hidden',
      }}
    >
      {/* 3. Hero Left Side Technical Information */}
      <div
        className="technical-side-text"
        style={{
          top: '180px',
          left: '48px',
          textAlign: 'left',
        }}
      >
        <div>SATELLITES</div>
        <div>IMAGERY</div>
        <div>INSIGHTS</div>
        <div>FOR A</div>
        <div>BRIGHTER</div>
        <div>TOMORROW</div>
        <div style={{ marginTop: '12px', width: '24px', height: '1px', background: 'rgba(56, 189, 248, 0.4)' }} />
      </div>

      {/* 4. Hero Right Side Technical Information */}
      <div
        className="technical-side-text"
        style={{
          top: '180px',
          right: '48px',
          textAlign: 'right',
        }}
      >
        <div>FROM</div>
        <div>SPACE DATA</div>
        <div>TO REAL-WORLD</div>
        <div>IMPACT</div>
        <div style={{ marginTop: '12px', marginLeft: 'auto', width: '24px', height: '1px', background: 'rgba(56, 189, 248, 0.4)' }} />
      </div>

      {/* 5. Main Centered Hero Content */}
      <div
        className="container"
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
          maxWidth: '920px',
        }}
      >
        {/* Eyebrow */}
        <div
          className="eyebrow"
          style={{
            letterSpacing: '0.22em',
            marginBottom: '18px',
            fontSize: '12px',
          }}
        >
          TURN SATELLITE DATA INTO REAL-WORLD INSIGHTS
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5.2vw, 4.25rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: '24px',
          }}
        >
          Understand Our Earth<br />
          with the Power of <span className="cyan-text">AI</span>
        </h1>

        {/* Supporting text */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
            lineHeight: 1.65,
            color: '#cbd5e1',
            maxWidth: '680px',
            marginBottom: '36px',
            fontWeight: 400,
          }}
        >
          SatQuery AI is an interactive vision-language assistant that helps you
          analyze satellite and remote sensing imagery through simple natural language queries.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          <button
            onClick={onOpenTry}
            className="btn-primary"
            style={{
              padding: '13px 30px',
              fontSize: '1rem',
            }}
          >
            <span>Try SatQuery AI</span>
            <ArrowUpRight size={18} />
          </button>

          <button
            onClick={onScrollToUseCases}
            className="btn-secondary"
            style={{
              padding: '12px 28px',
              fontSize: '1rem',
            }}
          >
            <span>Explore Use Cases</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 6. Bottom Hero Metadata (Left & Right) */}
      <div
        className="technical-side-text"
        style={{
          bottom: '80px',
          left: '48px',
          textAlign: 'left',
          fontSize: '9.5px',
        }}
      >
        <div>AGRICULTURE</div>
        <div>DISASTER MANAGEMENT</div>
        <div>URBAN PLANNING</div>
        <div>AND BEYOND</div>
      </div>

      <div
        className="technical-side-text"
        style={{
          bottom: '80px',
          right: '48px',
          textAlign: 'right',
          fontSize: '9.5px',
        }}
      >
        <div>A CLEANER</div>
        <div>SAFER</div>
        <div>MORE SUSTAINABLE</div>
        <div>PLANET</div>
      </div>
    </section>
  );
};
