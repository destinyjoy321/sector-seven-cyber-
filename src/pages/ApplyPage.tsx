import React from 'react';
import { ApplicationForm } from '../components/forms/ApplicationForm';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ApplyPageProps {
  onNavigate: (path: string) => void;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({ onNavigate }) => {
  const handleSuccess = (applicationId: string) => {
    // Direct routing to the dedicated V2.0 Quote Experience
    onNavigate(`/quote?id=${applicationId}`);
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50/70 text-slate-900 min-h-screen relative overflow-hidden flex flex-col justify-center">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-100/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-6 w-full relative z-10 text-left">
        
        {/* Navigation / Return Link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0284C7] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>

          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Sector Seven Cyber · Assessment
          </span>
        </div>

        {/* Focused 2-Point Card Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ApplicationForm onSuccess={handleSuccess} onNavigate={onNavigate} />
        </motion.div>

        {/* Minimal Bottom Footnote */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Need immediate support? Call our team directly at{' '}
          <a href="tel:+14703639083" className="text-slate-600 font-semibold hover:text-[#0284C7] transition-colors">
            (470) 363-9083
          </a>
        </div>

      </div>
    </div>
  );
};
