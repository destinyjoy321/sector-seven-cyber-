import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50/70 text-slate-700 min-h-screen py-24 sm:py-32 font-sans selection:bg-[#0284C7] selection:text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-[#0284C7] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#0284C7]" />
          <span>Back to Home</span>
        </button>

        {/* Premium Legal Document Container */}
        <div className="bg-white rounded-2xl p-8 sm:p-14 border border-slate-200/90 shadow-sm space-y-10">
          
          {/* Header Section */}
          <div className="border-b border-slate-200/80 pb-8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#0284C7] font-bold uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                // LEGAL DOCUMENTATION
              </span>
              <span className="text-xs font-mono text-slate-400">Section 23 & 24 Compliant</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight pt-2">
              Privacy Policy
            </h1>
            
            <div className="text-sm uppercase tracking-widest text-slate-500 mb-12 font-mono font-medium pt-1">
              SECTOR SEVEN CYBER LLC • Last Updated: September 1, 2026
            </div>
          </div>

          {/* Legal Body Content */}
          <div className="space-y-8 text-slate-700 text-base leading-relaxed">
            
            <p className="font-medium text-slate-800 bg-slate-50 p-6 rounded-xl border border-slate-200/80 leading-relaxed">
              At Sector Seven Cyber LLC, we are committed to protecting your business and personal information. This Privacy Policy details how we collect, handle, store, and retain the data you share with us through our technical questionnaires, intake forms, and website interactions.
            </p>

            <div className="space-y-3 pt-2">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7] text-xs flex items-center justify-center font-mono font-bold shrink-0">1</span>
                <span>INFORMATION WE COLLECT</span>
              </h2>
              <p className="leading-relaxed text-slate-700">
                We collect information you voluntarily provide during onboarding inquiries, contact form submissions, and technical insurance mapping questionnaires. This may include contact names, business email addresses, direct phone numbers, industry sector, employee headcount, insurance carrier status, and technical infrastructure details.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7] text-xs flex items-center justify-center font-mono font-bold shrink-0">2</span>
                <span>FILE UPLOAD & PRIVATE STORAGE DISCLOSURE</span>
              </h2>
              <p className="leading-relaxed text-slate-700">
                Uploaded cyber insurance questionnaires and test sheets are stored exclusively in private, 256-bit encrypted storage buckets. Permanent public access URLs are never created. Authorized personnel access uploaded documents solely through short-lived signed URLs with 15-minute expiration windows.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7] text-xs flex items-center justify-center font-mono font-bold shrink-0">3</span>
                <span>DATA RETENTION & AUTOMATED DELETION POLICY (SECTION 23)</span>
              </h2>
              <p className="leading-relaxed text-slate-700">
                Sector Seven Cyber LLC enforces a structured data retention lifecycle for all uploaded questionnaires:
              </p>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 font-mono text-xs text-slate-600 space-y-2 my-4">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Application Received ➔ Private Questionnaire Storage</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Business Review & Underwriter Risk Audit</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Client Acquisition / Engagement Decision</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Retention Period (30-Day Expiry) ➔ Automated Permanent Purge</span>
                </div>
              </div>
              <p className="leading-relaxed text-slate-700 mt-2">
                Questionnaires and associated intake records are scheduled for automated deletion following the expiration of the retention window, unless ongoing client engagement requires active policy compliance recordkeeping.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7] text-xs flex items-center justify-center font-mono font-bold shrink-0">4</span>
                <span>COOKIE & TRACKING DISCLOSURE</span>
              </h2>
              <p className="leading-relaxed text-slate-700">
                Our platform utilizes essential cookies and local storage tokens strictly required for routing state, CSRF prevention, and secure form processing. We do not use third-party tracking cookies or sell prospect data to external advertising networks.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight mb-6 flex items-center gap-3 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 text-[#0284C7] text-xs flex items-center justify-center font-mono font-bold shrink-0">5</span>
                <span>DATA SUBJECT ERASURE REQUESTS & RIGHT TO ERASURE (SECTION 42.6)</span>
              </h2>
              <p className="leading-relaxed text-slate-700">
                Clients and prospects may request immediate deletion or anonymization of their personal data or uploaded questionnaires prior to automated retention expiry by emailing <a href="mailto:privacy@sectorsevencyber.com" className="text-[#0284C7] font-semibold hover:underline">privacy@sectorsevencyber.com</a>.
              </p>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/80 text-xs space-y-3 mt-4">
                <h3 className="font-mono font-bold text-[#0284C7] uppercase tracking-wider text-xs">
                  // Logged 7-Step Erasure Workflow (Target: &lt; 30 Days)
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-slate-700 leading-relaxed font-sans text-xs">
                  <li><strong>Request Received:</strong> Intake via designated privacy channel.</li>
                  <li><strong>Identity Verification:</strong> Staff verifies requester identity & record ownership.</li>
                  <li><strong>Data Discovery:</strong> Staff locates matching application rows, private storage files, and email notification logs.</li>
                  <li><strong>Legal Hold Check:</strong> Verification that no active litigation or tax hold applies.</li>
                  <li><strong>Execution:</strong> Permanent deletion of private bucket files & database row anonymization.</li>
                  <li><strong>Audit Logging:</strong> Fact and scope of deletion logged in <code className="bg-slate-200/80 px-1.5 py-0.5 rounded font-mono text-[11px] text-slate-800">erasure_requests</code> table (without retaining deleted PII).</li>
                  <li><strong>Confirmation:</strong> Completion dispatch sent to requester within 30 days of receipt.</li>
                </ol>
              </div>
            </div>

          </div>

          {/* Document Footer Bar */}
          <div className="pt-8 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#0284C7]" />
              Private Storage & 30-Day Automated Deletion Policy
            </span>
            <button 
              onClick={() => onNavigate('/terms')} 
              className="text-[#0284C7] font-bold hover:underline"
            >
              View Terms of Service →
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
