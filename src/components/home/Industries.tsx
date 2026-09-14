import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Stethoscope, ShieldCheck, ArrowRight } from 'lucide-react';

interface IndustriesProps {
  onNavigate: (path: string) => void;
}

export const Industries: React.FC<IndustriesProps> = ({ onNavigate }) => {
  return (
    <section id="industries" className="py-28 bg-[#F8FAFC] text-slate-900 border-b border-slate-200 relative">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 text-left relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>BUILT FOR HIGH-VALUE PRACTICES</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-slate-900 tracking-tighter">
            Built for Practices Where Security Is a Business Responsibility
          </h2>
        </div>

        {/* 2 Main Industry Cards: Law Firms & Medical Clinics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Law Firms */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft-card space-y-6 flex flex-col justify-between hover:border-sky-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-[#0284C7] flex items-center justify-center shadow-sm">
                  <Scale className="w-6 h-6 text-[#0284C7]" />
                </div>
                <span className="text-xs font-mono font-bold bg-sky-50 text-[#0284C7] border border-sky-200 px-3 py-1 rounded-full">
                  Georgia Law Practices
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900">Law Firms</h3>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Your practice holds information clients expect you to protect: client financial information, legal documents, confidential communications, case files, credentials.
              </p>
              
              <p className="text-sm font-semibold text-slate-900 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                A cyber incident doesn't just create an IT problem. It can create a professional, financial and reputational problem.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/apply')}
              className="btn-primary w-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono font-extrabold text-xs tracking-wider py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02]"
            >
              <span>BOOK A SECURITY FIT CALL →</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </motion.div>

          {/* Medical Clinics */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft-card space-y-6 flex flex-col justify-between hover:border-sky-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-sm">
                  <Stethoscope className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full">
                  Georgia Healthcare Facilities
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900">Medical Clinics</h3>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Your systems contain information patients trust you to protect: patient records, personal information, insurance information, clinical systems, payment information.
              </p>
              
              <p className="text-sm font-semibold text-slate-900 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                When those systems go down, or sensitive information is compromised, the consequences extend far beyond the computer screen.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/apply')}
              className="btn-primary w-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono font-extrabold text-xs tracking-wider py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02]"
            >
              <span>BOOK A SECURITY FIT CALL →</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </motion.div>

        </div>

        {/* Georgia Law Framework Box (O.C.G.A. § 10-1-912) */}
        <motion.div 
          id="georgia-law"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl border border-slate-800"
        >
          <div className="space-y-2">
            <span className="font-mono text-xs font-extrabold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/30 inline-block">
              GEORGIA REGULATORY OBLIGATIONS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Georgia Law Isn't Just a Footnote
            </h3>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl font-normal">
            Georgia organizations handling computerized personal information have obligations under state law concerning the security of that information and notification following certain breaches.
          </p>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-sky-400 font-mono font-bold text-sm sm:text-base">
            O.C.G.A. § 10-1-912 matters because your cybersecurity responsibilities don't end with your insurance policy.
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Sector Seven Cyber helps organizations build stronger security environments around their operational, insurance and regulatory responsibilities.
          </p>

          <div className="pt-2">
            <a
              href="https://law.justia.com/codes/georgia/title-10/chapter-1/article-34/section-10-1-912/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold text-xs sm:text-sm tracking-wider px-8 py-4 rounded-full items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <span>REVIEW THE O.C.G.A. § 10-1-912 FRAMEWORK</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
