import React from 'react';
import { ApplicationForm } from '../components/forms/ApplicationForm';
import { ShieldCheck, Lock, FileCheck, ArrowLeft } from 'lucide-react';

interface ApplyPageProps {
  onNavigate: (path: string) => void;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({ onNavigate }) => {
  const handleSuccess = (applicationId: string) => {
    onNavigate(`/thank-you?id=${applicationId}`);
  };

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 hover:text-cyber-teal mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        {/* Page Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 space-y-8 tech-bracket">
          
          <div className="border-b border-slate-100 pb-6 space-y-3">
            <div className="inline-flex items-center gap-2 bg-cyber-teal/10 text-cyber-teal border border-cyber-teal/20 px-3.5 py-1 rounded-full text-xs font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>CONFIDENTIAL CLIENT INTAKE PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Cyber Insurance Assessment Application
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Upload your carrier questionnaire (PDF, DOCX, XLSX) and submit practice details. Our Georgia security architecture team will audit your technical gaps and issue a certified readiness report within 24 hours.
            </p>
          </div>

          {/* Form */}
          <ApplicationForm onSuccess={handleSuccess} onNavigate={onNavigate} />

        </div>

      </div>
    </div>
  );
};
