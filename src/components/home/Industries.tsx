import React from 'react';
import { Scale, Stethoscope, Building2, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface IndustriesProps {
  onNavigate: (path: string) => void;
}

export const Industries: React.FC<IndustriesProps> = ({ onNavigate }) => {
  const sectors = [
    {
      title: 'Georgia Law Firms & Legal Practices',
      badge: 'Fulton County & Statewide Focus',
      icon: Scale,
      features: [
        'Protection of Attorney-Client Privileged Data',
        'Wire Fraud & Escrow Account Breach Prevention',
        'Compliance with Georgia Bar Tech Guidelines',
        'Underwriter Sign-off for $5M+ Policy Limits',
      ],
      quote: '"Sector Seven resolved our Travelers questionnaire gap in 48 hours and lowered our annual premium quote by 30%."',
      author: 'Managing Partner, Atlanta Commercial Litigation Firm',
    },
    {
      title: 'Medical Clinics & Healthcare Groups',
      badge: 'HIPAA + Carrier Mandate Alignment',
      icon: Stethoscope,
      features: [
        'EHR/EMR System MFA & Endpoint Isolation',
        'HIPAA Security Risk Assessment (SRA) Sync',
        'Ransomware Immunity for Patient Records',
        'Fast-Track Approval from Chubb & Coalition',
      ],
      quote: '"Our medical clinic was facing non-renewal due to unencrypted legacy backups. S7 deployed immutable cloud storage overnight."',
      author: 'Chief Operating Officer, Surgical Specialty Clinic',
    },
    {
      title: 'Georgia B2B Professional Services',
      badge: 'CPA, Finance & Engineering',
      icon: Building2,
      features: [
        'FINRA / SEC Compliance Mapping',
        'Vendor Risk Assessment & SOC2 Readiness',
        'Continuous Cloud Log Telemetry',
        'Dedicated Georgia Incident Response SLA',
      ],
      quote: '"The peace of mind knowing our cyber insurance questionnaire is backed by live 24/7 EDR monitoring is priceless."',
      author: 'Director of Technology, Financial Services Group',
    },
  ];

  return (
    <section id="industries" className="py-24 bg-brand-bg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <span>WHO WE SERVE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored Cyber Solutions for Georgia's <br />
            <span className="text-brand-blue">High-Liability Organizations</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            We specialize exclusively in high-stakes practice environments where data loss or insurance rejection carries catastrophic legal and financial risk.
          </p>
        </div>

        {/* 3 Premium Industry Cards with Staggered Entrance & Pop Elevation (Point 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sectors.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-apple hover:shadow-apple-hover hover:border-brand-blue/50 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between text-left space-y-6 group"
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:bg-brand-blue transition-colors">
                      <Icon className="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                      {sec.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-blue transition-colors">{sec.title}</h3>

                  {/* Feature Bullet Points */}
                  <ul className="space-y-2.5 pt-2">
                    {sec.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quote Box */}
                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <p className="text-xs text-slate-700 italic font-serif leading-relaxed">
                    {sec.quote}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 font-semibold">
                    — {sec.author}
                  </p>

                  <button
                    onClick={() => onNavigate('/apply')}
                    className="w-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Apply For {sec.title.split(' ')[0]} Audit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
