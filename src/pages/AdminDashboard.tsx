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
  Lock, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Trash2, 
  RefreshCw, 
  Search, 
  UserCheck, 
  ArrowLeft,
  Key,
  Download,
  Shield
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [applications, setApplications] = useState<ProspectApplication[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'erasure'>('applications');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [erasureRequests, setErasureRequests] = useState<ErasureRequest[]>([]);
  const [erasureInputEmail, setErasureInputEmail] = useState<string>('');
  const [signedUrlModal, setSignedUrlModal] = useState<string | null>(null);

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
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

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
    <div className="pt-28 pb-24 bg-slate-50 text-slate-900 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="p-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm transition-colors"
              title="Return to Site"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-blue" />
                <h1 className="text-xl font-bold font-mono tracking-tight text-slate-900">SECTOR SEVEN STAFF PORTAL</h1>
                <span className="bg-blue-50 text-brand-blue font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                  INTERNAL ADMIN v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">Georgia B2B Lead Queue & Questionnaire Storage Inspection</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === 'applications' ? 'bg-brand-blue text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('erasure')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === 'erasure' ? 'bg-brand-blue text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Erasure Log ({erasureRequests.length})
            </button>
            <button
              onClick={loadData}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: APPLICATIONS & QUESTIONNAIRES */}
        {activeTab === 'applications' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Queue List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
                {['ALL', 'NEW', 'UNDER_REVIEW', 'CONTACTED', 'CONVERTED'].map(f => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3.5 py-1 rounded-xl text-[11px] font-mono font-bold shrink-0 transition-colors ${
                      statusFilter === f 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Application Cards Queue */}
              <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
                {filteredApps.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center text-slate-500 font-mono text-xs border border-slate-200">
                    No matching applications found.
                  </div>
                ) : (
                  filteredApps.map(app => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                        selectedAppId === app.id 
                          ? 'bg-blue-50/80 border-2 border-brand-blue shadow-md' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-brand-blue">{app.id}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 mt-2 truncate">{app.company_name}</h4>
                      <p className="text-xs text-slate-500 truncate">{app.contact_name} • {app.industry}</p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span className="truncate max-w-[180px]">📄 {app.file_name}</span>
                        <span>{new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

            {/* Right Detailed Inspector (7 cols) */}
            <div className="lg:col-span-7">
              {selectedApp ? (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 text-left tech-bracket">
                  
                  {/* Inspector Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="font-mono text-xs text-brand-blue font-extrabold">// RECORD INSPECTION</span>
                      <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedApp.company_name}</h2>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">Status:</span>
                      <select
                        value={selectedApp.status}
                        onChange={(e) => handleStatusChange(selectedApp.id, e.target.value as ApplicationStatus)}
                        className="bg-slate-50 text-slate-900 font-mono text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue font-bold"
                      >
                        <option value="NEW">NEW</option>
                        <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="QUALIFIED">QUALIFIED</option>
                        <option value="PROPOSAL_SENT">PROPOSAL_SENT</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="DECLINED">DECLINED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  </div>

                  {/* Field Grid */}
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
                      <span className="text-slate-500">Industry / Staff Count:</span>
                      <p className="text-slate-900 font-bold mt-0.5">{selectedApp.industry} ({selectedApp.employee_count} staff)</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Insurance Carrier:</span>
                      <p className="text-slate-900 font-bold mt-0.5">{selectedApp.insurance_provider}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Insurance Status:</span>
                      <p className="text-slate-900 font-bold mt-0.5">{selectedApp.insurance_status}</p>
                    </div>
                  </div>

                  {/* Section 42 Audit Trail Metadata */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs font-mono space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Section 42 Legal Consent Stamped</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      terms_accepted = <span className="text-emerald-700 font-bold">{String(selectedApp.terms_accepted)}</span> • 
                      timestamp = {selectedApp.terms_accepted_at} • 
                      version = "{selectedApp.terms_version}"
                    </p>
                  </div>

                  {/* Notes / Message */}
                  {selectedApp.message && (
                    <div className="space-y-1 text-xs">
                      <span className="font-mono text-slate-500 font-semibold">// Client Notes:</span>
                      <p className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 italic">
                        "{selectedApp.message}"
                      </p>
                    </div>
                  )}

                  {/* PROMINENT FILE QUESTIONNAIRE ACCESS CARD (Section 10 Signed Access) */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 border-2 border-brand-blue/30 shadow-md space-y-4">
                    <div className="flex items-center justify-between border-b border-blue-200/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-brand-blue text-white flex items-center justify-center shadow-md">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-mono font-extrabold text-slate-500 uppercase tracking-wider">Uploaded Document</p>
                          <p className="text-sm font-bold text-slate-900 truncate max-w-xs">{selectedApp.file_name}</p>
                          <p className="text-[11px] font-mono text-slate-600">
                            {(selectedApp.file_size / (1024 * 1024)).toFixed(2)} MB • Path: <span className="font-bold text-brand-blue">{selectedApp.file_path}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* High-Contrast Prominent Signed Token Button */}
                    <button
                      onClick={() => handleGenerateUrl(selectedApp.file_path)}
                      className="w-full bg-brand-blue hover:bg-blue-700 text-white font-extrabold text-xs py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer magnetic-btn"
                    >
                      <Key className="w-4 h-4 text-brand-amber" />
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
                      placeholder="Add notes regarding carrier audit findings or remediation timeline..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono"
                    ></textarea>
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center text-slate-500 font-mono text-sm border border-slate-200 shadow-sm">
                  Select an application from the queue to inspect details.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: DATA SUBJECT ERASURE LOG (Section 42.6 of Specification) */}
        {activeTab === 'erasure' && (
          <div className="space-y-8 text-left">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 tech-bracket">
              
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
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono"
                />
                <button
                  type="submit"
                  className="bg-brand-blue hover:bg-blue-700 text-white font-mono font-bold text-xs px-6 py-3 rounded-xl shrink-0 shadow-md"
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
                                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded-lg text-[10px] font-bold border border-red-200 transition-colors flex items-center gap-1"
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
          </div>
        )}

        {/* Modal for Private Signed Token URL */}
        {signedUrlModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-left space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-bold text-brand-blue flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-brand-amber" /> SECURE SIGNED ACCESS URL
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
