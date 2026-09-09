import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  TrendingUp,
  MapPin,
  Layers,
  UploadCloud,
  Paperclip,
  Crosshair,
  Send,
  RotateCw,
  ChevronDown,
  X,
} from 'lucide-react';

interface WorkspaceInitialProps {
  onExecuteQuery: (query: string, images: string[], type: 'single' | 'change' | 'custom') => void;
}

export const WorkspaceInitial: React.FC<WorkspaceInitialProps> = ({ onExecuteQuery }) => {
  const [inputText, setInputText] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('Auto');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const capabilities = [
    {
      id: 'describe',
      title: 'Describe\nan image',
      desc: 'Understand scenes\nand land cover',
      icon: ImageIcon,
      defaultQuery: 'Describe this satellite image.',
      type: 'single' as const,
      sampleImages: ['/assets/workspace_river_scene.svg'],
    },
    {
      id: 'changes',
      title: 'Detect\nchanges',
      desc: 'Compare images\nover time',
      icon: TrendingUp,
      defaultQuery: 'What changed between these two satellite images?',
      type: 'change' as const,
      sampleImages: ['/assets/bitemporal_2022.svg', '/assets/bitemporal_2024.svg'],
    },
    {
      id: 'objects',
      title: 'Find & highlight\nobjects',
      desc: 'Locate regions\nwith natural language',
      icon: MapPin,
      defaultQuery: 'Identify and highlight built-up areas and bridges.',
      type: 'single' as const,
      sampleImages: ['/assets/workspace_river_scene.svg'],
    },
    {
      id: 'fusion',
      title: 'Analyze\noptical + SAR',
      desc: 'Fuse multi-sensor\ndata for deeper insights',
      icon: Layers,
      defaultQuery: 'Perform optical + SAR fusion to classify water bodies.',
      type: 'single' as const,
      sampleImages: ['/assets/workspace_river_scene.svg'],
    },
  ];

  const quickPills = [
    { label: 'What changed over time?', type: 'change' as const, query: 'What changed between these two satellite images?', images: ['/assets/bitemporal_2022.svg', '/assets/bitemporal_2024.svg'] },
    { label: 'Identify water bodies', type: 'single' as const, query: 'Identify and segment water bodies in this scene.', images: ['/assets/workspace_river_scene.svg'] },
    { label: 'Describe this image', type: 'single' as const, query: 'Describe this satellite image.', images: ['/assets/workspace_river_scene.svg'] },
    { label: 'Analyze optical + SAR', type: 'single' as const, query: 'Analyze optical + SAR multi-sensor fusion features.', images: ['/assets/workspace_river_scene.svg'] },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newImgs: string[] = [];
    for (let i = 0; i < files.length; i++) {
      newImgs.push(URL.createObjectURL(files[i]));
    }
    setUploadedImages((prev) => [...prev, ...newImgs].slice(0, 2));
  };

  const handleSend = () => {
    const query = inputText.trim() || 'Describe this satellite image.';
    const isChangeQuery =
      query.toLowerCase().includes('change') ||
      query.toLowerCase().includes('between') ||
      uploadedImages.length === 2;

    const finalImages =
      uploadedImages.length > 0
        ? uploadedImages
        : isChangeQuery
        ? ['/assets/bitemporal_2022.svg', '/assets/bitemporal_2024.svg']
        : ['/assets/workspace_river_scene.svg'];

    onExecuteQuery(query, finalImages, isChangeQuery ? 'change' : 'single');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '820px',
        margin: '0 auto',
        padding: '40px 16px 80px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Sparkle Icon */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00e5ff',
          marginBottom: '16px',
        }}
      >
        <Sparkles size={28} />
      </div>

      {/* Greeting Heading */}
      <h1
        style={{
          fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          marginBottom: '10px',
          textAlign: 'center',
        }}
      >
        Hello, I'm SatQuery <span style={{ color: '#00e5ff' }}>AI</span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: '36px',
        }}
      >
        Ask questions about satellite imagery. Discover insights. Make a real impact.
      </p>

      {/* 4 Capability Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          width: '100%',
          marginBottom: '28px',
        }}
        className="capability-row"
      >
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.id}
              onClick={() => onExecuteQuery(cap.defaultQuery, cap.sampleImages, cap.type)}
              style={{
                padding: '22px 16px',
                borderRadius: '14px',
                background: 'rgba(8, 16, 32, 0.65)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(56, 189, 248, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.45)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 229, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(0, 229, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)',
                }}
              >
                <Icon size={19} strokeWidth={1.8} />
              </div>

              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1.3,
                  whiteSpace: 'pre-line',
                }}
              >
                {cap.title}
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.35,
                  whiteSpace: 'pre-line',
                }}
              >
                {cap.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Input Container */}
      <div
        style={{
          width: '100%',
          borderRadius: '16px',
          background: 'rgba(6, 13, 27, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 229, 255, 0.08)',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        {/* Upper Row: Image Upload Dropzone (Left) + Textarea (Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '170px 1fr',
            gap: '16px',
            marginBottom: '16px',
          }}
          className="input-top-grid"
        >
          {/* Add Image Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              borderRadius: '10px',
              border: '1px dashed rgba(56, 189, 248, 0.35)',
              background: 'rgba(3, 7, 18, 0.6)',
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: '110px',
              position: 'relative',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)')}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".tif,.tiff,.png,.jpg,.jpeg"
              multiple
              style={{ display: 'none' }}
            />

            {uploadedImages.length > 0 ? (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                {uploadedImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.8)',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <span style={{ fontSize: '10px', color: 'var(--accent-cyan)' }}>
                  {uploadedImages.length} Image{uploadedImages.length > 1 ? 's' : ''} Ready
                </span>
              </div>
            ) : (
              <>
                <UploadCloud size={24} color="var(--accent-cyan)" style={{ marginBottom: '8px' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                  Add Image
                </span>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  GeoTIFF, TIFF, PNG, JPG
                </span>
              </>
            )}
          </div>

          {/* Query Textarea & Send Button */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything about your satellite image..."
              rows={3}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '110px',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                resize: 'none',
                padding: '8px 48px 8px 8px',
                fontFamily: 'var(--font-sans)',
              }}
            />

            {/* Circular Send Button */}
            <button
              onClick={handleSend}
              aria-label="Send Query"
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00e5ff 0%, #0284c7 100%)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(0, 229, 255, 0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Toolbar: Model selector, Add another image, Region */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {/* Model Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(0, 229, 255, 0.08)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                color: 'var(--accent-cyan)',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Sparkles size={13} />
              <span>{selectedModel}</span>
              <ChevronDown size={13} />
            </button>

            {isModelDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '190px',
                  borderRadius: '8px',
                  background: 'rgba(4, 9, 21, 0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  padding: '6px',
                  zIndex: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {['Auto (Agentic Selection)', 'Remote-Sensing VLM', 'Siamese Change ViT', 'Optical + SAR Fusion'].map(
                  (m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedModel(m.split(' ')[0]);
                        setIsModelDropdownOpen(false);
                      }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        background: selectedModel === m.split(' ')[0] ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                        border: 'none',
                        color: selectedModel === m.split(' ')[0] ? '#00e5ff' : '#cbd5e1',
                        fontSize: '11.5px',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      {m}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Right Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              <Paperclip size={13} />
              <span>Add another image</span>
            </button>

            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              <Crosshair size={13} />
              <span>Region (optional)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Suggestion Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {quickPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => onExecuteQuery(pill.query, pill.images, pill.type)}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(8, 16, 32, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.background = 'rgba(8, 16, 32, 0.6)';
            }}
          >
            {pill.label}
          </button>
        ))}

        {/* Refresh button */}
        <button
          onClick={() => {
            setInputText('');
            setUploadedImages([]);
          }}
          title="Reset input"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <RotateCw size={14} />
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .capability-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .input-top-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
