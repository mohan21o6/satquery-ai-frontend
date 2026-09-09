import React, { useEffect, useRef } from 'react';

export const WorkspaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle star field
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.02 + 0.005,
    }));

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = Math.sin(time * s.speed * 60);
        ctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.15, s.alpha + twinkle * 0.25)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#030712',
      }}
    >
      {/* 1. Starfield Canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* 2. ONE Single Earth from Space (Lower Left / Center Horizon) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-180px',
          left: '-120px',
          width: '130vw',
          maxWidth: '1800px',
          height: '1050px',
          pointerEvents: 'none',
        }}
      >
        {/* Blue atmospheric rim glow */}
        <div
          style={{
            position: 'absolute',
            top: '0px',
            left: '5%',
            right: '25%',
            height: '240px',
            background: 'radial-gradient(ellipse at 40% 30%, rgba(0, 229, 255, 0.4) 0%, rgba(2, 132, 199, 0.2) 50%, transparent 75%)',
            filter: 'blur(45px)',
          }}
        />

        {/* Photorealistic Earth curved horizon */}
        <img
          src="/assets/hero_earth.jpg"
          alt="Earth background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '25% 15%',
            borderRadius: '50% 50% 0 0 / 26% 26% 0 0',
            opacity: 0.92,
            boxShadow: '0 -20px 80px rgba(0, 229, 255, 0.35)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 60%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>

      {/* 3. Realistic Satellite Station (Upper Right Orbit) */}
      <div
        style={{
          position: 'absolute',
          top: '70px',
          right: '4vw',
          width: '260px',
          height: '260px',
          transform: 'rotate(-15deg)',
          pointerEvents: 'none',
          animation: 'floatSlow 18s ease-in-out infinite alternate',
        }}
      >
        <img
          src="/assets/satellite.jpg"
          alt="Satellite in orbit"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '50%',
            maskImage: 'radial-gradient(circle at 45% 45%, black 45%, rgba(0,0,0,0.85) 60%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at 45% 45%, black 45%, rgba(0,0,0,0.85) 60%, transparent 80%)',
            filter: 'drop-shadow(0 0 24px rgba(0, 229, 255, 0.3))',
          }}
        />
      </div>

      {/* 4. Right Side Technical Coordinates */}
      <div
        className="technical-side-text"
        style={{
          top: '48%',
          right: '24px',
          textAlign: 'right',
          fontSize: '9.5px',
          lineHeight: '1.8',
        }}
      >
        <div>FROM</div>
        <div>SPACE DATA</div>
        <div>TO REAL-WORLD</div>
        <div style={{ color: 'var(--accent-cyan)' }}>SOLUTIONS</div>
      </div>

      {/* 5. Bottom Right: Mini Earth Orb Thumbnail */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'none',
        }}
      >
        <div style={{ textAlign: 'right', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'rgba(148, 163, 184, 0.75)', lineHeight: 1.4 }}>
          <div>A Cleaner</div>
          <div>Safer</div>
          <div>More Sustainable</div>
          <div style={{ color: '#00e5ff' }}>Planet →</div>
        </div>

        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            boxShadow: '0 0 12px rgba(0, 229, 255, 0.3)',
          }}
        >
          <img
            src="/assets/hero_earth.jpg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </div>
    </div>
  );
};
