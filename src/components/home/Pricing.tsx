import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { 
  getPricingConfig, 
  fetchRemotePricingConfig, 
  PRICING_CHANGED_EVENT, 
  PricingConfig 
} from '../../lib/pricing';

interface PricingProps {
  onNavigate: (path: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
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
      name: 'Essential MDR',
      tagline: 'Ideal for boutique practices and independent firms.',
      footprint: `${t1.min}–${t1.max} Protected Units`,
      price: `$${t1.monthlyPrice}`,
      rawPrice: t1.monthlyPrice,
      period: '/ month',
      popular: false,
      ctaText: 'Start Assessment',
      features: [
        `Up to ${t1.max} company desktops & laptops`,
        `Up to ${t1.max} cloud identity accounts (M365/Google)`,
        '24/7 human-led SOC active response',
        'Managed Detection & Response with EDR',
        'Cloud Identity Detection & Response',
        'Continuous Security Posture Rating',
        'Automated Asset Inventory',
        'Windows & Microsoft Defender management',
      ],
    },
    {
      name: 'Professional MDR',
      tagline: 'Our standard package for growing law firms and clinics.',
      footprint: `${t2.min}–${t2.max} Protected Units`,
      price: `$${t2.monthlyPrice}`,
      rawPrice: t2.monthlyPrice,
      period: '/ month',
      popular: true,
      badge: 'Most Popular',
      ctaText: 'Start Assessment',
      features: [
        `Up to ${t2.max} company desktops & laptops`,
        `Up to ${t2.max} cloud identity accounts (M365/Google)`,
        '24/7 human-led SOC active response',
        'Managed Detection & Response with EDR',
        'Cloud Identity Detection & Response',
        'Continuous Security Posture Rating',
        'Automated Asset Inventory',
        'Windows & Microsoft Defender management',
        'Priority incident investigation SLA',
        'Dedicated onboarding engineer',
      ],
    },
    {
      name: 'Advanced MDR',
      tagline: 'Comprehensive defense for established multi-partner firms.',
      footprint: `${t3.min}–${t3.max} Protected Units`,
      price: `$${t3.monthlyPrice}`,
      rawPrice: t3.monthlyPrice,
      period: '/ month',
      popular: false,
      ctaText: 'Start Assessment',
      features: [
        `Up to ${t3.max} company desktops & laptops`,
        `Up to ${t3.max} cloud identity accounts (M365/Google)`,
        '24/7 human-led SOC active response',
        'Managed Detection & Response with EDR',
        'Cloud Identity Detection & Response',
        'Continuous Security Posture Rating',
        'Automated Asset Inventory',
        'Windows & Microsoft Defender management',
        'Underwriting audit verification documentation',
        'Direct senior architect escalation line',
      ],
    },
    {
      name: 'Custom Enterprise',
      tagline: 'Tailored architecture for large practices and institutions.',
      footprint: `${customThreshold}+ Protected Units`,
      price: 'Custom',
      rawPrice: null,
      period: '',
      popular: false,
      isEnterprise: true,
      ctaText: 'Contact Sales',
      features: [
        'Unlimited company desktops & laptops',
        'Unlimited cloud identity accounts',
        'Custom multi-tenant SOC active response',
        'Multi-cloud & hybrid server integrations',
        'Custom executive board compliance reviews',
        'Custom cyber-insurance alignment reviews',
        'Dedicated Technical Account Manager',
        'Tailored SLA & deployment timeline',
      ],
    },
  ];

  // Detailed comparison matrix rows inspired by Photoroom "Compare our plans"
  const comparisonSections = [
    {
      category: 'Core MDR & Endpoint Protection',
      rows: [
        { name: 'Protected Desktops & Laptops', t1: `Up to ${t1.max}`, t2: `Up to ${t2.max}`, t3: `Up to ${t3.max}`, t4: 'Custom' },
        { name: '24/7 Human-Led Security Operations Center (SOC)', t1: true, t2: true, t3: true, t4: true },
        { name: 'Active Response & Process Termination', t1: true, t2: true, t3: true, t4: true },
        { name: 'Endpoint Detection & Response (EDR) Agents', t1: true, t2: true, t3: true, t4: true },
        { name: 'Windows Defender & Defender for Endpoint Management', t1: true, t2: true, t3: true, t4: true },
      ],
    },
    {
      category: 'Cloud Identity & Account Defense',
      rows: [
        { name: 'Protected Cloud Identity Users (M365 / Google)', t1: `Up to ${t1.max}`, t2: `Up to ${t2.max}`, t3: `Up to ${t3.max}`, t4: 'Custom' },
        { name: 'Cloud Identity Detection & Response', t1: true, t2: true, t3: true, t4: true },
        { name: 'Suspicious Login & Account Compromise Isolation', t1: true, t2: true, t3: true, t4: true },
        { name: 'Multi-Factor Authentication (MFA) Verification', t1: true, t2: true, t3: true, t4: true },
      ],
    },
    {
      category: 'Underwriting Evidence & Compliance',
      rows: [
        { name: 'Continuous Security Posture Rating', t1: true, t2: true, t3: true, t4: true },
        { name: 'Automated Device & Asset Inventory', t1: true, t2: true, t3: true, t4: true },
        { name: 'Cyber Insurance Audit Support Documentation', t1: false, t2: true, t3: true, t4: true },
        { name: 'Quarterly Executive Compliance Summaries', t1: false, t2: false, t3: true, t4: true },
      ],
    },
    {
      category: 'Onboarding & Support Architecture',
      rows: [
        { name: 'Silent Background Agent Deployment', t1: true, t2: true, t3: true, t4: true },
        { name: 'Dedicated Onboarding Technical Coordinator', t1: false, t2: true, t3: true, t4: true },
        { name: 'Senior Security Architect Direct Hotline', t1: false, t2: false, t3: true, t4: true },
        { name: 'Custom Integration & Multi-Site SLAs', t1: false, t2: false, t3: false, t4: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 bg-[#F8FAFC] text-slate-900 border-b border-slate-200 relative overflow-hidden">
      
      {/* Background Subtle Gradient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-sky-100/50 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#0284C7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-20">
        
        {/* Section Header - Clean Photoroom-Inspired Standard Typography */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Transparent Pricing Model</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Plans and pricing
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Predictable monthly rates based on your protected environment scale. Complete your assessment to receive your automated quote.
          </p>

          {/* Toggle pill */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center p-1 rounded-full bg-slate-200/80 border border-slate-300/80 shadow-inner">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Subscription
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual Agreement</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-extrabold">
                  Save 15%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 4-COLUMN PRICING CARDS (Photoroom style) */}
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
                  : tier.isEnterprise
                  ? 'bg-slate-900 text-white border border-slate-800 shadow-xl'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-soft-card hover:shadow-lg hover:border-slate-300'
              }`}
            >
              {/* Most Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0284C7] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{tier.badge}</span>
                </div>
              )}

              {/* Card Header & Price */}
              <div className="space-y-4">
                <div>
                  <h3 className={`text-xl font-bold tracking-tight ${tier.isEnterprise ? 'text-white' : 'text-slate-900'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${tier.isEnterprise ? 'text-slate-300' : 'text-slate-500'}`}>
                    {tier.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold tracking-tight ${tier.isEnterprise ? 'text-white' : 'text-slate-900'}`}>
                      {billingCycle === 'annual' && tier.price !== 'Custom'
                        ? `$${Math.round(parseInt(tier.price.replace('$', '')) * 0.85)}`
                        : tier.price}
                    </span>
                    {tier.period && (
                      <span className={`text-xs font-medium ${tier.isEnterprise ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-semibold block mt-1 ${tier.isEnterprise ? 'text-sky-400' : 'text-[#0284C7]'}`}>
                    {tier.footprint}
                  </span>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/apply')}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      tier.popular
                        ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md hover:scale-[1.02]'
                        : tier.isEnterprise
                        ? 'bg-white hover:bg-slate-100 text-slate-900 shadow-sm hover:scale-[1.02]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Features List */}
                <div className="pt-4 space-y-2.5">
                  <span className={`text-[11px] font-bold uppercase tracking-wider block ${tier.isEnterprise ? 'text-slate-400' : 'text-slate-400'}`}>
                    Included capabilities:
                  </span>
                  <ul className="space-y-2">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.popular ? 'text-[#0284C7]' : tier.isEnterprise ? 'text-sky-400' : 'text-emerald-600'}`} />
                        <span className={`leading-snug ${tier.isEnterprise ? 'text-slate-200' : 'text-slate-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* "COMPARE OUR PLANS" SECTION (Exact Photoroom style) */}
        <div className="pt-12 space-y-10 text-left">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Compare our plans
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Detailed breakdown of active response, identity defenses, and compliance evidence.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="py-4 px-6 text-slate-500 font-semibold w-2/5">Capabilities</th>
                    <th className="py-4 px-4 text-center font-bold text-slate-900 w-[15%]">
                      <div>Essential</div>
                      <span className="text-xs font-normal text-slate-500">${t1.monthlyPrice}/mo</span>
                    </th>
                    <th className="py-4 px-4 text-center font-bold text-[#0284C7] bg-sky-50/60 border-x border-sky-100 w-[15%]">
                      <div>Professional</div>
                      <span className="text-xs font-normal text-[#0284C7]">${t2.monthlyPrice}/mo</span>
                    </th>
                    <th className="py-4 px-4 text-center font-bold text-slate-900 w-[15%]">
                      <div>Advanced</div>
                      <span className="text-xs font-normal text-slate-500">${t3.monthlyPrice}/mo</span>
                    </th>
                    <th className="py-4 px-4 text-center font-bold text-slate-900 w-[15%]">
                      <div>Enterprise</div>
                      <span className="text-xs font-normal text-slate-500">Custom</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonSections.map((section, sIdx) => (
                    <React.Fragment key={sIdx}>
                      {/* Category Header Row */}
                      <tr className="bg-slate-50/50">
                        <td colSpan={5} className="py-3 px-6 font-bold text-slate-900 text-xs uppercase tracking-wider">
                          {section.category}
                        </td>
                      </tr>

                      {/* Section Rows */}
                      {section.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-6 font-medium text-slate-700">
                            {row.name}
                          </td>

                          {/* Column 1 */}
                          <td className="py-3.5 px-4 text-center">
                            {typeof row.t1 === 'boolean' ? (
                              row.t1 ? (
                                <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-slate-300 font-bold">—</span>
                              )
                            ) : (
                              <span className="font-semibold text-slate-800">{row.t1}</span>
                            )}
                          </td>

                          {/* Column 2 (Highlighted popular) */}
                          <td className="py-3.5 px-4 text-center bg-sky-50/40 border-x border-sky-100">
                            {typeof row.t2 === 'boolean' ? (
                              row.t2 ? (
                                <Check className="w-4 h-4 text-[#0284C7] stroke-[2.5] mx-auto" />
                              ) : (
                                <span className="text-slate-300 font-bold">—</span>
                              )
                            ) : (
                              <span className="font-bold text-[#0284C7]">{row.t2}</span>
                            )}
                          </td>

                          {/* Column 3 */}
                          <td className="py-3.5 px-4 text-center">
                            {typeof row.t3 === 'boolean' ? (
                              row.t3 ? (
                                <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-slate-300 font-bold">—</span>
                              )
                            ) : (
                              <span className="font-semibold text-slate-800">{row.t3}</span>
                            )}
                          </td>

                          {/* Column 4 */}
                          <td className="py-3.5 px-4 text-center">
                            {typeof row.t4 === 'boolean' ? (
                              row.t4 ? (
                                <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-slate-300 font-bold">—</span>
                              )
                            ) : (
                              <span className="font-semibold text-slate-800">{row.t4}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Table Action Strip */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">Need help determining your environment footprint?</h4>
                <p className="text-xs text-slate-500">Run through our 2-minute assessment for an immediate automated quote.</p>
              </div>

              <button
                onClick={() => onNavigate('/apply')}
                className="btn-primary bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold py-2.5 px-6 rounded-full shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>Start Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
