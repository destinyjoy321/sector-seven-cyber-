import React, { useState } from 'react';
import { Calculator, AlertCircle, ArrowUpRight, Check, X } from 'lucide-react';
import { RiskCalculatorInput } from '../../types';
import { motion } from 'framer-motion';

interface CalculatorProps {
  onNavigate: (path: string) => void;
}

export const InteractiveCalculator: React.FC<CalculatorProps> = ({ onNavigate }) => {
  const [inputs, setInputs] = useState<RiskCalculatorInput>({
    mfaEnabled: false,
    immutableBackups: true,
    edrDeployed: false,
    securityTraining: true,
    employeeCount: 25,
  });

  const toggleOption = (key: keyof Omit<RiskCalculatorInput, 'employeeCount'>) => {
    setInputs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const score = (
    (inputs.mfaEnabled ? 30 : 0) +
    (inputs.immutableBackups ? 25 : 0) +
    (inputs.edrDeployed ? 30 : 0) +
    (inputs.securityTraining ? 15 : 0)
  );

  const getRiskStatus = (score: number) => {
    if (score >= 85) return { level: 'LOW RISK', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', penalty: '0% (Standard Premium Rate)' };
    if (score >= 60) return { level: 'MODERATE GAP', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', penalty: '+25% to +40% Premium Surcharge' };
    return { level: 'HIGH CARRIER DENIAL RISK', color: 'text-red-700', bg: 'bg-red-50 border-red-200', penalty: 'High Risk of Non-Renewal or Coverage Void' };
  };

  const status = getRiskStatus(score);

  return (
    <section id="calculator" className="py-28 bg-[#F8FAFC] text-slate-900 border-b border-slate-200 relative">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-sky-100/50 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
            <Calculator className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>INTERACTIVE COMPLIANCE AUDITOR</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-slate-900 tracking-tighter">
            Cyber Insurance Readiness Calculator
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Self-assess your practice's technical controls to see how top insurance carriers view your policy application.
          </p>
        </div>

        {/* Calculator Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Left Column: Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-soft-card border border-slate-200 space-y-6"
          >
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center">1</span>
              Select Your Current Infrastructure Controls:
            </h3>

            <div className="space-y-4">
              
              {/* Question 1: MFA */}
              <div 
                onClick={() => toggleOption('mfaEnabled')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  inputs.mfaEnabled 
                    ? 'bg-sky-50 border-[#0284C7] text-slate-900 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Hardware / App-Based MFA across ALL Email & VPNs</span>
                    <span className="text-[10px] font-mono bg-sky-100 text-[#0284C7] px-2 py-0.5 rounded font-bold">+30 Pts</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Enforced multi-factor authentication for remote access, webmail, and admin portals.</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  inputs.mfaEnabled ? 'bg-[#0284C7] text-white' : 'border border-slate-300'
                }`}>
                  {inputs.mfaEnabled ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </div>

              {/* Question 2: EDR */}
              <div 
                onClick={() => toggleOption('edrDeployed')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  inputs.edrDeployed 
                    ? 'bg-sky-50 border-[#0284C7] text-slate-900 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Managed Endpoint Detection & Response (EDR)</span>
                    <span className="text-[10px] font-mono bg-sky-100 text-[#0284C7] px-2 py-0.5 rounded font-bold">+30 Pts</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">24/7 SOC telemetry agents (e.g. CrowdStrike, SentinelOne) installed on laptops & servers.</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  inputs.edrDeployed ? 'bg-[#0284C7] text-white' : 'border border-slate-300'
                }`}>
                  {inputs.edrDeployed ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </div>

              {/* Question 3: Immutable Backups */}
              <div 
                onClick={() => toggleOption('immutableBackups')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  inputs.immutableBackups 
                    ? 'bg-sky-50 border-[#0284C7] text-slate-900 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Immutable Offline / Air-Gapped Ransomware Backups</span>
                    <span className="text-[10px] font-mono bg-sky-100 text-[#0284C7] px-2 py-0.5 rounded font-bold">+25 Pts</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Encrypted backups protected against deletion or overwrite even if domain admin is breached.</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  inputs.immutableBackups ? 'bg-[#0284C7] text-white' : 'border border-slate-300'
                }`}>
                  {inputs.immutableBackups ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </div>

              {/* Question 4: Security Training */}
              <div 
                onClick={() => toggleOption('securityTraining')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  inputs.securityTraining 
                    ? 'bg-sky-50 border-[#0284C7] text-slate-900 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Quarterly Phishing Simulations & Staff Awareness</span>
                    <span className="text-[10px] font-mono bg-sky-100 text-[#0284C7] px-2 py-0.5 rounded font-bold">+15 Pts</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Documented employee security awareness training logs for underwriters.</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  inputs.securityTraining ? 'bg-[#0284C7] text-white' : 'border border-slate-300'
                }`}>
                  {inputs.securityTraining ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </div>

            </div>

          </motion.div>

          {/* Right Column: Calculated Score HUD Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border border-slate-800 space-y-6 text-left relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="font-mono text-xs text-sky-400 uppercase font-bold">Score Diagnosis</span>
                <span className="text-[10px] font-mono text-slate-400">Carrier Audit Standard</span>
              </div>

              {/* Gauge Meter */}
              <div className="text-center space-y-2 py-2">
                <div className="text-5xl font-extrabold font-mono text-white tracking-tight">
                  {score}<span className="text-2xl text-slate-400">/100</span>
                </div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Calculated Readiness Score</p>
                
                {/* Score Bar */}
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mt-3">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-[#0284C7] to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              {/* Status Box */}
              <div className={`p-4 rounded-2xl border ${status.bg} space-y-1 text-left`}>
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold ${status.color}`}>{status.level}</span>
                  <AlertCircle className={`w-4 h-4 ${status.color}`} />
                </div>
                <p className="text-xs font-semibold text-slate-800">Estimated Carrier Impact:</p>
                <p className="text-xs font-mono text-slate-600">{status.penalty}</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onNavigate('/apply')}
                className="btn-primary w-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-mono font-extrabold text-xs tracking-wider py-4 px-6 rounded-full flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
              >
                <span>BOOK A SECURITY FIT CALL →</span>
              </button>

              <p className="text-[10px] text-slate-400 text-center font-mono">
                Sector Seven Cyber provides technical gap remediation & broker alignment assistance.
              </p>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
