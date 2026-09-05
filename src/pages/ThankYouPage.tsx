import React from 'react';
import { CheckCircle2, ShieldCheck, FileText, ArrowRight, Lock, Clock, Mail } from 'lucide-react';

interface ThankYouPageProps {
  onNavigate: (path: string) => void;
  applicationId?: string;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ onNavigate, applicationId = 'SS-2026-0084' }) => {
  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Main Success Container */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 space-y-6 tech-bracket">
          
          {/* Animated Success Badge */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-extrabold text-cyber-teal uppercase tracking-widest">// Submission Verified</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Assessment Request Received
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Thank you for contacting Sector Seven Cyber LLC. We have securely received your practice details and uploaded cyber-insurance questionnaire.
            </p>
          </div>

          {/* Application Reference ID HUD Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-2">
              <span className="text-slate-400">APPLICATION REFERENCE ID</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">NEW</span>
            </div>
            
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">{applicationId}</span>
              <span className="text-xs text-slate-400 font-mono">{new Date().toLocaleDateString()}</span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyber-teal" />
                <span>Private Bucket Stored</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyber-teal" />
                <span>Confirmation Sent</span>
              </div>
            </div>
          </div>

          {/* Next Steps Timeline */}
          <div className="text-left space-y-3 pt-2">
            <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">What Happens Next:</h4>
            
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Clock className="w-4 h-4 text-cyber-teal shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">1. Georgia Security Architect Review</span>
                  <p className="text-[11px] text-slate-500">Our technical team will audit your uploaded questionnaire against your carrier's specific underwriter requirements.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-cyber-teal shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">2. Consultation & Remediation Blueprint</span>
                  <p className="text-[11px] text-slate-500">A Senior Architect will reach out via email/phone within 24 hours with your custom gap assessment and fix options.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={() => onNavigate('/')}
              className="w-full bg-slate-900 hover:bg-brand-blue text-white font-extrabold text-xs py-4 px-8 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-300 magnetic-btn"
            >
              <span>RETURN TO SECTOR SEVEN CYBER HOMEPAGE</span>
              <ArrowRight className="w-4 h-4 text-brand-amber" />
            </button>
          </div>


        </div>

      </div>
    </div>
  );
};
