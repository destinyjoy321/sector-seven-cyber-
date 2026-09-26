import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

interface FAQProps {
  onNavigate: (path: string) => void;
}

export const FAQ: React.FC<FAQProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What type of cybersecurity services does Sector Seven provide?',
      a: 'Sector Seven Cyber LLC operates as an elite B2B managed cybersecurity partner delivering Cloud & Endpoint Managed Detection & Response (MDR). Our human-led 24/7 Security Operations Center (SOC) provides continuous endpoint monitoring, cloud identity defense, active threat neutralization, and verifiable documentation that satisfies strict underwriting audits and industry compliance standards.',
    },
    {
      q: 'How does Cloud & Endpoint Managed Detection & Response (MDR) work?',
      a: 'We deploy silent, enterprise-grade endpoint security agents across your designated company laptops and desktops, combined with continuous telemetry ingestion from your Microsoft 365 or Google Workspace cloud environment. When suspicious processes, anomalous logins, or threat vectors emerge, our live SOC analysts immediately investigate and execute active containment measures to isolate compromised assets and protect critical data.',
    },
    {
      q: 'How does Sector Seven help our business address cyber-insurance requirements?',
      a: 'Modern cyber liability underwriters routinely require verifiable evidence of continuous endpoint monitoring (EDR/MDR), enforced multi-factor authentication (MFA), and automated asset inventories. Sector Seven provides managing partners with continuous security posture ratings and verifiable documentation that satisfies strict carrier renewal questionnaires.',
    },
    {
      q: 'How is Sector Seven’s monthly pricing calculated?',
      a: 'Our pricing is transparent, fixed, and calculated based on your protected environment scale. During your security assessment, we evaluate the number of company computers and cloud identity users requiring protection. The higher of the two quantities determines your monthly subscription tier ($500/mo for 1–10, $750/mo for 11–20, $1,000/mo for 21–30, or custom quotes for larger environments). There are no hidden hardware fees or surprise vendor markups.',
    },
    {
      q: 'What happens if our device or user count changes during service?',
      a: 'Your initial quote is based on the quantities provided during your assessment. If the actual number of devices or cloud users requiring protection differs during technical onboarding or expands as your business grows, your service plan and recurring monthly charge can be adjusted accordingly with full advance notice.',
    },
    {
      q: 'Do we need to replace our existing IT provider or internal staff?',
      a: 'No. Sector Seven operates as a specialized managed cybersecurity partner. We work seamlessly alongside your existing internal staff or external IT managed service provider (MSP), handling the specialized 24/7 SOC threat detection, EDR telemetry, and underwriting evidence documentation that standard IT teams do not staff around the clock.',
    },
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-white text-slate-900 border-b border-slate-200 relative">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] bg-sky-50/50 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header - Photoroom Style */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Common Questions</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently asked questions
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Everything you need to know about our managed cybersecurity service, pricing structure, and underwriting alignment.
          </p>
        </div>

        {/* Clean Accordion List (Photoroom style: clean divider lines, questions on left, plus/minus on right) */}
        <div className="divide-y divide-slate-200 text-left border-y border-slate-200">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="py-6 transition-colors duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-6 font-bold text-slate-900 text-base sm:text-lg hover:text-[#0284C7] transition-colors focus-visible:outline-none"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 transition-colors">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#0284C7]" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pr-12 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Contact / Assessment Strip */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-xl">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">Have a specific compliance question?</h3>
            <p className="text-xs sm:text-sm text-slate-300">Our senior security architects are available for direct technical consultations.</p>
          </div>

          <button
            onClick={() => onNavigate('/apply')}
            className="btn-primary shrink-0 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs px-6 py-3.5 rounded-full transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Start Security Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
