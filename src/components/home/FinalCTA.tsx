import React from 'react';
import { ArrowUpRight, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface FinalCTAProps {
  onNavigate: (path: string) => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 bg-brand-bg relative overflow-hidden border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Crisp Apple-Style White Container Card */}
        <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-200 shadow-2xl text-center space-y-8 tech-bracket relative">
          
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-4 py-1.5 rounded-full text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4 text-brand-blue" />
            <span>GUARANTEED CYBER INSURANCE READINESS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-3xl mx-auto">
            Protect Your Georgia Practice & <br />
            <span className="text-brand-blue">Secure Policy Approval Today</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Don't let missing MFA or backup controls risk your coverage. Submit your questionnaire for a confidential, 24-hour technical audit by Georgia's premier B2B cyber specialists.
          </p>

          {/* Action Button strictly directing to /apply */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/apply')}
              className="magnetic-btn bg-brand-blue hover:bg-blue-600 text-white font-extrabold text-sm sm:text-base px-9 py-4 rounded-full shadow-blue-glow flex items-center gap-2 transition-all duration-300"
            >
              <span>Upload Questionnaire & Apply</span>
              <ArrowUpRight className="w-5 h-5 text-brand-amber" />
            </button>

            <a
              href="tel:+14048923400"
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm px-7 py-4 rounded-full border border-slate-300 transition-colors"
            >
              Call Office: (404) 892-3400
            </a>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Lock className="w-3.5 h-3.5 text-brand-blue" /> Private Storage Bucket
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" /> Zod Validated Intake
            </span>
            <span>•</span>
            <span className="font-bold text-slate-700">Section 42 Audit Trail</span>
          </div>

        </div>

      </div>
    </section>
  );
};
