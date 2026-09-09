import React from 'react';
import { X, Download, Layers } from 'lucide-react';

interface WorkspaceLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const WorkspaceLightbox: React.FC<WorkspaceLightboxProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(2, 6, 18, 0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '1020px',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'rgba(6, 13, 27, 0.95)',
          border: '1px solid rgba(0, 229, 255, 0.4)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 229, 255, 0.2)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Lightbox Header */}
        <div
          style={{
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={18} color="var(--accent-cyan)" />
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{title}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href={imageUrl}
              download="satquery_analysis.svg"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                color: '#00e5ff',
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              <Download size={13} />
              <span>Download GeoTIFF / SVG</span>
            </a>

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Full Image Container */}
        <div style={{ padding: '24px', background: '#020611', display: 'flex', justifyContent: 'center' }}>
          <img
            src={imageUrl}
            alt={title}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
