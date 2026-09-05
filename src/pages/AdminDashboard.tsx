import React, { useState, useEffect } from 'react';
import { 
  getStoredApplications, 
  fetchLiveApplications,
  updateApplicationStatus, 
  generateSignedUrl, 
  getErasureRequests, 
  createErasureRequest, 
  executeErasureRequest 
} from '../lib/storage';
import { ProspectApplication, ApplicationStatus, ErasureRequest } from '../types';
import { 
  Shield, 
  ArrowLeft, 
  FileText, 
  Key, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Users, 
  Building2, 
  Filter, 
  Maximize2, 
  Plus, 
  ChevronRight, 
  Calendar, 
  Zap, 
  Award, 
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  LayoutDashboard,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [applications, setApplications] = useState<ProspectApplication[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'dashboard' | 'applications' | 'tokens' | 'erasure' | 'telemetry'>('dashboard');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [erasureRequests, setErasureRequests] = useState<ErasureRequest[]>([]);
  const [erasureInputEmail, setErasureInputEmail] = useState<string>('');
  const [signedUrlModal, setSignedUrlModal] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<'THIS_MONTH' | 'THIS_QUARTER' | 'ALL_TIME'>('THIS_MONTH');

  const loadData = async () => {
    const apps = await fetchLiveApplications();
    setApplications(apps);
    if (apps.length > 0 && !selectedAppId) {
      setSelectedAppId(apps[0].id);
    }
    setErasureRequests(getErasureRequests());
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedApp = applications.find(a => a.id === selectedAppId);

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(id, newStatus);
    loadData();
  };

  const handleNotesSave = (id: string, notes: string) => {
    if (selectedApp) {
      updateApplicationStatus(id, selectedApp.status, notes);
      loadData();
    }
  };

  const handleGenerateUrl = (filePath: string) => {
    const signed = generateSignedUrl(filePath);
    setSignedUrlModal(signed);
  };

  const handleAddErasure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!erasureInputEmail) return;
    createErasureRequest(erasureInputEmail);
    setErasureInputEmail('');
    setErasureRequests(getErasureRequests());
  };

  const handleExecuteErasure = (id: string) => {
    if (confirm('Execute permanent anonymization/deletion of prospect records per Section 42.6?')) {
      executeErasureRequest(id);
      loadData();
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch = 
      app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.insurance_provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate dynamic industry distribution
  const lawAppCount = applications.filter(a => a.industry === 'Law Firm').length;
  const healthAppCount = applications.filter(a => a.industry === 'Medical Clinic').length;
  const b2bAppCount = applications.filter(a => a.industry === 'Other B2B Professional Service').length;
  const totalApps = applications.length || 1;

  const lawPct = Math.round((lawAppCount / totalApps) * 100);
  const healthPct = Math.round((healthAppCount / totalApps) * 100);
  const b2bPct = Math.round((b2bAppCount / totalApps) * 100);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'NEW': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'UNDER_REVIEW': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'CONTACTED': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'QUALIFIED': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'CONVERTED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-sans pt-24 pb-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================== */}
          {/* LEFT SIDEBAR NAVIGATION (Inspire: NeuroBank) */}
          {/* ========================================== */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6 text-left">
              
              {/* Brand Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-blue text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold font-mono tracking-tight text-slate-900">SECTOR SEVEN</h2>
                    <span className="text-[10px] font-mono font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      ADMIN PORTAL
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('/')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
                  title="Return to Public Website"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Welcome Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-semibold">
                  <span>MONDAY, MARCH 24</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Welcome back, Underwriter!</h3>
                <p className="text-xs text-slate-500 font-mono">Georgia B2B Lead Queue & Storage</p>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5 font-mono text-xs">
                <button
                  onClick={() => setActiveSidebarTab('dashboard')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all ${
                    activeSidebarTab === 'dashboard'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard Overview</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => setActiveSidebarTab('applications')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all ${
                    activeSidebarTab === 'applications'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4" />
                    <span>Applications Queue</span>
                  </div>
                  <span className="bg-brand-blue text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {applications.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSidebarTab('tokens')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all ${
                    activeSidebarTab === 'tokens'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-4 h-4" />
                    <span>Signed Token Vault</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => setActiveSidebarTab('erasure')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all ${
                    activeSidebarTab === 'erasure'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-4 h-4" />
                    <span>Section 42.6 Erasure Log</span>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {erasureRequests.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveSidebarTab('telemetry')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all ${
                    activeSidebarTab === 'telemetry'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4" />
                    <span>Audit Telemetry</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </nav>

              {/* Bottom Pro AI Badge (NeuroBank Pro equivalent) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-2 shadow-lg shadow-blue-500/20 text-left">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold font-mono tracking-wider uppercase">Sector Seven AI</span>
                </div>
                <p className="text-[11px] text-blue-100 leading-snug">
                  Automated carrier compliance audit & underwriter scoring engine active.
                </p>
              </div>

            </div>
          </div>

          {/* ========================================== */}
          {/* MAIN DASHBOARD CONTENT AREA */}
          {/* ========================================== */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Top Action Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm text-left">
              
              {/* Date Filter Pill */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setDateRange('THIS_MONTH')}
                  className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                    dateRange === 'THIS_MONTH' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>This Month</span>
                </button>

                <button 
                  onClick={() => setDateRange('THIS_QUARTER')}
                  className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all ${
                    dateRange === 'THIS_QUARTER' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  This Quarter
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={loadData}
                  className="px-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700 flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Refresh Feed</span>
                </button>

                <button
                  onClick={() => onNavigate('/apply')}
                  className="px-4 py-2 rounded-2xl bg-brand-blue hover:bg-blue-700 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all magnetic-btn"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Application</span>
                </button>
              </div>

            </div>

            {/* ========================================== */}
            {/* TOP WIDGETS GRID (3 Columns - Inspire: NeuroBank) */}
            {/* ========================================== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CARD 1: AI Cyber Audit Insights (Indigo/Blue Gradient Hero Card) */}
              <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white border border-slate-800 shadow-xl text-left flex flex-col justify-between min-h-[220px]">
                {/* Micro Grid Backdrop Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-500/20 backdrop-blur-md text-blue-300 font-mono text-[11px] font-bold px-3 py-1 rounded-full border border-blue-400/30 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-300" /> AI Insights
                    </span>
                    <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Micro pagination dots */}
                  <div className="flex items-center gap-1 mb-3">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                    Your Ingestion Compliance Volume has increased by 14% since last month.
                  </h3>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-blue-200">
                  <span>95% Georgia Carrier Audit Rating</span>
                  <span className="text-emerald-400 font-bold">● High Underwrite Quality</span>
                </div>
              </div>

              {/* CARD 2: Ingestion Volume Metric & Daily Sparkline Graph */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-left flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-500 font-bold uppercase">Volume Overview</span>
                    <button className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <h2 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                      {applications.length || 44}
                    </h2>
                    <span className="bg-emerald-50 text-emerald-700 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> ↑ 12%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-[11px] font-mono text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold text-slate-700">
                      {applications.length} questionnaires
                    </span>
                    <span>12 Georgia carriers</span>
                  </div>
                </div>

                {/* Daily Volume Area Sparkline Graph */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="h-10 w-full flex items-end justify-between gap-1">
                    {[35, 42, 38, 55, 60, 48, 72, 85, 90, 78, 95].map((val, idx) => (
                      <div key={idx} className="w-full bg-blue-50 rounded-t-sm relative group" style={{ height: `${val}%` }}>
                        <div className="w-full bg-brand-blue rounded-t-sm h-full opacity-80 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                    <span>15</span>
                    <span>17</span>
                    <span>19</span>
                    <span>21</span>
                    <span>23</span>
                    <span>24</span>
                  </div>
                </div>
              </div>

              {/* CARD 3: Underwriter Compliance Arc Gauge (Donut/Radial Ring) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-left flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-500 font-bold uppercase">Audit Readiness</span>
                    <button className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-extrabold text-slate-900 font-mono">95%</h2>
                    <span className="bg-blue-50 text-brand-blue font-mono text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200">
                      Georgia Audit Pass Rate
                    </span>
                  </div>
                </div>

                {/* SVG Radial Arc Progress Gauge */}
                <div className="my-2 flex items-center justify-center relative">
                  <svg className="w-32 h-20" viewBox="0 0 100 50">
                    {/* Background Arc */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    {/* Progress Arc (95%) */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 86 42"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute bottom-1 font-mono text-xs font-bold text-slate-800">
                    95%
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-slate-600 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-brand-blue"></span> Active Policies
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span> Under Audit
                  </span>
                </div>
              </div>

            </div>

            {/* ========================================== */}
            {/* BOTTOM ASYMMETRIC GRID (2 Columns - Inspire: NeuroBank) */}
            {/* ========================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Recent Ingestion Queue & Table (8 Columns) */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-left space-y-6">
                
                {/* Header & Filter Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Ingestion Queue</h3>
                    <p className="text-xs text-slate-500 font-mono">Live questionnaire submissions & Section 10 token URLs</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200" title="Filter Queue">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200" title="Expand View">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Search & Status Filter Pills Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                    {['ALL', 'NEW', 'UNDER_REVIEW', 'QUALIFIED', 'CONVERTED'].map(f => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-mono font-bold shrink-0 transition-colors ${
                          statusFilter === f
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search company, ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                </div>

                {/* Applications Rows List (Inspired by NeuroBank Transactions List) */}
                <div className="space-y-3">
                  {filteredApps.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-mono text-xs border border-dashed border-slate-200 rounded-2xl">
                      No matching ingestion records found.
                    </div>
                  ) : (
                    filteredApps.map(app => (
                      <div
                        key={app.id}
                        onClick={() => {
                          setSelectedAppId(app.id);
                          setInspectorOpen(true);
                        }}
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          selectedAppId === app.id
                            ? 'bg-blue-50/70 border-brand-blue shadow-sm'
                            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        {/* Left Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-blue flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                            <Building2 className="w-5 h-5 text-brand-blue" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900 truncate">{app.company_name}</h4>
                              <span className="font-mono text-[10px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                {app.id}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">
                              {app.contact_name} • {app.industry}
                            </p>
                          </div>
                        </div>

                        {/* Right Info & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          <div className="text-right text-xs font-mono">
                            <span className="text-slate-400 text-[10px]">
                              {new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div>
                              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                                {app.status}
                              </span>
                            </div>
                          </div>

                          {/* Row Action: Generate Signed URL Token Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateUrl(app.file_path);
                            }}
                            className="bg-brand-blue hover:bg-blue-700 text-white font-mono font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                            title="Generate 15-Minute Signed URL"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-300" />
                            <span className="hidden sm:inline">15-Min Token</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

              {/* RIGHT COLUMN: Industry Risk Breakdown Widget (4 Columns - Inspire: NeuroBank Spending Widget) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Industry Breakdown Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-left space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Industry Breakdown</h3>
                      <p className="text-xs text-slate-500 font-mono">Georgia Underwriting Distribution</p>
                    </div>
                    <button className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total Distribution Stat */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">Total Submissions</span>
                      <p className="text-2xl font-extrabold font-mono text-slate-900 mt-0.5">{applications.length || 44}</p>
                    </div>
                    <span className="bg-blue-50 text-brand-blue font-mono text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                      3 Georgia Sectors
                    </span>
                  </div>

                  {/* Category Progress Bars */}
                  <div className="space-y-4 font-mono text-xs">
                    
                    {/* Category 1: Fulton Law Firms */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-slate-700 font-bold">
                        <span className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-brand-blue" /> Fulton Law Firms
                        </span>
                        <span>{lawPct}% ({lawAppCount})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-blue h-full rounded-full" style={{ width: `${lawPct}%` }}></div>
                      </div>
                    </div>

                    {/* Category 2: Healthcare & Clinics */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-slate-700 font-bold">
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Medical & Healthcare
                        </span>
                        <span>{healthPct}% ({healthAppCount})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${healthPct}%` }}></div>
                      </div>
                    </div>

                    {/* Category 3: B2B Professional Services */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-slate-700 font-bold">
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-amber-600" /> B2B Services
                        </span>
                        <span>{b2bPct}% ({b2bAppCount})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${b2bPct}%` }}></div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Section 42.6 Erasure Quick Access Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700 uppercase">// Section 42.6 Erasure</span>
                    <span className="bg-amber-50 text-amber-800 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                      GDPR / CCPA
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Log and execute prospect data subject anonymization requests within the mandatory 30-day window.
                  </p>
                  <button
                    onClick={() => setActiveSidebarTab('erasure')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>View Erasure Log ({erasureRequests.length})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ========================================== */}
        {/* TAB 2 / MODAL: SECTION 42.6 ERASURE LOG */}
        {/* ========================================== */}
        {activeSidebarTab === 'erasure' && (
          <div className="mt-8 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6 text-left">
            <div className="space-y-2">
              <span className="font-mono text-xs text-brand-blue font-extrabold uppercase">// SECTION 42.6 COMPLIANCE</span>
              <h2 className="text-2xl font-bold text-slate-900">Data Subject Erasure Request Workflow</h2>
              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                Log and execute GDPR & CCPA right-to-erasure requests. Erasing a record permanently anonymizes prospect data and quarantines uploaded file paths within 30 days of receipt.
              </p>
            </div>

            {/* Add Erasure Request Form */}
            <form onSubmit={handleAddErasure} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter prospect email to log deletion request..."
                value={erasureInputEmail}
                onChange={(e) => setErasureInputEmail(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono"
              />
              <button
                type="submit"
                className="bg-brand-blue hover:bg-blue-700 text-white font-mono font-bold text-xs px-6 py-3 rounded-2xl shrink-0 shadow-md"
              >
                + Log Erasure Request
              </button>
            </form>

            {/* Erasure Requests Table */}
            <div className="overflow-x-auto pt-4 border-t border-slate-100">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200">
                    <th className="pb-3 font-bold">Request ID</th>
                    <th className="pb-3 font-bold">Requester Email</th>
                    <th className="pb-3 font-bold">Request Date</th>
                    <th className="pb-3 font-bold">Status</th>
                    <th className="pb-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {erasureRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No deletion requests logged.
                      </td>
                    </tr>
                  ) : (
                    erasureRequests.map(r => (
                      <tr key={r.id}>
                        <td className="py-3.5 text-brand-blue font-bold">{r.id}</td>
                        <td className="py-3.5">{r.requester_email}</td>
                        <td className="py-3.5 text-slate-500">{new Date(r.request_date).toLocaleDateString()}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3.5">
                          {r.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleExecuteErasure(r.id)}
                              className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded-xl text-[10px] font-bold border border-red-200 transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Execute Erasure</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* MODAL: DEEP RECORD INSPECTOR DRAWER */}
        {/* ========================================== */}
        {inspectorOpen && selectedApp && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-left space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs text-brand-blue font-extrabold">// RECORD INSPECTION</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedApp.company_name}</h2>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp.id, e.target.value as ApplicationStatus)}
                    className="bg-slate-50 text-slate-900 font-mono text-xs px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  >
                    <option value="NEW">NEW</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="CONVERTED">CONVERTED</option>
                  </select>
                  <button 
                    onClick={() => setInspectorOpen(false)}
                    className="text-slate-400 hover:text-slate-900 font-mono text-sm font-bold p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500">Contact Name:</span>
                  <p className="text-slate-900 font-bold mt-0.5">{selectedApp.contact_name}</p>
                </div>
                <div>
                  <span className="text-slate-500">Email Address:</span>
                  <p className="text-slate-900 font-bold mt-0.5">{selectedApp.email}</p>
                </div>
                <div>
                  <span className="text-slate-500">Phone Number:</span>
                  <p className="text-slate-900 font-bold mt-0.5">{selectedApp.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500">Industry / Staff:</span>
                  <p className="text-slate-900 font-bold mt-0.5">{selectedApp.industry} ({selectedApp.employee_count} staff)</p>
                </div>
              </div>

              {/* Section 42 Legal Consent Stamp */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Section 42 Legal Consent Stamped</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  terms_accepted = <span className="text-emerald-700 font-bold">{String(selectedApp.terms_accepted)}</span> • 
                  timestamp = {selectedApp.terms_accepted_at}
                </p>
              </div>

              {/* Signed Token Button */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{selectedApp.file_name}</span>
                  <span className="font-mono text-slate-500">{(selectedApp.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>

                <button
                  onClick={() => handleGenerateUrl(selectedApp.file_path)}
                  className="w-full bg-brand-blue hover:bg-blue-700 text-white font-mono font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md magnetic-btn"
                >
                  <Key className="w-4 h-4 text-amber-300" />
                  <span>GENERATE 15-MINUTE PRIVATE SIGNED TOKEN URL</span>
                </button>
              </div>

              {/* Staff Notes Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-600 uppercase">
                  Internal Staff Notes & Audit Log:
                </label>
                <textarea
                  rows={3}
                  value={selectedApp.notes || ''}
                  onChange={(e) => handleNotesSave(selectedApp.id, e.target.value)}
                  placeholder="Add underwriter findings..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-mono"
                ></textarea>
              </div>

            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* MODAL: PRIVATE SIGNED TOKEN URL DISPLAY */}
        {/* ========================================== */}
        {signedUrlModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-left space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-bold text-brand-blue flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-500" /> SECURE SIGNED ACCESS URL
                </span>
                <button 
                  onClick={() => setSignedUrlModal(null)}
                  className="text-slate-400 hover:text-slate-900 font-mono text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Section 10 Security Protocol: Generated temporary signed token URL expires in <span className="text-amber-600 font-bold">15 minutes</span>. Private storage bucket access is restricted to authorized staff only.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-brand-blue break-all">
                {signedUrlModal}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(signedUrlModal);
                    alert('Signed token URL copied to clipboard!');
                  }}
                  className="bg-brand-blue hover:bg-blue-700 text-white font-mono font-bold text-xs px-6 py-3 rounded-xl shadow-md"
                >
                  Copy Signed URL
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

