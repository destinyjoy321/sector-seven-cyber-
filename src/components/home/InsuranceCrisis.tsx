import React from 'react';
import { AlertTriangle, ShieldX, FileX, ArrowRight } from 'lucide-react';

interface InsuranceCrisisProps {
  onNavigate: (path: string) => void;
}

export const InsuranceCrisis: React.FC<InsuranceCrisisProps> = ({ onNavigate }) => {
  const problems = [
    {
      title: 'Drastic Questionnaire Shift',
      desc: 'Insurance carriers like Travelers, Chubb, and Coalition no longer accept simple self-attestation checkboxes. They require technical proof of EDR logs, SIEM telemetry, and MFA coverage across 100% of endpoints.',
      icon: FileX,
    },
    {
      title: 'Policy Non-Renewal Risk',
      desc: 'Georgia law firms and medical clinics face immediate non-renewal notices or 300%+ premium penalties if technical questionnaires contain unanswered security gaps.',
      icon: AlertTriangle,
    },
    {
      title: 'Strict Carrier Denial Clauses',
      desc: 'If a ransomware breach occurs and your actual technical controls do not match what was submitted on the intake form, insurance carriers can void coverage entirely.',
      icon: ShieldX,
    },
  ];

  return (
    <section id="problem" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>COMMUNICATING THE BUSINESS PROBLEM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Why Georgia Law Firms & Medical Practices <br />
            <span className="text-brand-blue-light">Get Stuck on Cyber Insurance</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Obtaining and renewing cyber insurance in 2026 requires strict technical compliance. Sector Seven Cyber bridges the gap between carrier requirements and your IT infrastructure.
          </p>
        </div>

        {/* 3-Column Problem Cards with Staggered Entrance & Elevation Hover (Point 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {problems.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx} 
                className="bg-slate-800/90 rounded-3xl p-8 border border-slate-700/80 hover:border-brand-blue hover:scale-[1.03] hover:-translate-y-2 transition-all duration-300 space-y-4 text-left group shadow-xl hover:shadow-blue-glow"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:text-brand-blue-light group-hover:border-brand-blue transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-blue-light transition-colors">{p.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{p.desc}</p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-amber-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Carrier Risk Factor #{idx + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sector Seven Solution Banner (Point 4: Clean typography, no /art, increased font size) */}
        <div className="mt-16 bg-gradient-to-r from-slate-800 via-slate-800/95 to-slate-900 rounded-3xl p-8 sm:p-10 border border-brand-blue/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-3 text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-brand-blue-light tracking-wide uppercase font-sans">
              SECTOR SEVEN SOLUTION
            </h2>
            <h3 className="text-xl font-bold text-white">Proven Technical Remediation & Carrier Underwriter Approval</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              We audit your questionnaire, implement missing technical controls (MFA, Immutable Backups, EDR), and issue a certified readiness report directly to your broker.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/apply')}
            className="magnetic-btn shrink-0 bg-brand-blue hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-full flex items-center gap-2 shadow-blue-glow transition-all"
          >
            <span>Submit Questionnaire For Audit</span>
            <ArrowRight className="w-4 h-4 text-brand-amber" />
          </button>
        </div>

      </div>
    </section>
  );
};
