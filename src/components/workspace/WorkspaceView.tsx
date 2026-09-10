import React, { useState, useRef } from 'react';
import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { WorkspaceBackground } from './WorkspaceBackground';
import { WorkspaceInitial } from './WorkspaceInitial';
import { WorkspaceSingleImageResult } from './WorkspaceSingleImageResult';
import { WorkspaceTwoImageResult } from './WorkspaceTwoImageResult';
import { WorkspaceSarFusionResult } from './WorkspaceSarFusionResult';
import { WorkspaceLoadingState } from './WorkspaceLoadingState';
import { WorkspaceLightbox } from './WorkspaceLightbox';
import { WorkspaceReportModal } from './WorkspaceReportModal';
import { WorkspaceAuthGate } from './WorkspaceAuthGate';

import type { UserSession } from '../AuthModal';

interface WorkspaceViewProps {
  onBackToLanding: () => void;
  currentUser: UserSession | null;
  onLogout: () => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  onBackToLanding,
  currentUser: initialUser,
  onLogout,
}) => {
  const [activeNav, setActiveNav] = useState('new-chat');
  const [stage, setStage] = useState<'initial' | 'loading' | 'single-result' | 'two-result' | 'sar-fusion-result'>('initial');
  const [pendingType, setPendingType] = useState<'single' | 'change' | 'sar-fusion' | 'florence-2'>('single');
  const [currentQuery, setCurrentQuery] = useState('Describe this satellite image.');
  const [currentImages, setCurrentImages] = useState<string[]>(['/assets/workspace_river_scene.svg']);

  // ── Auth state (can be updated in-workspace) ──────────────────
  const [currentUser, setCurrentUser] = useState<UserSession | null>(initialUser);

  // ── Auth Gate (ChatGPT-style) ─────────────────────────────────
  // pendingExec stores the query that was attempted before auth
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const pendingExecRef = useRef<{
    query: string;
    images: string[];
    type: 'single' | 'change' | 'sar-fusion' | 'florence-2' | 'custom';
  } | null>(null);

  // Modals state
  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; img: string; title: string }>({
    isOpen: false,
    img: '',
    title: '',
  });
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportStats, setReportStats] = useState<any>(null);
  const [reportBeforeImg, setReportBeforeImg] = useState<string | undefined>(undefined);
  const [reportAfterImg, setReportAfterImg] = useState<string | undefined>(undefined);
  const [reportMaskImg, setReportMaskImg] = useState<string | undefined>(undefined);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleOpenReport = (stats?: any, before?: string, after?: string, mask?: string) => {
    setReportStats(stats || null);
    setReportBeforeImg(before || currentImages[0]);
    setReportAfterImg(after || currentImages[1]);
    setReportMaskImg(mask);
    setIsReportOpen(true);
  };

  // ── Execute query (gate for unauthenticated users) ────────────
  const handleExecuteQuery = (query: string, images: string[], type: 'single' | 'change' | 'sar-fusion' | 'florence-2' | 'custom') => {
    if (!currentUser) {
      pendingExecRef.current = { query, images, type };
      setAuthGateOpen(true);
      return;
    }
    _runQuery(query, images, type);
  };

  const _runQuery = (query: string, images: string[], type: 'single' | 'change' | 'sar-fusion' | 'florence-2' | 'custom') => {
    setCurrentQuery(query);
    setCurrentImages(images);

    const qLower = query.toLowerCase();
    if (type === 'sar-fusion' || qLower.includes('sar') || qLower.includes('fusion')) {
      setPendingType('sar-fusion');
    } else if (type === 'florence-2' || type === 'single') {
      // Florence-2 handles all single-image queries (Case A + Case B)
      setPendingType('florence-2');
    } else if (type === 'change' || images.length >= 2) {
      setPendingType('change');
    } else {
      // Default single image → Florence-2
      setPendingType('florence-2');
    }
    setStage('loading');
  };

  // ── Auth gate success ─────────────────────────────────────────
  const handleAuthSuccess = (user: UserSession) => {
    setCurrentUser(user);
    setAuthGateOpen(false);

    if (pendingExecRef.current) {
      const { query, images, type } = pendingExecRef.current;
      pendingExecRef.current = null;
      setTimeout(() => _runQuery(query, images, type), 80);
    }
  };

  const handleAuthGateDismiss = () => {
    pendingExecRef.current = null;
    setAuthGateOpen(false);
  };

  const handleLoadingComplete = () => {
    if (pendingType === 'sar-fusion') {
      setStage('sar-fusion-result');
    } else if (pendingType === 'change') {
      setStage('two-result');
    } else {
      // florence-2 or single → single-result (WorkspaceSingleImageResult)
      setStage('single-result');
    }
  };

  const handleNewChat = () => {
    setActiveNav('new-chat');
    setStage('initial');
    setCurrentQuery('');
    setCurrentImages([]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    onLogout();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2400);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#030712',
        color: '#ffffff',
        overflowX: 'hidden',
      }}
    >
      {/* 1. Cinematic Aerospace Space & Single Earth Background */}
      <WorkspaceBackground />

      {/* 2. Fixed Top Header */}
      <WorkspaceHeader
        onBackToLanding={onBackToLanding}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 3. Left Navigation Sidebar */}
      <WorkspaceSidebar
        activeNav={activeNav}
        onSelectNav={(nav) => {
          setActiveNav(nav);
          if (nav === 'new-chat') handleNewChat();
        }}
        onNewChat={handleNewChat}
      />

      {/* 4. Central Main Workspace Area */}
      <main
        style={{
          marginLeft: '210px',
          paddingTop: '76px',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
        }}
        className="workspace-main-area"
      >
        {stage === 'initial' && (
          <WorkspaceInitial onExecuteQuery={handleExecuteQuery} />
        )}

        {stage === 'loading' && (
          <WorkspaceLoadingState onComplete={handleLoadingComplete} />
        )}

        {stage === 'single-result' && (
          <WorkspaceSingleImageResult
            userQuery={currentQuery}
            userImage={currentImages[0] || '/assets/workspace_river_scene.svg'}
            currentUser={currentUser}
            queryType={pendingType === 'florence-2' ? 'florence-2' : 'single'}
            onRunFollowUp={(query, type) => handleExecuteQuery(query, currentImages, type)}
            onOpenLightbox={(img, title) => setLightboxState({ isOpen: true, img, title })}
            onGenerateReport={() => setIsReportOpen(true)}
            onShare={handleShare}
          />
        )}

        {stage === 'two-result' && (
          <WorkspaceTwoImageResult
            userQuery={currentQuery}
            images={currentImages}
            currentUser={currentUser}
            onRunFollowUp={(query, type) => handleExecuteQuery(query, currentImages, type)}
            onOpenLightbox={(img, title) => setLightboxState({ isOpen: true, img, title })}
            onGenerateReport={handleOpenReport}
            onShare={handleShare}
          />
        )}

        {stage === 'sar-fusion-result' && (
          <WorkspaceSarFusionResult
            userQuery={currentQuery}
            images={currentImages}
            currentUser={currentUser}
            onRunFollowUp={(query, type) => handleExecuteQuery(query, currentImages, type)}
            onOpenLightbox={(img, title) => setLightboxState({ isOpen: true, img, title })}
            onGenerateReport={() => handleOpenReport(undefined, currentImages[0], currentImages[1])}
            onShare={handleShare}
          />
        )}
      </main>

      {/* Lightbox Fullscreen Modal */}
      <WorkspaceLightbox
        isOpen={lightboxState.isOpen}
        onClose={() => setLightboxState({ isOpen: false, img: '', title: '' })}
        imageUrl={lightboxState.img}
        title={lightboxState.title}
      />

      {/* Executive Report Modal */}
      <WorkspaceReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        analysisType={stage === 'two-result' ? 'change' : 'single'}
        stats={reportStats}
        beforeImg={reportBeforeImg}
        afterImg={reportAfterImg}
        maskImg={reportMaskImg}
      />

      {/* ── ChatGPT-Style Auth Gate ── renders ON TOP of workspace ─ */}
      <WorkspaceAuthGate
        isOpen={authGateOpen}
        onClose={handleAuthGateDismiss}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Share Toast Notification */}
      {showShareToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 600,
            background: 'rgba(8, 16, 32, 0.95)',
            border: '1px solid #00e5ff',
            boxShadow: '0 8px 30px rgba(0, 229, 255, 0.3)',
            borderRadius: '8px',
            padding: '12px 20px',
            color: '#00e5ff',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>✓ Analysis link copied to clipboard</span>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .workspace-main-area {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
