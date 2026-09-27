import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Sparkles, Building2, Laptop, Cloud } from 'lucide-react';
import { 
  getPricingConfig, 
  fetchRemotePricingConfig, 
  PRICING_CHANGED_EVENT, 
  PricingConfig,
  WHATS_INCLUDED_CAPABILITIES 
} from '../../lib/pricing';

interface PricingProps {
  onNavigate: (path: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const [config, setConfig] = useState<PricingConfig>(getPricingConfig());

  useEffect(() => {
    // Fetch live backend pricing
    fetchRemotePricingConfig().then(cfg => {
      if (cfg) setConfig(cfg);
    });

    // Listen for live updates triggered by admin edits
    const handlePricingChanged = (e: any) => {
      if (e?.detail) {
        setConfig(e.detail);
      } else {
        setConfig(getPricingConfig());
      }
    };

    window.addEventListener(PRICING_CHANGED_EVENT, handlePricingChanged);
    window.addEventListener('storage', handlePricingChanged);
    return () => {
      window.removeEventListener(PRICING_CHANGED_EVENT, handlePricingChanged);
      window.removeEventListener('storage', handlePricingChanged);
    };
  }, []);

  const t1 = config.tiers?.[0] || { min: 1, max: 10, monthlyPrice: 500, label: '1–10 Protected Environment' };
  const t2 = config.tiers?.[1] || { min: 11, max: 20, monthlyPrice: 750, label: '11–20 Protected Environment' };
  const t3 = config.tiers?.[2] || { min: 21, max: 30, monthlyPrice: 1000, label: '21–30 Protected Environment' };
  const customThreshold = config.customQuoteThreshold || 30;

  const tiers = [
    {
      name: '1–10 Protected Units',
      scaleLabel: '1–10 Computers or Cloud Accounts',
      tagline: 'Ideal for independent practices and boutique legal or medical offices.',
      price: `$${t1.monthlyPrice}`,
      period: '/ month',
      popular: false,
      isCustom: false,
      ctaText: 'Start Security Assessment',
    },
    {
      name: '11–20 Protected Units',
      scaleLabel: '11–20 Computers or Cloud Accounts',
      tagline: 'Standard protection for growing firms, clinics, and professional agencies.',
      price: `$${t2.monthlyPrice}`,
      period: '/ month',
      popular: true,
      badge: 'Standard Scale',
      isCustom: false,
      ctaText: 'Start Security Assessment',
    },
    {
      name: '21–30 Protected Units',
      scaleLabel: '21–30 Computers or Cloud Accounts',
      tagline: 'Comprehensive managed defense for established multi-partner organizations.',
      price: `$${t3.monthlyPrice}`,
      period: '/ month',
      popular: false,
      isCustom: false,
      ctaText: 'Start Security Assessment',
    },
    {
      name: 'Custom Cybersecurity Plan',
      scaleLabel: `${customThreshold}+ Protected Units`,
      tagline: 'Tailored architecture and managed active response for larger enterprise environments.',
      price: 'Custom',
      period: 'Quote',
      popular: false,
      isCustom: true,
      ctaText: 'Request Custom Quote',
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#F8FAFC] text-slate-900 border-b border-slate-200 relative overflow-hidden">
      
      {/* Background Subtle Gradient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-sky-100/50 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#0284C7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-20">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Transparent Predictable Pricing</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Plans and pricing
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Predictable monthly rates based on your protected environment scale. Complete your assessment to receive your automated quote.
          </p>

          <p className="text-xs text-slate-500 font-medium">
            Pricing is determined by the higher of your company computer count or cloud identity accounts. Every tier receives complete Sector Seven Cyber Protection.
          </p>
        </div>

        {/* 4-COLUMN SCALE TIERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch text-left">
          {tiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                tier.popular
                  ? 'bg-white border-2 border-[#0284C7] shadow-[0_20px_50px_rgba(2,132,199,0.12)] scale-[1.02] ring-4 ring-[#0284C7]/10'
                  : tier.isCustom
                  ? 'bg-slate-900 text-white border border-slate-800 shadow-xl'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-soft-card hover:shadow-lg hover:border-slate-300'
              }`}
            >
              {/* Scale Badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0284C7] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{tier.badge}</span>
                </div>
              )}

              {/* Card Header & Price */}
              <div className="space-y-4">
                <div>
                  <h3 className={`text-xl font-bold tracking-tight ${tier.isCustom ? 'text-white' : 'text-slate-900'}`}>
                    {tier.name}
                  </h3>
                  <span className={`text-xs font-semibold block mt-1 ${tier.isCustom ? 'text-sky-400' : 'text-[#0284C7]'}`}>
                    {tier.scaleLabel}
                  </span>
                  <p className={`text-xs mt-2 leading-relaxed ${tier.isCustom ? 'text-slate-300' : 'text-slate-500'}`}>
                    {tier.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className={`pt-3 pb-2 border-b ${tier.isCustom ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold tracking-tight ${tier.isCustom ? 'text-white' : 'text-slate-900'}`}>
                      {tier.price}
                    </span>
                    <span className={`text-xs font-medium ${tier.isCustom ? 'text-slate-400' : 'text-slate-500'}`}>
                      {tier.period}
                    </span>
                  </div>
                </div>

                {/* Included Highlights */}
                <div className="space-y-2.5 pt-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.isCustom ? 'text-sky-400' : 'text-emerald-600'}`} />
                    <span className={tier.isCustom ? 'text-slate-200' : 'text-slate-700'}>
                      24/7 human-led SOC active response
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.isCustom ? 'text-sky-400' : 'text-emerald-600'}`} />
                    <span className={tier.isCustom ? 'text-slate-200' : 'text-slate-700'}>
                      MDR with EDR & Windows Defender
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.isCustom ? 'text-sky-400' : 'text-emerald-600'}`} />
                    <span className={tier.isCustom ? 'text-slate-200' : 'text-slate-700'}>
                      Cloud identity defense (M365 / Google)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.isCustom ? 'text-sky-400' : 'text-emerald-600'}`} />
                    <span className={tier.isCustom ? 'text-slate-200' : 'text-slate-700'}>
                      Security posture rating & asset inventory
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer CTA Button */}
              <div className="pt-6">
                <button
                  onClick={() => onNavigate('/apply')}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    tier.popular
                      ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md hover:scale-[1.02]'
                      : tier.isCustom
                      ? 'bg-white hover:bg-slate-100 text-slate-900 shadow-sm hover:scale-[1.02]'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* UNIFIED CAPABILITIES SECTION (Section 13) */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-soft-card text-left space-y-8">
          <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                Single Managed Cybersecurity Service
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                What's Included in Sector Seven Cyber Protection
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Every client environment receives our complete managed defense suite with zero separate add-on charges.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/apply')}
              className="btn-primary bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold py-3 px-6 rounded-full shadow-sm flex items-center gap-2 shrink-0 transition-all"
            >
              <span>Get Your Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHATS_INCLUDED_CAPABILITIES.map((capability, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-sky-50/50 hover:border-sky-100 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-xs font-semibold text-slate-800 leading-snug">
                  {capability}
                </span>
              </div>
            ))}
          </div>

          {/* Section 17 Notice */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Notice:</strong> Pricing is based on the information and quantities provided during your assessment. If the number of devices or cloud users requiring protection differs during onboarding or changes during the service period, your service plan and recurring monthly charge may be adjusted accordingly.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
