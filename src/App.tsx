import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ApplyPage } from './pages/ApplyPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AdminDashboard } from './pages/AdminDashboard';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname + window.location.search
  );
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Sync client router with popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);

    // Touch device detection
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Custom Cursor Mouse Tracking
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (
        target && (
          target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.closest('button') || 
          target.closest('a') ||
          target.classList.contains('cursor-pointer')
        )
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTouchDevice]);

  // Extract base pathname and search query dynamically
  const [rawPathname, rawSearch] = currentPath.split('?');
  const cleanPathname = rawPathname === '/' ? '/' : rawPathname.replace(/\/+$/, '');
  const searchParams = new URLSearchParams(rawSearch !== undefined ? rawSearch : window.location.search);
  const appIdParam = searchParams.get('id') || undefined;

  const renderPage = () => {
    if (cleanPathname === '/apply') {
      return <ApplyPage onNavigate={navigate} />;
    }
    if (cleanPathname === '/thank-you') {
      return <ThankYouPage onNavigate={navigate} applicationId={appIdParam} />;
    }
    if (cleanPathname === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }
    if (cleanPathname === '/privacy') {
      return <PrivacyPage onNavigate={navigate} />;
    }
    if (cleanPathname === '/admin') {
      return <AdminDashboard onNavigate={navigate} />;
    }
    return <HomePage onNavigate={navigate} />;
  };


  return (
    <div className="relative min-h-screen bg-cyber-bg text-cyber-dark font-sans selection:bg-cyber-teal selection:text-white">
      
      {/* Global Noise Overlay Filter (Section II Global Visual Texture) */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Custom Cursor Ring & Dot (Disabled on Touch Devices) */}
      {!isTouchDevice && (
        <>
          <div
            className={`fixed rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out mix-blend-difference bg-white ${
              isHovered ? 'w-10 h-10 -ml-5 -mt-5 opacity-40 scale-125' : 'w-3 h-3 -ml-1.5 -mt-1.5 opacity-80'
            }`}
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
            }}
          />
          <div
            className={`fixed rounded-full border border-cyber-teal pointer-events-none z-[9998] transition-all duration-200 ease-out ${
              isHovered ? 'w-12 h-12 -ml-6 -mt-6 opacity-80 border-2' : 'w-8 h-8 -ml-4 -mt-4 opacity-30'
            }`}
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
            }}
          />
        </>
      )}

      {/* Floating Navbar */}
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      {/* Main Page Body */}
      {renderPage()}

      {/* Universal Footer */}
      <Footer onNavigate={navigate} />

    </div>
  );
}
