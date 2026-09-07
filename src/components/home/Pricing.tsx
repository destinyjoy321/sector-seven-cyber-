import React from 'react';
import { Check, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
        'Underwriter Alignment Support',
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
    <section id="pricing" className="py-28 bg-[#F8FAFC] text-slate-900 border-b border-slate-200 relative">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-100/50 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <span>QUALIFYING PROSPECTS & PRICING</span>
          </div>
          <h2 className="text-[clamp(2.1rem,4.5vw,4rem)] font-extrabold text-slate-900 tracking-tighter leading-tight">
            Transparent Service Pricing <br />
            <span className="text-[#0284C7]">Built For Georgia Practice Leaders</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            No hidden fees or unexpected IT retainers. Clear pricing designed to deliver immediate insurance qualification.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch text-left">
          {tiers.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                t.popular 
                  ? 'bg-slate-900 text-white shadow-2xl border-2 border-[#0284C7] scale-[1.02]' 
                  : 'bg-white text-slate-900 border border-slate-200 shadow-soft-card hover:shadow-lg'
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0284C7] text-white text-[10px] font-extrabold font-mono uppercase px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>{t.badge}</span>
                </div>
              )}

              <div className="space-y-6">
                {!t.popular && (
                  <span className="inline-block text-[10px] font-mono font-bold bg-slate-100 text-[#0284C7] px-3 py-1 rounded-full">
                    {t.badge}
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-extrabold">{t.name}</h3>
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
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${t.popular ? 'text-[#0284C7]' : 'text-[#0284C7]'}`} />
                      <span className={t.popular ? 'text-slate-200' : 'text-slate-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => onNavigate('/apply')}
                  className={`btn-primary w-full font-mono font-extrabold text-xs tracking-wider py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-[1.03] ${
                    t.popular 
                      ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md' 
                      : 'bg-slate-900 hover:bg-[#0284C7] text-white shadow-sm'
                  }`}
                >
                  <span>BOOK A SECURITY FIT CALL →</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
