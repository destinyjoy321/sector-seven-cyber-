import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white text-slate-900 border-t border-slate-200 relative overflow-hidden font-sans">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20 space-y-16">
        
        {/* Massive Oversized Secure Communication Gateway Banner */}
        <div className="border-b border-slate-200 pb-12 text-left space-y-3">
          <div className="inline-flex items-center gap-2 text-[#0284C7] font-mono text-xs font-bold uppercase tracking-widest bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>SECURE COMMUNICATION GATEWAY</span>
          </div>

          <div>
            <a 
              href="mailto:contact@sectorsevencyber.com" 
              className="group relative inline-block text-[clamp(1.5rem,4.5vw,3.75rem)] font-extrabold text-slate-900 tracking-tighter hover:text-[#0284C7] transition-colors duration-300"
            >
              <span>contact@sectorsevencyber.com</span>
              {/* Electric Cyan Underline Animation */}
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00D2FF] origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </a>
          </div>
        </div>

        {/* Rigid Grid Layout (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-slate-200 pb-12 text-left">
          
          {/* Column 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" />
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
              Sector Seven Cyber LLC builds and operates continuously managed cybersecurity environments for Georgia law firms, medical clinics, and high-liability enterprises.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-[#0284C7] text-[11px] font-mono font-bold px-3 py-1 rounded-full border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-ping" />
                Atlanta, Georgia Jurisdiction (Fulton County)
              </span>
            </div>
          </div>

          {/* Column 2: Core Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold text-[#0284C7] uppercase tracking-widest">// Core Practices</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><a href="#services" className="hover:text-[#0284C7] transition-colors">Carrier Audit & Alignment</a></li>
              <li><a href="#services" className="hover:text-[#0284C7] transition-colors">MFA & Hardware Backup Setup</a></li>
              <li><a href="#services" className="hover:text-[#0284C7] transition-colors">EDR & Endpoint Protection</a></li>
              <li><a href="#services" className="hover:text-[#0284C7] transition-colors">Continuous Compliance Monitoring</a></li>
              <li><a href="#services" className="hover:text-[#0284C7] transition-colors">Georgia Breach Law Alignment</a></li>
            </ul>
          </div>

          {/* Column 3: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-xs font-bold text-[#0284C7] uppercase tracking-widest">// Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-[#0284C7] transition-colors text-left">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/apply')} className="hover:text-[#0284C7] transition-colors text-left font-bold text-slate-900 flex items-center gap-1">
                  Intake Application <ArrowUpRight className="w-3 h-3 text-[#0284C7]" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-[#0284C7] transition-colors text-left">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-[#0284C7] transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Direct (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold text-[#0284C7] uppercase tracking-widest">// Direct Contact</h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                <span>Atlanta, Georgia 30309</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                <a href="tel:+14048923400" className="hover:text-[#0284C7] transition-colors font-bold text-slate-900">+1 (404) 892-3400</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                <a href="mailto:contact@sectorsevencyber.com" className="hover:text-[#0284C7] transition-colors font-bold text-slate-900">contact@sectorsevencyber.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Architectural Copyright & Legal Links Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Bottom Left: Monospace Copyright */}
          <p className="font-mono text-xs text-slate-500 font-normal text-left">
            © 2026 Sector Seven Cyber LLC. All rights reserved. Atlanta, Georgia.
          </p>

          {/* Bottom Right: Mandatory Legal Links */}
          <div className="flex items-center gap-6 font-mono text-xs text-slate-600">
            <button 
              onClick={() => onNavigate('/privacy')} 
              className="hover:text-[#0284C7] transition-colors focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded px-1"
            >
              Privacy Policy
            </button>
            <span className="text-slate-300">•</span>
            <button 
              onClick={() => onNavigate('/terms')} 
              className="hover:text-[#0284C7] transition-colors focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded px-1"
            >
              Terms of Service
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
