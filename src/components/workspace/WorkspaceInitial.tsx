import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  TrendingUp,
  Layers,
  UploadCloud,
  Send,
  RotateCw,
  ChevronDown,
  X,
  CheckCircle2,
  AlertCircle,
  FileImage,
} from 'lucide-react';

interface WorkspaceInitialProps {
  onExecuteQuery: (query: string, images: string[], type: 'single' | 'change' | 'sar-fusion' | 'florence-2' | 'custom') => void;
}

interface ImageSlot {
  url: string;
  name: string;
  file?: File;
  dimensions?: string;
}

export const WorkspaceInitial: React.FC<WorkspaceInitialProps> = ({ onExecuteQuery }) => {
  const [selectedModel, setSelectedModel] = useState<'changeformer' | 'sar-fusion' | 'florence-2'>('changeformer');
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<string>('changes');
  const [inputText, setInputText] = useState('What changed between these two satellite images?');
  const [beforeImage, setBeforeImage] = useState<ImageSlot | null>(null);
  const [afterImage, setAfterImage] = useState<ImageSlot | null>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputBeforeRef = useRef<HTMLInputElement | null>(null);
  const fileInputAfterRef = useRef<HTMLInputElement | null>(null);

  const isSarMode = selectedModel === 'sar-fusion';
  const isFlorenceMode = selectedModel === 'florence-2';

  const capabilities = [
    {
      id: 'changes',
      title: 'Bi-Temporal\nChange Detection',
      desc: 'Compare multi-date satellite images\nusing ChangeFormer V6 ViT',
      icon: TrendingUp,
      model: 'changeformer' as const,
      defaultQuery: 'What changed between these two satellite images?',
      type: 'change' as const,
      sampleBefore: '/assets/bitemporal_2022.svg',
      sampleAfter: '/assets/bitemporal_2024.svg',
    },
    {
      id: 'sar-multimodal',
      title: 'Multimodal SAR\n+ Optical Baseline',
      desc: 'OpenEarthMap-SAR semantic segmentation\n(9-output, 8 land-cover categories)',
      icon: Sparkles,
      model: 'sar-fusion' as const,
      defaultQuery: 'Perform OpenEarthMap-SAR 9-output semantic segmentation using Optical and SAR imagery.',
      type: 'sar-fusion' as const,
      sampleBefore: '/assets/bitemporal_2022.svg',
      sampleAfter: '/assets/bitemporal_2024.svg',
    },
    {
      id: 'florence-vqa',
      title: 'Visual Q&A\n& Scene Analysis',
      desc: 'Ask natural-language questions\nabout single satellite scenes',
      icon: ImageIcon,
      model: 'florence-2' as const,
      defaultQuery: 'Is there a water body in this image?',
      type: 'florence-2' as const,
      sampleBefore: '/assets/workspace_river_scene.svg',
      sampleAfter: '',
    },
    {
      id: 'florence-seg',
      title: 'Feature Highlighting\n& Mask Extraction',
      desc: 'Segment target regions:\nwater bodies, roads, buildings',
      icon: Layers,
      model: 'florence-2' as const,
      defaultQuery: 'Highlight the water body.',
      type: 'florence-2' as const,
      sampleBefore: '/assets/workspace_river_scene.svg',
      sampleAfter: '',
    },
  ];

  const quickPills = isSarMode
    ? [
        { label: 'OpenEarthMap-SAR 9-Output Segmentation', type: 'sar-fusion' as const, query: 'Perform OpenEarthMap-SAR 9-output semantic segmentation (8 land-cover categories + background) using Optical and SAR imagery.' },
        { label: 'SAR Radar Surface Penetration', type: 'sar-fusion' as const, query: 'Segment terrain and water bodies with OpenEarthMap-SAR UNet.' },
        { label: 'Class Distribution & Metrics', type: 'sar-fusion' as const, query: 'Calculate 9-channel output distribution for Optical and SAR inputs.' },
      ]
    : isFlorenceMode
    ? [
        { label: 'Is there a water body?', type: 'florence-2' as const, query: 'Is there a water body in this image?' },
        { label: 'Highlight the water body', type: 'florence-2' as const, query: 'Highlight the water body.' },
        { label: 'Highlight the buildings', type: 'florence-2' as const, query: 'Highlight the buildings.' },
        { label: 'Highlight the roads', type: 'florence-2' as const, query: 'Highlight the roads.' },
        { label: 'Highlight the vegetation', type: 'florence-2' as const, query: 'Highlight the vegetation.' },
      ]
    : [
        { label: 'Compare Before & After Images', type: 'change' as const, query: 'What changed between these two satellite images?' },
        { label: 'Generate Binary Change Mask', type: 'change' as const, query: 'Generate the ChangeFormer binary change mask.' },
        { label: 'Compute Changed Pixel Count', type: 'change' as const, query: 'Calculate changed pixels and change percentage.' },
      ];

  const handleProcessFile = (file: File, isBefore: boolean) => {
    // Validate image format
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/bmp', 'image/webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(file.type) && !['tif', 'tiff', 'png', 'jpg', 'jpeg', 'bmp'].includes(ext || '')) {
      setValidationError(`Invalid file format "${file.name}". Please upload a PNG, JPG, or GeoTIFF image.`);
      return;
    }

    setValidationError(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const slot: ImageSlot = {
        url,
        name: file.name,
        file,
        dimensions: `${img.naturalWidth} × ${img.naturalHeight}`,
      };
      if (isBefore) {
        setBeforeImage(slot);
      } else {
        setAfterImage(slot);
      }
    };
    img.src = url;
  };

  const handleLoadSample = (sampleB: string = '/assets/bitemporal_2022.svg', sampleA: string = '/assets/bitemporal_2024.svg') => {
    setValidationError(null);
    if (isSarMode) {
      setBeforeImage({
        url: sampleB,
        name: 'optical_rgb_sample.png',
        dimensions: '256 × 256',
      });
      setAfterImage({
        url: sampleA,
        name: 'sar_radar_sample.png',
        dimensions: '256 × 256',
      });
      setInputText('Perform multimodal 9-class land-cover segmentation using Optical and SAR imagery.');
    } else if (isFlorenceMode) {
      // Florence-2 only needs one image
      setBeforeImage({
        url: sampleB || '/assets/workspace_river_scene.svg',
        name: 'satellite_scene_sample.png',
        dimensions: '256 × 256',
      });
      setAfterImage(null);
      setInputText('Is there a water body in this image?');
    } else {
      setBeforeImage({
        url: sampleB,
        name: 'bitemporal_2022_before.png',
        dimensions: '256 × 256',
      });
      setAfterImage({
        url: sampleA,
        name: 'bitemporal_2024_after.png',
        dimensions: '256 × 256',
      });
      setInputText('What changed between these two satellite images?');
    }
  };

  const handleSend = () => {
    // Florence-2 (Case A/B) — only 1 image required
    if (isFlorenceMode) {
      if (!beforeImage) {
        if (!beforeImage) {
          handleLoadSample();
          onExecuteQuery(
            inputText.trim() || 'Describe what you see in this satellite image.',
            ['/assets/bitemporal_2022.svg'],
            'florence-2'
          );
          return;
        }
        setValidationError('Please upload a satellite image.');
        return;
      }
      setValidationError(null);
      const query = inputText.trim() || 'Describe what you see in this satellite image.';
      onExecuteQuery(query, [beforeImage.url], 'florence-2');
      return;
    }

    // ChangeFormer / SAR — 2 images required
    if (!beforeImage || !afterImage) {
      if (!beforeImage && !afterImage) {
        // Auto-load sample pair for instant preview
        handleLoadSample();
        onExecuteQuery(
          inputText.trim() || (isSarMode ? 'Multimodal segmentation' : 'What changed between these two satellite images?'),
          ['/assets/bitemporal_2022.svg', '/assets/bitemporal_2024.svg'],
          isSarMode ? 'sar-fusion' : 'change'
        );
        return;
      }
      setValidationError(
        isSarMode
          ? 'Please select both OPTICAL (RGB) and SAR (RADAR) satellite images for SAR-ML-Fusion.'
          : 'Please select both BEFORE and AFTER satellite images for ChangeFormer change detection.'
      );
      return;
    }

    setValidationError(null);
    const query = inputText.trim() || (isSarMode ? 'Perform SAR-ML-Fusion multimodal land cover segmentation.' : 'What changed between these two satellite images?');
    onExecuteQuery(query, [beforeImage.url, afterImage.url], isSarMode ? 'sar-fusion' : 'change');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        padding: '32px 16px 80px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Sparkle Icon */}
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 229, 255, 0.1)',
          border: '1px solid rgba(0, 229, 255, 0.4)',
          color: '#00e5ff',
          marginBottom: '14px',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.25)',
        }}
      >
        <Sparkles size={24} />
      </div>

      {/* Greeting Heading */}
      <h1
        style={{
          fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        {isSarMode ? (
          <>
            Multimodal Land Cover with <span style={{ color: '#00e5ff' }}>OpenEarthMap-SAR</span>
          </>
        ) : isFlorenceMode ? (
          <>
            Visual Analysis with <span style={{ color: '#00e5ff' }}>AI Image Understanding</span>
          </>
        ) : (
          <>
            Satellite Change Detection with <span style={{ color: '#00e5ff' }}>ChangeFormer</span>
          </>
        )}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: '0.925rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: '28px',
          maxWidth: '640px',
          lineHeight: 1.5,
        }}
      >
        {isSarMode
          ? 'Fuse Optical (RGB) and SAR (Radar backscatter) satellite images to perform high-resolution 8-class land-cover semantic segmentation using the official OpenEarthMap-SAR DFC2025 baseline.'
          : isFlorenceMode
          ? 'Upload a single satellite image and ask any question about it, or request spatial highlighting of features such as water bodies, roads, buildings, or vegetation.'
          : 'Upload bi-temporal satellite image pairs (Before & After) to compute real-time pixel-level change maps and spatial statistics using the LEVIR ChangeFormer V6 model.'}
      </p>

      {/* Capability Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          width: '100%',
          marginBottom: '24px',
        }}
        className="capability-row"
      >
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          const isCapSelected = selectedCapabilityId === cap.id;
          return (
            <div
              key={cap.id}
              onClick={() => {
                setSelectedCapabilityId(cap.id);
                if (cap.model) {
                  setSelectedModel(cap.model);
                }
                handleLoadSample(cap.sampleBefore, cap.sampleAfter);
                setInputText(cap.defaultQuery);
              }}
              style={{
                padding: '18px 14px',
                borderRadius: '12px',
                background: isCapSelected ? 'rgba(0, 229, 255, 0.08)' : 'rgba(8, 16, 32, 0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: isCapSelected ? '1px solid rgba(0, 229, 255, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '10px',
                position: 'relative',
                transition: 'all 0.25s ease',
                opacity: isCapSelected ? 1 : 0.65,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                if (isCapSelected) {
                  e.currentTarget.style.borderColor = '#00e5ff';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 229, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                if (isCapSelected) {
                  e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.45)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isCapSelected && (
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    color: '#00e5ff',
                    background: 'rgba(0, 229, 255, 0.15)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  ACTIVE
                </span>
              )}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: isCapSelected ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCapSelected ? '#00e5ff' : 'var(--text-muted)',
                }}
              >
                <Icon size={18} strokeWidth={1.8} />
              </div>

              <div
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: isCapSelected ? '#ffffff' : '#94a3b8',
                  lineHeight: 1.25,
                  whiteSpace: 'pre-line',
                }}
              >
                {cap.title}
              </div>

              <div
                style={{
                  fontSize: '0.725rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.3,
                  whiteSpace: 'pre-line',
                }}
              >
                {cap.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Input & Dual-Image Upload Container */}
      <div
        style={{
          width: '100%',
          borderRadius: '16px',
          background: 'rgba(6, 13, 27, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 229, 255, 0.35)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 229, 255, 0.08)',
          padding: '22px',
          marginBottom: '20px',
        }}
      >
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={fileInputBeforeRef}
          onChange={(e) => e.target.files?.[0] && handleProcessFile(e.target.files[0], true)}
          accept=".tif,.tiff,.png,.jpg,.jpeg,.bmp"
          style={{ display: 'none' }}
        />
        <input
          type="file"
          ref={fileInputAfterRef}
          onChange={(e) => e.target.files?.[0] && handleProcessFile(e.target.files[0], false)}
          accept=".tif,.tiff,.png,.jpg,.jpeg,.bmp"
          style={{ display: 'none' }}
        />

        {/* Top: 2-Slot Image Dropzone Grid */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {isSarMode ? 'Multimodal Satellite Inputs (Optical RGB & SAR Radar)' : isFlorenceMode ? 'Single Satellite Image Input' : 'Bi-Temporal Satellite Imagery (T1 Before & T2 After)'}
            </span>
            <button
              onClick={() => handleLoadSample()}
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#00e5ff',
                background: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                padding: '3px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>{isFlorenceMode ? '⚡ Load Sample Image' : '⚡ Load Sample Pair'}</span>
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isFlorenceMode ? '1fr' : '1fr 1fr',
              gap: '14px',
            }}
            className="dual-image-grid"
          >
            {/* Slot 1: BEFORE / OPTICAL / SINGLE IMAGE */}
            <div
              onClick={() => fileInputBeforeRef.current?.click()}
              style={{
                borderRadius: '10px',
                border: beforeImage ? '1px solid rgba(0, 229, 255, 0.5)' : '1px dashed rgba(56, 189, 248, 0.35)',
                background: beforeImage ? 'rgba(3, 7, 18, 0.85)' : 'rgba(3, 7, 18, 0.5)',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                minHeight: '80px',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = beforeImage ? 'rgba(0, 229, 255, 0.5)' : 'rgba(56, 189, 248, 0.35)')}
            >
              {beforeImage ? (
                <>
                  <div style={{ width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
                    <img src={beforeImage.url} alt="Slot 1 Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#00e5ff', fontFamily: 'var(--font-mono)' }}>
                        {isSarMode ? 'STREAM 1: OPTICAL (RGB)' : isFlorenceMode ? 'INPUT: SATELLITE IMAGE' : 'T1: BEFORE'}
                      </span>
                      <CheckCircle2 size={12} color="#00e5ff" />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {beforeImage.name}
                    </div>
                    {beforeImage.dimensions && (
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {beforeImage.dimensions}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBeforeImage(null);
                    }}
                    title="Remove image"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(0, 229, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e5ff', flexShrink: 0 }}>
                    <UploadCloud size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc' }}>
                      {isSarMode ? '1. Upload OPTICAL Image (RGB)' : isFlorenceMode ? 'Upload Satellite Image (PNG / JPG / GeoTIFF)' : '1. Upload BEFORE Image (T1)'}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Click or drag satellite file (PNG/JPG/GeoTIFF)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Slot 2: AFTER / SAR RADAR IMAGE — hidden in Florence-2 single-image mode */}
            {!isFlorenceMode && (
            <div
              onClick={() => fileInputAfterRef.current?.click()}
              style={{
                borderRadius: '10px',
                border: afterImage ? '1px solid rgba(0, 229, 255, 0.5)' : '1px dashed rgba(56, 189, 248, 0.35)',
                background: afterImage ? 'rgba(3, 7, 18, 0.85)' : 'rgba(3, 7, 18, 0.5)',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                minHeight: '80px',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = afterImage ? 'rgba(0, 229, 255, 0.5)' : 'rgba(56, 189, 248, 0.35)')}
            >
              {afterImage ? (
                <>
                  <div style={{ width: '56px', height: '56px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
                    <img src={afterImage.url} alt="Slot 2 Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#00e5ff', fontFamily: 'var(--font-mono)' }}>
                        {isSarMode ? 'STREAM 2: SAR (RADAR)' : 'T2: AFTER'}
                      </span>
                      <CheckCircle2 size={12} color="#00e5ff" />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {afterImage.name}
                    </div>
                    {afterImage.dimensions && (
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {afterImage.dimensions}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAfterImage(null);
                    }}
                    title="Remove image"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(0, 229, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e5ff', flexShrink: 0 }}>
                    <UploadCloud size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc' }}>
                      {isSarMode ? '2. Upload SAR Image (Radar)' : '2. Upload AFTER Image (T2)'}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Click or drag satellite file (PNG/JPG/GeoTIFF)
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
        </div>

        {/* Query Input Area */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', background: 'rgba(3, 7, 18, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 12px' }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              isSarMode
                ? 'Ask anything about multimodal SAR + Optical land cover classification...'
                : isFlorenceMode
                ? 'Ask a question or type "Highlight the [feature]"...'
                : 'Ask anything about changes between these two satellite images...'
            }
            rows={2}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.925rem',
              lineHeight: 1.5,
              resize: 'none',
              paddingRight: '48px',
              fontFamily: 'var(--font-sans)',
            }}
          />

          {/* Circular Send Button */}
          <button
            onClick={handleSend}
            aria-label="Send Query"
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
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

        {/* Validation error message */}
        {validationError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontSize: '12px', marginTop: '10px', fontFamily: 'var(--font-mono)' }}>
            <AlertCircle size={14} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Bottom Toolbar: Model selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            marginTop: '12px',
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
              <span>
                {selectedModel === 'changeformer'
                  ? 'ChangeFormer V6 (LEVIR-CD ViT)'
                  : selectedModel === 'sar-fusion'
                  ? 'OpenEarthMap-SAR (UNet EfficientNet-B4)'
                  : 'AI Visual Analysis (Single Image)'}
              </span>
              <ChevronDown size={13} />
            </button>

            {isModelDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '320px',
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
                {[
                  {
                    id: 'changeformer' as const,
                    capId: 'changes',
                    name: 'ChangeFormer V6 (LEVIR-CD ViT)',
                    desc: 'Siamese Transformer for Binary Change Detection',
                  },
                  {
                    id: 'sar-fusion' as const,
                    capId: 'sar-multimodal',
                    name: 'OpenEarthMap-SAR (DFC2025 Baseline)',
                    desc: 'UNet EfficientNet-B4 • 9 output channels • 8 land-cover categories + background',
                  },
                  {
                    id: 'florence-2' as const,
                    capId: 'florence-vqa',
                    name: 'AI Visual Analysis (Single Image)',
                    desc: 'Ask questions about one image • Highlight features • Visual understanding',
                  },
                ].map((m) => {
                  const isCur = selectedModel === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m.id);
                        setSelectedCapabilityId(m.capId);
                        setIsModelDropdownOpen(false);
                        if (m.id === 'sar-fusion') {
                          setInputText('Perform OpenEarthMap-SAR 9-output semantic segmentation using Optical and SAR imagery.');
                        } else if (m.id === 'florence-2') {
                          setInputText('Is there a water body in this image?');
                          setAfterImage(null); // florence-2 only needs 1 image
                        } else {
                          setInputText('What changed between these two satellite images?');
                        }
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '4px',
                        background: isCur ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                        border: 'none',
                        color: isCur ? '#00e5ff' : '#94a3b8',
                        fontSize: '11.5px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600 }}>{m.name}</span>
                        {isCur && (
                          <span style={{ fontSize: '9px', color: '#00e5ff', background: 'rgba(0,229,255,0.1)', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                            SELECTED
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '10px', color: isCur ? '#38bdf8' : '#64748b' }}>{m.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <FileImage size={13} color="var(--accent-cyan)" />
            <span>Mismatched Dimensions Auto-Aligned (e.g. 1424×795 vs 1421×800)</span>
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
            onClick={() => {
              setInputText(pill.query);
              if (isFlorenceMode) {
                if (!beforeImage) {
                  handleLoadSample();
                }
              } else {
                if (!beforeImage || !afterImage) {
                  handleLoadSample();
                }
              }
            }}
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

        {/* Reset Button */}
        <button
          onClick={() => {
            setInputText(
              isSarMode
                ? 'Perform OpenEarthMap-SAR 9-output semantic segmentation using Optical and SAR imagery.'
                : isFlorenceMode
                ? 'Is there a water body in this image?'
                : 'What changed between these two satellite images?'
            );
            setBeforeImage(null);
            setAfterImage(null);
            setValidationError(null);
          }}
          title="Reset Inputs"
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
          .dual-image-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
