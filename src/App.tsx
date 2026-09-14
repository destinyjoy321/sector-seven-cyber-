import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { Preloader } from './components/layout/Preloader';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

const ApplyPage = lazy(() => import('./pages/ApplyPage').then(m => ({ default: m.ApplyPage })));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage').then(m => ({ default: m.ThankYouPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname + window.location.search
  );

  // Sync client router with popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract base pathname and search query dynamically with case/slash normalization
  const [rawPathname, rawSearch] = currentPath.split('?');
  const pathWithoutHash = (rawPathname.split('#')[0] || '/').trim();
  const cleanPathname = pathWithoutHash === '/' ? '/' : pathWithoutHash.replace(/\/+$/, '').toLowerCase();
  const searchParams = new URLSearchParams(rawSearch !== undefined ? rawSearch : window.location.search);
  const appIdParam = searchParams.get('id') || undefined;

  const renderPage = () => {
    if (cleanPathname === '/apply') {
      return (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center text-slate-500 font-mono text-xs">Loading Secure Intake Portal...</div>}>
          <ApplyPage onNavigate={navigate} />
        </Suspense>
      );
    }
    if (cleanPathname === '/thank-you') {
      return (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center text-slate-500 font-mono text-xs">Loading Confirmation...</div>}>
          <ThankYouPage onNavigate={navigate} applicationId={appIdParam} />
        </Suspense>
      );
    }
    if (cleanPathname === '/terms') {
      return (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center text-slate-500 font-mono text-xs">Loading Terms...</div>}>
          <TermsPage onNavigate={navigate} />
        </Suspense>
      );
    }
    if (cleanPathname === '/privacy') {
      return (
        <Suspense fallback={<div className="min-h-screen pt-32 text-center text-slate-500 font-mono text-xs">Loading Privacy Policy...</div>}>
          <PrivacyPage onNavigate={navigate} />
        </Suspense>
      );
    }
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <SmoothScroll>
      <Preloader />
      <div className="relative min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0284C7] selection:text-white">
        
        {/* Global Fixed Film Grain Noise Overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Floating Navbar */}
        <Navbar currentPath={currentPath} onNavigate={navigate} />

        {/* Main Page Body protected by Error Boundary */}
        <ErrorBoundary>
          {renderPage()}
        </ErrorBoundary>

        {/* Universal Footer */}
        <Footer onNavigate={navigate} />

      </div>
    </SmoothScroll>
  );
}




