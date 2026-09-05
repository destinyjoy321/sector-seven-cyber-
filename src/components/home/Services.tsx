import React from 'react';
import { ShieldCheck, Lock, HardDrive, Cpu, FileCheck, ArrowUpRight } from 'lucide-react';

interface ServicesProps {
  onNavigate: (path: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const services = [
    {
      title: 'Carrier Questionnaire & Policy Audit',
      badge: 'Step 1: Intake Audit',
      desc: 'We review your cyber insurance application form line-by-line, verifying your technical setup against underwriter requirements (Chubb, Travelers, Coalition, CNA) to identify disqualifying policy gaps before submission.',
      icon: FileCheck,
    },
    {
      title: 'MFA & Hardware Security Key Enforcement',
      badge: 'Control #1: Authentication',
      desc: 'Deploy turn-key Multi-Factor Authentication (YubiKey, FIDO2, Duo) across Microsoft 365, Google Workspace, legacy RDP servers, and remote VPN gateways with zero downtime for practice staff.',
      icon: Lock,
    },
    {
      title: 'Managed EDR & 24/7 Threat Hunting',
      badge: 'Control #2: Endpoint Telemetry',
      desc: 'Deploy enterprise-grade Endpoint Detection & Response (EDR) agents backed by a 24/7 Security Operations Center (SOC) to stop ransomware execution, lateral movement, and privilege escalation.',
      icon: Cpu,
    },
    {
      title: 'Immutable Ransomware Backups',
      badge: 'Control #3: Data Resilience',
      desc: 'Architect air-gapped, write-once-read-many (WORM) cloud & local backup storage, guaranteeing data restoration even in the event of domain-wide administrative compromise.',
      icon: HardDrive,
    },
  ];

  return (
    <section id="services" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
              <span>CORE SPECIALIST CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              All-In-One Cyber Defense Designed <br />
              <span className="text-brand-blue">To Qualify, Protect & Remediate</span>
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/apply')}
            className="magnetic-btn shrink-0 bg-slate-900 hover:bg-brand-blue text-white font-extrabold text-xs sm:text-sm px-7 py-4 rounded-full flex items-center gap-2 shadow-md transition-colors"
          >
            <span>Request Service Proposal</span>
            <ArrowUpRight className="w-4 h-4 text-brand-amber" />
          </button>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-apple hover:shadow-apple-hover hover:border-brand-blue/50 transition-all duration-300 space-y-4 text-left group tech-bracket relative"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:bg-brand-blue transition-colors">
                    <Icon className="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full border border-brand-blue/20">
                    {s.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-mono font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                  <span>Learn Technical Implementation</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
