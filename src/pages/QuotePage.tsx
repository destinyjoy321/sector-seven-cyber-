import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getApplicationById } from '../lib/storage';
import { WHATS_INCLUDED_CAPABILITIES } from '../lib/pricing';
import { ProspectApplication } from '../types';
import { 
  ShieldCheck, 
  Shield,
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Laptop, 
  Cloud, 
  Building2, 
  PhoneCall, 
  ShieldAlert,
  Lock,
  Sparkles
} from 'lucide-react';

interface QuotePageProps {
  onNavigate: (path: string) => void;
  applicationId?: string;
}

export const QuotePage: React.FC<QuotePageProps> = ({ onNavigate, applicationId }) => {
  const [app, setApp] = useState<ProspectApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadQuoteData() {
      const targetId = applicationId || sessionStorage.getItem('sector_seven_last_application_id') || undefined;
      if (!targetId) {
        setLoading(false);
        return;
      }
      const data = await getApplicationById(targetId);
      setApp(data);
      setLoading(false);
    }
    loadQuoteData();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-24 flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#0284C7] animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">
            Generating your customized quote...
          </p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="pt-36 pb-24 bg-[#F8FAFC] text-slate-900 min-h-screen flex items-center justify-center relative px-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto border border-sky-100">
            <Shield className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              No Active Assessment Found
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't locate an active cybersecurity assessment for this session. Complete a quick 60-second assessment to calculate your instant quote and coverage plan.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/apply')}
            className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold py-3.5 rounded-full transition-all shadow-sm"
          >
            Start Security Assessment
          </button>
        </div>
      </div>
    );
  }

  const activeApp: ProspectApplication = app;
  const isCustomQuote = activeApp.is_custom_quote || activeApp.calculated_monthly_price === null;

  return (
    <div className="pt-32 pb-24 bg-[#F8FAFC] text-slate-900 min-h-screen relative overflow-hidden">
      
      {/* Ambient Gradient Glows (Futuristic & Glassy) */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-sky-100/50 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#0284C7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('/apply')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0284C7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Modify Assessment Details</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-medium text-slate-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Quote Reference: {activeApp.id}</span>
          </div>
        </div>

        {/* Header - Only for standard automated quote */}
        {!isCustomQuote && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center space-y-3"
          >
            <div className="inline-flex items-center gap-2 bg-sky-50 text-[#0284C7] border border-sky-200 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Customized Service Quote</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto uppercase">
              Here's Your Sector Seven Cybersecurity Quote
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto">
              Protection customized for your organization's environment
            </p>
          </motion.div>
        )}

        {isCustomQuote ? (
          /* ============================================================== */
          /* CUSTOM CYBERSECURITY PLAN FLOW (For environments > 30 units)   */
          /* Matches exact specification from Section 9 & client screenshot  */
          /* ============================================================== */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[32px] p-8 sm:p-12 md:p-14 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.04)] max-w-2xl mx-auto text-center space-y-7 my-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto border border-sky-100 shadow-sm">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-3 max-w-lg mx-auto">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Custom Cybersecurity Plan
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Your environment requires a customized Sector Seven quote. Submit your information and our team will contact you regarding pricing.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Organization</span>
                  <span className="font-bold text-slate-900 text-base truncate block mt-0.5">{activeApp.company_name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Contact</span>
                  <span className="font-bold text-slate-900 text-base truncate block mt-0.5">{activeApp.contact_name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Protected Desktops & Laptops</span>
                  <span className="font-bold text-[#0284C7] text-base block mt-0.5">{activeApp.device_count} Units</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Cloud Identity Accounts</span>
                  <span className="font-bold text-[#0284C7] text-base block mt-0.5">{activeApp.cloud_user_count} Accounts</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                href="tel:+14703639083"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:scale-[1.02]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call (470) 363-9083</span>
              </a>

              <button
                onClick={() => onNavigate('/')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-all"
              >
                Return to Homepage
              </button>
            </div>
          </motion.div>
        ) : (
          /* ============================================================== */
          /* SLEEK, GLASSY & FUTURISTIC QUOTE EXPERIENCE                    */
          /* ============================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Glassy Rate Card & "What's Included" List */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              
              {/* PRIMARY RATE CARD (Glassy, Futuristic, Clean) */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
                      Unified Managed Service
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Sector Seven Cyber Protection
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Prepared for <strong className="text-slate-800">{activeApp.company_name}</strong>
                    </p>
                  </div>

                  {/* Clean Modern Pricing Highlight */}
                  <div className="sm:text-right bg-gradient-to-br from-sky-50 to-blue-50/50 px-6 py-4 rounded-2xl border border-sky-100 shrink-0">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Monthly Total
                    </span>
                    <div className="flex items-baseline sm:justify-end gap-1.5 text-[#0284C7] mt-0.5">
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                        ${activeApp.calculated_monthly_price}
                      </span>
                      <span className="text-sm font-semibold text-slate-500">
                        / month
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scope Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Laptop className="w-4 h-4 text-[#0284C7]" />
                    <span>{activeApp.device_count} Protected Devices</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Cloud className="w-4 h-4 text-[#0284C7]" />
                    <span>{activeApp.cloud_user_count} Cloud Identity Users</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>24/7 SOC Active</span>
                  </div>
                </div>
              </div>

              {/* "WHAT'S INCLUDED" CHECKLIST */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-[#0284C7] text-xs font-semibold uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Included Capabilities</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    What's Included in Your Protection Package
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Delivered as one unified managed cybersecurity service with zero separate add-on fees.
                  </p>
                </div>

                {/* Capabilities Grid */}
                <div className="space-y-3">
                  {WHATS_INCLUDED_CAPABILITIES.map((capability, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-sm font-medium text-slate-800 leading-snug">
                        {capability}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>

            {/* Right Column: Sticky Quote Summary Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 lg:sticky lg:top-28 space-y-6"
            >
              
              {/* QUOTE SUMMARY CARD (Photoroom style: sleek, clean, modern) */}
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border-2 border-slate-900 shadow-xl space-y-6">
                
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                    Summary
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Sector Seven Cyber Protection
                  </h4>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600 divide-y divide-slate-100">
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500">Organization:</span>
                    <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">
                      {activeApp.company_name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3.5">
                    <span className="text-slate-500">Protected Computers & Devices:</span>
                    <span className="font-bold text-slate-900">
                      {activeApp.device_count} Laptops / Desktops
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3.5">
                    <span className="text-slate-500">Protected Cloud Identity Users:</span>
                    <span className="font-bold text-slate-900">
                      {activeApp.cloud_user_count} Accounts
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3.5">
                    <span className="text-slate-500">Security Operations Center:</span>
                    <span className="font-bold text-emerald-600">
                      24/7 Active Response Included
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3.5">
                    <span className="text-slate-500">Billing Terms:</span>
                    <span className="font-medium text-slate-800">
                      Monthly Recurring Subscription
                    </span>
                  </div>
                </div>

                {/* Monthly Total Display */}
                <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Monthly Total
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      ${activeApp.calculated_monthly_price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium ml-1">/ month</span>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      Guaranteed Rate
                    </span>
                  </div>
                </div>

                {/* Notice Regarding Environment Scale */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                  <p>
                    <strong>Notice Regarding Environment Scale:</strong> Pricing is based on the information and quantities provided during your assessment. If the number of devices or cloud users requiring protection differs during onboarding or changes during the service period, your service plan and recurring monthly charge may be adjusted accordingly.
                  </p>
                </div>

                {/* Continue to Activation Button */}
                <button
                  onClick={() => onNavigate(`/activate?id=${activeApp.id}`)}
                  className="w-full btn-primary bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold tracking-wider py-4 px-6 rounded-full shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] group"
                >
                  <span>Continue to Activation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-xs text-slate-500 text-center leading-relaxed">
                  Next step: Review your Sector Seven Service Agreement and securely activate recurring protection.
                </p>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <Lock className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>256-Bit SSL Encrypted · No Setup Fees</span>
                </div>

              </div>

            </motion.div>

          </div>
        )}

      </div>
    </div>
  );
};
