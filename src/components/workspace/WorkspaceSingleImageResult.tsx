import React, { useState, useEffect, useCallback } from 'react';
import {
  Maximize2,
  Share2,
  Send,
  RotateCw,
  Layers,
  Eye,
  TrendingUp,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  ImageIcon,
} from 'lucide-react';

import type { UserSession } from '../AuthModal';

const API_BASE = 'http://127.0.0.1:8001';

interface WorkspaceSingleImageResultProps {
  userQuery: string;
  userImage: string;
  currentUser: UserSession | null;
  queryType?: 'single' | 'florence-2';
  onRunFollowUp: (query: string, type: 'single' | 'change' | 'sar-fusion' | 'florence-2') => void;
  onOpenLightbox: (img: string, title: string) => void;
  onGenerateReport: () => void;
  onShare: () => void;
}

interface FlorenCaseAResult {
  case: 'A';
  question: string;
  answer: string;
}

interface FlorenceCaseBResult {
  case: 'B';
  prompt: string;
  target: string;
  mask: string | null;
  overlay: string | null;
  area_percentage: number;
  bbox?: { x: number; y: number; width: number; height: number } | null;
  message: string;
}

type FlorenceResult = FlorenCaseAResult | FlorenceCaseBResult | null;

// Detect whether a query is a Case B (spatial/highlight) request
const HIGHLIGHT_PATTERN = /^(?:highlight|show(?: me)?|locate|find|detect|mark|segment|identify)\s+/i;
function isCaseB(query: string): boolean {
  return HIGHLIGHT_PATTERN.test(query.trim());
}

// Lossless helper to convert image source (Blob URL, DataURL, Asset path) to a valid File with correct extension
async function urlToImageFile(imageUrl: string): Promise<File> {
  const resp = await fetch(imageUrl);
  const blob = await resp.blob();

  // Extract raw name if present
  let baseName = 'satellite_image';
  if (!imageUrl.startsWith('blob:') && !imageUrl.startsWith('data:')) {
    const rawName = imageUrl.split('/').pop()?.split('?')[0];
    if (rawName) baseName = rawName;
  }

  // Determine valid extension and mime type from Blob MIME
  const mime = (blob.type || '').toLowerCase();
  let ext = '.png';
  let mimeType = 'image/png';

  if (mime === 'image/jpeg' || mime === 'image/jpg') {
    ext = '.jpg';
    mimeType = 'image/jpeg';
  } else if (mime === 'image/png') {
    ext = '.png';
    mimeType = 'image/png';
  } else if (mime === 'image/tiff' || mime === 'image/tif') {
    ext = '.tif';
    mimeType = 'image/tiff';
  } else if (mime === 'image/webp') {
    ext = '.webp';
    mimeType = 'image/webp';
  } else if (mime === 'image/bmp') {
    ext = '.bmp';
    mimeType = 'image/bmp';
  }

  // If baseName already ends with a valid extension, preserve it
  if (/\.(png|jpe?g|tiff?|bmp|webp)$/i.test(baseName)) {
    return new File([blob], baseName, { type: mimeType });
  }

  // Otherwise append the determined extension
  const safeFilename = `${baseName}${ext}`;
  return new File([blob], safeFilename, { type: mimeType });
}

// Fetch helpers ─────────────────────────────────────────────────────────────

async function runCaseA(imageUrl: string, question: string): Promise<FlorenCaseAResult> {
  const file = await urlToImageFile(imageUrl);

  const form = new FormData();
  form.append('image', file, file.name);
  form.append('question', question);

  const resp = await fetch(`${API_BASE}/single-image/analyze`, { method: 'POST', body: form });
  if (!resp.ok) {
    let errMsg = `HTTP ${resp.status}`;
    try {
      const err = await resp.json();
      errMsg = err.detail || err.error || err.message || errMsg;
    } catch {
      errMsg = resp.statusText || errMsg;
    }
    throw new Error(errMsg);
  }

  const data = await resp.json();
  if (data && data.success === false) {
    throw new Error(data.error || data.detail || 'Analysis was unsuccessful.');
  }

  const answer = data?.answer ?? data?.message ?? (typeof data === 'string' ? data : 'Analysis complete.');
  return {
    case: 'A',
    question: data?.question || question,
    answer: String(answer),
  };
}

