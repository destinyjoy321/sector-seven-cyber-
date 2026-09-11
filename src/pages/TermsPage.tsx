import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50/70 text-slate-700 min-h-screen py-24 sm:py-32 font-sans selection:bg-[#0284C7] selection:text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-[#0284C7] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#0284C7]" />
          <span>Back to Home</span>
        </button>

        {/* Premium Legal Document Container */}
        <div className="bg-white rounded-2xl p-8 sm:p-14 border border-slate-200/90 shadow-sm space-y-10">
          
          {/* Header Section */}
          <div className="border-b border-slate-200/80 pb-8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#0284C7] font-bold uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                // LEGAL DOCUMENTATION
              </span>
              <span className="text-xs font-mono text-slate-400">Section 42.2 Compliant</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight pt-2">
              Terms of Service
            </h1>
            
            <div className="text-sm uppercase tracking-widest text-slate-500 mb-12 font-mono font-medium pt-1">
              SECTOR SEVEN CYBER LLC • Last Updated: September 1, 2026
            </div>
          </div>

          {/* Legal Body Content */}
          <div className="space-y-8 text-slate-700 text-base leading-relaxed">
            
            <p className="font-medium text-slate-800 bg-slate-50 p-6 rounded-xl border border-slate-200/80 leading-relaxed">
              Welcome to Sector Seven Cyber LLC (“Company,” “we,” “us,” or “our”). By accessing or using our website, filling out our onboarding forms, or utilizing any intake platform we provide, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site or forms.
            </p>

            <div className="space-y-3 pt-2">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7] text-xs flex items-center justify-center font-mono font-bold shrink-0">1</span>
                <span>USE OF THE SITE AND COMPLIANCE</span>
              </h2>
              <p className="leading-relaxed text-slate-700">
                You agree to use our website and intake questionnaires strictly for lawful business purposes. You are entirely prohibited from attempting to breach, scan, or exploit the security architecture of this website or utilizing our company infrastructure to conduct any unauthorized technical activities.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7] text-xs flex items-center justify-center font-mono font-bold shrink-0">2</span>
                <span>INDEMNIFICATION (YOUR LIABILITY)</span>
              </h2>
              <p className="leading-relaxed text-slate-700">
                You agree to indemnify, defend, and hold harmless Sector Seven Cyber LLC, its officers, directors, employees, and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including but not limited to attorney's fees) arising from: (i) Your use of and access to this website or digital intake forms; (ii) Your violation of any term of these Terms; or (iii) Your violation of any third-party intellectual property or privacy right using our network.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7] text-xs flex items-center justify-center font-mono font-bold shrink-0">3</span>
                <span>GOVERNING LAW AND VENUE</span>
              </h2>
              <p className="leading-relaxed text-slate-700">
                These Terms of Service, and any dispute arising from your use of this website, shall be governed by, and construed in accordance with, the laws of the State of Georgia, without regard to its conflict of laws principles. Any legal action or proceeding relating to this website shall be brought exclusively in the state or federal courts located in Fulton County, Georgia.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7] text-xs flex items-center justify-center font-mono font-bold shrink-0">4</span>
                <span>LIMITATION OF LIABILITY & B2B SERVICE DISCLAIMERS</span>
              </h2>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1 font-mono">4.1 Pre-Contractual Assessments and Estimations</h3>
                  <p>
                    Any regulatory compliance scoring, endpoint estimations, footprint calculations, or risk evaluations generated by our digital intake platforms are provided strictly for introductory, educational, and pre-screening assessment purposes. They do not constitute a formal cybersecurity guarantee, a technical audit, or an immediate binding contract for threat-hunting coverage. Formal monitoring, security operations center (SOC) routing, and active daemon protections are exclusively activated after an explicit Master Services Agreement (MSA) is formally signed and funded by both parties.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1 font-mono">4.2 Exclusion of Consequential Damages</h3>
                  <p>
                    To the maximum extent permitted by applicable law, Sector Seven Cyber LLC shall not be held liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our informational site or screening tools. This includes, without limitation, any loss of corporate profits, business interruption, loss of data, unencrypted system compromises, or downstream costs resulting from a third-party cyberattack or data breach occurring while using our intake framework.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1 font-mono">4.3 Aggregate Liability Cap</h3>
                  <p>
                    In no event shall the total aggregate liability of Sector Seven Cyber LLC for all claims, judgments, losses, or causes of action arising under these Terms of Service or through website tool interaction exceed one hundred U.S. dollars ($100.00).
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1 font-mono">4.4 B2B Authority Representation</h3>
                  <p>
                    By completing and submitting our intake or compliance forms, you explicitly represent and warrant that you are acting as an authorized corporate agent, managing partner, or officer of the legal entity named, and that you possess the full structural authority to bind the entity to these operational terms.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Document Footer Bar */}
          <div className="pt-8 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <span>Georgia Jurisdiction (Fulton County)</span>
            <button 
              onClick={() => onNavigate('/privacy')} 
              className="text-[#0284C7] font-bold hover:underline"
            >
              View Privacy Policy →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
