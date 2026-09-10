import React, { useEffect, useRef } from 'react';

interface EarthBackgroundProps {
  scrollY?: number;
}

export const EarthBackground: React.FC<EarthBackgroundProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 1. Background stars canvas fallback / ambient space dust
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

    const starCount = 180;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.012 + 0.004,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

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

  // 2. Scroll-driven cinematic video timeline engine
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Keep video paused — playback is driven exclusively by scroll position
    video.pause();

    let animId: number;
    let currentRenderTime = -1;

    const tick = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const totalHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1;
      const viewHeight = window.innerHeight || 1;
      const maxScroll = Math.max(1, totalHeight - viewHeight);

      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      const duration = video.duration;

      if (duration && !isNaN(duration) && duration > 0) {
        // Prevent browser 'ended' event while hitting exact final frame at bottom
        const maxTime = Math.max(0, duration - 0.01);
        const targetTime = progress >= 0.999 ? maxTime : progress * maxTime;

        if (currentRenderTime < 0) {
          currentRenderTime = targetTime;
        } else {
          const diff = targetTime - currentRenderTime;
          if (Math.abs(diff) < 0.0005) {
            currentRenderTime = targetTime;
          } else {
            // Responsive lerp coefficient (0.22 provides immediate tracking + smooth motion)
            currentRenderTime += diff * 0.22;
          }
        }

        // Direct assignment to video element
        if (Math.abs(video.currentTime - currentRenderTime) > 0.0001) {
          video.currentTime = currentRenderTime;
        }
      }

      animId = requestAnimationFrame(tick);
    };

    const onLoadedMetadata = () => {
      video.pause();
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('play', () => { video.pause(); });

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {/* Starfield canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.65,
        }}
      />

      {/* Cinematic scroll-driven background video — lv_0_20260909234819.mp4 */}
      <video
        ref={videoRef}
        src="/assets/lv_0_20260909234819.mp4"
        preload="auto"
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          pointerEvents: 'none',
        }}
      />

      {/* Radial vignette — preserves text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 42%, rgba(3,7,18,0.05) 0%, rgba(3,7,18,0.38) 62%, rgba(3,7,18,0.88) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom fade — blends into footer */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '280px',
          background: 'linear-gradient(to bottom, transparent, rgba(3,7,18,0.96))',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

