import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  FileCheck, 
  Calculator, 
  ShieldCheck, 
  CreditCard, 
  Cloud, 
  Activity, 
  ArrowRight 
} from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (path: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 70%'],
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 22 });

  // Exactly as specified in Document Section 19
  const steps = [
    {
      step: '01',
      title: 'Complete Your Security Assessment',
      desc: 'Tell us about your organization and the environment requiring protection.',
      icon: FileCheck,
    },
    {
      step: '02',
      title: 'Receive Your Cybersecurity Quote',
      desc: 'Receive a Sector Seven monthly rate based on your protected environment.',
      icon: Calculator,
    },
    {
      step: '03',
      title: 'Review Your Protection',
      desc: 'Review your monthly rate and everything included in Sector Seven Cyber Protection.',
      icon: ShieldCheck,
    },
    {
      step: '04',
      title: 'Agree & Pay',
      desc: 'Review the Service Agreement and securely activate recurring billing.',
      icon: CreditCard,
    },
    {
      step: '05',
      title: 'Security Onboarding',
      desc: 'We begin connecting the approved cloud environment and deploying supported endpoint protection.',
      icon: Cloud,
    },
    {
      step: '06',
      title: '24/7 Managed Protection',
      desc: "Your protected environment enters Sector Seven's managed cybersecurity service.",
      icon: Activity,
    },
  ];

  return (
    <section id="how-it-works" className="py-28 bg-[#F8FAFC] text-slate-900 border-b border-slate-200 relative">
      
      {/* Background ambient soft glow */}
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-sky-100/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10 text-left">
        
          {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-3.5 py-1 rounded-full text-xs font-semibold">
            <span>Seamless Onboarding Journey</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-slate-900 tracking-tighter">
            How It Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            From initial assessment to live 24/7 active defense in six clear, transparent phases.
          </p>
        </div>

        {/* Vertical Timeline Container */}
        <div ref={containerRef} className="relative pl-8 sm:pl-16 space-y-8 text-left">
          
          {/* Base Inactive Vertical Line */}
          <div className="absolute left-3 sm:left-6 top-3 bottom-3 w-0.5 bg-slate-300 rounded-full" />

          {/* Active Sector Seven Cyan Scroll Line */}
          <motion.div
            style={{ scaleY }}
            className="absolute left-3 sm:left-6 top-3 bottom-3 w-0.5 bg-[#0284C7] origin-top rounded-full shadow-[0_0_10px_#0284C7]"
          />

          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0.4, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative flex items-start gap-6 group transition-opacity duration-500"
              >
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-8 sm:-left-16 top-1 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-slate-300 group-hover:border-[#0284C7] group-hover:shadow-md flex items-center justify-center transition-all duration-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] group-hover:scale-125 transition-transform" />
                </div>

                {/* Step Content Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-soft-card hover:border-sky-300 hover:shadow-md transition-all duration-300 w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0284C7] tracking-wider uppercase">
                      Phase {s.step}
                    </span>
                    <div className="p-2 rounded-xl bg-sky-50 text-[#0284C7]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    {s.step} — {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="pt-6 text-center">
          <button
            onClick={() => onNavigate('/apply')}
            className="btn-primary inline-flex items-center gap-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm tracking-wide px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <span>Start Your Security Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
