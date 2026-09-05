import React from 'react';
import { ArrowLeft, Shield, Lock } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-600 hover:text-cyber-teal mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 space-y-8 text-left tech-bracket">
          
          <div className="border-b border-slate-200 pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cyber-teal font-extrabold uppercase tracking-widest">// LEGAL DOCUMENTATION</span>
              <span className="text-xs font-mono text-slate-400">Section 42.3 Compliant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono text-slate-500">
              SECTOR SEVEN CYBER LLC • Last Updated: September 1, 2026
            </p>
          </div>

          {/* Exact Text Supplied in Section 42.3 of Specification */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
            
            <p className="font-medium text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              At Sector Seven Cyber LLC, we are committed to protecting your business and personal information. This Privacy Policy details how we collect, handle, and secure the data you share with us through our technical questionnaires, intake forms, and website interactions.
            </p>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">1</span>
                INFORMATION WE COLLECT
              </h3>
              <p>
                We collect information you voluntarily provide during onboarding calls, contact form submissions, and technical insurance mapping questionnaires. This may include your name, business email, phone number, network configurations, and company profile data.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-mono">2</span>
                DATA DELETION AND RIGHT TO ERASURE (GDPR & PRIVACY COMPLIANCE)
              </h3>
              <p>
                We respect your right to privacy and control over your data. Users and clients may request the complete deletion of their profile information and personal data at any time by sending a direct request to our support email.
              </p>
              <p>
                Upon receiving a valid erasure request, Sector Seven Cyber LLC will permanently erase, delete, or anonymize the user's data from all internal systems within thirty (30) days. This erasure timeline applies except where the retention of specific records is strictly required by applicable state or federal law, regulatory compliance, or legitimate business tax auditing purposes.
              </p>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyber-teal" />
              Private Storage & 30-Day Erasure SLA
            </span>
            <button 
              onClick={() => onNavigate('/terms')} 
              className="text-cyber-teal font-semibold hover:underline"
            >
              View Terms of Service →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
