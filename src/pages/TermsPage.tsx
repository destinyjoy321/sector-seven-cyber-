import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-32 pb-24 bg-[#050505] text-white min-h-screen relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#00D2FF]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-[#00D2FF] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0D111A]/90 rounded-3xl p-8 sm:p-12 shadow-vault-card border border-[#5A6B7C]/30 space-y-8 backdrop-blur-xl"
        >
          
          <div className="border-b border-[#5A6B7C]/30 pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#00D2FF] font-extrabold uppercase tracking-widest">// LEGAL DOCUMENTATION</span>
              <span className="text-xs font-mono text-slate-400">Section 42.2 Compliant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs font-mono text-slate-400">
              SECTOR SEVEN CYBER LLC • Last Updated: September 1, 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-6">
            
            <p className="font-medium text-white bg-[#050505] p-4 rounded-2xl border border-[#5A6B7C]/30">
              Welcome to Sector Seven Cyber LLC (“Company,” “we,” “us,” or “our”). By accessing or using our website, filling out our onboarding forms, or utilizing any intake platform we provide, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site or forms.
            </p>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#050505] border border-[#00D2FF]/50 text-[#00D2FF] text-xs flex items-center justify-center font-mono">1</span>
                USE OF THE SITE AND COMPLIANCE
              </h3>
              <p>
                You agree to use our website and intake questionnaires strictly for lawful business purposes. You are entirely prohibited from attempting to breach, scan, or exploit the security architecture of this website or utilizing our company infrastructure to conduct any unauthorized technical activities.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#050505] border border-[#00D2FF]/50 text-[#00D2FF] text-xs flex items-center justify-center font-mono">2</span>
                INDEMNIFICATION (YOUR LIABILITY)
              </h3>
              <p>
                You agree to indemnify, defend, and hold harmless Sector Seven Cyber LLC, its officers, directors, employees, and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including but not limited to attorney's fees) arising from: (i) Your use of and access to this website or digital intake forms; (ii) Your violation of any term of these Terms; or (iii) Your violation of any third-party intellectual property or privacy right using our network.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#050505] border border-[#00D2FF]/50 text-[#00D2FF] text-xs flex items-center justify-center font-mono">3</span>
                GOVERNING LAW AND VENUE
              </h3>
              <p>
                These Terms of Service, and any dispute arising from your use of this website, shall be governed by, and construed in accordance with, the laws of the State of Georgia, without regard to its conflict of laws principles. Any legal action or proceeding relating to this website shall be brought exclusively in the state or federal courts located in Fulton County, Georgia.
              </p>
            </div>

          </div>

          <div className="pt-6 border-t border-[#5A6B7C]/30 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Georgia Jurisdiction (Fulton County)</span>
            <button 
              onClick={() => onNavigate('/privacy')} 
              className="text-[#00D2FF] font-semibold hover:underline"
            >
              View Privacy Policy →
            </button>
          </div>

        </motion.div>

      </div>
    </div>
  );
};
