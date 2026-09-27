import React from 'react';
import { ProspectApplication } from '../../types';
import { ShieldCheck, Printer, X, Shield } from 'lucide-react';

interface CoverageCertificateProps {
  app: ProspectApplication;
  onClose?: () => void;
  isModal?: boolean;
}

export const CoverageCertificate: React.FC<CoverageCertificateProps> = ({ app, onClose, isModal = false }) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = app.paid_at 
    ? new Date(app.paid_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

  const certificateId = app.id || 'SS-2026-CERT';
  const devicesCount = app.device_count || 1;
  const cloudUsersCount = app.cloud_user_count !== undefined ? app.cloud_user_count : 0;
  const monthlyRate = app.calculated_monthly_price || 500;

  // The core printable certificate layout
  const certificateContent = (
    <div className="certificate-document bg-white text-slate-900 w-full max-w-[780px] mx-auto p-6 sm:p-8 border-2 border-slate-900 rounded-none relative overflow-hidden shadow-2xl print:shadow-none print:border-2 print:p-6 print:max-w-none print:w-full">
      
      {/* Precision Inner Inset Security Border */}
      <div className="border border-slate-300 p-5 sm:p-7 relative">
        
        {/* Corner Security Marks */}
        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-slate-900" />
        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-slate-900" />
        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-slate-900" />
        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-slate-900" />

        {/* TOP HEADER: Company Identification & Certificate Meta */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center shrink-0 border border-slate-700">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                Official Evidence of Coverage
              </span>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                Sector Seven Cyber LLC
              </h1>
              <p className="text-[11px] text-slate-600 font-medium">
                Cloud & Endpoint Managed Detection & Response (MDR)
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-[10px] space-y-0.5 shrink-0">
            <div className="text-slate-500">
              Certificate Ref: <strong className="text-slate-900 font-bold">{certificateId}</strong>
            </div>
            <div className="text-slate-500">
              Issue Date: <span className="text-slate-800 font-medium">{formattedDate}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>ACTIVE & VERIFIED</span>
            </div>
          </div>
        </div>

        {/* DOCUMENT TITLE */}
        <div className="text-center my-4 space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
            Certificate of Cyber Protection Coverage
          </h2>
          <p className="text-[11px] text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
            Verifiable evidence of continuous Managed Detection & Response (MDR) for commercial cyber insurance underwriting, regulatory audits, and enterprise risk management.
          </p>
        </div>

        {/* CERTIFIED ENTITY (ISSUED TO) */}
        <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200/90 mb-4">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#0284C7] font-mono block mb-1">
            Certified Organization
          </span>
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {app.company_name}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Authorized Executive: <strong className="text-slate-800">{app.contact_name}</strong> {app.contact_title ? `— ${app.contact_title}` : ''}
              </p>
            </div>
            <div className="text-xs font-medium text-slate-600 text-right shrink-0">
              <span className="block text-[9px] uppercase text-slate-400 font-mono">Industry Classification</span>
              <span className="font-semibold text-slate-800">{app.industry}</span>
            </div>
          </div>
        </div>

        {/* OPERATIONAL TELEMETRY & SPECIFICATION MATRIX */}
        <div className="mb-4">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono block mb-1.5">
            Coverage Scope & Operational Telemetry
          </span>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            
            <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
              <span className="text-[9px] text-slate-500 block font-mono">Primary Service Plan</span>
              <span className="font-bold text-slate-900 text-xs">Sector Seven Cyber Protection</span>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Cloud & Endpoint Managed Detection & Response (MDR)
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
              <span className="text-[9px] text-slate-500 block font-mono">Security Operations Center</span>
              <span className="font-bold text-emerald-700 text-xs">24/7 Human-Led Active Response</span>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Continuous threat detection, investigation & host containment
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
              <span className="text-[9px] text-slate-500 block font-mono">Protected Endpoints</span>
              <span className="font-bold text-slate-900 text-xs">{devicesCount} Workstations & Laptops</span>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Windows Defender & Microsoft Defender for Endpoint Management
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
              <span className="text-[9px] text-slate-500 block font-mono">Protected Cloud Identities</span>
              <span className="font-bold text-slate-900 text-xs">{cloudUsersCount} M365 / Google Workspace Accounts</span>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Cloud identity detection, anomaly alerts & privilege auditing
              </p>
            </div>

          </div>
        </div>

        {/* UNDERWRITING & AUDIT ATTESTATION STATEMENT */}
        <div className="border-t border-b border-slate-200 py-3 my-3 text-[10.5px] text-slate-700 leading-relaxed">
          <p>
            <strong>Underwriting Attestation:</strong> This document certifies that the organization named above is enrolled in Sector Seven Cyber LLC's continuous Managed Detection & Response service. Coverage includes 24/7 Security Operations Center (SOC) surveillance, active threat neutralization, endpoint sensor telemetry, and cloud tenant audit logging. This certificate serves as verifiable evidence of operational cybersecurity controls for insurance carriers, commercial brokers, and regulatory auditors.
          </p>
        </div>

        {/* BOTTOM VALIDATION, DIGITAL SEAL & SIGNATURE */}
        <div className="flex items-center justify-between gap-6 pt-2">
          
          {/* Authentic Corporate Seal */}
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full border-2 border-slate-900 p-0.5 flex items-center justify-center relative shrink-0">
              <div className="w-full h-full rounded-full border border-dashed border-slate-400 flex flex-col items-center justify-center text-center p-1 bg-slate-50">
                <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                <span className="text-[6.5px] font-mono font-bold tracking-tighter text-slate-800 leading-none mt-0.5">
                  SECTOR SEVEN
                </span>
                <span className="text-[5.5px] font-mono text-slate-500 leading-none">
                  ATLANTA, GA
                </span>
              </div>
            </div>
            <div className="text-[9.5px] font-mono text-slate-500 space-y-0.5">
              <div className="text-slate-800 font-bold">State of Georgia Jurisdiction</div>
              <div>Fulton County Corporate Registry</div>
              <div className="text-[#0284C7] font-semibold">sectorsevencyber.com/verify</div>
            </div>
          </div>

          {/* Official Signature Block */}
          <div className="text-right shrink-0">
            <div className="font-serif italic text-lg font-bold text-slate-900 tracking-wide border-b border-slate-400 pb-0.5 px-3 inline-block">
              Destiny Joy Sagay
            </div>
            <div className="text-[11px] font-bold text-slate-900 mt-0.5">Destiny Joy Sagay</div>
            <div className="text-[9.5px] text-slate-500 font-medium">Founder & Managing Principal</div>
            <div className="text-[8.5px] text-[#0284C7] font-mono uppercase font-semibold">Sector Seven Cyber LLC</div>
          </div>

        </div>

        {/* REGULATORY NOTICE FOOTER */}
        <div className="mt-3 pt-2 border-t border-slate-100 text-[8.5px] text-slate-400 text-center leading-tight">
          Pricing and service provisioning are based on certified assessment quantities and governed by the Sector Seven Cyber LLC Service Agreement. Recurring monthly subscription: ${monthlyRate}/month. Valid for active subscription periods.
        </div>

      </div>

    </div>
  );

  // If rendered inside the interactive preview modal
  if (isModal) {
    return (
      <div className="certificate-modal-backdrop fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center no-print print:hidden">
        
        {/* Interactive Modal Frame */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
          
          {/* Modal Top Control Bar (Hidden on Print) */}
          <div className="no-print p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#0284C7] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Official Certificate of Cyber Protection Coverage
                </h3>
                <p className="text-[11px] text-slate-400">
                  Formatted for formal 8.5" x 11" Letter printing and cyber insurance underwriter submission
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="btn-primary bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Preview Area on Screen */}
          <div className="p-4 sm:p-8 overflow-y-auto bg-slate-900/60 flex items-center justify-center">
            {certificateContent}
          </div>

        </div>

      </div>
    );
  }

  // Standalone view (for dedicated print root)
  return certificateContent;
};
