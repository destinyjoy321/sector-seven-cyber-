import React from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-32 pb-24 bg-[#050505] text-white min-h-screen relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#00D2FF]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-[#00D2FF] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0D111A]/90 rounded-3xl p-8 sm:p-12 shadow-vault-card border border-[#5A6B7C]/30 space-y-8 backdrop-blur-xl"
        >
          
          <div className="border-b border-[#5A6B7C]/30 pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#00D2FF] font-extrabold uppercase tracking-widest">// LEGAL DOCUMENTATION</span>
              <span className="text-xs font-mono text-slate-400">Section 23 & 24 Compliant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs font-mono text-slate-400">
              SECTOR SEVEN CYBER LLC • Last Updated: September 1, 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-6">
            
            <p className="font-medium text-white bg-[#050505] p-4 rounded-2xl border border-[#5A6B7C]/30">
              At Sector Seven Cyber LLC, we are committed to protecting your business and personal information. This Privacy Policy details how we collect, handle, store, and retain the data you share with us through our technical questionnaires, intake forms, and website interactions.
            </p>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#050505] border border-[#00D2FF]/50 text-[#00D2FF] text-xs flex items-center justify-center font-mono">1</span>
                INFORMATION WE COLLECT
              </h3>
              <p>
                We collect information you voluntarily provide during onboarding inquiries, contact form submissions, and technical insurance mapping questionnaires. This may include contact names, business email addresses, direct phone numbers, industry sector, employee headcount, insurance carrier status, and technical infrastructure details.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#050505] border border-[#00D2FF]/50 text-[#00D2FF] text-xs flex items-center justify-center font-mono">2</span>
                FILE UPLOAD & PRIVATE STORAGE DISCLOSURE
              </h3>
              <p>
                Uploaded cyber insurance questionnaires and test sheets are stored exclusively in private, 256-bit encrypted storage buckets. Permanent public access URLs are never created. Authorized personnel access uploaded documents solely through short-lived signed URLs with 15-minute expiration windows.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#050505] border border-[#00D2FF]/50 text-[#00D2FF] text-xs flex items-center justify-center font-mono">3</span>
                DATA RETENTION & AUTOMATED DELETION POLICY (SECTION 23)
              </h3>
              <p>
                Sector Seven Cyber LLC enforces a structured data retention lifecycle for all uploaded questionnaires:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs font-mono text-slate-400">
                <li>Application Received ➔ Private Questionnaire Storage</li>
                <li>Business Review & Underwriter Risk Audit</li>
                <li>Client Acquisition / Engagement Decision</li>
                <li>Retention Period (30-Day Expiry) ➔ Automated Permanent Purge</li>
              </ul>
              <p className="mt-2">
                Questionnaires and associated intake records are scheduled for automated deletion following the expiration of the retention window, unless ongoing client engagement requires active policy compliance recordkeeping.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#050505] border border-[#00D2FF]/50 text-[#00D2FF] text-xs flex items-center justify-center font-mono">4</span>
                COOKIE & TRACKING DISCLOSURE
              </h3>
              <p>
                Our platform utilizes essential cookies and local storage tokens strictly required for routing state, CSRF prevention, and secure form processing. We do not use third-party tracking cookies or sell prospect data to external advertising networks.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#050505] border border-[#00D2FF]/50 text-[#00D2FF] text-xs flex items-center justify-center font-mono">5</span>
                DATA SUBJECT ERASURE REQUESTS & RIGHT TO ERASURE (SECTION 42.6)
              </h3>
              <p>
                Clients and prospects may request immediate deletion or anonymization of their personal data or uploaded questionnaires prior to automated retention expiry by emailing <a href="mailto:privacy@sectorsevencyber.com" className="text-[#00D2FF] font-semibold hover:underline">privacy@sectorsevencyber.com</a>.
              </p>
              <div className="bg-[#050505] p-4 rounded-2xl border border-[#5A6B7C]/30 text-xs space-y-2">
                <h4 className="font-mono font-bold text-[#00D2FF] uppercase tracking-wider">// Logged 7-Step Erasure Workflow (Target: &lt; 30 Days)</h4>
                <ol className="list-decimal pl-5 space-y-1 text-slate-300 font-mono">
                  <li><strong>Request Received:</strong> Intake via designated privacy channel.</li>
                  <li><strong>Identity Verification:</strong> Staff verifies requester identity & record ownership.</li>
                  <li><strong>Data Discovery:</strong> Staff locates matching application rows, private storage files, and email notification logs.</li>
                  <li><strong>Legal Hold Check:</strong> Verification that no active litigation or tax hold applies.</li>
                  <li><strong>Execution:</strong> Permanent deletion of private bucket files & database row anonymization.</li>
                  <li><strong>Audit Logging:</strong> Fact and scope of deletion logged in `erasure_requests` table (without retaining deleted PII).</li>
                  <li><strong>Confirmation:</strong> Completion dispatch sent to requester within 30 days of receipt.</li>
                </ol>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-[#5A6B7C]/30 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#00D2FF]" />
              Private Storage & 30-Day Automated Deletion Policy
            </span>
            <button 
              onClick={() => onNavigate('/terms')} 
              className="text-[#00D2FF] font-semibold hover:underline"
            >
              View Terms of Service →
            </button>
          </div>

        </motion.div>

      </div>
    </div>
  );
};
