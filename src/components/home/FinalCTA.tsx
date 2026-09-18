import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock } from 'lucide-react';

interface FinalCTAProps {
  onNavigate: (path: string) => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onNavigate }) => {
  return (
    <section className="py-28 bg-[#F8FAFC] text-slate-900 relative overflow-hidden border-t border-slate-200">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-sky-100/50 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left space-y-16">
        
        {/* Main CTA Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-soft-card space-y-8"
        >
          
          <div className="space-y-4">
            <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#0284C7] bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200 inline-flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
              TAKE ACTION BEFORE RENEWAL
            </span>
            <h2 className="text-[clamp(2.25rem,4.5vw,4rem)] font-extrabold text-slate-900 tracking-tighter leading-tight">
              Don't Wait for the Letter
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              If your renewal is coming up, now is the time to find out what your insurer expects. Not when the carrier has already flagged your application. Not after your premium jumps. Not after your policy lapses. And certainly not after an incident.
            </p>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-200">
            <h3 className="text-lg font-bold text-[#0284C7] font-mono">
              Start with the documentation.
            </h3>
            
            <button
              onClick={() => onNavigate('/apply')}
              className="btn-primary bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono font-extrabold text-xs tracking-wider px-8 py-4 rounded-full shadow-md hover:shadow-lg inline-flex items-center gap-2 transition-all duration-200 hover:scale-[1.03]"
            >
              <span>START YOUR SECURITY ASSESSMENT →</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </button>

            <p className="text-xs text-slate-500">
              Upload the questionnaire, renewal notice or deficiency letter your broker or carrier provided.
            </p>
            <div className="inline-block text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Confidential. Secure. No obligation.
            </div>
          </div>

          {/* Final Question */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-mono text-xs text-slate-500 font-bold uppercase tracking-wider">Your Insurer Is Asking a Simple Question</h4>
            <p className="text-xl font-bold text-slate-900">Can you prove you're protected?</p>
            <p className="text-xs text-[#0284C7] font-semibold">Don't wait until the answer costs you your policy.</p>
          </div>

        </motion.div>

        {/* P.S. Postscript Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3 font-normal text-slate-600 text-sm sm:text-base leading-relaxed"
        >
          <span className="font-mono text-xs font-extrabold text-[#0284C7] uppercase tracking-wider block">P.S.</span>
          <p>
            Marcus didn't lose his practice. He didn't suffer a breach. He didn't even have a cybersecurity incident.
          </p>
          <p>
            He simply couldn't prove that one of the controls his insurer required was continuously operating. That's enough to create a problem.
          </p>
          <p>
            And if your renewal is coming up, you don't want to discover your gaps from the person deciding whether to insure you.
          </p>
          <p className="font-bold text-slate-900 pt-2">
            Find them first. Upload your compliance packet.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/apply')}
              className="text-xs font-mono font-bold text-[#0284C7] hover:underline inline-flex items-center gap-1"
            >
              Upload Compliance Packet Now →
            </button>
          </div>
        </motion.div>

        {/* Footer Guarantee */}
        <div className="text-center text-xs text-slate-500 font-mono flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure Communication Gateway • Atlanta, Georgia</span>
        </div>

      </div>
    </section>
  );
};
