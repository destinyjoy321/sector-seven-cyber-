import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchLiveApplications, 
  updateApplicationStatus,
  fetchLiveAuditLogs
} from '../lib/storage';
import { 
  getPricingConfig, 
  savePricingConfig, 
  fetchRemotePricingConfig,
  PricingConfig 
} from '../lib/pricing';
import { ProspectApplication, ApplicationStatus } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Activity, 
  Sliders, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Download, 
  RefreshCw, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Building2, 
  Shield, 
  Laptop, 
  Cloud, 
  ChevronDown, 
  ExternalLink, 
  X, 
  Save, 
  Filter, 
  ArrowUpDown, 
  Eye,
  Check,
  TrendingUp,
  Cpu,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  Home,
  PlusCircle
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'ASSESSMENT SUBMITTED',
  'QUOTE GENERATED',
  'ACTIVATION STARTED',
  'PAID',
  'ONBOARDING',
  'ACTIVE',
  'CUSTOM QUOTE REQUIRED',
];

interface ActivityLogItem {
  id: string;
  type: 'PAYMENT' | 'ASSESSMENT' | 'CUSTOM' | 'CONFIG' | 'STATUS';
  title: string;
  detail: string;
  timestamp: string;
  badge: string;
  badgeColor: string;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('sector_seven_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active navigation tab (Dashboard, Clients, Revenue, Activity)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'revenue' | 'activity'>('dashboard');

  // Application data
  const [applications, setApplications] = useState<ProspectApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected prospect for inspection modal
  const [selectedApp, setSelectedApp] = useState<ProspectApplication | null>(null);

  // Pricing configuration modal
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(getPricingConfig());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dbAuditLogs, setDbAuditLogs] = useState<any[]>([]);

