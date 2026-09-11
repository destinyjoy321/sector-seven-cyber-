import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AlertCircle, ArrowRight, ShieldCheck, FileCheck, Layers } from 'lucide-react';

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
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

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
                  <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#0284C7] bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200 inline-flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-[#0284C7]" />
                    COMMUNICATING THE BUSINESS PROBLEM
                  </span>
                </TextMaskLine>

                <TextMaskLine delay={0.1}>
                  <h2 className="text-[clamp(1.75rem,3.8vw,3.25rem)] font-extrabold text-slate-900 tracking-tighter leading-tight">
                    Your Insurance Carrier Demands Proof of Protection. We Provide It.
                  </h2>
                </TextMaskLine>

                <TextMaskLine delay={0.2}>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0284C7]">
                    Meeting modern cyber liability requirements shouldn't hold your business back.
                  </h3>
                </TextMaskLine>
              </div>

              <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                <TextMaskLine delay={0.1}>
                  <p>
                    When Marcus Whitfield received his law practice’s cyber insurance renewal, his commercial broker highlighted a major industry shift. To maintain his coverage and protect his preferred premium rate, Marcus had to provide verified evidence of continuous, 24/7 monitored endpoint protection.
                  </p>
                </TextMaskLine>

                <TextMaskLine delay={0.15}>
                  <p>
                    Like many firm owners, Marcus assumed his standard antivirus software was enough. But modern compliance requires active, human-led threat hunting to keep pace with modern risks. Carriers aren't being difficult—they are simply setting the standard required to securely insure high-value practices.
                  </p>
                </TextMaskLine>

                <TextMaskLine delay={0.2}>
                  <p>
                    Marcus had 30 days to close the gap. Instead of scrambling or facing steep premium increases, he partnered with Sector Seven. We deployed enterprise-grade compliance monitoring across his entire firm in under 48 hours. Marcus’s broker seamlessly finalized a secure renewal, keeping the firm fully compliant, fully covered, and perfectly protected.
                  </p>
                </TextMaskLine>
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
                <div className="absolute bottom-4 left-4 right-4 bg-white/85 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/90 text-xs text-slate-800 flex items-center justify-between shadow-sm z-10">
                  <span className="font-mono font-bold text-[#0284C7] uppercase tracking-wider text-[11px]">CASE #1042 · UNDERWRITING AUDIT</span>
                  <span className="font-mono text-slate-500 text-[11px]">MARCUS WHITFIELD FIRM</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section: The Rules Have Changed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-6 space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Rules Have Changed
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Cyber insurance used to feel like another box on the business checklist: get a policy, install antivirus, answer the questionnaire, renew.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              That's not the environment you're operating in anymore. Underwriters are scrutinizing the controls behind cyber-risk applications more closely. They want evidence. They want monitoring. They want documented controls. And increasingly, they want security measures that aren't simply installed, but continuously managed and verifiable.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              At the same time, your practice has responsibilities beyond the insurance policy. Your clients expect you to protect confidential information. Your patients expect you to protect sensitive health information. Georgia law imposes obligations around the security and breach notification of certain computerized personal information.
            </p>
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-[#0284C7] font-bold text-sm">
              Security is no longer just an IT concern. It's an operational, insurance and regulatory responsibility.
            </div>
          </motion.div>

          {/* Section: Cybersecurity Is What We Do. Security Position Is What We Build. */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
            className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-soft-card"
          >
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Cybersecurity Is What We Do. <br />
                <span className="text-[#0284C7]">Security Position Is What We Build.</span>
              </h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Most cybersecurity companies sell cybersecurity. Sector Seven Cyber builds and continuously operates the security environment surrounding high-value professional practices.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:border-sky-300 transition-colors">
                <ShieldCheck className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Security</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Protect the systems, endpoints, networks and cloud environments your practice depends on.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:border-sky-300 transition-colors">
                <FileCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Insurance</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Align your security posture with the requirements identified by your broker and carrier.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:border-sky-300 transition-colors">
                <Layers className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Regulatory</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Build stronger security practices around the obligations that apply to your organization.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs font-mono font-bold text-slate-800 border-t border-slate-200 pt-4">
              The result isn't simply another security product installed on your computers. It's a security position you can demonstrate.
            </p>

            <button
              onClick={() => onNavigate('/apply')}
              className="btn-primary w-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono font-extrabold text-xs tracking-wider py-4 px-6 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-[1.02]"
            >
              <span>BOOK A SECURITY FIT CALL</span>
            </button>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
