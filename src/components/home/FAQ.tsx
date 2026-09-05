import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowUpRight } from 'lucide-react';

interface FAQProps {
  onNavigate: (path: string) => void;
}

export const FAQ: React.FC<FAQProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why are cyber insurance carriers in Georgia rejecting self-attestations?',
      a: 'Following massive increases in ransomware claims, underwriters (Travelers, Chubb, Coalition) now require technical proof of EDR logs, hardware MFA, and air-gapped backups. Simple checkboxes without technical audit trails can lead to policy cancellation or claim denial.',
    },
    {
      q: 'What document formats do you accept for the questionnaire upload?',
      a: 'Our secure intake system accepts PDF (.pdf), Word (.doc, .docx), and Excel (.xls, .xlsx) files up to 50MB. All uploaded questionnaires are encrypted and stored in a private Supabase bucket with restricted 15-minute signed access URLs.',
    },
    {
      q: 'How fast can Sector Seven Cyber remediate our infrastructure gaps?',
      a: 'Our initial gap audit is completed within 24 hours. Full technical remediation (MFA, EDR agent installation, immutable backup configuration) is typically completed within 48 to 72 hours without interrupting daily firm or clinic workflows.',
    },
    {
      q: 'Will you interface directly with our insurance broker?',
      a: 'Yes. Once we complete your technical remediation, we issue a formal Security Architecture & Remediation Certificate directly to your insurance broker or carrier underwriter.',
    },
    {
      q: 'Is Sector Seven Cyber based in Georgia?',
      a: 'Yes. Sector Seven Cyber LLC is headquartered in Fulton County, Georgia, serving law firms, medical clinics, and B2B practices statewide.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-3.5 py-1 rounded-full text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-brand-blue" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Clear Answers for Practice Partners & IT Leads
          </h2>
          <p className="text-slate-600 text-sm">
            Click any question below to expand the detailed technical explanation.
          </p>
        </div>

        {/* Standard Dropdown Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'bg-slate-50 border-brand-blue/40 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-brand-blue transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-mono flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-blue' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/80 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-12 text-center bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-sm text-slate-900">Have a specific carrier questionnaire question?</h4>
            <p className="text-xs text-slate-500">Speak directly with a Georgia cybersecurity specialist.</p>
          </div>
          <button
            onClick={() => onNavigate('/apply')}
            className="magnetic-btn bg-slate-900 hover:bg-brand-blue text-white text-xs font-bold px-6 py-3 rounded-full flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>Submit Questionnaire</span>
            <ArrowUpRight className="w-4 h-4 text-brand-amber" />
          </button>
        </div>

      </div>
    </section>
  );
};