  // Chart timeframe toggle
  const [chartTimeframe, setChartTimeframe] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [data, remoteConfig, logs] = await Promise.all([
      fetchLiveApplications(),
      fetchRemotePricingConfig(),
      fetchLiveAuditLogs()
    ]);
    setApplications(data);
    if (remoteConfig) {
      setPricingConfig(remoteConfig);
    }
    if (logs && logs.length > 0) {
      setDbAuditLogs(logs);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.authenticated) {
        sessionStorage.setItem('sector_seven_admin_auth', 'true');
        sessionStorage.setItem('sector_seven_admin_passcode', passcode);
        if (data.token) {
          sessionStorage.setItem('sector_seven_admin_token', data.token);
        }
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError(data.error || 'Invalid administrator credentials.');
      }
    } catch (err) {
      setAuthError('Connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sector_seven_admin_auth');
    sessionStorage.removeItem('sector_seven_admin_passcode');
    setIsAuthenticated(false);
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(appId, newStatus);
    setApplications(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: newStatus, updated_at: new Date().toISOString() } : a))
    );
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Status updated to ${newStatus}`);
  };

  // Save configuration asynchronously to both localStorage and Supabase backend
  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      const result = await savePricingConfig(pricingConfig, passcode);
      setIsSavingConfig(false);
      if (result.success) {
        setIsConfigModalOpen(false);
        setActiveTab('dashboard');
        showToast('Pricing tiers & vendor costs saved to database successfully!');
        loadData();
      } else {
        showToast(`Saved locally! Note: Backend database notice: ${result.error || 'Check server connection'}`);
        setIsConfigModalOpen(false);
      }
    } catch (err: any) {
      setIsSavingConfig(false);
      showToast(`Saved locally. Notice: ${err.message || 'Could not reach server'}`);
      setIsConfigModalOpen(false);
    }
  };

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchesSearch =
      app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.broker_name && app.broker_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations from REAL applications
  const totalLeads = applications.length;
  const activeAndPaid = applications.filter(a => a.status === 'PAID' || a.status === 'ONBOARDING' || a.status === 'ACTIVE');
  const totalMRR = activeAndPaid.reduce((sum, a) => sum + (a.calculated_monthly_price || 0), 0);
  const totalEstimatedCost = activeAndPaid.reduce((sum, a) => {
    const devCost = (a.device_count || 0) * pricingConfig.endpointUnitCost;
    const userCost = (a.cloud_user_count || 0) * pricingConfig.cloudUserUnitCost;
    return sum + devCost + userCost;
  }, 0);
  const totalNetMargin = totalMRR - totalEstimatedCost;
  const marginPercentage = totalMRR > 0 ? ((totalNetMargin / totalMRR) * 100).toFixed(1) : '0.0';

  // Dynamic industry breakdown from REAL applications (Section 4 matching)
  const industryCategories = [
    { key: 'Law Firms & Legal Practices', label: 'Law Firms & Legal', color: '#0284C7' },
    { key: 'Healthcare Clinics & Medical Practices', label: 'Healthcare Clinics', color: '#8B5CF6' },
    { key: 'CPA Practices & Accounting Firms', label: 'CPA & Accounting', color: '#F59E0B' },
    { key: 'Commercial Insurance Brokerages', label: 'Insurance Brokerages', color: '#10B981' },
    { key: 'Other / Independent Business', label: 'Other Businesses', color: '#64748B' },
  ];

  const industryCounts: Record<string, number> = {
    'Law Firms & Legal Practices': 0,
    'Healthcare Clinics & Medical Practices': 0,
    'CPA Practices & Accounting Firms': 0,
    'Commercial Insurance Brokerages': 0,
    'Other / Independent Business': 0,
  };

  applications.forEach(a => {
    if (industryCounts[a.industry] !== undefined) {
      industryCounts[a.industry]++;
    } else {
      industryCounts['Other / Independent Business']++;
    }
  });

  // Calculate dynamic SVG donut arcs (Circumference C = 2 * PI * 40 ≈ 251.327)
  let accumulatedDonutPercent = 0;
  const donutSlices = industryCategories.map(cat => {
    const count = industryCounts[cat.key] || 0;
    const percent = totalLeads > 0 ? count / totalLeads : 0;
    const strokeLength = percent * 251.327;
    const strokeOffset = accumulatedDonutPercent * 251.327;
    accumulatedDonutPercent += percent;
    return {
      ...cat,
      count,
      strokeLength,
      strokeOffset,
    };
  });

  // Real Monthly Telemetry from genuine applications (Zero forged numbers)
  const telemetryMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const currentYear = new Date().getFullYear();

  const monthlyTelemetry = telemetryMonths.map((mName, mIdx) => {
    const activeInMonth = activeAndPaid.filter(app => {
      const dateStr = app.paid_at || app.created_at;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      const yr = d.getFullYear();
      const mo = d.getMonth();
      if (yr < currentYear) return true;
      if (yr === currentYear && mo <= mIdx) return true;
      return false;
    });

    const grossMRR = activeInMonth.reduce((sum, a) => sum + (a.calculated_monthly_price || 0), 0);
    const vendorCost = activeInMonth.reduce((sum, a) => {
      const devCost = (a.device_count || 0) * pricingConfig.endpointUnitCost;
      const userCost = (a.cloud_user_count || 0) * pricingConfig.cloudUserUnitCost;
      return sum + devCost + userCost;
    }, 0);
    const netMargin = grossMRR - vendorCost;

    return {
      month: mName,
      monthIndex: mIdx,
      grossMRR,
      vendorCost,
      netMargin,
      activeCount: activeInMonth.length,
    };
  });

  const peakMRR = Math.max(...monthlyTelemetry.map(m => m.grossMRR), totalMRR, 1);

  // Dynamic Activity Stream: Display real PostgreSQL audit logs from Supabase
  const realActivityLogs: ActivityLogItem[] = dbAuditLogs.length > 0 
    ? dbAuditLogs.map(log => {
        let badgeColor = 'bg-sky-50 text-[#0284C7] border-sky-200';
        let badge = 'Intake';
        let logType: ActivityLogItem['type'] = 'ASSESSMENT';

        if (log.event_type === 'PAYMENT_COMPLETED') {
          badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          badge = 'Paid';
          logType = 'PAYMENT';
        } else if (log.event_type === 'AGREEMENT_SIGNED') {
          badgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
          badge = 'Signed';
          logType = 'STATUS';
        } else if (log.event_type === 'CONFIG_UPDATED') {
          badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
          badge = 'Config';
          logType = 'CONFIG';
        } else if (log.event_type === 'STATUS_CHANGED') {
          badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
          badge = 'Status';
          logType = 'STATUS';
        }

        return {
          id: log.id,
          type: logType,
          title: log.title || 'Security Telemetry Event',
          detail: log.detail || log.event_type,
          timestamp: new Date(log.created_at).toLocaleString(),
          badge,
          badgeColor
        };
      })
    : applications.map(app => {
        if (app.status === 'PAID' || app.status === 'ACTIVE') {
          return {
            id: `act-${app.id}`,
            type: 'PAYMENT',
            title: 'Subscription Activated',
            detail: `${app.company_name} ($${app.calculated_monthly_price || 750}/mo)`,
            timestamp: new Date(app.updated_at || app.created_at).toLocaleDateString(),
            badge: 'Paid',
            badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          };
        }
        if (app.is_custom_quote || (app.calculated_monthly_price === null)) {
          return {
            id: `act-${app.id}`,
            type: 'CUSTOM',
            title: 'Custom Quote Review',
            detail: `${app.company_name} (${app.device_count} devices, ${app.cloud_user_count} users)`,
            timestamp: new Date(app.created_at).toLocaleDateString(),
            badge: 'Custom',
            badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
          };
        }
        return {
          id: `act-${app.id}`,
          type: 'ASSESSMENT',
          title: 'Assessment Submitted',
          detail: `${app.company_name} (${app.device_count} dev, ${app.cloud_user_count} cloud)`,
          timestamp: new Date(app.created_at).toLocaleDateString(),
          badge: 'Quote Ready',
          badgeColor: 'bg-sky-50 text-[#0284C7] border-sky-200',
        };
      });

  // CSV Export functionality
  const handleExportCSV = () => {
    if (applications.length === 0) {
      showToast('No applications to export yet.');
      return;
    }

    const headers = [
      'Application ID',
      'Created At',
      'Company',
      'Contact',
      'Title',
      'Email',
      'Phone',
      'Industry',
      'Cyber Insurance Status',
      'Referred By Broker',
      'Referring Broker',
      'Device Count',
      'Cloud User Count',
      'Monthly Price ($)',
      'Internal Estimated Cost ($)',
      'Status',
    ];

    const rows = applications.map(a => {
      const devCost = (a.device_count || 0) * pricingConfig.endpointUnitCost;
      const userCost = (a.cloud_user_count || 0) * pricingConfig.cloudUserUnitCost;
      const totalCost = (devCost + userCost).toFixed(2);
      return [
        `"${a.id}"`,
        `"${a.created_at}"`,
        `"${a.company_name.replace(/"/g, '""')}"`,
        `"${a.contact_name.replace(/"/g, '""')}"`,
        `"${(a.contact_title || '').replace(/"/g, '""')}"`,
        `"${a.email}"`,
        `"${a.phone}"`,
        `"${a.industry}"`,
        `"${a.insurance_status}"`,
        `"${a.referred_by_broker || 'No'}"`,
        `"${(a.broker_name || 'N/A').replace(/"/g, '""')}"`,
        a.device_count || 0,
        a.cloud_user_count || 0,
        a.calculated_monthly_price || 'Custom',
        totalCost,
        `"${a.status}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sector_Seven_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Client roster CSV downloaded successfully!');
  };

  // Status color pill helper
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'PAID':
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ONBOARDING':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'QUOTE GENERATED':
        return 'bg-sky-50 text-[#0284C7] border-sky-200';
      case 'CUSTOM QUOTE REQUIRED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ACTIVATION STARTED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // ==============================================================
  // LOGIN SCREEN (Clean, isolated, with Home button)
  // ==============================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex flex-col justify-center items-center px-4 relative">
        
        {/* Simple Top Navigation Back to Website */}
        <div className="absolute top-8 left-8">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0284C7]" />
            <span>Back to Sector Seven Website</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl max-w-md w-full space-y-6 text-left"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto border border-sky-100 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sector Seven Command Console
            </h2>
            <p className="text-sm text-slate-500">
              Confidential Back-Office & Lead Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="passcode" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Passcode
              </label>
              <input
                id="passcode"
                type="password"
                placeholder="Enter access passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-[#0284C7]"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{authError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm py-3.5 rounded-full transition-all shadow-sm"
            >
              Sign In to Command Console
            </button>

            <p className="text-xs text-slate-400 text-center pt-2">
              Authorized Sector Seven Cyber Operations personnel only.
            </p>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F5F7] min-h-screen text-slate-900 flex font-sans">
      
      {/* ============================================================== */}
      {/* 1. LEFT SIDEBAR NAVIGATION ("Prodex" layout)                    */}
      {/* ============================================================== */}
      <aside className="w-64 bg-white border-r border-slate-200/80 shrink-0 hidden md:flex flex-col justify-between py-6 px-5 fixed inset-y-0 left-0 z-30 shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
        
        <div className="space-y-6">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-extrabold shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight block">
                Sector Seven
              </span>
              <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">
                Cyber Back-Office
              </span>
            </div>
          </div>

          {/* Tenant Switcher Pill */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs font-semibold text-slate-800">
            <div className="flex items-center gap-2 truncate">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate">Sector Seven SOC</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          {/* Navigation Sections */}
          <div className="space-y-6 pt-2">
            
            {/* MAIN CATEGORY */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                Main
              </span>

              {/* 1. Dashboard Tab */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              {/* 2. Client Roster Tab */}
              <button
                onClick={() => setActiveTab('clients')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'clients'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="flex-1 text-left">Client Roster</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-sky-100 text-sky-800 font-bold">
                  {totalLeads}
                </span>
              </button>

              {/* 3. Revenue & Margins Tab */}
              <button
                onClick={() => setActiveTab('revenue')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'revenue'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Revenue & Margins</span>
              </button>

              {/* 4. Live Activity Tab */}
              <button
                onClick={() => setActiveTab('activity')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'activity'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Live Activity</span>
              </button>
            </div>

            {/* CONFIGURATION CATEGORY */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                Configuration
              </span>

              {/* Pricing Engine Modal Trigger */}
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-all"
              >
                <Sliders className="w-4 h-4 text-slate-400" />
                <span>Pricing Engine</span>
              </button>

              {/* Home / View Public Site Button */}
              <button
                onClick={() => onNavigate('/')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-sky-50 hover:text-[#0284C7] transition-all"
              >
                <Home className="w-4 h-4 text-slate-400 group-hover:text-[#0284C7]" />
                <span>View Public Site</span>
              </button>
            </div>

          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/60 border border-sky-100 space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0284C7]" />
              <span className="text-xs font-bold text-slate-900">V2.0 Engine Active</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Self-serve quoting & Stripe subscription sync enabled.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN CONTENT AREA                                           */}
      {/* ============================================================== */}
      <main className="flex-1 md:pl-64 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          
          <div className="flex items-center gap-4">
            {/* Quick Home / Back Link */}
            <button
              onClick={() => onNavigate('/')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'clients' && 'Client Roster & Pipeline'}
                {activeTab === 'revenue' && 'Revenue & Margin Telemetry'}
                {activeTab === 'activity' && 'Live Audit Stream'}
              </h1>
            </div>
          </div>

          {/* Search, Notifications & Destiny Sagay Profile */}
          <div className="flex items-center gap-3">
            
            {/* Search Input with ⌘K badge */}
            <div className="relative hidden sm:block w-64 lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clients, quote IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-[#0284C7] transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Refresh Data */}
            <button
              onClick={loadData}
              className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Destiny Joy Sagay Profile in Top Right (Prominent, Uncluttered) */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0284C7] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                DS
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  Destiny Joy Sagay
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Founder & Administrator
                </span>
              </div>
            </div>

          </div>

        </header>

        {/* Mobile / Tablet Horizontal Tab Navigation Bar (Visible when sidebar is hidden) */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto p-3 bg-white border-b border-slate-200/90 px-4 sm:px-6 sticky top-20 z-10 shadow-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeTab === 'clients' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Client Roster</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-sky-100 text-sky-800 font-bold">
              {totalLeads}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'revenue' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Revenue & Margins
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'activity' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Activity
          </button>
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-sky-50 text-[#0284C7] border border-sky-200 hover:bg-sky-100 transition-colors"
          >
            Pricing Engine
          </button>
        </div>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-6 sm:mx-8 mt-4 p-3.5 rounded-2xl bg-emerald-500 text-white font-semibold text-xs flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-emerald-600 rounded">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Dynamic Views */}
        <div className="p-6 sm:p-8 space-y-8 max-w-[1600px] w-full mx-auto">
          
          {/* ============================================================== */}
          {/* VIEW A: DASHBOARD OVERVIEW                                     */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Top 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500 block">Total Assessments</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block tracking-tight">{totalLeads}</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>{totalLeads} in database</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0284C7] flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500 block">Active Subscribers</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block tracking-tight">{activeAndPaid.length}</span>
                    <span className="text-[11px] font-semibold text-slate-500">Recurring Stripe clients</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500 block">Monthly Revenue (MRR)</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 block tracking-tight">${totalMRR.toLocaleString()}</span>
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{marginPercentage}% Net Margin</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500 block">Vendor Unit Expense</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block tracking-tight">${totalEstimatedCost.toFixed(2)}</span>
                    <span className="text-[11px] font-medium text-slate-400">
                      ${pricingConfig.endpointUnitCost.toFixed(2)}/dev + ${pricingConfig.cloudUserUnitCost.toFixed(2)}/user
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <Cpu className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Middle Section: Chart + Donut */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Recurring Revenue Bar Chart (2/3 width) */}
                <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#0284C7]" />
                        <h2 className="text-base font-bold text-slate-900">Recurring Revenue & Margins</h2>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                          Recurring Subscription
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-200" />
                          Net Retained Margin
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                      {(['Monthly', 'Quarterly', 'Yearly'] as const).map(tf => (
                        <button
                          key={tf}
                          onClick={() => setChartTimeframe(tf)}
                          className={`px-3 py-1.5 rounded-lg transition-all ${
                            chartTimeframe === tf ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart Graphic */}
                  <div className="h-64 pt-6 flex items-end justify-between gap-3 relative border-b border-slate-100 pb-2">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      <div className="border-b border-dashed border-slate-200 w-full" />
                      <div className="border-b border-dashed border-slate-200 w-full" />
                      <div className="border-b border-dashed border-slate-200 w-full" />
                      <div className="border-b border-dashed border-slate-200 w-full" />
                    </div>

                    {totalMRR === 0 && (
                      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 bg-slate-50/90 backdrop-blur-xs p-3 rounded-xl border border-slate-200/80 text-center max-w-sm mx-auto shadow-xs">
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          No active subscriptions currently recorded.
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Telemetry activates automatically as clients complete Agree & Pay.
                        </span>
                      </div>
                    )}

                    {monthlyTelemetry.map((mData, idx) => {
                      const monthVal = mData.grossMRR;
                      const marginVal = mData.netMargin;
                      const barHeight = totalMRR > 0 ? Math.min(100, Math.max(6, (monthVal / peakMRR) * 100)) : 0;
                      const isHovered = hoveredBarIndex === idx;

                      return (
                        <div
                          key={mData.month}
                          onMouseEnter={() => setHoveredBarIndex(idx)}
                          onMouseLeave={() => setHoveredBarIndex(null)}
                          className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative z-10"
                        >
                          {isHovered && (
                            <div className="absolute -top-16 bg-white p-3 rounded-xl border border-slate-200 shadow-xl text-left z-30 pointer-events-none min-w-[140px] space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                {mData.month} 2026 Telemetry
                              </span>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Gross MRR:</span>
                                <span className="font-bold text-slate-900">${monthVal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-[#0284C7]">Net Margin:</span>
                                <span className="font-bold text-[#0284C7]">${marginVal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400 pt-0.5 border-t border-slate-100">
                                <span>Active Clients:</span>
                                <span className="font-semibold text-slate-700">{mData.activeCount}</span>
                              </div>
                            </div>
                          )}

                          <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end transition-all h-full">
                            <div
                              style={{ height: `${barHeight}%` }}
                              className={`w-full rounded-t-xl transition-all duration-300 ${
                                isHovered
                                  ? 'bg-gradient-to-t from-[#0284C7] to-sky-400 shadow-md scale-y-105'
                                  : 'bg-gradient-to-t from-sky-400 to-blue-300 opacity-80'
                              }`}
                            />
                          </div>

                          <span className={`text-[11px] font-semibold mt-3 transition-colors ${
                            isHovered ? 'text-[#0284C7] font-bold' : 'text-slate-400'
                          }`}>
                            {mData.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Industry Breakdown Donut (1/3 width) */}
                <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">Clients by Industry</h2>
                    <button 
                      onClick={() => setActiveTab('clients')}
                      className="text-xs font-semibold text-[#0284C7] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center py-2 relative">
                    <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
                      {totalLeads > 0 && donutSlices.map(slice => slice.count > 0 && (
                        <circle
                          key={slice.key}
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={slice.color}
                          strokeWidth="12"
                          strokeDasharray={`${slice.strokeLength} ${251.327 - slice.strokeLength}`}
                          strokeDashoffset={-slice.strokeOffset}
                          fill="transparent"
                          className="transition-all duration-500"
                        />
                      ))}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Leads</span>
                      <span className="text-2xl font-extrabold text-slate-900">{totalLeads}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {donutSlices.map(cat => (
                      <div key={cat.key} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-600 font-medium truncate max-w-[190px]">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <span className="truncate">{cat.label}</span>
                        </span>
                        <span className="font-bold text-slate-900">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Section: Activity Preview + Pipeline Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Recent Activity Stream (1/3 width) */}
                <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
                    <button 
                      onClick={() => setActiveTab('activity')}
                      className="text-xs font-semibold text-[#0284C7] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {realActivityLogs.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                        <Activity className="w-6 h-6 mx-auto text-slate-300" />
                        <p>No activity logged yet.</p>
                      </div>
                    ) : (
                      realActivityLogs.slice(0, 4).map(act => (
                        <div key={act.id} className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                            {act.type === 'PAYMENT' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Laptop className="w-4 h-4" />}
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 truncate">{act.title}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${act.badgeColor}`}>{act.badge}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{act.detail}</p>
                            <span className="text-[10px] text-slate-400 block pt-0.5">{act.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Client Pipeline Preview (2/3 width) */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
                      <p className="text-xs text-slate-500">Prospect pipeline overview</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('clients')}
                      className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                    >
                      Open Full Roster
                    </button>
                  </div>

                  {filteredApps.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-3">
                      <Building2 className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">No applications in database yet.</p>
                      <button
                        onClick={() => onNavigate('/apply')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Run Test Security Assessment</span>
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs table-fixed">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
                          <tr>
                            <th className="py-3 px-4 w-36 text-center">Reference ID</th>
                            <th className="py-3 px-4 w-52 text-left">Company</th>
                            <th className="py-3 px-4 w-40 text-center">Sector Seven Rate</th>
                            <th className="py-3 px-4 w-40 text-center">Status</th>
                            <th className="py-3 px-4 w-24 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredApps.slice(0, 5).map(app => (
                            <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-3.5 px-4 text-center">
                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800 text-xs tracking-wider">
                                  {app.id}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-bold text-slate-900 truncate">{app.company_name}</td>
                              <td className="py-3.5 px-4 text-center">
                                {app.calculated_monthly_price ? (
                                  <div className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 font-bold text-slate-900 text-xs">
                                    <span className="text-[11px] font-semibold text-emerald-600">$</span>
                                    <span className="font-extrabold text-sm">{app.calculated_monthly_price}</span>
                                    <span className="text-[10px] font-normal text-slate-400">/mo</span>
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                    Custom Plan
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(app.status)}`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => setSelectedApp(app)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW B: CLIENT ROSTER & PIPELINE (Full-Page Table)             */}
          {/* ============================================================== */}
          {activeTab === 'clients' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-6 p-6 sm:p-8">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Client Pipeline & Assessment Roster
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Managing {applications.length} submitted assessments, quotes, and active subscriptions
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  >
                    <option value="ALL">All Statuses ({applications.length})</option>
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors border border-slate-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => onNavigate('/apply')}
                    className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>New Assessment</span>
                  </button>
                </div>
              </div>

              {/* Client Roster Table (Mathematically Balanced Columns) */}
              {filteredApps.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <Building2 className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold text-slate-700">No matching applications found.</p>
                  <p className="text-xs text-slate-500">Submitted security assessments from `/apply` will appear here live.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs table-fixed">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
                      <tr>
                        <th className="py-3.5 px-4 w-36 text-center">Reference ID</th>
                        <th className="py-3.5 px-4 w-60 text-left">Company & Contact</th>
                        <th className="py-3.5 px-4 w-44 text-center">Environment Scope</th>
                        <th className="py-3.5 px-4 w-40 text-center">Sector Seven Rate</th>
                        <th className="py-3.5 px-4 w-36 text-center">Internal Cost</th>
                        <th className="py-3.5 px-4 w-44 text-center">Status</th>
                        <th className="py-3.5 px-4 w-24 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredApps.map(app => {
                        const devCost = (app.device_count || 0) * pricingConfig.endpointUnitCost;
                        const userCost = (app.cloud_user_count || 0) * pricingConfig.cloudUserUnitCost;
                        const totalCost = devCost + userCost;
                        const price = app.calculated_monthly_price;
                        const margin = price ? price - totalCost : null;

                        return (
                          <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* 1. Reference ID (Centered Monospace Badge) */}
                            <td className="py-4 px-4 text-center">
                              <span className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800 text-xs tracking-wider">
                                {app.id}
                              </span>
                            </td>

                            {/* 2. Company & Contact */}
                            <td className="py-4 px-4 text-left">
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-900 block truncate text-sm">
                                  {app.company_name}
                                </span>
                                <span className="text-[11px] text-slate-500 block truncate">
                                  {app.contact_name} • {app.email}
                                </span>
                              </div>
                            </td>

                            {/* 3. Environment Scope */}
                            <td className="py-4 px-4 text-center">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-slate-800 block text-xs">
                                  {app.device_count || 0} dev • {app.cloud_user_count || 0} cloud
                                </span>
                                <span className="text-[11px] text-slate-400 block truncate">
                                  {app.industry}
                                </span>
                              </div>
                            </td>

                            {/* 4. Sector Seven Price (Balanced Centered Badge) */}
                            <td className="py-4 px-4 text-center">
                              {price ? (
                                <div className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 font-bold text-slate-900 text-xs">
                                  <span className="text-[11px] font-semibold text-emerald-600">$</span>
                                  <span className="font-extrabold text-sm">{price}</span>
                                  <span className="text-[10px] font-normal text-slate-400">/mo</span>
                                </div>
                              ) : (
                                <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                  Custom Plan
                                </span>
                              )}
                            </td>

                            {/* 5. Internal Cost & Margin (Admin Only) */}
                            <td className="py-4 px-4 text-center">
                              <div className="space-y-0.5">
                                <span className="text-slate-600 block text-xs font-semibold">
                                  ${totalCost.toFixed(2)}
                                </span>
                                {margin !== null && (
                                  <span className="text-emerald-600 font-semibold block text-[11px]">
                                    +${margin.toFixed(2)} net
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 6. Status Pipeline Dropdown */}
                            <td className="py-4 px-4 text-center">
                              <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                className={`text-[11px] font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(app.status)}`}
                              >
                                {ALL_STATUSES.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>

                            {/* 7. Action Button */}
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Details</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW C: REVENUE & MARGIN TELEMETRY                             */}
          {/* ============================================================== */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Gross Monthly Recurring Revenue
                  </span>
                  <span className="text-3xl font-extrabold text-slate-900 block">
                    ${totalMRR.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">
                    Annual Run Rate: ${(totalMRR * 12).toLocaleString()}/yr
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Vendor Cost Subtraction
                  </span>
                  <span className="text-3xl font-extrabold text-rose-600 block">
                    ${totalEstimatedCost.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500">
                    ${pricingConfig.endpointUnitCost.toFixed(2)}/device + ${pricingConfig.cloudUserUnitCost.toFixed(2)}/cloud user
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Net Retained Profit Margin
                  </span>
                  <span className="text-3xl font-extrabold text-emerald-600 block">
                    ${totalNetMargin.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">
                    {marginPercentage}% Net Margin Retention
                  </span>
                </div>
              </div>

              {/* Pricing Tiers Table */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Current Pricing Matrix</h3>
                    <p className="text-xs text-slate-500">Customer monthly rates & automatic quantity bands</p>
                  </div>
                  <button
                    onClick={() => setIsConfigModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Edit Rates</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {pricingConfig.tiers.map((t, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider block">{t.label}</span>
                      <div className="flex items-baseline gap-1 text-2xl font-extrabold text-slate-900">
                        <span>${t.monthlyPrice}</span>
                        <span className="text-xs font-medium text-slate-400">/ month</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Scope: {t.min} to {t.max} protected devices / identities
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW D: LIVE AUDIT & ACTIVITY STREAM                           */}
          {/* ============================================================== */}
          {activeTab === 'activity' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Real-Time Security & Telemetry Audit Log
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete audit trail of prospect intakes, Stripe checkout sessions, and status updates
                </p>
              </div>

              {realActivityLogs.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <Activity className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold text-slate-700">No events logged yet.</p>
                  <p className="text-xs text-slate-500">Events trigger automatically as prospects submit assessments or complete Stripe checkout.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {realActivityLogs.map(act => (
                    <div key={act.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 mt-0.5">
                          {act.type === 'PAYMENT' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Laptop className="w-5 h-5" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-900 text-sm">{act.title}</span>
                            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${act.badgeColor}`}>
                              {act.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{act.detail}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{act.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </main>

      {/* ============================================================== */}
      {/* 3. PROSPECT DETAIL MODAL                                       */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7]">
                    Application Inspection • {selectedApp.id}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {selectedApp.company_name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Roster detail fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block">Executive Contact</span>
                  <span className="font-bold text-slate-900 block text-sm">{selectedApp.contact_name}</span>
                  <span className="text-slate-500 block">{selectedApp.contact_title || 'Executive'}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block">Contact Info</span>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedApp.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedApp.phone}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block">Industry Sector</span>
                  <span className="font-bold text-slate-900 block">{selectedApp.industry}</span>
                  <span className="text-slate-500 block">Insurance: {selectedApp.insurance_status}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block">Broker Referral Attribution</span>
                  <span className="font-bold text-slate-900 block">
                    {selectedApp.referred_by_broker === 'Yes' ? 'Referred by Partner' : 'Direct Lead'}
                  </span>
                  {selectedApp.broker_name && (
                    <span className="text-[#0284C7] font-semibold block">{selectedApp.broker_name}</span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1 sm:col-span-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-slate-500 block">Environment Scope:</span>
                      <span className="font-bold text-slate-900">
                        {selectedApp.device_count} Protected Devices • {selectedApp.cloud_user_count} Cloud Users
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block">Calculated Rate:</span>
                      <span className="text-lg font-extrabold text-[#0284C7]">
                        {selectedApp.calculated_monthly_price ? `$${selectedApp.calculated_monthly_price}/mo` : 'Custom Quote Required'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Change Buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Update Pipeline Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedApp.id, st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedApp.status === st
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <a
                  href={`/quote?id=${selectedApp.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Client Quote View</span>
                </a>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 4. PRICING CONFIGURATION MODAL (Auto-closes on save!)          */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isConfigModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Backend Pricing Variables</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Pricing Tiers & Internal Margins
                  </h3>
                </div>
                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5 text-xs">
                
                {/* Customer Monthly Pricing Tiers */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Customer Monthly Pricing Tiers
                  </h4>

                  {pricingConfig.tiers.map((tier, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-semibold text-slate-700 w-32 shrink-0">{tier.label}:</span>
                      <div className="flex items-center gap-1 flex-1">
                        <span className="text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          value={tier.monthlyPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPricingConfig(prev => ({
                              ...prev,
                              tiers: prev.tiers.map((t, i) => (i === idx ? { ...t, monthlyPrice: val } : t))
                            }));
                          }}
                          className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                        />
                        <span className="text-slate-500 font-medium">/mo</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Internal Vendor Unit Costs */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Internal Vendor Costs (Admin Only)
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <label className="text-[11px] text-slate-500 font-medium block">Cost per Protected Device</label>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          step="0.10"
                          value={pricingConfig.endpointUnitCost}
                          onChange={(e) => setPricingConfig(prev => ({ ...prev, endpointUnitCost: Number(e.target.value) }))}
                          className="w-full px-2.5 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <label className="text-[11px] text-slate-500 font-medium block">Cost per Cloud User</label>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          step="0.10"
                          value={pricingConfig.cloudUserUnitCost}
                          onChange={(e) => setPricingConfig(prev => ({ ...prev, cloudUserUnitCost: Number(e.target.value) }))}
                          className="w-full px-2.5 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Quote Threshold */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                    Custom Quote Threshold (Higher Quantity &gt; Threshold)
                  </label>
                  <input
                    type="number"
                    value={pricingConfig.customQuoteThreshold}
                    onChange={(e) => setPricingConfig(prev => ({ ...prev, customQuoteThreshold: Number(e.target.value) }))}
                    className="w-32 px-3 py-1.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400">
                    Any environment exceeding this number will trigger the "Custom Cybersecurity Plan" screen.
                  </p>
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  disabled={isSavingConfig}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isSavingConfig}
                  className="px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60"
                >
                  {isSavingConfig ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Configuration</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
