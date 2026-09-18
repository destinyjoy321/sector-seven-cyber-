import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Upload, FileSearch, PhoneCall, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (path: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for drawing vertical Sector Seven Cyan timeline line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 70%'],
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 22 });

  const steps = [
    {
      step: '01',
      title: 'You Send the Documentation.',
      desc: 'Upload the questionnaire, renewal notice or deficiency letter your broker or carrier provided.',
      icon: Upload,
    },
    {
      step: '02',
      title: 'We Review the Requirements.',
      desc: 'We examine what your insurer is asking for and identify the relevant security requirements.',
      icon: FileSearch,
    },
    {
      step: '03',
      title: 'We Conduct an Environment Review.',
      desc: 'Our security architecture team evaluates your device count, cloud footprint, and questionnaire details to verify your environment scope.',
      icon: ShieldCheck,
    },
    {
      step: '04',
      title: 'We Build the Security Environment.',
      desc: 'If there is a fit, Sector Seven Cyber implements the appropriate security protections and establishes continuous monitoring and management.',
      icon: ShieldCheck,
    },
    {
      step: '05',
      title: 'We Maintain the Position.',
      desc: 'Security isn\'t a once-a-year exercise. Your environment continues to be monitored, managed and documented as requirements and threats evolve.',
      icon: RefreshCw,
    },
  ];

  return (
    <section id="how-it-works" className="py-28 bg-[#F8FAFC] text-slate-900 border-b border-slate-200 relative">
      
      {/* Background ambient soft glow */}
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-sky-100/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <span>TRANSPARENT PROCESS</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-slate-900 tracking-tighter">
            What Happens After You Submit?
          </h2>
        </div>

        {/* Vertical Timeline Container */}
        <div ref={containerRef} className="relative pl-8 sm:pl-16 space-y-12 text-left">
          
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
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative flex items-start gap-6 group transition-opacity duration-500"
              >
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-8 sm:-left-16 top-1 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-slate-300 group-hover:border-[#0284C7] group-hover:shadow-md flex items-center justify-center transition-all duration-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] group-hover:scale-125 transition-transform" />
                </div>

                {/* Step Content Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-soft-card hover:border-sky-300 hover:shadow-lg transition-all duration-300 w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-black text-[#0284C7] tracking-wider">
                      STEP {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0284C7]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{s.desc}</p>
                </div>

              </motion.div>
            );
          })}

        </div>

        {/* Action Callout Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-white text-base">Ready to review your requirements?</h4>
            <p className="text-xs text-slate-400 font-mono">
              Upload the questionnaire, renewal notice or deficiency letter your broker or carrier provided.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/apply')}
            className="btn-primary shrink-0 bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono font-extrabold text-xs tracking-wider px-6 py-4 rounded-full flex items-center gap-2 shadow-md transition-all hover:scale-[1.03]"
          >
            <span>START YOUR SECURITY ASSESSMENT →</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};
