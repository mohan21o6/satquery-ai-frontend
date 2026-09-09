import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle, ShieldCheck } from 'lucide-react';

interface WorkspaceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisType: 'single' | 'change';
}

export const WorkspaceReportModal: React.FC<WorkspaceReportModalProps> = ({
  isOpen,
  onClose,
  analysisType,
}) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('SatQuery AI Executive Intelligence Report downloaded successfully.');
      onClose();
    }, 1200);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(2, 6, 18, 0.9)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid rgba(0, 229, 255, 0.4)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 229, 255, 0.2)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#cbd5e1',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid #00e5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00e5ff',
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <span className="eyebrow" style={{ margin: 0 }}>
              EXECUTIVE INTELLIGENCE DOSSIER
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
              {analysisType === 'change'
                ? 'Bi-Temporal Change Analysis Report'
                : 'Remote Sensing Scene Assessment Report'}
            </h2>
          </div>
        </div>

        {/* Document Preview Box */}
        <div
          style={{
            background: 'rgba(3, 7, 18, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            color: '#cbd5e1',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                MISSION ID
              </div>
              <div style={{ fontWeight: 600, color: '#fff' }}>SATQUERY-AOI-2024-0988</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                CONFIDENCE SCORE
              </div>
              <div style={{ fontWeight: 600, color: '#00e5ff' }}>91.4% Calibrated</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                CRS PROJECTION
              </div>
              <div style={{ fontWeight: 600, color: '#fff' }}>WGS 84 / UTM 43N</div>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Executive Summary</div>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {analysisType === 'change'
                ? 'Automated bi-temporal differencing detected 34.2 hectares of new built-up industrial expansion between Jan 2022 and Jan 2024 across eastern coordinates. Corresponding reduction in marginal agricultural vegetation verified via NDRE/NDVI index variance.'
                : 'Scene features a river delta bifurcating high-density commercial urban fabric (west) and multi-parcel agricultural vegetation (east), connected via arterial road bridge infrastructure.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="tech-tag">
              <ShieldCheck size={12} />
              CRYPTOGRAPHICALLY SIGNED
            </span>
            <span className="tech-tag">
              <CheckCircle size={12} />
              ISRO/ESA CALIBRATED
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.875rem' }}>
            Cancel
          </button>

          <button onClick={handleDownload} disabled={downloading} className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.875rem' }}>
            <Download size={15} />
            <span>{downloading ? 'Generating PDF...' : 'Download PDF Dossier'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