async function runCaseB(imageUrl: string, prompt: string): Promise<FlorenceCaseBResult> {
  const file = await urlToImageFile(imageUrl);

  const form = new FormData();
  form.append('image', file, file.name);
  form.append('prompt', prompt);

  const resp = await fetch(`${API_BASE}/single-image/segment`, { method: 'POST', body: form });
  if (!resp.ok) {
    let errMsg = `HTTP ${resp.status}`;
    try {
      const err = await resp.json();
      errMsg = err.detail || err.error || err.message || errMsg;
    } catch {
      errMsg = resp.statusText || errMsg;
    }
    throw new Error(errMsg);
  }

  const data = await resp.json();
  if (data && data.success === false && data.error) {
    throw new Error(data.error);
  }

  return {
    case: 'B',
    prompt: data?.prompt || prompt,
    target: data?.target || '',
    mask: data?.mask || null,
    overlay: data?.overlay || null,
    area_percentage: typeof data?.area_percentage === 'number' ? data.area_percentage : 0,
    bbox: data?.bbox || null,
    message: data?.message || 'Segmentation complete.',
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export const WorkspaceSingleImageResult: React.FC<WorkspaceSingleImageResultProps> = ({
  userQuery,
  userImage,
  currentUser,
  queryType,
  onRunFollowUp,
  onOpenLightbox,
  onShare,
}) => {
  const [result, setResult] = useState<FlorenceResult>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  const executeAnalysis = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    setResult(null);

    try {
      if (isCaseB(userQuery)) {
        const res = await runCaseB(userImage, userQuery);
        setResult(res);
      } else {
        const res = await runCaseA(userImage, userQuery);
        setResult(res);
      }
    } catch (err: any) {
      console.error('[Single Image Analysis Error]', err);
      setApiError(err?.message || 'Analysis failed. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, [userImage, userQuery]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setApiError(null);
    setResult(null);

    (async () => {
      try {
        if (isCaseB(userQuery)) {
          const res = await runCaseB(userImage, userQuery);
          if (isMounted) setResult(res);
        } else {
          const res = await runCaseA(userImage, userQuery);
          if (isMounted) setResult(res);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('[Single Image Analysis Error]', err);
          setApiError(err?.message || 'Analysis failed. Please ensure the backend server is running.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [userImage, userQuery]);

  const handleSendChat = () => {
    const q = chatInput.trim();
    if (!q) return;
    setChatInput('');
    onRunFollowUp(q, 'florence-2');
  };

  const isCaseBResult = result && result.case === 'B';
  const isCaseAResult = result && result.case === 'A';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 310px',
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
      {/* ── Main Analysis Column ───────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* User Query Bubble */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '14px',
            background: 'rgba(8, 16, 32, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
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
          <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
            <img src={userImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#f8fafc' }}>{userQuery}</div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '2px' }}>
              {isCaseB(userQuery) ? 'Feature Segmentation' : 'Visual Question & Answer'}
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div
          style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(6, 13, 27, 0.8)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${apiError ? 'rgba(239,68,68,0.4)' : 'rgba(0,229,255,0.25)'}`,
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isCaseB(userQuery)
                ? <Layers size={16} color="#00e5ff" />
                : <MessageSquare size={16} color="#00e5ff" />
              }
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                {isCaseB(userQuery) ? 'Spatial Segmentation Result' : 'Visual Analysis Answer'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
              {isLoading ? (
                <><Loader2 size={12} className="spin" color="#00e5ff" /><span style={{ color: '#00e5ff' }}>ANALYSING...</span></>
              ) : apiError ? (
                <><AlertCircle size={12} color="#f87171" /><span style={{ color: '#f87171' }}>ERROR</span></>
              ) : (
                <><CheckCircle2 size={12} color="#10b981" /><span style={{ color: '#10b981' }}>COMPLETE</span></>
              )}
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '40px 0', color: 'var(--text-secondary)' }}>
              <Loader2 size={32} color="#00e5ff" className="spin" />
              <span style={{ fontSize: '0.9rem' }}>
                {isCaseB(userQuery) ? 'Finding and highlighting requested region...' : 'Analysing satellite image...'}
              </span>
            </div>
          )}

          {/* Error state */}
          {!isLoading && apiError && (
            <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#f87171', marginBottom: '6px' }}>
                <AlertCircle size={15} />
                <span>Analysis Failed</span>
              </div>
              <div>{apiError}</div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8' }}>
                Ensure the backend server is running and the visual analysis service is ready.
              </div>
            </div>
          )}

          {/* Case A: Answer */}
          {!isLoading && isCaseAResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Original image */}
              <div style={{ borderRadius: '10px', overflow: 'hidden', background: '#040d1a', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', maxHeight: '340px' }}>
                <img src={userImage} alt="Uploaded satellite image" style={{ width: '100%', maxHeight: '340px', objectFit: 'contain' }} />
                <button
                  onClick={() => onOpenLightbox(userImage, 'Satellite Image')}
                  style={{ position: 'absolute', bottom: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '6px', background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Maximize2 size={13} />
                </button>
              </div>

              {/* Answer bubble */}
              <div style={{ padding: '18px 20px', borderRadius: '12px', background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.2)', lineHeight: 1.7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(0,229,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={13} color="#00e5ff" />
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#00e5ff', fontWeight: 600 }}>ANALYSIS RESULT</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#e2e8f0' }}>
                  {(result as FlorenCaseAResult).answer}
                </p>
              </div>
            </div>
          )}

          {/* Case B: Mask + Overlay */}
          {!isLoading && isCaseBResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Result message */}
              <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.2)', fontSize: '13px', color: '#7dd3fc', lineHeight: 1.6 }}>
                {(result as FlorenceCaseBResult).message}
                {(result as FlorenceCaseBResult).area_percentage > 0 && (
                  <span style={{ marginLeft: '8px', fontFamily: 'var(--font-mono)', color: '#00e5ff', fontWeight: 600 }}>
                    ({(result as FlorenceCaseBResult).area_percentage.toFixed(1)}% of image)
                  </span>
                )}
              </div>

              {/* Image grid */}
              <div style={{ display: 'grid', gridTemplateColumns: (result as FlorenceCaseBResult).overlay ? '1fr 1fr' : '1fr', gap: '12px' }} className="seg-result-grid">
                {/* Original */}
                <div style={{ borderRadius: '10px', overflow: 'hidden', background: '#040d1a', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                  <div style={{ padding: '7px 10px', background: 'rgba(0,0,0,0.5)', fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Eye size={11} /><span>ORIGINAL IMAGE</span>
                  </div>
                  <img src={userImage} alt="Original" style={{ width: '100%', objectFit: 'contain', maxHeight: '280px' }} />
                  <button onClick={() => onOpenLightbox(userImage, 'Original Image')} style={{ position: 'absolute', bottom: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '5px', background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Maximize2 size={12} />
                  </button>
                </div>

                {/* Overlay */}
                {(result as FlorenceCaseBResult).overlay && (
                  <div style={{ borderRadius: '10px', overflow: 'hidden', background: '#040d1a', border: '1px solid rgba(0,229,255,0.4)', boxShadow: '0 4px 20px rgba(0,229,255,0.15)', position: 'relative' }}>
                    <div style={{ padding: '7px 10px', background: 'rgba(0,229,255,0.08)', fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#00e5ff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Layers size={11} /><span>SEGMENTED REGION</span>
                    </div>
                    <img src={(result as FlorenceCaseBResult).overlay!} alt="Segmentation Overlay" style={{ width: '100%', objectFit: 'contain', maxHeight: '280px' }} />
                    <button onClick={() => onOpenLightbox((result as FlorenceCaseBResult).overlay!, `Segmentation: ${(result as FlorenceCaseBResult).target}`)} style={{ position: 'absolute', bottom: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '5px', background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(0,229,255,0.4)', color: '#00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Maximize2 size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* No detection notice */}
              {!(result as FlorenceCaseBResult).overlay && (
                <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.3)', color: '#fde047', fontSize: '12px', lineHeight: 1.5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 600, marginBottom: '4px' }}>
                    <AlertCircle size={14} />
                    <span>No Region Detected</span>
                  </div>
                  <div>The model did not find '{(result as FlorenceCaseBResult).target}' in the image. Try a different description or upload a different image.</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Follow-up Chat Input */}
        <div style={{ borderRadius: '14px', background: 'rgba(6,13,27,0.72)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,229,255,0.2)', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
              placeholder="Ask another question or highlight a feature..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem' }}
            />
            <button
              onClick={handleSendChat}
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #00e5ff, #0284c7)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
            >
              <Send size={14} />
            </button>
          </div>
          {/* Quick suggestion pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Is there a water body?', 'Highlight the water body.', 'Highlight the buildings.', 'Highlight the roads.'].map((pill, i) => (
              <button
                key={i}
                onClick={() => {
                  onRunFollowUp(pill, 'florence-2');
                }}
                style={{ padding: '4px 11px', borderRadius: '20px', background: 'rgba(8,16,32,0.6)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', fontSize: '11px', cursor: 'pointer' }}
              >
                {pill}
              </button>
            ))}
            <button
              onClick={() => setChatInput('')}
              style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <RotateCw size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Right Side Panel ───────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Image preview */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(6,13,27,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#00e5ff', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ImageIcon size={12} /><span>INPUT IMAGE</span>
          </div>
          <div style={{ borderRadius: '8px', overflow: 'hidden', background: '#020617', position: 'relative' }}>
            <img src={userImage} alt="Input" style={{ width: '100%', objectFit: 'contain', maxHeight: '180px' }} />
            <button onClick={() => onOpenLightbox(userImage, 'Input Image')} style={{ position: 'absolute', bottom: '6px', right: '6px', width: '26px', height: '26px', borderRadius: '4px', background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Maximize2 size={11} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(6,13,27,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', marginBottom: '12px' }}>Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => executeAnalysis()}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 12px', borderRadius: '8px', background: 'linear-gradient(135deg, rgba(0,229,255,0.12), rgba(2,132,199,0.2))', border: '1px solid rgba(0,229,255,0.4)', color: '#ffffff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <RotateCw size={14} color="#00e5ff" /><span>Re-run Visual Analysis</span>
            </button>
            <button
              onClick={onShare}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: '#e2e8f0', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              <Share2 size={14} color="var(--accent-cyan)" /><span>Share</span>
            </button>
          </div>
        </div>

        {/* Stats (Case B only) */}
        {!isLoading && isCaseBResult && (result as FlorenceCaseBResult).area_percentage > 0 && (
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(6,13,27,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#00e5ff', fontWeight: 600, marginBottom: '12px' }}>SEGMENTATION STATS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span>Target</span>
                <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{(result as FlorenceCaseBResult).target}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span>Area Coverage</span>
                <span style={{ color: '#00e5ff', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{(result as FlorenceCaseBResult).area_percentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .single-result-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 680px) {
          .seg-result-grid { grid-template-columns: 1fr !important; }
        }
        .spin { animation: orbitSpin 1.2s linear infinite; }
        @keyframes orbitSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
