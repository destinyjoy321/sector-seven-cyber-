import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface InsuranceCrisisProps {
  onNavigate: (path: string) => void;
}

const TextMaskLine: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: '100%', opacity: 0, filter: 'blur(4px)' }}
      whileInView={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const, delay }}
    >
      {children}
    </motion.div>
  </div>
);

export const InsuranceCrisis: React.FC<InsuranceCrisisProps> = ({ onNavigate }) => {
  const marcusContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: marcusContainerRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-25, 25]);

  return (
    <section id="problem" className="py-24 md:py-32 bg-[#F8FAFC] text-slate-900 relative overflow-hidden border-b border-slate-200">
      
      {/* Ambient Soft Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0284C7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left space-y-20">
        
        {/* Story Section: Marcus Whitfield Narrative (Scroll-Linked Parallax & 2-Column Desktop Grid) */}
        <div ref={marcusContainerRef} className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-soft-card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Narrative Text */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-3 border-b border-slate-200 pb-6">
                <TextMaskLine delay={0}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200 inline-flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-[#0284C7]" />
                    Cybersecurity for Insurance Requirements
                  </span>
                </TextMaskLine>

                {/* Explicit Heading from Document Section 2 */}
                <TextMaskLine delay={0.1}>
                  <h2 className="text-[clamp(1.75rem,3.8vw,3.25rem)] font-extrabold text-slate-900 tracking-tight leading-tight">
                    CYBER INSURANCE REQUIREMENTS ARE GETTING HARDER TO IGNORE
                  </h2>
                </TextMaskLine>

                {/* Explicit Supporting Copy from Document Section 2 */}
                <TextMaskLine delay={0.2}>
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                    Businesses may be asked about their cybersecurity controls when applying for or renewing cyber-insurance coverage. Sector Seven provides managed cloud and endpoint cybersecurity protection designed to strengthen the security environment businesses rely on every day.
                  </p>
                </TextMaskLine>
              </div>

              <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                <TextMaskLine delay={0.1}>
                  <p>
                    When Marcus Whitfield received his law practice’s cyber insurance renewal, his commercial broker highlighted a major industry shift: underwriters required verifiable evidence of continuous, 24/7 monitored endpoint protection and active cloud identity defenses.
                  </p>
                </TextMaskLine>

                <TextMaskLine delay={0.15}>
                  <p>
                    Marcus assumed standard antivirus software was sufficient. But carriers aren't looking for static software—they require human-led threat hunting to keep pace with modern risks. Sector Seven delivers active enterprise-grade cybersecurity, ensuring managing partners have the documented technical posture carriers audit.
                  </p>
                </TextMaskLine>

                <TextMaskLine delay={0.2}>
                  <p>
                    Instead of scrambling or facing non-renewal notices, Marcus partnered with Sector Seven. We deployed 24/7 managed detection and response across his firm, giving his broker the technical proof needed for renewal.
                  </p>
                </TextMaskLine>
              </div>

              {/* Explicit CTA from Document Section 2 */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/apply')}
                  className="btn-primary inline-flex items-center gap-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs tracking-wide px-7 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <span>Start Your Security Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Column: Generated High-Fidelity Image with Parallax Effect */}
            <div className="lg:col-span-5 relative w-full h-full flex items-center justify-center">
              <div className="w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-lg relative group bg-slate-100">
                <motion.div style={{ y: imageY }} className="w-full h-[360px] sm:h-[440px] lg:h-[480px]">
                  <img 
                    src="/images/marcus_whitfield_legal_desk.jpg" 
                    alt="Marcus Whitfield Law Practice Confidential Document Desk" 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>

                {/* Subtle Frosted Glass HUD Overlay Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/90 text-xs text-slate-800 flex items-center justify-between shadow-sm z-10">
                  <span className="font-semibold text-[#0284C7] uppercase tracking-wider text-[11px]">Case #1042 · Underwriting Audit</span>
                  <span className="text-slate-500 text-[11px]">Marcus Whitfield Firm</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Active Defense Architecture Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Active Defense Architecture
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Sector Seven Delivers Continuous Enterprise-Grade Cybersecurity
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              We provide the active technical defenses, endpoint monitoring, and 24/7 SOC response that allow businesses to protect their data, maintain operational resilience, and satisfy strict underwriting audits.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/apply')}
            className="shrink-0 btn-primary bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs tracking-wide px-6 py-3.5 rounded-full transition-all"
          >
            Start Security Assessment
          </button>
        </div>

      </div>
    </section>
  );
};
