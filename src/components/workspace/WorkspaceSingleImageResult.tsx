import React, { useState } from 'react';
import {
  FileText,
  Building2,
  Droplets,
  Trees,
  Compass,
  Clock,
  Maximize2,
  Download,
  Share2,
  ArrowRight,
  Send,
  Sliders,
  Image as ImageIcon,
  RotateCw,
  Sparkles,
  Layers,
} from 'lucide-react';

import type { UserSession } from '../AuthModal';

interface WorkspaceSingleImageResultProps {
  userQuery: string;
  userImage: string;
  currentUser: UserSession | null;
  onRunFollowUp: (query: string, type: 'single' | 'change') => void;
  onOpenLightbox: (img: string, title: string) => void;
  onGenerateReport: () => void;
  onShare: () => void;
}

export const WorkspaceSingleImageResult: React.FC<WorkspaceSingleImageResultProps> = ({
  userQuery,
  userImage,
  currentUser,
  onRunFollowUp,
  onOpenLightbox,
  onGenerateReport,
  onShare,
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'analysis'>('map');
  const [chatInput, setChatInput] = useState('');
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  const keyElements = [
    {
      id: 'urban',
      title: 'Built-up Area',
      desc: 'Dense urban settlements on the western side, including residential and commercial buildings.',
      icon: Building2,
      badgeBg: 'rgba(244, 63, 94, 0.15)',
      badgeBorder: 'rgba(244, 63, 94, 0.4)',
      badgeColor: '#fb7185',
    },
    {
      id: 'water',
      title: 'Water Body',
      desc: 'A major river flowing diagonally across the image.',
      icon: Droplets,
      badgeBg: 'rgba(14, 165, 233, 0.15)',
      badgeBorder: 'rgba(14, 165, 233, 0.4)',
      badgeColor: '#38bdf8',
    },
    {
      id: 'bridge',
      title: 'Bridge',
      desc: 'A road bridge connecting both sides of the river.',
      icon: Layers,
      badgeBg: 'rgba(168, 85, 247, 0.15)',
      badgeBorder: 'rgba(168, 85, 247, 0.4)',
      badgeColor: '#c084fc',
    },
    {
      id: 'vegetation',
      title: 'Vegetation',
      desc: 'Agricultural fields and green areas, mainly on the eastern side.',
      icon: Trees,
      badgeBg: 'rgba(34, 197, 94, 0.15)',
      badgeBorder: 'rgba(34, 197, 94, 0.4)',
      badgeColor: '#4ade80',
    },
    {
      id: 'roads',
      title: 'Road Network',
      desc: 'Multiple roads and highways are visible, connecting urban areas and rural regions.',
      icon: Compass,
      badgeBg: 'rgba(249, 115, 22, 0.15)',
      badgeBorder: 'rgba(249, 115, 22, 0.4)',
      badgeColor: '#fb923c',
    },
    {
      id: 'landuse',
      title: 'Land Use',
      desc: 'Urban (west) | Agricultural (east) | Mixed settlements along roads.',
      icon: Clock,
      badgeBg: 'rgba(234, 179, 8, 0.15)',
      badgeBorder: 'rgba(234, 179, 8, 0.4)',
      badgeColor: '#facc15',
    },
  ];

  const relatedQueries = [
    'What is the land use in this image?',
    'How many bridges are visible?',
    'Highlight the built-up areas.',
    'Is there any deforestation?',
    'Detect changes with another image.',
  ];

  const quickPills = [
    'What objects are visible?',
    'Identify built-up areas',
    'Highlight the water body',
    'Classify land use',
    'Detect changes over time?',
  ];

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const isChange = chatInput.toLowerCase().includes('change') || chatInput.toLowerCase().includes('between');
    onRunFollowUp(chatInput, isChange ? 'change' : 'single');
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
      className="single-result-layout"
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

          {/* Thumbnail */}
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              flexShrink: 0,
            }}
          >
            <img src={userImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Query Text */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#f8fafc' }}>
              {userQuery}
            </div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Today, 10:21 AM
            </div>
          </div>
        </div>

        {/* AI Response Bubble & Content */}
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
              Here is a detailed description of the satellite image:
            </span>
          </div>

          {/* 2-Column Split: Left Description & Elements, Right Map Visualization */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.15fr',
              gap: '24px',
              alignItems: 'start',
            }}
            className="result-two-col"
          >
            {/* Left Column: Overall Description & Key Elements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Overall Description Box */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <FileText size={16} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', letterSpacing: '0.02em' }}>
                    Overall Description
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.65,
                    color: 'rgba(226, 232, 240, 0.9)',
                  }}
                >
                  This satellite image shows a mixed urban and natural landscape. A large river flows
                  from the top-left to the bottom-right, with a bridge connecting the two sides. The
                  western side (left) is densely built-up with urban areas, while the eastern side
                  (right) contains a mix of agricultural fields, green patches, and smaller settlements.
                </p>
              </div>

              {/* Key Elements */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Sparkles size={16} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', letterSpacing: '0.02em' }}>
                    Key Elements
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {keyElements.map((item) => {
                    const Icon = item.icon;
                    const isHighlighted = highlightedElement === item.id;
                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setHighlightedElement(item.id)}
                        onMouseLeave={() => setHighlightedElement(null)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: isHighlighted ? 'rgba(0, 229, 255, 0.08)' : 'rgba(4, 9, 21, 0.5)',
                          border: isHighlighted ? '1px solid rgba(0, 229, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: item.badgeBg,
                            border: `1px solid ${item.badgeBorder}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: item.badgeColor,
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          <Icon size={14} />
                        </div>

                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Satellite Map Visualization */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#040d1a',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                position: 'relative',
              }}
            >
              {/* Map Controls Header */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {/* Map / Analysis Toggle */}
                <div
                  style={{
                    display: 'flex',
                    background: 'rgba(3, 7, 18, 0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 'var(--radius-full)',
                    padding: '2px',
                  }}
                >
                  <button
                    onClick={() => setActiveTab('map')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      background: activeTab === 'map' ? '#38bdf8' : 'transparent',
                      color: activeTab === 'map' ? '#030712' : '#cbd5e1',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Map
                  </button>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      background: activeTab === 'analysis' ? '#38bdf8' : 'transparent',
                      color: activeTab === 'analysis' ? '#030712' : '#cbd5e1',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Analysis
                  </button>
                </div>

                {/* Expand Fullscreen Button */}
                <button
                  onClick={() => onOpenLightbox(userImage, 'Satellite Scene Visualization')}
                  title="Expand Map"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: 'rgba(3, 7, 18, 0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <Maximize2 size={13} />
                </button>
              </div>

              {/* Map Canvas / Image */}
              <div style={{ position: 'relative', width: '100%', height: '420px' }}>
                <img
                  src={userImage}
                  alt="Satellite Analysis Scene"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Overlaid Interactive Tags (matching Reference 3) */}
                {/* 1. Urban Area Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '38%',
                    left: '12%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(3, 7, 18, 0.85)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(0, 229, 255, 0.4)',
                    boxShadow: '0 0 10px rgba(0, 229, 255, 0.2)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#fff',
                  }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e5ff' }} />
                  <span>Urban Area</span>
                </div>

                {/* 2. River Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '28%',
                    left: '52%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(3, 7, 18, 0.85)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(14, 165, 233, 0.4)',
                    boxShadow: '0 0 10px rgba(14, 165, 233, 0.2)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#fff',
                  }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                  <span>River</span>
                </div>

                {/* 3. Bridge Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '52%',
                    left: '48%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(3, 7, 18, 0.85)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    boxShadow: '0 0 10px rgba(168, 85, 247, 0.2)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#fff',
                  }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c084fc' }} />
                  <span>Bridge</span>
                </div>

                {/* 4. Agricultural Land Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '44%',
                    right: '10%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(3, 7, 18, 0.85)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.2)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#fff',
                  }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                  <span>Agricultural Land</span>
                </div>

                {/* Bottom Right Controls: North Compass & Scale Bar */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '6px',
                    background: 'rgba(3, 7, 18, 0.8)',
                    backdropFilter: 'blur(6px)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {/* Compass */}
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: 'var(--accent-cyan)',
                    }}
                  >
                    N
                  </div>
                  {/* Scale Bar */}
                  <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
                    0 ── 1 ── 2 km
                  </div>
                </div>
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
                  const isChange = pill.includes('change');
                  onRunFollowUp(pill, isChange ? 'change' : 'single');
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

      {/* Right Insights & Actions Panel (matching Reference 3) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 1. Next Steps Panel */}
        <div
          style={{
            padding: '20px',
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
            Next Steps
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { title: 'Ask follow-up questions', desc: 'Drill down into specific areas' },
              { title: 'Highlight objects', desc: 'E.g., buildings, roads, water' },
              { title: 'Compare with another image', desc: 'Analyze changes over time', isAction: true },
              { title: 'Generate a report', desc: 'Get a detailed analysis', isReport: true },
            ].map((step, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (step.isAction) onRunFollowUp('What changed between these two satellite images?', 'change');
                  if (step.isReport) onGenerateReport();
                }}
                style={{
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 229, 255, 0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Download & Share */}
        <div
          style={{
            padding: '20px',
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
            Download & Share
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => onOpenLightbox(userImage, 'Satellite Scene Image')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Download size={14} color="var(--accent-cyan)" />
              <span>Download Image</span>
            </button>

            <button
              onClick={onGenerateReport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <FileText size={14} color="var(--accent-cyan)" />
              <span>Download Report</span>
            </button>

            <button
              onClick={onShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Share2 size={14} color="var(--accent-cyan)" />
              <span>Share Analysis</span>
            </button>
          </div>
        </div>

        {/* 3. Related Queries */}
        <div
          style={{
            padding: '20px',
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
            Related Queries
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {relatedQueries.map((rq, idx) => (
              <div
                key={idx}
                onClick={() => {
                  const isChange = rq.includes('change');
                  onRunFollowUp(rq, isChange ? 'change' : 'single');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-cyan)' }}>☑</span>
                  <span>{rq}</span>
                </div>
                <ArrowRight size={13} color="var(--accent-cyan)" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .single-result-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .result-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
