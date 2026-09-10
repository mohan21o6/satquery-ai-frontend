import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Maximize2,
  FileText,
  Download,
  Share2,
  Send,
  Sparkles,
  Loader2,
  Cpu,
  Layers,
  Info,
  Radio,
  Eye,
  AlertCircle,
} from 'lucide-react';

import type { UserSession } from '../AuthModal';

export interface OpenEarthMapClassStat {
  class_id: number;
  class_name: string;
  color: string;
  pixel_count: number;
  percentage: number;
}

export interface OpenEarthMapSarData {
  success: boolean;
  model: string;
  task: string;
  checkpoint_loaded: boolean;
  checkpoint_path?: string;
  classes: string[];
  class_statistics: OpenEarthMapClassStat[];
  dominant_class: {
    class_name: string;
    percentage: number;
    color?: string;
  };
  total_pixels: number;
  segmentation_mask: string;
  mask_download_url?: string;
  optical_dimensions?: string;
  sar_dimensions?: string;
  mutual_dimensions?: string;
  tensor_dimensions?: string;
  inference_time_ms?: number;
}

interface WorkspaceSarFusionResultProps {
  userQuery: string;
  images: string[];
  currentUser: UserSession | null;
  onRunFollowUp: (query: string, type: 'single' | 'change' | 'sar-fusion') => void;
  onOpenLightbox: (img: string, title: string) => void;
  onGenerateReport: () => void;
  onShare: () => void;
}

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

// Official OpenEarthMap-SAR 9 Classes Definition (Background + 8 Land-Cover Categories)
const DEFAULT_CLASSES = [
  { id: 0, name: 'Background', color: '#000000' },
  { id: 1, name: 'Bareland', color: '#800000' },
  { id: 2, name: 'Grass', color: '#00ff24' },
  { id: 3, name: 'Pavement', color: '#949494' },
  { id: 4, name: 'Road', color: '#ffffff' },
  { id: 5, name: 'Tree', color: '#226126' },
  { id: 6, name: 'Water', color: '#0045ff' },
  { id: 7, name: 'Cropland', color: '#4bb549' },
  { id: 8, name: 'Buildings', color: '#de1f07' },
];

