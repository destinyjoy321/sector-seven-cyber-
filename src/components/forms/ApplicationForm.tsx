import React, { useState } from 'react';
import { applicationFormSchema, ApplicationFormData } from '../../lib/validation';
import { FileUpload } from './FileUpload';
import { saveApplication } from '../../lib/storage';
import { ProspectApplication } from '../../types';
import { ArrowRight, Lock, AlertCircle } from 'lucide-react';

interface ApplicationFormProps {
  onSuccess: (applicationId: string) => void;
  onNavigate: (path: string) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSuccess, onNavigate }) => {
  const [formData, setFormData] = useState<Partial<ApplicationFormData>>({
    contact_name: '',
    company_name: '',
    email: '',
    phone: '',
    industry: 'Law Firm',
    employee_count: '25-50',
    insurance_status: 'Existing Policy / Renewal',
    insurance_provider: '',
    message: '',
    terms_accepted: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFileError('');

    // Step 1: Validate file presence
    if (!selectedFile) {
      setFileError('Please upload your cyber insurance questionnaire or test sheet document.');
      return;
    }

    // Step 2: Zod Schema Validation
    const validationResult = applicationFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const appId = `SS-2026-${randomNum}`;

      const sanitizedFilename = `questionnaire-${Math.random().toString(36).substring(2, 10)}.${selectedFile.name.split('.').pop()}`;

      const newApp: ProspectApplication = {
        id: appId,
        created_at: timestamp,
        updated_at: timestamp,
        contact_name: validationResult.data.contact_name,
        company_name: validationResult.data.company_name,
        email: validationResult.data.email,
        phone: validationResult.data.phone,
        industry: validationResult.data.industry,
        employee_count: validationResult.data.employee_count,
        insurance_status: validationResult.data.insurance_status,
        insurance_provider: validationResult.data.insurance_provider,
        message: validationResult.data.message,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type || 'application/pdf',
        file_path: `${appId}/${sanitizedFilename}`,
        status: 'NEW',
        terms_accepted: true,
        terms_accepted_at: timestamp,
        terms_version: '2026-09-01',
      };

      await saveApplication(newApp, selectedFile);
      setIsSubmitting(false);
      onSuccess(appId);
    } catch (err) {
      setIsSubmitting(false);
      alert('An error occurred during submission. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      
      {/* Contact Name & Firm Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            Contact Name & Title *
          </label>
          <input
            type="text"
            name="contact_name"
            placeholder="e.g. Marcus Vance, Esq."
            value={formData.contact_name || ''}
            onChange={handleTextChange}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all ${
              errors.contact_name ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-slate-50/50 focus:bg-white'
            }`}
          />
          {errors.contact_name && <p className="text-xs text-red-600 mt-1 font-medium">{errors.contact_name}</p>}
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            Company / Practice Name *
          </label>
          <input
            type="text"
            name="company_name"
            placeholder="e.g. Vance & Montgomery Law Partners"
            value={formData.company_name || ''}
            onChange={handleTextChange}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all ${
              errors.company_name ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-slate-50/50 focus:bg-white'
            }`}
          />
          {errors.company_name && <p className="text-xs text-red-600 mt-1 font-medium">{errors.company_name}</p>}
        </div>
      </div>

      {/* Business Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            Business Email *
          </label>
          <input
            type="email"
            name="email"
            placeholder="m.vance@vancelawga.com"
            value={formData.email || ''}
            onChange={handleTextChange}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all ${
              errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-slate-50/50 focus:bg-white'
            }`}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            Direct Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+1 (404) 892-3400"
            value={formData.phone || ''}
            onChange={handleTextChange}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all ${
              errors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-slate-50/50 focus:bg-white'
            }`}
          />
          {errors.phone && <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>}
        </div>
      </div>

      {/* Industry Sector & Employee Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            Industry Sector *
          </label>
          <select
            name="industry"
            value={formData.industry || 'Law Firm'}
            onChange={handleTextChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
          >
            <option value="Law Firm">Law Firm / Legal Practice</option>
            <option value="Medical Clinic">Medical Clinic / Healthcare Facility</option>
            <option value="Other B2B Professional Service">Other B2B Professional Service</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            Employee Count *
          </label>
          <select
            name="employee_count"
            value={formData.employee_count || '25-50'}
            onChange={handleTextChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
          >
            <option value="1-10">1 - 10 Employees</option>
            <option value="10-25">10 - 25 Employees</option>
            <option value="25-50">25 - 50 Employees</option>
            <option value="50-100">50 - 100 Employees</option>
            <option value="100+">100+ Enterprise Staff</option>
          </select>
        </div>
      </div>

      {/* Insurance Status & Carrier Provider Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            Current Insurance Status *
          </label>
          <select
            name="insurance_status"
            value={formData.insurance_status || 'Existing Policy / Renewal'}
            onChange={handleTextChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
          >
            <option value="Existing Policy / Renewal">Existing Policy Renewal</option>
            <option value="New Policy Application">New Policy Application</option>
            <option value="Carrier Compliance Audit">Carrier Compliance Audit / Warning Notice</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            Insurance Carrier Name *
          </label>
          <input
            type="text"
            name="insurance_provider"
            placeholder="e.g. Travelers, Chubb, Coalition, CNA"
            value={formData.insurance_provider || ''}
            onChange={handleTextChange}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all ${
              errors.insurance_provider ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-slate-50/50 focus:bg-white'
            }`}
          />
          {errors.insurance_provider && <p className="text-xs text-red-600 mt-1 font-medium">{errors.insurance_provider}</p>}
        </div>
      </div>

      {/* Additional Notes / Details */}
      <div>
        <label className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
          Specific Carrier Requirements / Notes (Optional)
        </label>
        <textarea
          name="message"
          rows={3}
          placeholder="e.g., We received a 30-day notice from Chubb requiring proof of hardware MFA and air-gapped backups."
          value={formData.message || ''}
          onChange={handleTextChange}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none resize-none"
        ></textarea>
      </div>

      {/* File Upload Component */}
      <FileUpload
        selectedFile={selectedFile}
        onFileSelect={(file) => {
          setSelectedFile(file);
          if (file) setFileError('');
        }}
        error={fileError}
      />

      {/* Mandatory Consent Checkbox (Section 42.5 of PDF Specification) */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="terms_accepted"
            checked={formData.terms_accepted || false}
            onChange={handleTextChange}
            className="mt-1 w-4 h-4 text-brand-blue border-slate-300 rounded focus:ring-brand-blue accent-brand-blue"
          />
          <span className="text-xs text-slate-600 leading-normal">
            I agree to the Sector Seven Cyber LLC{' '}
            <button
              type="button"
              onClick={() => window.open('/terms', '_blank')}
              className="font-semibold text-brand-blue hover:underline"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => window.open('/privacy', '_blank')}
              className="font-semibold text-brand-blue hover:underline"
            >
              Privacy Policy
            </button>.
          </span>
        </label>
        {errors.terms_accepted && (
          <p className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.terms_accepted}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !formData.terms_accepted}
          className={`w-full font-extrabold text-sm py-4 px-8 rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
            isSubmitting || !formData.terms_accepted
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'magnetic-btn bg-slate-900 hover:bg-brand-blue text-white shadow-blue-glow'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading to Private Bucket & Database...</span>
            </div>
          ) : (
            <>
              <span>SUBMIT APPLICATION & QUESTIONNAIRE</span>
              <ArrowRight className="w-4 h-4 text-brand-amber" />
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 font-mono text-center mt-3 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 text-brand-emerald" />
          Live Supabase Storage Connected • Private 256-Bit Bucket • Section 11 Compliant
        </p>
      </div>

    </form>
  );
};
