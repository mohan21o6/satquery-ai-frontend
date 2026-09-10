import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Maximize2,
  FileText,
  Download,
  Share2,
  ArrowRight,
  Send,
  Image as ImageIcon,
  RotateCw,
  Sparkles,
  Loader2,
  Cpu,
  Info,
} from 'lucide-react';

import type { UserSession } from '../AuthModal';
import type { ChangeReportStats } from './WorkspaceReportModal';

interface WorkspaceTwoImageResultProps {
  userQuery: string;
  images: string[];
  currentUser: UserSession | null;
  onRunFollowUp: (query: string, type: 'single' | 'change') => void;
  onOpenLightbox: (img: string, title: string) => void;
  onGenerateReport: (stats?: ChangeReportStats, beforeImg?: string, afterImg?: string, maskImg?: string) => void;
  onShare: () => void;
}

interface ChangeFormerStats {
  changed_pixels: number;
  total_pixels: number;
  change_percentage: number;
  threshold?: number;
  input_width: number;
  input_height: number;
  after_width?: number;
  after_height?: number;
  mask_width?: number;
  mask_height?: number;
  tiled_inference_enabled?: boolean;
  tile_size?: number;
  tile_overlap?: number;
  tile_count?: number;
}

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // ── ChangeFormer Live API Integration State ─────────────────────
  const [threshold, setThreshold] = useState<number>(0.50);
  const [apiMask, setApiMask] = useState<string | null>(null);
  const [apiStats, setApiStats] = useState<ChangeFormerStats | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [apiStatusText, setApiStatusText] = useState<string>('Connecting to ChangeFormer API...');
  const [apiError, setApiError] = useState<string | null>(null);

  const img1 = images[0] || '/assets/bitemporal_2022.svg';
  const img2 = images[1] || '/assets/bitemporal_2024.svg';
  const changeMapImg = apiMask || '';

  // Lossless conversion of image source (Blob URL, DataURL, Asset path) to standard PNG File
  const urlToPngFile = async (url: string, filename: string): Promise<File> => {
    try {
      if (url.startsWith('blob:') || url.startsWith('data:')) {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type || 'image/png' });
      }
    } catch {
      // fallback to canvas rendering below
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 256;
        canvas.height = img.naturalHeight || 256;
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

  const executeInference = async (targetThreshold: number = threshold) => {
    if (images.length < 2) return;
    setIsLoadingApi(true);
    setApiError(null);
    setApiStatusText('Preparing high-resolution image tiles...');

    try {
      const beforeFile = await urlToPngFile(img1, 'before_image.png');
      const afterFile = await urlToPngFile(img2, 'after_image.png');

      const formData = new FormData();
      formData.append('before_image', beforeFile);
      formData.append('after_image', afterFile);
      formData.append('threshold', targetThreshold.toString());
      formData.append('overlap', '64');

      setApiStatusText('Running ChangeFormer V6 Tiled Swin-Transformer Inference...');

      let apiRes: Response | null = null;
      try {
        apiRes = await fetch('http://127.0.0.1:8001/predict', {
          method: 'POST',
          body: formData,
        });
      } catch {
        apiRes = await fetch('http://localhost:8001/predict', {
          method: 'POST',
          body: formData,
        });
      }

      if (!apiRes.ok) {
        const errText = await apiRes.text().catch(() => '');
        let msg = `ChangeFormer API returned HTTP ${apiRes.status}`;
        try {
          const parsed = JSON.parse(errText);
          if (parsed.detail) msg += `: ${parsed.detail}`;
        } catch {}
        throw new Error(msg);
      }

      const data = await apiRes.json();
      if (data.success && data.result_image) {
        setApiMask(data.result_image);
        if (data.statistics) {
          setApiStats(data.statistics);
        }
        setApiStatusText('ChangeFormer Inference Completed');
      }
    } catch (err: any) {
      console.warn('[ChangeFormer Frontend] POST /predict notice:', err);
      setApiError(err.message || 'ChangeFormer backend server unreachable (http://127.0.0.1:8001)');
      setApiStatusText('Backend server offline');
    } finally {
      setIsLoadingApi(false);
    }
  };

  useEffect(() => {
    executeInference(threshold);
  }, [images]);


  const analysisChecklist = [
    'Bi-temporal satellite imagery ingested',
    'Spatial dimension alignment & tensor preprocessing',
    'ChangeFormer V6 Swin-Transformer inference',
    apiMask ? 'Binary Change Mask generated' : 'Change detection processing',
    apiStats
      ? `Real Metric: ${apiStats.change_percentage}% surface change`
      : 'Calculating pixel statistics',
  ];

  const suggestedFollowUps = [
    'Show the ChangeFormer change mask',
    'Show changed pixel statistics',
    'What percentage of pixels changed?',
    'Download the change mask',
    'Generate a ChangeFormer analysis report',
    'Run another before/after comparison',
  ];

  const quickPills = [
    'Show changed pixel statistics',
    'What percentage of pixels changed?',
    'How many pixels changed?',
    'Download the change mask',
    'Run another before/after comparison',
  ];

  const handleSendChat = () => {
    const q = chatInput.trim();
    if (!q) return;

    setChatMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setChatInput('');

    // ChangeFormer-only contextual response
    const qLower = q.toLowerCase();

    if (qLower.includes('how many') || qLower.includes('pixel') || qLower.includes('count')) {
      const response = apiStats
        ? `ChangeFormer detected ${apiStats.changed_pixels.toLocaleString()} changed pixels out of ${apiStats.total_pixels.toLocaleString()} total evaluated pixels (${apiStats.change_percentage}% surface change).`
        : 'Pixel statistics are currently being computed by ChangeFormer.';
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: response }]);
    } else if (qLower.includes('percentage') || qLower.includes('%')) {
      const response = apiStats
        ? `The evaluated surface change is ${apiStats.change_percentage}% according to the ChangeFormer V6 LEVIR model mask.`
        : 'Change percentage calculation is in progress.';
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: response }]);
    } else if (qLower.includes('mask') || qLower.includes('download')) {
      if (apiMask) {
        const link = document.createElement('a');
        link.href = apiMask;
        link.download = `ChangeFormer_mask_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setChatMessages((prev) => [...prev, { sender: 'assistant', text: 'ChangeFormer binary change mask PNG has been downloaded.' }]);
      } else {
        setChatMessages((prev) => [...prev, { sender: 'assistant', text: 'Change mask is not ready yet.' }]);
      }
    } else if (qLower.includes('report')) {
      onGenerateReport();
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: 'Opened the ChangeFormer intelligence dossier report.' }]);
    } else if (qLower.includes('again') || qLower.includes('another') || qLower.includes('compare')) {
      onRunFollowUp(q, 'change');
    } else if (
      qLower.includes('bounding') ||
      qLower.includes('structure') ||
      qLower.includes('vegetation') ||
      qLower.includes('residential') ||
      qLower.includes('industrial') ||
      qLower.includes('vqa') ||
      qLower.includes('grounding')
    ) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Notice: ChangeFormer strictly performs bi-temporal pixel-level binary change detection and statistical pixel calculations for satellite imagery.',
        },
      ]);
    } else {
      const response = apiStats
        ? `ChangeFormer Analysis Summary: Model Grid = 256×256 px, Changed Pixels = ${apiStats.changed_pixels.toLocaleString()}, Total Pixels = ${apiStats.total_pixels.toLocaleString()}, Change = ${apiStats.change_percentage}%.`
        : 'ChangeFormer inference is processing your satellite imagery.';
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: response }]);
    }
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
              Bi-Temporal Satellite Change Detection
            </div>
          </div>
        </div>

        {/* ChangeFormer Response Container */}
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
          {/* Header */}
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
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                ChangeFormer V6 Model Output:
              </span>
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
                    <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>{apiStatusText}</span>
                  </>
                ) : (
                  <>
                    <Cpu size={13} />
                    <span>ChangeFormer Live</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Error Banner if API call failed */}
          {apiError && (
            <div
              style={{
                marginBottom: '20px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontSize: '0.825rem',
                lineHeight: 1.5,
              }}
            >
              <strong>ChangeFormer Backend Connection Error:</strong> {apiError}.<br />
              <span style={{ fontSize: '11px', color: '#fca5a5' }}>
                Ensure your backend server is running via: <code>cd backend/changeformer && .\venv\Scripts\python.exe app.py</code>
              </span>
            </div>
          )}

          {/* 3-Card Visual Comparison */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '24px',
            }}
            className="three-cards-grid"
          >
            {/* Card 1: Before Image */}
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
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Before Image (T1)</div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {apiStats ? `${apiStats.input_width} × ${apiStats.input_height} px` : 'Initial Acquisition'}
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                <img src={img1} alt="Before Acquisition" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => onOpenLightbox(img1, 'Before Satellite Image (T1)')}
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

            {/* Card 2: After Image */}
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
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>After Image (T2)</div>
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {apiStats ? `${apiStats.after_width || apiStats.input_width} × ${apiStats.after_height || apiStats.input_height} px` : 'Subsequent Acquisition'}
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                <img src={img2} alt="After Acquisition" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => onOpenLightbox(img2, 'After Satellite Image (T2)')}
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

            {/* Card 3: Real ChangeFormer Change Mask */}
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#040d1a',
                border: apiError
                  ? '1px solid rgba(239, 68, 68, 0.5)'
                  : apiMask
                  ? '1px solid rgba(0, 229, 255, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: apiMask
                  ? '0 0 16px rgba(0, 229, 255, 0.15)'
                  : 'none',
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
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: apiMask ? '#00e5ff' : '#94a3b8' }}>
                  ChangeFormer Mask
                </div>
                {/* Real Mask Legend */}
                {apiMask && (
                  <div style={{ display: 'flex', gap: '8px', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#ffffff' }}>
                      <span style={{ width: '6px', height: '6px', background: '#ffffff', borderRadius: '1px' }} />
                      255 (Change)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b' }}>
                      <span style={{ width: '6px', height: '6px', background: '#000000', border: '1px solid #334155', borderRadius: '1px' }} />
                      0 (No Change)
                    </span>
                  </div>
                )}
              </div>

              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '220px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#020617',
                }}
              >
                {isLoadingApi ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '16px', textAlign: 'center' }}>
                    <Loader2 size={24} color="#00e5ff" style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: '11px', color: '#00e5ff', fontFamily: 'var(--font-mono)' }}>
                      {apiStatusText}
                    </span>
                  </div>
                ) : apiError ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 600 }}>
                      Inference Failed
                    </span>
                    <span style={{ fontSize: '10px', color: '#cbd5e1', lineHeight: 1.4 }}>
                      {apiError}
                    </span>
                  </div>
                ) : apiMask ? (
                  <>
                    <img src={apiMask} alt="Raw ChangeFormer Binary Change Mask" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => onOpenLightbox(apiMask, 'ChangeFormer Binary Change Mask')}
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
                  </>
                ) : (
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Waiting for inference...</span>
                )}
              </div>
            </div>
          </div>

          {/* Real Result Summary & Statistics Panel */}
          <div
            style={{
              padding: '20px 22px',
              borderRadius: '12px',
              background: 'rgba(4, 9, 21, 0.8)',
              border: apiError ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(0, 229, 255, 0.3)',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
              {/* Left Result Description */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={16} color={apiError ? '#f87171' : 'var(--accent-cyan)'} />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: apiError ? '#f87171' : 'var(--accent-cyan)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {apiError ? 'ERROR' : isLoadingApi ? 'INFERRING...' : 'CHANGEFORMER METRIC'}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.025rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '8px',
                    lineHeight: 1.4,
                  }}
                >
                  {isLoadingApi
                    ? 'Running ChangeFormer V6 Tiled Inference...'
                    : apiError
                    ? 'ChangeFormer API Error'
                    : apiStats
                    ? apiStats.changed_pixels === 0
                      ? 'No change detected by ChangeFormer at the current inference threshold.'
                      : `ChangeFormer detected ${apiStats.change_percentage}% surface change (${apiStats.changed_pixels.toLocaleString()} changed pixels)`
                    : 'Awaiting ChangeFormer inference result.'}
                </h3>

                <p
                  style={{
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                  }}
                >
                  {isLoadingApi
                    ? 'Extracting spatial tiles and executing ChangeFormer V6 transformer inference at native scale...'
                    : apiError
                    ? `Backend response error: ${apiError}. Please confirm the FastAPI server is active.`
                    : apiStats
                    ? apiStats.changed_pixels === 0
                      ? 'The ChangeFormer model analyzed the bi-temporal satellite image pair and detected zero changed pixels at the current threshold. The raw model mask and exact statistics are displayed above.'
                      : `ChangeFormer V6 evaluated the bi-temporal image pair (Input: ${apiStats.input_width}×${apiStats.input_height} px, Mask: ${apiStats.mask_width || apiStats.input_width}×${apiStats.mask_height || apiStats.input_height} px). Exactly ${apiStats.changed_pixels.toLocaleString()} out of ${apiStats.total_pixels.toLocaleString()} pixels were identified as change.`
                    : 'Upload two temporal satellite images to run real ChangeFormer change detection.'}
                </p>

                {/* Explicit Ground Sampling Distance notice */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '11px', color: '#94a3b8' }}>
                  <Info size={12} color="#38bdf8" />
                  <span>Area in km² unavailable — geographic resolution metadata was not provided.</span>
                </div>
              </div>

              {/* Right Statistics Box */}
              {apiStats && (
                <div style={{ minWidth: '220px', background: 'rgba(0, 229, 255, 0.03)', border: '1px solid rgba(0, 229, 255, 0.15)', borderRadius: '10px', padding: '14px' }}>
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
                    <span>Surface Change</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{apiStats.change_percentage}%</span>
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
                        width: `${Math.min(100, Math.max(apiStats.changed_pixels > 0 ? 2 : 0, apiStats.change_percentage))}%`,
                        height: '100%',
                        background: 'linear-gradient(to right, #0284c7, #00e5ff)',
                        boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#94a3b8', marginTop: '6px' }}>
                    <span>Changed: {apiStats.changed_pixels.toLocaleString()}</span>
                    <span>Total: {apiStats.total_pixels.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Diagnostic Telemetry & Threshold Controller */}
            {apiStats && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  flexWrap: 'wrap',
                }}
              >
                {/* Telemetry Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#94a3b8', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Input: <strong style={{ color: '#fff' }}>{apiStats.input_width}×{apiStats.input_height} px</strong>
                  </span>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#94a3b8', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Mask: <strong style={{ color: '#fff' }}>{apiStats.mask_width || apiStats.input_width}×{apiStats.mask_height || apiStats.input_height} px</strong>
                  </span>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#94a3b8', padding: '3px 8px', borderRadius: '4px', background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.2)' }}>
                    Tiles: <strong style={{ color: '#00e5ff' }}>{apiStats.tile_count ?? 1} ({apiStats.tile_size ?? 256}×{apiStats.tile_size ?? 256} px)</strong>
                  </span>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#94a3b8', padding: '3px 8px', borderRadius: '4px', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
                    Threshold: <strong style={{ color: '#a78bfa' }}>{(apiStats.threshold ?? threshold).toFixed(2)}</strong>
                  </span>
                </div>

                {/* Threshold Quick Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                    Threshold:
                  </span>
                  {[0.35, 0.40, 0.50, 0.60].map((tVal) => (
                    <button
                      key={tVal}
                      disabled={isLoadingApi}
                      onClick={() => {
                        setThreshold(tVal);
                        executeInference(tVal);
                      }}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        background: Math.abs(threshold - tVal) < 0.01 ? 'rgba(0, 229, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: Math.abs(threshold - tVal) < 0.01 ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: Math.abs(threshold - tVal) < 0.01 ? '#00e5ff' : '#cbd5e1',
                        cursor: isLoadingApi ? 'not-allowed' : 'pointer',
                        fontWeight: Math.abs(threshold - tVal) < 0.01 ? 700 : 400,
                      }}
                    >
                      {tVal.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat History & Follow-Up Contextual Box */}
        {chatMessages.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: msg.sender === 'user' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(6, 13, 27, 0.8)',
                  border: msg.sender === 'user' ? '1px solid rgba(37, 99, 235, 0.35)' : '1px solid rgba(0, 229, 255, 0.25)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                }}
              >
                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: msg.sender === 'user' ? '#93c5fd' : '#00e5ff', marginBottom: '4px' }}>
                  {msg.sender === 'user' ? 'YOU' : 'CHANGEFORMER ASSISTANT'}
                </div>
                {msg.text}
              </div>
            ))}
          </div>
        )}

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
              onClick={() => onRunFollowUp('Run another comparison', 'change')}
              title="Upload new image pair"
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
              placeholder="Ask about ChangeFormer metrics, changed pixels, or change mask..."
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
                  setChatInput(pill);
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
              title="Reset input"
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
              onClick={() => onGenerateReport(apiStats || undefined, img1, img2, apiMask || undefined)}
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
              onClick={() => {
                if (apiMask) {
                  const link = document.createElement('a');
                  link.href = apiMask;
                  link.download = `ChangeFormer_mask_${Date.now()}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  onOpenLightbox(changeMapImg, 'Download Change Results');
                }
              }}
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
              <span>Download Change Mask</span>
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
                onClick={() => {
                  if (item === 'Generate a ChangeFormer analysis report') {
                    onGenerateReport();
                  } else if (item === 'Download the change mask') {
                    if (apiMask) {
                      const link = document.createElement('a');
                      link.href = apiMask;
                      link.download = `ChangeFormer_mask_${Date.now()}.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  } else if (item.includes('comparison')) {
                    onRunFollowUp('Run another comparison', 'change');
                  } else {
                    setChatInput(item);
                  }
                }}
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