export const WorkspaceSarFusionResult: React.FC<WorkspaceSarFusionResultProps> = ({
  userQuery,
  images,
  onRunFollowUp,
  onOpenLightbox,
  onGenerateReport,
  onShare,
}) => {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // ── OpenEarthMap-SAR API State ─────────────────────────────────────
  const [apiData, setApiData] = useState<OpenEarthMapSarData | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [apiStatusText, setApiStatusText] = useState<string>('Connecting to OpenEarthMap-SAR API...');
  const [apiError, setApiError] = useState<string | null>(null);

  const opticalImg = images[0] || '/assets/bitemporal_2024.svg';
  const sarImg = images[1] || '/assets/bitemporal_2022.svg';

  // Lossless conversion of image source to standard PNG File
  const urlToPngFile = async (url: string, filename: string): Promise<File> => {
    try {
      if (url.startsWith('blob:') || url.startsWith('data:')) {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type || 'image/png' });
      }
    } catch {}

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 512;
        canvas.height = img.naturalHeight || 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], filename, { type: 'image/png' }));
          } else {
            reject(new Error('Failed to convert canvas to PNG blob'));
          }
        }, 'image/png');
      };
      img.onerror = () => {
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => resolve(new File([blob], filename, { type: 'image/png' })))
          .catch(reject);
      };
      img.src = url;
    });
  };

  const executeSarFusion = async () => {
    if (images.length < 2) return;
    setIsLoadingApi(true);
    setApiError(null);
    setApiStatusText('Preparing Optical (RGB) & SAR radar inputs...');

    try {
      const opticalFile = await urlToPngFile(opticalImg, 'optical_image.png');
      const sarFile = await urlToPngFile(sarImg, 'sar_image.png');

      const formData = new FormData();
      formData.append('optical_image', opticalFile);
      formData.append('sar_image', sarFile);

      setApiStatusText('Executing OpenEarthMap-SAR UNet (EfficientNet-B4 + scSE) segmentation...');

      let apiRes: Response | null = null;
      try {
        apiRes = await fetch('http://127.0.0.1:8001/sar-fusion/predict', {
          method: 'POST',
          body: formData,
        });
      } catch {
        apiRes = await fetch('http://localhost:8001/sar-fusion/predict', {
          method: 'POST',
          body: formData,
        });
      }

      if (!apiRes.ok) {
        const errText = await apiRes.text().catch(() => '');
        let msg = `OpenEarthMap-SAR API returned HTTP ${apiRes.status}`;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.detail) msg = parsed.detail;
        } catch {}
        throw new Error(msg);
      }

      const data: OpenEarthMapSarData = await apiRes.json();
      if (data.success) {
        setApiData(data);
        setApiStatusText('OpenEarthMap-SAR Analysis Completed');
      }
    } catch (err: any) {
      console.warn('[OpenEarthMap-SAR Frontend] Notice:', err);
      setApiError(err.message || 'OpenEarthMap-SAR backend service unreachable');
      setApiStatusText('Backend server offline or checkpoint missing');
    } finally {
      setIsLoadingApi(false);
    }
  };

  useEffect(() => {
    executeSarFusion();
  }, [images]);

  const analysisChecklist = [
    'Optical RGB & SAR radar modalities ingested',
    'Spatial extent center-crop co-registration',
    'OpenEarthMap-SAR UNet (EfficientNet-B4 + scSE attention) evaluation',
    apiData ? '9-output segmentation generated (8 land-cover categories + background)' : 'UNet semantic mask calculation',
    apiData
      ? `Dominant class: ${apiData.dominant_class?.class_name} (${apiData.dominant_class?.percentage}%)`
      : 'Calculating 9-channel output distribution metrics',
  ];

  const suggestedFollowUps = [
    'What is the dominant land-cover class?',
    'Show 9-channel distribution breakdown',
    'How much vegetation vs urban area is detected?',
    'Download the segmentation mask',
    'Run ChangeFormer change detection on RGB images',
  ];

  const handleSendChat = () => {
    const q = chatInput.trim();
    if (!q) return;

    const userMsg: ChatMessage = { sender: 'user', text: q };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    const qLower = q.toLowerCase();
    setTimeout(() => {
      let reply = '';
      if (qLower.includes('dominant') || qLower.includes('main')) {
        reply = apiData
          ? `The dominant land-cover class identified by OpenEarthMap-SAR is **${apiData.dominant_class?.class_name}** at **${apiData.dominant_class?.percentage}%**.`
          : 'Running OpenEarthMap-SAR multimodal inference to determine dominant terrain class.';
      } else if (qLower.includes('class') || qLower.includes('distribution') || qLower.includes('breakdown')) {
        if (apiData && apiData.class_statistics) {
          const stats = apiData.class_statistics
            .filter((c) => c.pixel_count > 0)
            .map((c) => `• **${c.class_name}**: ${c.percentage}% (${c.pixel_count.toLocaleString()} px)`)
            .join('\n');
          reply = `**OpenEarthMap-SAR 9-Output Distribution (8 land-cover + background):**\n\n${stats}`;
        } else {
          reply = 'OpenEarthMap-SAR statistics are currently being calculated.';
        }
      } else if (qLower.includes('download') || qLower.includes('mask')) {
        if (apiData && apiData.segmentation_mask) {
          const link = document.createElement('a');
          link.href = apiData.segmentation_mask;
          link.download = `OpenEarthMap_SAR_Mask_${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          reply = 'OpenEarthMap-SAR segmentation mask PNG downloaded.';
        } else {
          reply = 'Segmentation mask is not ready yet.';
        }
      } else if (qLower.includes('changeformer') || qLower.includes('change')) {
        reply = 'Switching to ChangeFormer bi-temporal change detection mode for Before/After analysis.';
        onRunFollowUp(q, 'change');
      } else {
        reply = apiData
          ? `OpenEarthMap-SAR evaluated ${apiData.total_pixels?.toLocaleString()} pixels. Dominant class: **${apiData.dominant_class?.class_name}** (${apiData.dominant_class?.percentage}%).`
          : 'Processing multimodal remote sensing data via OpenEarthMap-SAR.';
      }
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    }, 400);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px 20px 48px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 340px',
        gap: '24px',
        alignItems: 'start',
      }}
      className="workspace-layout-grid"
    >
      {/* Main Analysis Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header Bar */}
        <div
          style={{
            padding: '20px 24px',
            borderRadius: '14px',
            background: 'rgba(6, 13, 27, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, rgba(0, 229, 255, 0.3), rgba(15, 23, 42, 0.8))',
                  border: '1px solid rgba(0, 229, 255, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00e5ff',
                }}
              >
                <Radio size={16} />
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                OpenEarthMap-SAR Multimodal Semantic Segmentation (DFC2025)
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#00e5ff',
              }}
            >
              {isLoadingApi ? (
                <>
                  <Loader2 size={12} className="spin" />
                  <span>{apiStatusText.toUpperCase()}</span>
                </>
              ) : apiData?.checkpoint_loaded ? (
                <>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  <span>PRETRAINED UNET LOADED</span>
                </>
              ) : (
                <>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308' }} />
                  <span>OEM-SAR BASELINE</span>
                </>
              )}
            </div>
          </div>

          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
            {userQuery}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Architecture: <strong style={{ color: '#00e5ff' }}>UNet EfficientNet-B4 + scSE Attention</strong> • Dataset: <strong style={{ color: '#00e5ff' }}>OpenEarthMap-SAR</strong> • <strong style={{ color: '#00e5ff' }}>9 output channels • 8 land-cover categories + background</strong>
          </div>
        </div>

        {/* Multimodal Tri-Panel Result Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
          className="tri-image-grid"
        >
          {/* Card 1: Optical RGB Image */}
          <div
            style={{
              borderRadius: '12px',
              background: 'rgba(6, 13, 27, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={13} color="#00e5ff" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#00e5ff', fontFamily: 'var(--font-mono)' }}>
                  STREAM 1: OPTICAL (RGB)
                </span>
              </div>
              <button
                onClick={() => onOpenLightbox(opticalImg, 'Optical (RGB) Satellite Acquisition')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                title="Expand View"
              >
                <Maximize2 size={13} />
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: '#020617' }}>
              <img
                src={opticalImg}
                alt="Optical Input"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '8px 12px', fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Optical Surface Reflectance (RGB)
            </div>
          </div>

          {/* Card 2: SAR Radar Image */}
          <div
            style={{
              borderRadius: '12px',
              background: 'rgba(6, 13, 27, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={13} color="#38bdf8" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  STREAM 2: SAR (RADAR)
                </span>
              </div>
              <button
                onClick={() => onOpenLightbox(sarImg, 'Synthetic Aperture Radar (SAR)')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                title="Expand View"
              >
                <Maximize2 size={13} />
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: '#020617' }}>
              <img
                src={sarImg}
                alt="SAR Input"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }}
              />
            </div>
            <div style={{ padding: '8px 12px', fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              SAR Backscatter Intensity
            </div>
          </div>

          {/* Card 3: 9-Output Segmentation Mask */}
          <div
            style={{
              borderRadius: '12px',
              background: 'rgba(6, 13, 27, 0.8)',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 30px rgba(0, 229, 255, 0.15)',
            }}
          >
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
                background: 'rgba(0, 229, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={13} color="#00e5ff" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#00e5ff', fontFamily: 'var(--font-mono)' }}>
                  OPENEARTHMAP-SAR — 9-OUTPUT SEMANTIC SEGMENTATION
                </span>
              </div>
              {apiData?.segmentation_mask && (
                <button
                  onClick={() => onOpenLightbox(apiData.segmentation_mask, 'OpenEarthMap-SAR 9-Output Segmentation Mask')}
                  style={{ background: 'none', border: 'none', color: '#00e5ff', cursor: 'pointer' }}
                  title="Expand Mask"
                >
                  <Maximize2 size={13} />
                </button>
              )}
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isLoadingApi ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#00e5ff' }}>
                  <Loader2 size={28} className="spin" />
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>Running 9-channel inference...</span>
                </div>
              ) : apiData?.segmentation_mask ? (
                <img
                  src={apiData.segmentation_mask}
                  alt="OpenEarthMap-SAR Segmentation Mask"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  <AlertCircle size={24} color="#eab308" style={{ marginBottom: '6px' }} />
                  <div>Segmentation mask will render when backend executes.</div>
                </div>
              )}
            </div>
            <div style={{ padding: '8px 12px', fontSize: '10.5px', color: '#38bdf8', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between' }}>
              <span>9-Output Color-Mapped Mask</span>
              {apiData?.inference_time_ms && <span>{apiData.inference_time_ms}ms</span>}
            </div>
          </div>
        </div>

        {/* Checkpoint / Status Notice */}
        {apiError && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              background: 'rgba(234, 179, 8, 0.08)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              color: '#fde047',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '4px' }}>
              <AlertCircle size={15} />
              <span>Official OpenEarthMap-SAR Baseline Notice</span>
            </div>
            <div>{apiError}</div>
            <div style={{ marginTop: '6px', color: '#cbd5e1', fontSize: '11px' }}>
              To load the official pretrained weights, run: <code style={{ color: '#00e5ff', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>python backend/sar_ml_fusion/download_checkpoint.py</code>
            </div>
          </div>
        )}

        {/* 9-Output Distribution Table */}
        <div
          style={{
            padding: '20px 24px',
            borderRadius: '14px',
            background: 'rgba(6, 13, 27, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="#00e5ff" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em' }}>
                OPENEARTHMAP-SAR — 9-OUTPUT SEMANTIC SEGMENTATION
              </span>
            </div>
            {apiData?.dominant_class && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Dominant:</span>
                <span style={{ color: apiData.dominant_class.color || '#00e5ff', fontWeight: 700 }}>
                  {apiData.dominant_class.class_name} ({apiData.dominant_class.percentage}%)
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginBottom: '16px',
            }}
            className="classes-grid"
          >
            {DEFAULT_CLASSES.map((cls) => {
              const stat = apiData?.class_statistics?.find((s) => s.class_id === cls.id || s.class_name === cls.name);
              const pct = stat ? stat.percentage : 0;
              const px = stat ? stat.pixel_count : 0;

              return (
                <div
                  key={cls.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(3, 7, 18, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '2px',
                          background: cls.color,
                          display: 'inline-block',
                          border: '1px solid rgba(255,255,255,0.2)',
                        }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>{cls.name}</span>
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 700 }}>
                      {pct}%
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        height: '100%',
                        background: cls.color,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  {px > 0 && (
                    <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {px.toLocaleString()} px
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <Info size={13} color="#00e5ff" />
              <span>Classes follow IEEE GRSS Data Fusion Contest Track 1 specification.</span>
            </div>

            {apiData?.segmentation_mask && (
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = apiData.segmentation_mask;
                  link.download = `OpenEarthMap_SAR_Mask_${Date.now()}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="btn-pill-cyan"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                <Download size={13} />
                <span>Download Mask PNG</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Chat Panel */}
        <div
          style={{
            padding: '20px 24px',
            borderRadius: '14px',
            background: 'rgba(6, 13, 27, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={16} color="#00e5ff" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
              Follow-Up Analysis &amp; Query Console
            </span>
          </div>

          {/* Message Thread */}
          {chatMessages.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px', maxHeight: '200px', overflowY: 'auto' }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: msg.sender === 'user' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(3, 7, 18, 0.8)',
                    border: msg.sender === 'user' ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    lineHeight: 1.4,
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask about OpenEarthMap-SAR classification, class percentages, or switch to ChangeFormer..."
              style={{
                width: '100%',
                padding: '10px 42px 10px 14px',
                borderRadius: '8px',
                background: 'rgba(3, 7, 18, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSendChat}
              style={{
                position: 'absolute',
                right: '6px',
                background: 'none',
                border: 'none',
                color: '#00e5ff',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={15} />
            </button>
          </div>

          {/* Suggested Query Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            {suggestedFollowUps.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setChatInput(chip);
                  if (chip.includes('ChangeFormer')) {
                    onRunFollowUp(chip, 'change');
                  }
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#00e5ff')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar: Execution Checklist & Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Actions Card */}
        <div
          style={{
            padding: '20px',
            borderRadius: '14px',
            background: 'rgba(6, 13, 27, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Analysis Actions
          </span>

          <button
            onClick={onGenerateReport}
            className="btn-pill-cyan"
            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}
          >
            <FileText size={15} />
            <span>Generate Analysis Report</span>
          </button>

          <button
            onClick={onShare}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <Share2 size={15} />
            <span>Share Result Dossier</span>
          </button>
        </div>

        {/* Pipeline Execution Telemetry Checklist */}
        <div
          style={{
            padding: '20px',
            borderRadius: '14px',
            background: 'rgba(6, 13, 27, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Cpu size={15} color="#00e5ff" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em' }}>
              PIPELINE EXECUTION TRACE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {analysisChecklist.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={13} color="#00e5ff" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <div>Model: OpenEarthMap-SAR</div>
            <div>Encoder: EfficientNet-B4 (scSE)</div>
            <div>Classes: 8 (DFC2025 Standard)</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1040px) {
          .workspace-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .tri-image-grid {
            grid-template-columns: 1fr !important;
          }
          .classes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
