import React from 'react';
import { ArrowUpRight, FileText, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onNavigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-slate-900 border-b border-slate-200 text-white min-h-[90vh] flex flex-col justify-center">
      
      {/* High-Resolution Executive Office Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-65 mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('/hero_bg.jpg')` }}
      ></div>

      {/* Ambient Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-950/70"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950"></div>
      
      {/* Sapphire Glow */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-brand-blue/20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Main Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Top Pill Badge with Full Company Name */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-mono shadow-sm border border-white/20">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-amber animate-pulse"></span>
              <span className="font-extrabold text-brand-amber uppercase tracking-wider">SECTOR SEVEN CYBER LLC</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-200 font-semibold">Georgia Cyber Readiness</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Reliable Cyber Defense <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-brand-blue-light to-brand-blue bg-clip-text text-transparent">
                When It Matters Most.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl">
              <strong className="text-white font-bold">Sector Seven Cyber LLC</strong> turns strict carrier questionnaires into guaranteed policy approvals for Georgia law firms and medical clinics with verified MFA, EDR, and immutable backup remediation.
            </p>

            {/* Main CTAs strictly directing to /apply */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onNavigate('/apply')}
                className="magnetic-btn bg-brand-blue hover:bg-blue-600 text-white font-extrabold text-sm px-8 py-4 rounded-full shadow-blue-glow flex items-center justify-center gap-2 transition-all duration-300 group"
              >
                <span>Upload Cyber Questionnaire & Apply</span>
                <ArrowUpRight className="w-4 h-4 text-brand-amber group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/apply')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm px-7 py-4 rounded-full border border-white/20 shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-brand-blue-light" />
                <span>Start Lead Intake Form</span>
              </button>
            </div>

            {/* Avatar Stack & Social Proof */}
            <div className="pt-4 flex items-center gap-4 border-t border-white/15 max-w-lg">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Georgia Client" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Georgia Client" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" alt="Georgia Client" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1 text-brand-amber font-bold">
                  ★★★★★ <span className="text-white font-mono font-semibold ml-1">4.9/5.0</span>
                </div>
                <p className="text-slate-300 font-medium">Trusted by 150+ Georgia Practices & Law Firms</p>
              </div>
            </div>

          </div>

          {/* Right Column: Wide Rectangular 3D Rotating Video Container (White Background Eliminated) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
            
            {/* Wide Rectangular Video Card Frame */}
            <div className="relative w-full aspect-video h-72 sm:h-96 md:h-[400px] rounded-3xl overflow-hidden bg-white/95 backdrop-blur-md shadow-2xl border border-white/30 flex items-center justify-center p-3 group">
              
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover mix-blend-multiply scale-105 transition-transform duration-700 group-hover:scale-110"
              >
                <source src="/mobius_loop.mp4" type="video/mp4" />
              </video>

              {/* Dynamic 95% Carrier Audit Progress Bar Indicator */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-left space-y-2 shadow-xl">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> Sector Seven Cyber Carrier Compliance
                  </span>
                  <span className="text-brand-emerald font-extrabold text-sm">95%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-blue via-brand-blue-light to-brand-emerald h-full w-[95%] rounded-full shadow-blue-glow animate-pulse"></div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
