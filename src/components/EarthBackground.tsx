import React, { useEffect, useRef } from 'react';

interface EarthBackgroundProps {
  scrollY: number;
}

export const EarthBackground: React.FC<EarthBackgroundProps> = ({ scrollY }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Twinkling stars canvas in background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate static stars
    const starCount = 240;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw faint space nebula dust
      const nebulaGrad = ctx.createRadialGradient(
        width * 0.65,
        height * 0.25,
        50,
        width * 0.65,
        height * 0.25,
        width * 0.6
      );
      nebulaGrad.addColorStop(0, 'rgba(14, 116, 144, 0.04)');
      nebulaGrad.addColorStop(0.5, 'rgba(3, 105, 161, 0.02)');
      nebulaGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const twinkle = Math.sin(time * star.speed * 60 + star.phase);
        const currentAlpha = Math.max(0.15, Math.min(1, star.alpha + twinkle * 0.25));

        ctx.fillStyle = `rgba(224, 242, 254, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Parallax calculations for continuous Earth journey
  const heroEarthParallax = Math.min(scrollY * 0.35, 300);
  const midEarthParallax = (scrollY - 1800) * 0.18;
  const lowerEarthParallax = (scrollY - 3600) * 0.15;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      {/* 1. Starfield Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.85,
        }}
      />

      {/* 2. Primary Hero Earth Curvature (Visible at top, curves through Hero & Capabilities) */}
      <div
        style={{
          position: 'absolute',
          top: '38vh',
          left: '50%',
          transform: `translateX(-50%) translateY(${-heroEarthParallax}px)`,
          width: '150vw',
          maxWidth: '2200px',
          height: '1100px',
          opacity: Math.max(0, 1 - scrollY / 1500),
          transition: 'transform 0.1s ease-out, opacity 0.2s ease-out',
          pointerEvents: 'none',
        }}
      >
        {/* Glow halo behind Earth */}
        <div
          style={{
            position: 'absolute',
            top: '0%',
            left: '10%',
            right: '10%',
            height: '240px',
            background: 'radial-gradient(ellipse at 50% 30%, rgba(0, 229, 255, 0.45) 0%, rgba(2, 132, 199, 0.25) 45%, rgba(3, 7, 18, 0) 75%)',
            filter: 'blur(35px)',
            pointerEvents: 'none',
          }}
        />

        {/* Earth image with cinematic curvature */}
        <img
          src="/assets/hero_earth.jpg"
          alt="Earth curvature from orbit"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 18%',
            borderRadius: '50% 50% 0 0 / 22% 22% 0 0',
            boxShadow: '0 -15px 60px rgba(0, 229, 255, 0.35)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>

      {/* 3. Mid-Page Secondary Earth Horizon (Glides into view for Example Analysis & Supported Inputs) */}
      <div
        style={{
          position: 'absolute',
          top: '42vh',
          left: '50%',
          transform: `translateX(-50%) translateY(${midEarthParallax}px)`,
          width: '160vw',
          maxWidth: '2400px',
          height: '1000px',
          opacity: scrollY > 1200 && scrollY < 3200 ? Math.min(0.75, (scrollY - 1200) / 400) * Math.max(0, 1 - (scrollY - 2600) / 600) : 0,
          transition: 'transform 0.1s ease-out, opacity 0.3s ease-out',
          pointerEvents: 'none',
        }}
      >
        {/* Atmospheric rim halo */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            left: '15%',
            right: '15%',
            height: '220px',
            background: 'radial-gradient(ellipse at 50% 40%, rgba(56, 189, 248, 0.35) 0%, rgba(2, 132, 199, 0.18) 50%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />
        <img
          src="/assets/hero_earth.jpg"
          alt="Earth atmospheric horizon"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 45%',
            borderRadius: '50% 50% 0 0 / 18% 18% 0 0',
            opacity: 0.85,
            filter: 'hue-rotate(-10deg) brightness(0.9)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 90%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 90%)',
          }}
        />
      </div>

      {/* 4. Lower-Page Majestic Earth Horizon (Visible behind FAQ, Final CTA, & Footer) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-120px',
          left: '50%',
          transform: `translateX(-50%) translateY(${lowerEarthParallax}px)`,
          width: '170vw',
          maxWidth: '2600px',
          height: '1100px',
          opacity: scrollY > 2800 ? Math.min(0.9, (scrollY - 2800) / 400) : 0,
          transition: 'transform 0.1s ease-out, opacity 0.3s ease-out',
          pointerEvents: 'none',
        }}
      >
        {/* Cyan sunrise glow */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '20%',
            right: '20%',
            height: '260px',
            background: 'radial-gradient(ellipse at 50% 30%, rgba(0, 229, 255, 0.4) 0%, rgba(2, 132, 199, 0.22) 50%, transparent 80%)',
            filter: 'blur(45px)',
          }}
        />
        <img
          src="/assets/hero_earth.jpg"
          alt="Atmospheric Earth view behind CTA"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 25%',
            borderRadius: '50% 50% 0 0 / 22% 22% 0 0',
            opacity: 0.9,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>

      {/* 5. Global subtle vignette gradient connecting all sections */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(3, 7, 18, 0.75) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
