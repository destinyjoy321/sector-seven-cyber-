import React from 'react';
import { ApplicationForm } from '../components/forms/ApplicationForm';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ApplyPageProps {
  onNavigate: (path: string) => void;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({ onNavigate }) => {
  const handleSuccess = (applicationId: string) => {
    onNavigate(`/thank-you?id=${applicationId}`);
  };

  return (
    <div className="pt-32 pb-24 bg-[#F8FAFC] text-slate-900 min-h-screen relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-sky-100/50 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 hover:text-[#0284C7] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 space-y-3 border-b border-slate-200 pb-6"
        >
          <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>CONFIDENTIAL CLIENT INTAKE PORTAL</span>
          </div>
          <h1 className="text-[clamp(2.1rem,4.5vw,4rem)] font-extrabold text-slate-900 tracking-tighter">
            Cybersecurity Assessment Application
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
            Tell us about your current security environment and upload any relevant cybersecurity or cyber-insurance questionnaire. Our team will review your information and contact you regarding the next steps.
          </p>
        </motion.div>

        {/* Form Container */}
        <ApplicationForm onSuccess={handleSuccess} onNavigate={onNavigate} />

      </div>
    </div>
  );
};
