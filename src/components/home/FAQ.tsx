import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

interface FAQProps {
  onNavigate: (path: string) => void;
}

export const FAQ: React.FC<FAQProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is the Sector Seven framework classified as an automated software suite or a Cyber Liability Insurance instrument?',
      a: 'Neither. Sector Seven Cyber LLC operates exclusively as an institutional B2B cybersecurity compliance and active defense firm. We are not an insurance carrier, nor do we deploy passive software that routes unmonitored alerts to empty inboxes. Instead, we anchor our client defenses with a live, human-led, 24/7/365 Security Operations Center (SOC) that monitors your network infrastructure in real time.',
    },
    {
      q: 'What is the operational protocol if a critical vulnerability or threat vector is identified outside of standard business hours?',
      a: 'While automated monitoring programs merely log indicators of compromise, Sector Seven’s dedicated human threat hunters intervene immediately. In the event of a high-severity security anomaly detected at midnight, our global SOC team steps in within minutes to terminate the malicious process, isolate the affected device from the host network, and neutralize the threat vector before data can be stolen.',
    },
    {
      q: 'How does Sector Seven assist with our independent insurance underwriting and state compliance?',
      a: 'We actively engineer your technical endpoints to comply with demanding cyber insurance underwriting requirements and state notification frameworks (such as O.C.G.A. § 10-1-912). By delivering active human oversight instead of passive tools, we provide the definitive proof of protection that carriers require to qualify your firm for coverage.',
    },
  ];

  return (
    <section id="faq" className="py-28 bg-white text-slate-900 border-b border-slate-200 relative">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-slate-900 tracking-tighter">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Clean Accordion with Steel Blue-Gray Bottom Border */}
        <div className="space-y-2 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="border-b border-slate-200 transition-colors duration-200 group hover:border-[#0284C7]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left py-6 px-2 flex items-center justify-between gap-4 font-bold text-slate-900 text-base sm:text-lg group-hover:text-[#0284C7] transition-colors focus-visible:outline-none focus-visible:text-[#0284C7]"
                >
                  <span className="flex items-center gap-4">
                    <span className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-[#0284C7] text-xs font-mono flex items-center justify-center shrink-0 group-hover:bg-sky-50 group-hover:border-sky-300 transition-colors">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#0284C7]' : 'group-hover:text-[#0284C7]'}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
        >
          <div className="space-y-1">
            <h4 className="font-extrabold text-white text-lg">Your Insurer Is Asking a Simple Question</h4>
            <p className="text-xs sm:text-sm text-sky-400 font-mono font-semibold">Can you prove you're protected?</p>
          </div>
          <button
            onClick={() => onNavigate('/apply')}
            className="btn-primary bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono text-xs font-extrabold tracking-wider px-6 py-4 rounded-full flex items-center gap-2 shrink-0 transition-all shadow-md hover:scale-[1.03]"
          >
            <span>START YOUR SECURITY ASSESSMENT →</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
