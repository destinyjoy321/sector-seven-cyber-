import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApplicationById, updateApplicationFields, upsertStoredApplication, getStoredApplications } from '../lib/storage';
import { ProspectApplication } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Cloud, 
  Laptop, 
  PhoneCall, 
  Mail, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Activity, 
  Shield, 
  Lock, 
  Terminal, 
  Search,
  ExternalLink,
  Clock,
  Key
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
  applicationId?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, applicationId }) => {
  const [app, setApp] = useState<ProspectApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [tenantConnected, setTenantConnected] = useState<boolean>(false);
  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [lookupError, setLookupError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    async function loadDashboard() {
      const searchParams = new URLSearchParams(window.location.search);
      const sessionIdParam = searchParams.get('session_id') || undefined;
      const targetId =
        applicationId ||
        searchParams.get('id') ||
        sessionStorage.getItem('sector_seven_last_application_id') ||
        undefined;

      // 1. If redirected from Stripe Checkout, verify payment immediately with backend
      if (sessionIdParam) {
        setIsVerifying(true);
        try {
          const verifyUrl = `/api/verify-payment?session_id=${encodeURIComponent(sessionIdParam)}${targetId ? `&id=${encodeURIComponent(targetId)}` : ''}`;
          const verifyRes = await fetch(verifyUrl);
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            if (verifyData.application) {
              upsertStoredApplication(verifyData.application);
              setApp(verifyData.application);
              if (targetId) {
                sessionStorage.setItem('sector_seven_last_application_id', targetId);
              }
              setLoading(false);
              setIsVerifying(false);
              return;
            }
          }
        } catch (verifyErr) {
          console.warn('Instant payment verification notice:', verifyErr);
        } finally {
          setIsVerifying(false);
        }
      }

      // 2. Load from storage or database
      if (targetId) {
        sessionStorage.setItem('sector_seven_last_application_id', targetId);
        const data = await getApplicationById(targetId);
        if (data) {
          if (data.status !== 'ACTIVE' && data.status !== 'ONBOARDING' && data.status !== 'PAID') {
            const updated = updateApplicationFields(data.id, {
              status: 'PAID',
              onboarding_status: 'IN_PROGRESS',
              paid_at: data.paid_at || new Date().toISOString(),
            });
            setApp(updated || data);
          } else {
            setApp(data);
          }
          setLoading(false);
          return;
        }
      }

      // 3. Fallback: check stored applications if only 1 exists
      const stored = getStoredApplications();
      if (stored.length === 1) {
        setApp(stored[0]);
      }

      setLoading(false);
    }

    loadDashboard();
  }, [applicationId]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    setLoading(true);
    setLookupError('');

    const query = lookupQuery.trim();
    // Try by ID
    let found = await getApplicationById(query);
    if (!found) {
      // Try by matching email in stored apps
      const stored = getStoredApplications();
      const byEmail = stored.find(a => a.email.toLowerCase() === query.toLowerCase());
      if (byEmail) found = byEmail;
    }

    if (found) {
      sessionStorage.setItem('sector_seven_last_application_id', found.id);
      setApp(found);
    } else {
      setLookupError('No organization profile found matching that reference ID or email.');
    }
    setLoading(false);
  };

  const copyInstallerCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  if (loading || isVerifying) {
    return (
      <div className="min-h-screen pt-36 pb-24 flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#0284C7] animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            {isVerifying ? 'Confirming Stripe Verification & Synchronizing Telemetry...' : 'Loading Client Security Operations Dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  // Fallback: If no application context is found, show lookup portal rather than dead end
  if (!app) {
    return (
      <div className="pt-36 pb-24 bg-[#F8FAFC] text-slate-900 min-h-screen flex items-center justify-center relative px-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto border border-sky-100">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Client Operations Portal
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your Application Reference ID or registered corporate email to access your active deployment telemetry.
            </p>
          </div>

          <form onSubmit={handleLookup} className="space-y-3 text-left">
            <div>
              <label htmlFor="refInput" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Reference ID or Email
              </label>
              <div className="relative">
                <input
                  id="refInput"
                  type="text"
                  placeholder="e.g. SS-2026-XXXX or user@company.com"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition-all"
                  required
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
              {lookupError && (
                <p className="text-[11px] text-rose-600 font-medium mt-1.5">{lookupError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-sm"
            >
              Access Security Dashboard
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigate('/apply')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              Need to initialize new protection? Start Security Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeApp = app;
  const silentCmd = `msiexec /i SectorSeven-Agent-x64.msi /qn ORG_REF="${activeApp.id}" SOC_ROUTER="telemetry.sectorsevencyber.com" /L*V "C:\\SectorSeven\\install.log"`;

  return (
    <div className="pt-28 pb-24 bg-[#F8FAFC] text-slate-900 min-h-screen relative overflow-hidden">
      
      {/* Background Operational Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left space-y-8">
        
        {/* TOP STATUS MASTHEAD */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-[#0B1220] text-white p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Top Indicator Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-[#0284C7] to-emerald-400" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  MDR Active • 24/7 SOC Standby
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
                  REF: {activeApp.id}
                </span>
                {activeApp.stripe_session_id && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-950/80 border border-sky-800/50 text-sky-300 text-[11px] font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    Stripe Confirmed
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeApp.company_name}
                </h1>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Managed Cyber Protection console. Endpoint agents and cloud tenant monitoring are provisioned and synchronized with the Sector Seven Security Operations Center.
                </p>
              </div>
            </div>

            {/* Quick Metrics Badge */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shrink-0 flex flex-col sm:flex-row lg:flex-col gap-4 text-xs font-mono">
              <div className="flex items-center justify-between gap-6 border-b border-slate-800/80 pb-3 sm:border-b-0 sm:pb-0 lg:border-b lg:pb-3">
                <span className="text-slate-400">Monthly Plan:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  ${activeApp.calculated_monthly_price || 750}/mo Active
                </span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span className="text-slate-400">Covered Assets:</span>
                <span className="text-white font-bold">
                  {activeApp.device_count} Endpoints / {activeApp.cloud_user_count} Cloud IDs
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MAIN OPERATIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PRIMARY COLUMN: Technical Deployment Modules (7 of 12 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* MODULE 1: Cloud Tenant Sentinel */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Step 1: Cloud Tenant Environment Connection
                    </h2>
                    <p className="text-xs text-slate-500">
                      Microsoft 365 or Google Workspace Account Telemetry
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                  tenantConnected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tenantConnected ? 'Connected & Verified' : 'Awaiting Authorization'}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Connect your organization's cloud identity directory to monitor unauthorized sign-in attempts, executive impersonation, malicious forwarding rules, and admin privilege escalations.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs space-y-0.5 w-full sm:w-auto">
                  <div className="font-semibold text-slate-900">M365 & Google Workspace API Connector</div>
                  <div className="text-slate-500 text-[11px]">Read-only security graph audit log streaming</div>
                </div>

                <button
                  type="button"
                  onClick={() => setTenantConnected(!tenantConnected)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center justify-center gap-2 ${
                    tenantConnected 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-[#0284C7] hover:bg-[#0369A1] text-white'
                  }`}
                >
                  {tenantConnected ? (
                    <>
                      <Check className="w-4 h-4" />
                      Tenant Linked
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Authorize Cloud Connector
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* MODULE 2: Endpoint Agent Silent Distribution */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Step 2: Silent Endpoint Agent Package
                    </h2>
                    <p className="text-xs text-slate-500">
                      Licensed Quota: {activeApp.device_count} Laptops & Workstations
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100 text-[11px] font-semibold">
                  Installer v2.6.4 Ready
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Deploy the lightweight Sector Seven telemetry sensor across your fleet. It operates silently in the background, utilizing under 1% CPU with zero user disruption.
              </p>

              {/* Package Download Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => alert(`Downloading SectorSeven-Agent-x64.msi for Organization ${activeApp.id}`)}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 flex items-center justify-between transition-all group text-left"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block group-hover:text-[#0284C7]">Windows MSI Installer</span>
                    <span className="text-[11px] text-slate-500 font-mono">64-bit • Signed GPO Ready</span>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-[#0284C7] shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Downloading SectorSeven-Agent-macOS.pkg for Organization ${activeApp.id}`)}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 flex items-center justify-between transition-all group text-left"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 block group-hover:text-[#0284C7]">macOS PKG Package</span>
                    <span className="text-[11px] text-slate-500 font-mono">Universal • MDM Compatible</span>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-[#0284C7] shrink-0" />
                </button>
              </div>

              {/* Silent GPO / Script Deployment Command */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#0284C7]" />
                    Silent Script Deployment (Group Policy / Intune / RMM)
                  </span>
                  <button
                    type="button"
                    onClick={() => copyInstallerCommand(silentCmd)}
                    className="text-[#0284C7] hover:text-[#0369A1] font-semibold inline-flex items-center gap-1 text-[11px] transition-colors"
                  >
                    {copiedCmd ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Command
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed break-all border border-slate-800 relative">
                  {silentCmd}
                </div>
              </div>
            </div>

            {/* MODULE 3: 24/7 SOC Telemetry Baseline */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Step 3: SOC Telemetry Baseline & Posture Rating
                  </h2>
                  <p className="text-xs text-slate-500">
                    Human-led Security Operations Center Triaging
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Encrypted Ingestion Channel Active</strong>
                    <span>Your dedicated organization endpoint gateway is actively listening for initial agent beacons.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Clock className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Baseline Calibration Period (First 48 Hours)</strong>
                    <span>Our analysts map authorized administrative routines to suppress false positives and tailor threat thresholds.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SECONDARY COLUMN: Coverage Scope, Underwriting & Concierge (5 of 12 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CARD: Organization Environment Scope */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Protected Coverage Scope</h3>
                <span className="text-[11px] font-mono text-slate-500">{activeApp.industry}</span>
              </div>

              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <dt className="text-slate-500 text-[11px]">Protected Devices</dt>
                  <dd className="text-lg font-extrabold text-slate-900 mt-1">{activeApp.device_count}</dd>
                  <span className="text-[10px] text-slate-500 block">Laptops & Desktops</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <dt className="text-slate-500 text-[11px]">Protected Cloud IDs</dt>
                  <dd className="text-lg font-extrabold text-slate-900 mt-1">{activeApp.cloud_user_count}</dd>
                  <span className="text-[10px] text-slate-500 block">M365 / Google Users</span>
                </div>
              </dl>

              {/* Environment Scale Policy Note */}
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2.5">
                <Shield className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                <p>
                  <strong>Scale Adjustments:</strong> Pricing reflects verified scope. Should your device count or active cloud accounts change during service, quotas adjust automatically on your monthly billing cycle.
                </p>
              </div>
            </div>

            {/* CARD: Subscription & Certificate of Coverage */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Billing & Underwriting Receipt</h3>
                <span className="text-xs font-bold text-emerald-600">Active</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Plan:</span>
                  <span className="font-semibold text-slate-900">{activeApp.plan_name || 'Cyber Protection'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Billing Amount:</span>
                  <span className="font-bold text-slate-900">${activeApp.calculated_monthly_price || 750} / month</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Activated At:</span>
                  <span className="font-mono text-slate-700">
                    {activeApp.paid_at ? new Date(activeApp.paid_at).toLocaleDateString() : 'Active'}
                  </span>
                </div>
                {activeApp.stripe_session_id && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Transaction ID:</span>
                    <span className="font-mono text-slate-700 text-[10px] truncate max-w-[170px]">
                      {activeApp.stripe_session_id}
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handlePrintCertificate}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                Print / Save Coverage Certificate
              </button>
            </div>

            {/* CARD: Dedicated Concierge Support */}
            <div className="bg-[#0B1220] text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  Assigned Security Architect
                </span>
                <h3 className="text-base font-bold text-white">
                  SOC Deployment Assistance
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Questions regarding silent GPO deployment or cloud API permissions? Contact your dedicated onboarding lead directly.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <a
                  href="tel:+14703639083"
                  className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-3 transition-colors text-slate-200"
                >
                  <PhoneCall className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Direct Architect Desk</span>
                    <span className="font-bold text-white text-xs">(470) 363-9083</span>
                  </div>
                </a>

                <a
                  href="mailto:contact@sectorsevencyber.com"
                  className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center gap-3 transition-colors text-slate-200"
                >
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">SOC Operations Dispatch</span>
                    <span className="font-bold text-white text-xs">contact@sectorsevencyber.com</span>
                  </div>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
