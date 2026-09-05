import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800 relative overflow-hidden">
      {/* Background Decorative Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info with Official Sector Seven Cyber Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="Sector Seven Cyber LLC Official Logo" 
                className="h-10 w-auto object-contain bg-white/90 p-1 rounded" 
              />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Sector Seven Cyber LLC provides end-to-end technical remediation, cyber insurance alignment, and 24/7 managed defense for Georgia law firms, healthcare providers, and high-liability enterprises.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-slate-800 text-brand-blue-light text-xs font-mono px-3 py-1 rounded-full border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
                Georgia Jurisdiction (Fulton County)
              </span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="font-mono text-xs font-bold text-brand-blue-light uppercase tracking-wider mb-4">// Services</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#services" className="hover:text-brand-blue-light transition-colors">Carrier Audit & Alignment</a></li>
              <li><a href="#services" className="hover:text-brand-blue-light transition-colors">MFA & Hardware Backup Setup</a></li>
              <li><a href="#services" className="hover:text-brand-blue-light transition-colors">EDR & Endpoint Protection</a></li>
              <li><a href="#services" className="hover:text-brand-blue-light transition-colors">Continuous Compliance Monitoring</a></li>
              <li><a href="#services" className="hover:text-brand-blue-light transition-colors">Incident Response & Guarantees</a></li>
            </ul>
          </div>

          {/* Quick Links & Legal (Section 42.1 Links) */}
          <div>
            <h4 className="font-mono text-xs font-bold text-brand-blue-light uppercase tracking-wider mb-4">// Navigation</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-brand-blue-light transition-colors text-left">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/apply')} className="hover:text-brand-blue-light transition-colors text-left font-semibold text-white flex items-center gap-1">
                  Intake Application <ArrowUpRight className="w-3 h-3 text-brand-amber" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-brand-blue-light transition-colors text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-brand-blue-light transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-brand-blue-light transition-colors text-left font-mono text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-brand-blue-light" /> Staff Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className="font-mono text-xs font-bold text-brand-blue-light uppercase tracking-wider mb-4">// Direct Intake</h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-blue-light shrink-0" />
                <span>Atlanta, Georgia 30309</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-blue-light shrink-0" />
                <a href="tel:+14048923400" className="hover:text-white transition-colors">+1 (404) 892-3400</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-blue-light shrink-0" />
                <a href="mailto:intake@sectorsevencyber.com" className="hover:text-white transition-colors">intake@sectorsevencyber.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Sector Seven Cyber LLC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('/terms')} 
              className="hover:text-white transition-colors"
            >
              Terms of Service (/terms)
            </button>
            <button 
              onClick={() => onNavigate('/privacy')} 
              className="hover:text-white transition-colors"
            >
              Privacy Policy (/privacy)
            </button>
            <span className="font-mono text-[10px] text-slate-400">UUID SS-SPEC-2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
