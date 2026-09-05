import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Phone, Lock, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Insurance Problem', href: '#problem' },
    { label: 'Services', href: '#services' },
    { label: 'Who We Serve', href: '#industries' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (currentPath !== '/') {
      onNavigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300">
      <div className={`max-w-7xl mx-auto rounded-full transition-all duration-300 ${
        scrolled 
          ? 'glass-pill py-2.5 px-6 border border-slate-200/90 shadow-pill' 
          : 'bg-white/95 backdrop-blur-md py-3 px-6 border border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          
          {/* Prominent Official Sector Seven Cyber Logo & Full Brand Name */}
          <div 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src="/logo.jpg" 
              alt="Sector Seven Cyber LLC Official Logo" 
              className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <div className="hidden sm:block text-left">
              <div className="font-black text-slate-900 tracking-tight text-lg sm:text-xl leading-none">
                SECTOR SEVEN
              </div>
              <div className="font-extrabold text-brand-blue tracking-widest text-xs uppercase mt-0.5">
                CYBER LLC
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
            <button
              onClick={() => onNavigate('/')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                currentPath === '/' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-brand-blue transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="tel:+14048923400" 
              className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brand-blue" />
              <span>(404) 892-3400</span>
            </a>

            <button
              onClick={() => onNavigate('/admin')}
              className="text-slate-400 hover:text-slate-900 p-2 rounded-full hover:bg-slate-100 transition-colors"
              title="Staff Portal Access"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/apply')}
              className="magnetic-btn relative overflow-hidden bg-slate-900 text-white hover:bg-brand-blue text-xs font-extrabold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-all duration-300"
            >
              <span>Submit Assessment</span>
              <ArrowUpRight className="w-4 h-4 text-brand-amber" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('/apply')}
              className="bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-full flex items-center gap-1"
            >
              <span>Apply</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-brand-amber" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-slate-200 flex flex-col gap-3 pb-2 animate-fadeIn">
            <button
              onClick={() => { onNavigate('/'); setMobileMenuOpen(false); }}
              className="text-left py-1.5 text-sm font-semibold text-slate-900"
            >
              Home Page
            </button>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="py-1 text-sm text-slate-600 hover:text-brand-blue"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => { onNavigate('/apply'); setMobileMenuOpen(false); }}
                className="w-full bg-slate-900 text-white text-xs font-bold py-2.5 rounded-full flex items-center justify-center gap-2"
              >
                <span>Upload Questionnaire & Apply</span>
                <ArrowUpRight className="w-4 h-4 text-brand-amber" />
              </button>
              <button
                onClick={() => { onNavigate('/admin'); setMobileMenuOpen(false); }}
                className="w-full text-xs font-mono text-slate-500 py-2 flex items-center justify-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Staff Portal (/admin)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
