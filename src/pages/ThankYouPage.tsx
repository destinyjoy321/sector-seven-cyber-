import React, { useEffect } from 'react';
import { CheckCircle2, Lock, Calendar, Mail, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThankYouPageProps {
  onNavigate: (path: string) => void;
  applicationId?: string;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ onNavigate, applicationId = 'SS-2026-0084' }) => {
  const CALENDAR_LINK = "https://calendar.app.google/MWTKBzrinmAgwedF6";

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="pt-28 pb-24 bg-[#F8FAFC] text-slate-900 min-h-screen flex items-center justify-center relative overflow-hidden">
      
      {/* Background Ambient Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] bg-sky-100/50 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10 w-full">
        
        {/* Main Success Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-6 text-left"
        >
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono font-extrabold text-[#0284C7] uppercase tracking-widest">// Assessment Received & Vaulted</span>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
                Assessment Received.
              </h1>
            </div>
          </div>

          {/* Master Description Copy */}
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-3 font-normal">
            <p className="text-base sm:text-lg font-semibold text-slate-900">
              Assessment received. Sector Seven Cyber will review your submission and contact you regarding the next steps.
            </p>
            <p className="text-slate-600">
              Our engineering team is reviewing your organization's security environment details to prepare your initial review. You will receive a confirmation email shortly at the address provided.
            </p>
          </div>

          {/* Application Reference ID HUD Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
              <span className="text-slate-400">APPLICATION REFERENCE ID</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">CONFIRMED</span>
            </div>
            
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">{applicationId}</span>
              <span className="text-xs text-slate-400 font-mono">{new Date().toLocaleDateString()}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>AES-256 Vaulted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Environment Logged</span>
              </div>
            </div>
          </div>

          {/* OPTIONAL EMBEDDED CALENDAR */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-inner bg-slate-50 space-y-0">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between font-mono text-xs font-bold border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00D2FF]" />
                <span>OPTIONAL: INTRODUCTORY BRIEFING (15 MIN)</span>
              </div>
              <a
                href={CALENDAR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-sky-400 hover:text-white flex items-center gap-1 underline"
              >
                <span>Full Window</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="w-full h-[650px] sm:h-[700px] relative bg-white">
              <iframe
                src={CALENDAR_LINK}
                className="w-full h-full border-0 bg-white"
                title="Sector Seven Executive Briefing Calendar"
                loading="lazy"
              />
            </div>
          </div>

          {/* Return Home Link */}
          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs font-mono font-bold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
            >
              ← Return to Sector Seven Cyber Homepage
            </button>
          </div>

        </motion.div>

      </div>
    </div>
  );
};


