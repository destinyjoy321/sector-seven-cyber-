import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Cloud, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { WHATS_INCLUDED_CAPABILITIES } from '../../lib/pricing';

interface ServicesProps {
  onNavigate: (path: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  return (
    <section id="services" className="py-24 md:py-32 bg-white text-slate-900 relative border-b border-slate-200">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10 text-left">
        
        {/* Core Service Language (Section 3 Requirement) */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            <span>Unified Managed Cybersecurity Service</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            CLOUD & ENDPOINT MANAGED DETECTION & RESPONSE (MDR)
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            24/7 monitoring, threat detection, investigation, and active response across supported endpoint and cloud environments through a human-led Security Operations Center.
          </p>

          <p className="text-sm text-slate-500 font-medium">
            Delivered to your business as one comprehensive managed cybersecurity service, not separate disconnected tools you have to manage yourself.
          </p>
        </div>

        {/* 2-Column Presentation: Core Operational Architecture & Included Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Architecture Display */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  Human-Led 24/7 Active Response
                </span>
                <h3 className="text-2xl font-extrabold text-white">
                  Continuous Vigilance for High-Value Practices
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike passive software tools that route unmonitored alerts into empty inboxes, Sector Seven pairs leading endpoint and cloud integrations with live human threat hunters who actively investigate and respond to incidents in real time.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Endpoint Telemetry (EDR)</span>
                  <span className="text-sky-400 font-bold">24/7 Monitored</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Cloud Identity Defense (M365/Google)</span>
                  <span className="text-sky-400 font-bold">Continuous</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Security Posture Evidence</span>
                  <span className="text-emerald-400 font-bold">Underwriting Ready</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/apply')}
                  className="w-full btn-primary bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Start Your Security Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: "What's Included" Capabilities Matrix */}
          <div className="lg:col-span-7 bg-[#F8FAFC] rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-[#0284C7] text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Included Service Capabilities</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Everything Included in Sector Seven Cyber Protection
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Zero surprise add-ons. Unified protection designed to meet strict business and cyber-insurance requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {WHATS_INCLUDED_CAPABILITIES.map((capability, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {capability}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
              <span>
                <strong>Transparent Pricing:</strong> We calculate your monthly rate exclusively on your protected computers and cloud users. No vendor markup displays, no long contracts, and no hardware appliance costs.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
