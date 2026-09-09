import React, { useState } from 'react';
import {
  CheckCircle2,
  Maximize2,
  FileText,
  Download,
  Share2,
  ArrowRight,
  Send,
  Sliders,
  Image as ImageIcon,
  RotateCw,
  Sparkles,
} from 'lucide-react';

import type { UserSession } from '../AuthModal';

interface WorkspaceTwoImageResultProps {
  userQuery: string;
  images: string[];
  currentUser: UserSession | null;
  onRunFollowUp: (query: string, type: 'single' | 'change') => void;
  onOpenLightbox: (img: string, title: string) => void;
  onGenerateReport: () => void;
  onShare: () => void;
}

export const WorkspaceTwoImageResult: React.FC<WorkspaceTwoImageResultProps> = ({
  userQuery,
  images,
  currentUser,
  onRunFollowUp,
  onOpenLightbox,
  onGenerateReport,
  onShare,
}) => {
  const [chatInput, setChatInput] = useState('');

  const img1 = images[0] || '/assets/bitemporal_2022.svg';
  const img2 = images[1] || '/assets/bitemporal_2024.svg';
  const changeMapImg = '/assets/bitemporal_change.svg';

  const analysisChecklist = [
    'Query classified: Change Analysis',
    'Two temporal images detected',
    'Change Detection Model selected',
    'Change VQA executed',
    'Visual evidence generated',
  ];

  const suggestedFollowUps = [
    'Show the newly built structures with bounding boxes',
    'Calculate the change area (in km²)',
    'Compare vegetation loss in this region',
    'Is this a residential or industrial expansion?',
  ];

  const quickPills = [
    'Describe this image',
    'Identify water bodies',
    'Detect built-up areas',
    'Analyze optical + SAR',
    'Compare two dates',
  ];

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const isSingle = chatInput.toLowerCase().includes('describe');
    onRunFollowUp(chatInput, isSingle ? 'single' : 'change');
    setChatInput('');
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 310px',
        gap: '24px',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px 20px 100px',
        position: 'relative',
        zIndex: 10,
      }}
      className="two-result-layout"
    >
      {/* Main Analysis Column (Left) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* User Query Bubble */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '14px',
            background: 'rgba(8, 16, 32, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Avatar with user initial */}
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {currentUser?.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'S'}
          </div>

          {/* Dual Thumbnails */}
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <img src={img1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <img src={img2} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Query Text */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#f8fafc' }}>
              {userQuery}
            </div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Today, 10:24 AM
            </div>
          </div>
        </div>

        {/* AI Response Container */}
        <div
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(6, 13, 27, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 229, 255, 0.22)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* AI Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, rgba(0, 229, 255, 0.25), rgba(15, 23, 42, 0.8))',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#00e5ff" strokeWidth="1.6" transform="rotate(-30 12 12)" />
                <circle cx="17.5" cy="8.5" r="2.2" fill="#00e5ff" />
              </svg>
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
              I've analyzed the two satellite images. Here are the key changes I found:
            </span>
          </div>

          {/* 3 Comparison Cards (Image 1, Image 2, Change Map) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '24px',
            }}
            className="three-cards-grid"
          >
            {/* Card 1: Image 1 (Jan 2022) */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#040d1a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ padding: '10px 14px', background: 'rgba(3, 7, 18, 0.7)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Image 1</div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Jan 2022
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                <img src={img1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => onOpenLightbox(img1, 'Image 1 (Jan 2022)')}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '4px',
                    background: 'rgba(0,0,0,0.7)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Maximize2 size={12} />
                </button>
              </div>
            </div>

            {/* Card 2: Image 2 (Jan 2024) */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#040d1a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ padding: '10px 14px', background: 'rgba(3, 7, 18, 0.7)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Image 2</div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Jan 2024
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                <img src={img2} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => onOpenLightbox(img2, 'Image 2 (Jan 2024)')}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '4px',
                    background: 'rgba(0,0,0,0.7)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Maximize2 size={12} />
                </button>
              </div>
            </div>

            {/* Card 3: Change Map */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#040d1a',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                boxShadow: '0 0 16px rgba(239, 68, 68, 0.15)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(3, 7, 18, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f87171' }}>Change Map</div>
                {/* Legend */}
                <div style={{ display: 'flex', gap: '8px', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f87171' }}>
                    <span style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '1px' }} />
                    New Built-up
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#4ade80' }}>
                    <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '1px' }} />
                    Veg Loss
                  </span>
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                <img src={changeMapImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => onOpenLightbox(changeMapImg, 'Change Map (Bi-Temporal Delta)')}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '4px',
                    background: 'rgba(0,0,0,0.7)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Maximize2 size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div
            style={{
              padding: '22px 24px',
              borderRadius: '12px',
              background: 'rgba(4, 9, 21, 0.8)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            {/* Left Result Description */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} color="var(--accent-cyan)" />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.1em',
                  }}
                >
                  RESULT
                </span>
              </div>

              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '8px',
                  lineHeight: 1.4,
                }}
              >
                The built-up area has increased significantly, primarily in the eastern region.
              </h3>

              <p
                style={{
                  fontSize: '0.825rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                }}
              >
                Between January 2022 and January 2024, there is a visible expansion of urban
                infrastructure in the eastern part of the image, with new residential and industrial
                buildings. Some vegetation has been cleared to make way for development.
              </p>
            </div>

            {/* Right Confidence Bar */}
            <div style={{ minWidth: '180px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                <span>Confidence</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>91%</span>
              </div>

              <div
                style={{
                  width: '100%',
                  height: '7px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '91%',
                    height: '100%',
                    background: 'linear-gradient(to right, #0284c7, #00e5ff)',
                    boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Contextual Chat Input Bar */}
        <div
          style={{
            borderRadius: '16px',
            background: 'rgba(6, 13, 27, 0.72)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            padding: '14px 18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <button
              title="Attach image"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <ImageIcon size={18} />
            </button>

            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendChat();
              }}
              placeholder="Ask anything about your satellite image..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            />

            <button
              title="Adjust Parameters"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <Sliders size={18} />
            </button>

            <button
              onClick={handleSendChat}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00e5ff 0%, #0284c7 100%)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <Send size={15} />
            </button>
          </div>

          {/* Quick pills below input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const isSingle = pill.includes('Describe') || pill.includes('water');
                  onRunFollowUp(pill, isSingle ? 'single' : 'change');
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(8, 16, 32, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                {pill}
              </button>
            ))}

            <button
              onClick={() => setChatInput('')}
              title="Reset"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <RotateCw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side Panel: Analysis Details & Suggested Follow-ups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 1. Analysis Details Panel */}
        <div
          style={{
            padding: '22px 20px',
            borderRadius: '14px',
            background: 'rgba(6, 13, 27, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#ffffff',
              marginBottom: '14px',
              letterSpacing: '0.02em',
            }}
          >
            Analysis Details
          </div>

          {/* Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {analysisChecklist.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <CheckCircle2 size={15} color="#00e5ff" style={{ marginTop: '1px', flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={onGenerateReport}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(2, 132, 199, 0.3))',
                border: '1px solid rgba(0, 229, 255, 0.5)',
                color: '#ffffff',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <FileText size={15} color="#00e5ff" />
              <span>Generate Report</span>
            </button>

            <button
              onClick={() => onOpenLightbox(changeMapImg, 'Download Change Results')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                fontSize: '0.825rem',
                cursor: 'pointer',
              }}
            >
              <Download size={14} color="var(--accent-cyan)" />
              <span>Download Results</span>
            </button>

            <button
              onClick={onShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                fontSize: '0.825rem',
                cursor: 'pointer',
              }}
            >
              <Share2 size={14} color="var(--accent-cyan)" />
              <span>Share Analysis</span>
            </button>
          </div>
        </div>

        {/* 2. Suggested Follow-ups Panel */}
        <div
          style={{
            padding: '22px 20px',
            borderRadius: '14px',
            background: 'rgba(6, 13, 27, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#ffffff',
              marginBottom: '14px',
              letterSpacing: '0.02em',
            }}
          >
            Suggested Follow-ups
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {suggestedFollowUps.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onRunFollowUp(item, 'change')}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  lineHeight: 1.45,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.background = 'rgba(0, 229, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <ArrowRight size={13} color="var(--accent-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .two-result-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .three-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
