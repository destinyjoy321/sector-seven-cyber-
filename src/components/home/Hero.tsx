import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PhoneCall } from 'lucide-react';

interface HeroProps {
  onNavigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  // Custom cubic-bezier easing curve [0.16, 1, 0.3, 1]
  const deepZTransition = {
    duration: 1.5,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <section 
      className="relative pt-32 pb-24 md:pt-44 md:pb-36 overflow-hidden bg-white text-slate-900 min-h-[90vh] flex flex-col justify-center border-b border-slate-200 group"
    >
      
      {/* Background Subtle Gradient Flare & Ambient Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#0284C7]/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-sky-200/30 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Abstract 3D Topographical Mesh Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/images/hero_topographical_mesh.jpg" 
          alt="Abstract 3D Topographical Mesh Background" 
          className="w-full h-full object-cover object-center opacity-30 mix-blend-multiply select-none"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto text-center flex flex-col items-center">
        
        {/* Top Header Brand Tag */}
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.9, y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 }}
          transition={{ ...deepZTransition, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/90 backdrop-blur-md shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-ping" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0284C7]">
            SECTOR SEVEN CYBER
          </span>
        </motion.div>

        {/* Primary Headline - Z-Axis Reveal with Dark Slate Text */}
        <motion.h1
          initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.95 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ ...deepZTransition, delay: 0.2 }}
          className="text-[clamp(2.3rem,5.2vw,5.25rem)] font-extrabold text-slate-900 tracking-tighter leading-[1.08] max-w-4xl"
        >
          Enterprise-Grade Cyber Defense for{' '}
          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0284C7] bg-clip-text text-transparent">
            High-Value Georgia Practices.
          </span>
        </motion.h1>

        {/* Sub-headline - Light Mode Contrast */}
        <motion.p
          initial={{ opacity: 0, filter: 'blur(16px)', scale: 0.95 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ ...deepZTransition, delay: 0.4 }}
          className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl text-center"
        >
          24/7/365 human-led threat monitoring, endpoint defense, and insurance-compliance engineering for Georgia law firms and medical clinics facing increasingly demanding security and underwriting requirements.
        </motion.p>

        {/* Callout Quote Block */}
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(14px)', scale: 0.95, y: 30 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 }}
          transition={{ ...deepZTransition, delay: 0.6 }}
          className="mt-8 p-6 sm:p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/90 max-w-2xl text-center space-y-1.5 shadow-soft-card"
        >
          <p className="text-sm sm:text-base font-semibold text-slate-800">
            “Your insurer isn't simply asking whether you have cybersecurity.”
          </p>
          <p className="text-sm sm:text-base font-bold text-[#0284C7] italic font-serif">
            “They're asking whether you can demonstrate it.”
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.95, y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 }}
          transition={{ ...deepZTransition, delay: 0.8 }}
          className="mt-9 flex items-center justify-center w-full sm:w-auto"
        >
          <button
            onClick={() => onNavigate('/apply')}
            className="btn-primary w-full sm:w-auto bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono font-extrabold text-xs tracking-wider px-9 py-4 rounded-full shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 group border border-sky-400/30 hover:scale-[1.03]"
          >
            <span>BOOK A SECURITY FIT CALL</span>
          </button>
        </motion.div>

        {/* Caption & Georgia Compliance Digital Seal */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...deepZTransition, delay: 1 }}
          className="mt-8 text-xs space-y-4 text-center max-w-xl"
        >
          <p className="text-slate-500">
            Begin by securely uploading the compliance documentation provided by your broker or carrier.
          </p>

          {/* Interactive Georgia Compliance Digital Seal */}
          <div>
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById('georgia-law');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900 text-white border border-slate-700/80 shadow-md backdrop-blur-md cursor-pointer group transition-all duration-300 hover:border-[#00D2FF] hover:shadow-[0_0_20px_rgba(0,210,255,0.3)]"
            >
              {/* Spinning / Glowing Seal Icon Ring */}
              <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border border-[#00D2FF]/60 border-t-transparent group-hover:rotate-90 transition-transform duration-500" />
                <span className="w-2 h-2 rounded-full bg-[#00D2FF] group-hover:scale-125 transition-transform" />
              </div>

              <div className="text-left font-mono text-xs">
                <span className="block font-extrabold text-white group-hover:text-[#00D2FF] transition-colors tracking-wide text-[11px]">
                  GEORGIA O.C.G.A. § 10-1-912 SEAL
                </span>
                <span className="block text-[10px] text-slate-400">
                  Review Statutory Security Mandates →
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
