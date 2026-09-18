import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Phone, Menu, X } from 'lucide-react';
import { Logo } from './Logo';

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
      <div className={`max-w-7xl mx-auto transition-all duration-300 ${
        mobileMenuOpen ? 'rounded-2xl' : 'rounded-full'
      } ${
        scrolled 
          ? 'glass-pill py-2.5 px-6 border border-slate-200/90 shadow-pill' 
          : 'bg-white/95 backdrop-blur-md py-3 px-6 border border-slate-200/80 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          
          {/* Official Sector Seven Cyber Logo & Brand Name */}
          <div 
            onClick={() => onNavigate('/')}
            className="cursor-pointer group"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/90">
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
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#0284C7] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="tel:+14603639083" 
              className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 hover:text-[#0284C7] px-3 py-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>(460) 363-9083</span>
            </a>

            <button
              onClick={() => onNavigate('/apply')}
              className="btn-primary relative overflow-hidden bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-mono font-bold tracking-wider px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all duration-200 hover:scale-[1.03]"
            >
              <span>START YOUR SECURITY ASSESSMENT</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('/apply')}
              className="bg-[#0284C7] text-white text-xs font-bold px-3.5 py-2 rounded-full flex items-center gap-1 shadow-sm"
            >
              <span>Assess</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
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
          <div className="sm:hidden mt-4 pt-4 border-t border-slate-200 flex flex-col gap-3 pb-2 animate-fadeIn text-left">
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
                className="py-1 text-sm text-slate-600 hover:text-[#0284C7]"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <button
                onClick={() => { onNavigate('/apply'); setMobileMenuOpen(false); }}
                className="w-full bg-[#0284C7] text-white text-xs font-bold py-2.5 rounded-full flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Start Your Security Assessment</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
