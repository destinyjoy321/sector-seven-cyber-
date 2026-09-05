import React from 'react';
import { Check, Shield, ArrowUpRight, Sparkles } from 'lucide-react';

interface PricingProps {
  onNavigate: (path: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const tiers = [
    {
      name: 'Essential Carrier Audit',
      badge: 'Single Assessment',
      price: '$1,490',
      period: 'one-time',
      desc: 'Ideal for small law firms or clinics needing rapid underwriter audit of an existing questionnaire.',
      features: [
        'Line-by-line Questionnaire Audit',
        'Carrier Underwriter Risk Gap Analysis',
        'Remediation Action Plan Document',
        '24-Hour SLA Audit Turnaround',
        'Direct Broker Coordination',
      ],
      popular: false,
    },
    {
      name: 'Insurance Readiness Suite',
      badge: 'Most Popular For Law Firms',
      price: '$3,850',
      period: 'one-time remediation',
      desc: 'Complete turn-key remediation of MFA, EDR, and Backup gaps required for high-limit policy approvals.',
      features: [
        'Everything in Essential Audit',
        'Full MFA & Hardware Key Deployment',
        'Immutable Backup Architecture Setup',
        'EDR Endpoint Agent Installation',
        'Underwriter Sign-off Guarantee',
        'Staff Security Awareness Training Logs',
      ],
      popular: true,
    },
    {
      name: 'Enterprise Cyber Shield',
      badge: 'Continuous Protection',
      price: '$6,500',
      period: '/ month',
      desc: 'Full-service managed cybersecurity & continuous carrier compliance monitoring for Georgia enterprises.',
      features: [
        'Everything in Readiness Suite',
        '24/7 Managed SOC Telemetry & Hunting',
        'Continuous Insurance Policy Compliance',
        '$1M Ransomware Financial Guarantee',
        'Annual Breach Simulation & Penetration Testing',
        'Dedicated Georgia Security Architect',
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-cyber-teal/10 text-cyber-teal border border-cyber-teal/20 px-3.5 py-1 rounded-full text-xs font-mono">
            <span>QUALIFYING PROSPECTS & PRICING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Service Pricing <br />
            <span className="text-cyber-teal">Built For Georgia Practice Leaders</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            No hidden fees or unexpected IT retainers. Clear pricing designed to deliver immediate insurance qualification.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((t, idx) => (
            <div 
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between text-left transition-all duration-300 relative ${
                t.popular 
                  ? 'bg-slate-900 text-white shadow-2xl border-2 border-cyber-teal scale-[1.02] tech-bracket' 
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-lg'
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyber-teal text-slate-950 text-[10px] font-extrabold font-mono uppercase px-4 py-1 rounded-full shadow-glow flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{t.badge}</span>
                </div>
              )}

              <div className="space-y-6">
                {!t.popular && (
                  <span className="inline-block text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    {t.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold">{t.name}</h3>
                  <p className={`text-xs mt-2 ${t.popular ? 'text-slate-300' : 'text-slate-600'}`}>{t.desc}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold font-mono tracking-tight">{t.price}</span>
                  <span className={`text-xs font-mono ${t.popular ? 'text-slate-400' : 'text-slate-500'}`}>{t.period}</span>
                </div>

                {/* Feature List */}
                <ul className="space-y-3 pt-4 border-t border-slate-200/40">
                  {t.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-xs">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${t.popular ? 'text-cyber-teal' : 'text-cyber-teal'}`} />
                      <span className={t.popular ? 'text-slate-200' : 'text-slate-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => onNavigate('/apply')}
                  className={`w-full font-bold text-xs py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all ${
                    t.popular 
                      ? 'bg-cyber-teal hover:bg-teal-500 text-slate-950 shadow-glow font-extrabold' 
                      : 'bg-slate-900 hover:bg-cyber-teal text-white shadow-md'
                  }`}
                >
                  <span>Select {t.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-cyber-amber" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
