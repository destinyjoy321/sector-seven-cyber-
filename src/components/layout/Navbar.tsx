import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  ArrowRight, 
  Phone, 
  Menu, 
  X, 
  ShieldCheck, 
  Eye, 
  Cloud, 
  FileText, 
  Building2, 
  Scale, 
  Stethoscope, 
  Briefcase, 
  ShieldAlert,
  Lock
} from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'industries' | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const isAdminAuthenticated = typeof window !== 'undefined' && sessionStorage.getItem('sector_seven_admin_auth') === 'true';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollTo = (anchor: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (currentPath !== '/') {
      onNavigate('/');
      setTimeout(() => {
        const el = document.querySelector(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const servicesList = [
    {
      title: 'Cloud & Endpoint MDR',
      desc: '24/7 telemetry monitoring & active threat isolation across all company devices.',
      icon: ShieldCheck,
      anchor: '#services',
    },
    {
      title: '24/7 SOC Active Response',
      desc: 'Live human threat hunters intervening in real time when anomalies occur.',
      icon: Eye,
      anchor: '#services',
    },
    {
      title: 'Cloud Identity Defense',
      desc: 'Proactive credential monitoring & tenant protection for M365 and Google.',
      icon: Cloud,
      anchor: '#services',
    },
    {
      title: 'Posture Rating & Asset Inventory',
      desc: 'Continuous compliance evidence satisfying cyber insurance underwriting.',
      icon: FileText,
      anchor: '#services',
    },
  ];

  const industriesList = [
    {
      title: 'Law Firms & Legal Practices',
      desc: 'Protecting attorney-client privilege & Fulton County underwriting compliance.',
      icon: Scale,
      anchor: '#industries',
    },
    {
      title: 'Healthcare Clinics & Medical',
      desc: 'HIPAA-aligned active protection for clinical workstations and records.',
      icon: Stethoscope,
      anchor: '#industries',
    },
    {
      title: 'CPA Practices & Accounting',
      desc: 'Financial credential defense during tax season and regulatory audits.',
      icon: Briefcase,
      anchor: '#industries',
    },
    {
      title: 'Commercial Insurance Brokerages',
      desc: 'Cybersecurity partnership tracking and client policy readiness.',
      icon: ShieldAlert,
      anchor: '#industries',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-3.5 transition-all duration-300">
      <div 
        ref={navRef}
        className={`max-w-7xl mx-auto transition-all duration-300 ${
          mobileMenuOpen ? 'rounded-2xl' : 'rounded-full'
        } ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl py-2 px-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]' 
            : 'bg-white/90 backdrop-blur-lg py-2.5 px-6 border border-slate-200/80 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('/')}
            className="cursor-pointer group shrink-0"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links with Photoroom-Inspired Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleScrollTo('#services')}
                className={`px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors ${
                  activeDropdown === 'services' ? 'text-[#0284C7] bg-slate-50' : 'hover:text-[#0284C7]'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180 text-[#0284C7]' : 'text-slate-400'}`} />
              </button>

              {/* Glassy Services Dropdown Menu */}
              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 mt-2 w-80 p-3 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200 shadow-xl space-y-1 animate-fadeIn">
                  {servicesList.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleScrollTo(s.anchor)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 cursor-pointer transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">{s.title}</h4>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Industries Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('industries')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleScrollTo('#industries')}
                className={`px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors ${
                  activeDropdown === 'industries' ? 'text-[#0284C7] bg-slate-50' : 'hover:text-[#0284C7]'
                }`}
              >
                <span>Who We Serve</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'industries' ? 'rotate-180 text-[#0284C7]' : 'text-slate-400'}`} />
              </button>

              {/* Glassy Industries Dropdown Menu */}
              {activeDropdown === 'industries' && (
                <div className="absolute top-full left-0 mt-2 w-80 p-3 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-200 shadow-xl space-y-1 animate-fadeIn">
                  {industriesList.map((ind, idx) => {
                    const Icon = ind.icon;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleScrollTo(ind.anchor)}
                        className="p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 cursor-pointer transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">{ind.title}</h4>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{ind.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Direct Nav Items */}
            <button
              onClick={() => handleScrollTo('#problem')}
              className="px-3.5 py-2 rounded-full hover:text-[#0284C7] transition-colors"
            >
              Insurance Problem
            </button>

            <button
              onClick={() => handleScrollTo('#how-it-works')}
              className="px-3.5 py-2 rounded-full hover:text-[#0284C7] transition-colors"
            >
              How It Works
            </button>

            <button
              onClick={() => handleScrollTo('#pricing')}
              className="px-3.5 py-2 rounded-full hover:text-[#0284C7] transition-colors font-bold text-slate-900"
            >
              Pricing
            </button>

            <button
              onClick={() => handleScrollTo('#faq')}
              className="px-3.5 py-2 rounded-full hover:text-[#0284C7] transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="tel:+14703639083" 
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0284C7] px-3 py-2 rounded-full transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>(470) 363-9083</span>
            </a>

            {isAdminAuthenticated ? (
              <button
                onClick={() => onNavigate('/admin')}
                className="text-xs font-bold text-[#0284C7] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-xs"
                title="Return to Command Console"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Admin Console</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('/admin')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-full transition-colors flex items-center gap-1"
                title="Internal Administrative Portal"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Admin</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('/apply')}
              className="btn-primary bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold tracking-wide px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all duration-200 hover:scale-[1.03]"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('/apply')}
              className="bg-[#0284C7] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"
            >
              <span>Start</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2 pb-2 text-left text-sm font-semibold">
            <button onClick={() => { onNavigate('/'); setMobileMenuOpen(false); }} className="py-1 text-slate-900 text-left">
              Home
            </button>
            <button onClick={() => handleScrollTo('#services')} className="py-1 text-slate-600 hover:text-[#0284C7] text-left">
              Services (Cloud & Endpoint MDR)
            </button>
            <button onClick={() => handleScrollTo('#pricing')} className="py-1 text-slate-600 hover:text-[#0284C7] text-left">
              Pricing Plans & Comparison
            </button>
            <button onClick={() => handleScrollTo('#industries')} className="py-1 text-slate-600 hover:text-[#0284C7] text-left">
              Who We Serve
            </button>
            <button onClick={() => handleScrollTo('#how-it-works')} className="py-1 text-slate-600 hover:text-[#0284C7] text-left">
              How It Works
            </button>
            <button onClick={() => handleScrollTo('#faq')} className="py-1 text-slate-600 hover:text-[#0284C7] text-left">
              FAQ
            </button>
            <button onClick={() => { onNavigate('/admin'); setMobileMenuOpen(false); }} className={`py-1 text-left flex items-center gap-2 ${isAdminAuthenticated ? 'text-[#0284C7] font-bold' : 'text-slate-600 hover:text-[#0284C7]'}`}>
              {isAdminAuthenticated ? <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isAdminAuthenticated ? 'Return to Admin Console' : 'Admin Console'}</span>
            </button>
            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={() => { onNavigate('/apply'); setMobileMenuOpen(false); }}
                className="w-full bg-[#0284C7] text-white text-xs font-bold py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Start Security Assessment</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
