import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onNavigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
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
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
            Cloud & Endpoint Managed Detection & Response (MDR)
          </span>
        </motion.div>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.95 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ ...deepZTransition, delay: 0.2 }}
          className="text-[clamp(2.3rem,5.2vw,5.25rem)] font-extrabold text-slate-900 tracking-tighter leading-[1.08] max-w-4xl"
        >
          Protect Your Business from Cyber Threats —{' '}
          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0284C7] bg-clip-text text-transparent">
            On Endpoints & In The Cloud.
          </span>
        </motion.h1>

        {/* Sub-headline explicitly reflecting Document Section 1 */}
        <motion.p
          initial={{ opacity: 0, filter: 'blur(16px)', scale: 0.95 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ ...deepZTransition, delay: 0.4 }}
          className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl text-center"
        >
          Protect your business from cyber threats — whether you're strengthening your cybersecurity, addressing cyber-insurance requirements, or both. Backed by a 24/7 Security Operations Center (SOC) with active response.
        </motion.p>

        {/* Callout Quote Block */}
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(14px)', scale: 0.95, y: 30 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 }}
          transition={{ ...deepZTransition, delay: 0.6 }}
          className="mt-8 p-6 sm:p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/90 max-w-2xl text-center space-y-1.5 shadow-soft-card"
        >
          <p className="text-sm sm:text-base font-semibold text-slate-800">
            “Your insurer or partners aren't simply asking whether you have cybersecurity.”
          </p>
          <p className="text-sm sm:text-base font-bold text-[#0284C7] italic font-serif">
            “They're asking whether you can demonstrate 24/7 active response.”
          </p>
        </motion.div>

        {/* Primary Action Button */}
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.95, y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 }}
          transition={{ ...deepZTransition, delay: 0.8 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => onNavigate('/apply')}
            className="btn-primary w-full sm:w-auto bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm tracking-wide px-8 py-3.5 rounded-full shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200 group border border-sky-400/30 hover:scale-[1.03]"
          >
            <span>Start Your Security Assessment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...deepZTransition, delay: 1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            Human-Led 24/7 SOC
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#0284C7]" />
            Fixed Monthly Transparent Rates
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
            Instant Algorithmic Quote
          </span>
        </motion.div>

      </div>
    </section>
  );
};
