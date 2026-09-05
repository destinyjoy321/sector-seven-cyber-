import React from 'react';
import { Upload, Search, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (path: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  const steps = [
    {
      step: '01',
      title: 'Upload Carrier Questionnaire',
      desc: 'Submit your raw cyber insurance test sheet or renewal application (.pdf, .docx, .xlsx) via our private upload portal.',
      icon: Upload,
    },
    {
      step: '02',
      title: 'Gap Analysis & Underwriter Sync',
      desc: 'Our Georgia security architects analyze your infrastructure against carrier mandates (Travelers, Chubb, Coalition), identifying missing MFA or backup controls.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Turn-Key Technical Remediation',
      desc: 'We deploy required EDR agents, hardware MFA, and immutable air-gapped backups with zero disruption to your daily legal or clinical operations.',
      icon: Wrench,
    },
    {
      step: '04',
      title: 'Carrier Sign-Off & Certification',
      desc: 'We issue an underwriter-approved compliance certificate, ensuring immediate policy approval.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <span>TRANSPARENT WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How The Sector Seven System Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From initial document upload to guaranteed insurance underwriter sign-off in 4 clear steps.
          </p>
        </div>

        {/* 4 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-50 rounded-3xl p-7 border border-slate-200 hover:bg-white hover:border-brand-blue/40 hover:shadow-xl transition-all duration-300 space-y-4 text-left group tech-bracket"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-brand-blue">{s.step}</span>
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>

                <div className="pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald"></span>
                  <span>Timeline: &lt;24-48 Hours</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Telemetry Feed Banner */}
        <div className="mt-14 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-brand-emerald animate-ping"></span>
            <span className="text-slate-300">
              <span className="text-brand-blue-light font-bold">[LIVE FEED]</span> Current Georgia Intake Queue: 
              <span className="text-brand-emerald font-bold ml-2">Active Processing (3 Spots Remaining This Week)</span>
            </span>
          </div>

          <button
            onClick={() => onNavigate('/apply')}
            className="magnetic-btn bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-full flex items-center gap-1.5 shrink-0"
          >
            <span>Start Intake Process</span>
            <ArrowRight className="w-4 h-4 text-brand-amber" />
          </button>
        </div>

      </div>
    </section>
  );
};
