import React, { useState, useEffect } from 'react';
import { EarthBackground } from './components/EarthBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CapabilityBar } from './components/CapabilityBar';
import { AboutSection } from './components/AboutSection';
import { UseCases } from './components/UseCases';
import { HowItWorks } from './components/HowItWorks';
import { SpecialistModels } from './components/SpecialistModels';
import { ExampleAnalysis } from './components/ExampleAnalysis';
import { SupportedInputs } from './components/SupportedInputs';
import { FAQSection } from './components/FAQSection';
import { SupportSection } from './components/SupportSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { ContactModal } from './components/ContactModal';
import { AuthModal, type UserSession } from './components/AuthModal';
import { WorkspaceView } from './components/workspace/WorkspaceView';

export const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
  const [scrollY, setScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Frontend-only user session state
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem('satquery_active_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Auth modal state
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'signup',
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Primary CTA Trigger — always open workspace (auth gate is handled inside workspace)
  const handleTrySatQuery = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setView('workspace');
  };

  // Login button trigger
  const handleOpenLogin = () => {
    if (currentUser) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setView('workspace');
    } else {
      setAuthModal({ isOpen: true, mode: 'login' });
    }
  };

  // Auth success callback
  const handleAuthSuccess = (user: UserSession) => {
    setCurrentUser(user);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setView('workspace');
  };

  // Logout callback
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('satquery_active_user');
    } catch {
      // ignore
    }
    setView('landing');
  };

  const handleBackToLanding = () => {
    setView('landing');
  };

  // If in workspace view, render workspace with user session
  if (view === 'workspace') {
    return (
      <WorkspaceView
        onBackToLanding={handleBackToLanding}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // Approved Landing Page (Completely Untouched)
  return (
    <div className="satquery-app" style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* 1. Continuous Earth & Space Parallax Background */}
      <EarthBackground scrollY={scrollY} />

      {/* 2. Fixed Top Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTry={handleTrySatQuery}
        onOpenLogin={handleOpenLogin}
      />

      {/* 3. Hero Section */}
      <Hero
        onOpenTry={handleTrySatQuery}
        onScrollToUseCases={() => scrollToSection('use-cases')}
      />

      {/* 4. Core Capabilities Bar across Earth */}
      <CapabilityBar onSelectCapability={() => scrollToSection('models')} />

      {/* 5. About SatQuery AI */}
      <AboutSection onLearnMore={() => scrollToSection('how-it-works')} />

      {/* 6. Use Cases */}
      <UseCases onSelectCase={handleTrySatQuery} />

      {/* 7. How It Works */}
      <HowItWorks />

      {/* 8. Specialized AI Models */}
      <SpecialistModels />

      {/* 9. Example Analysis (Bitemporal Change & Agent Execution Trace) */}
      <ExampleAnalysis />

      {/* 10. Supported Inputs */}
      <SupportedInputs onViewDocs={() => scrollToSection('faq')} />

      {/* 11. FAQ Accordion */}
      <FAQSection />

      {/* 12. Support & Help */}
      <SupportSection
        onContactSupport={() => setIsContactOpen(true)}
        onViewDocs={() => scrollToSection('faq')}
      />

      {/* 13. Final CTA over Lower Earth Horizon */}
      <FinalCTA
        onOpenTry={handleTrySatQuery}
        onContactUs={() => setIsContactOpen(true)}
      />

      {/* 14. Footer */}
      <Footer onContactClick={() => setIsContactOpen(true)} />

      {/* Interactive Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(id) => scrollToSection(id)}
      />
      <ContactModal
        isOpen={isContactOpen}
        mode="contact"
        onClose={() => setIsContactOpen(false)}
      />
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'signup' })}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default App;
