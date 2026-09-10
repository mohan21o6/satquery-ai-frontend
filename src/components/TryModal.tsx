import React, { useState } from 'react';
import { X, Play, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

interface TryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TryModal: React.FC<TryModalProps> = ({ isOpen, onClose }) => {
  const [selectedDataset, setSelectedDataset] = useState('bitemporal');
  const [selectedModel, setSelectedModel] = useState('change-vit');
  const [query, setQuery] = useState('What changed between the two dates and what was the percentage increase in built-up area?');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  if (!isOpen) return null;

  const sampleDatasets = [
    { id: 'bitemporal', name: 'Bi-Temporal River Delta (2022 vs 2024)', preview: '/assets/bitemporal_2024.svg' },
    { id: 'flood', name: 'Flash Flood Disaster (Sentinel-1 SAR)', preview: '/assets/usecase_disaster.svg' },
    { id: 'urban', name: 'Metropolitan Urban Grid (VHR 30cm)', preview: '/assets/usecase_urban.svg' },
    { id: 'agri', name: 'Crop Vegetation Pivot (NDVI Multispectral)', preview: '/assets/usecase_agriculture.svg' },
  ];

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 900);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(2, 6, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          border: '1px solid rgba(0, 229, 255, 0.4)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 229, 255, 0.15)',
          position: 'relative',
        }}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5ff' }} />
            <span className="eyebrow" style={{ margin: 0 }}>
              INTERACTIVE VISION-LANGUAGE CONSOLE
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>
            SatQuery AI Live Environment
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Select remote sensing payload, specify query in natural language, and inspect generated evidence.
          </p>
        </div>

        {/* 1. Dataset Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', display: 'block', marginBottom: '8px' }}>
            1. SELECT BI-TEMPORAL SAMPLE DATASET
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {sampleDatasets.map((ds) => (
              <div
                key={ds.id}
                onClick={() => setSelectedDataset(ds.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: selectedDataset === ds.id ? 'rgba(0, 229, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: selectedDataset === ds.id ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                }}
              >
                <img src={ds.preview} alt="" style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.85rem', color: selectedDataset === ds.id ? '#fff' : 'var(--text-secondary)', fontWeight: 500 }}>
                  {ds.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Model Routing */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', display: 'block', marginBottom: '8px' }}>
            2. ACTIVE MODEL PIPELINE
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { id: 'change-vit', label: 'ChangeFormer V6 (Active Siamese ViT)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  background: 'rgba(0, 229, 255, 0.2)',
                  border: '1px solid #00e5ff',
                  color: '#00e5ff',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Query Bar */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', display: 'block', marginBottom: '8px' }}>
            3. CHANGE DETECTION OBJECTIVE
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '8px',
                background: 'rgba(3, 7, 18, 0.8)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="btn-primary"
              style={{ padding: '0 24px', whiteSpace: 'nowrap' }}
            >
              {isRunning ? (
                <>
                  <RefreshCw size={16} style={{ animation: 'orbitSpin 1s linear infinite' }} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Execute ChangeFormer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4. Results & Evidence Panel */}
        {hasRun && (
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: 'rgba(4, 9, 21, 0.9)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            {/* Visual Evidence Graphic */}
            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '180px' }}>
              <img
                src={'/assets/bitemporal_change.svg'}
                alt="Visual Evidence"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(0,0,0,0.85)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: '#00e5ff',
                  border: '1px solid rgba(0, 229, 255, 0.4)',
                }}
              >
                CHANGEFORMER BINARY MASK
              </div>
            </div>

            {/* Natural Language Response */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                  CHANGEFORMER TELEMETRY
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                  GRID: 256×256 px
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', color: '#f8fafc', lineHeight: 1.5, fontWeight: 500 }}>
                Pixel-level binary change mask generated. 8,126 changed pixels detected out of 65,536 total pixels (12.4% change ratio).
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <span className="tech-tag" style={{ fontSize: '9.5px' }}>
                  <ShieldCheck size={12} />
                  CHANGEFORMER V6
                </span>
                <span className="tech-tag" style={{ fontSize: '9.5px' }}>
                  <Layers size={12} />
                  256×256 TENSOR
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
