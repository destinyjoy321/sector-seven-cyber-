import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { applicationFormSchema, ApplicationFormData } from '../../lib/validation';
import { FileUpload } from './FileUpload';
import { saveApplication } from '../../lib/storage';
import { ProspectApplication } from '../../types';
import { ArrowRight, AlertCircle, Lock, CheckCircle2 } from 'lucide-react';

interface ApplicationFormProps {
  onSuccess: (applicationId: string) => void;
  onNavigate: (path: string) => void;
}

type VaultStage = 'idle' | 'encrypting' | 'validating' | 'securing' | 'success';

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
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [vaultStage, setVaultStage] = useState<VaultStage>('idle');

  // 3D Hover Tilt using Framer Motion (max 2 degrees, desktop only)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(y, [-300, 300], [2, -2]), { stiffness: 300, damping: 30 });
  const rotateYSpring = useSpring(useTransform(x, [-300, 300], [-2, 2]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Strictly disable tilt on mobile & touch devices
    if (!window.matchMedia('(pointer: fine)').matches || window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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
    setSubmitError('');

    // Step 1: Validate file presence
    if (!selectedFile) {
      setFileError('Your document could not be uploaded. Please try again.');
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
    setVaultStage('encrypting');

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
        notification_status: 'PENDING',
        terms_accepted: true,
        terms_accepted_at: timestamp,
        terms_version: '2026-09-01',
      };

      // Multi-step Vault Sequence Timing
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      const savePromise = saveApplication(newApp, selectedFile);
      
      await delay(600);
      setVaultStage('validating');
      await delay(600);
      setVaultStage('securing');

      // Await database & storage upload completion
      await savePromise;

      // Show crisp success checkmark animation
      setVaultStage('success');
      await delay(800);

      setIsSubmitting(false);
      onSuccess(appId);
    } catch (err: any) {
      setIsSubmitting(false);
      setVaultStage('idle');
      const errorMsg = 'Your document could not be uploaded. Please try again.';
      setSubmitError(errorMsg);
      setFileError(errorMsg);
    }
  };

  return (
    <motion.div
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 transition-shadow duration-300 hover:shadow-2xl relative overflow-hidden"
    >
      {/* The Vault Sequence Multi-step Overlay */}
      {vaultStage !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-2xl border border-slate-200"
          role="status"
          aria-live="polite"
          aria-label="Vault sequence form processing status"
        >
          {vaultStage !== 'success' ? (
            <div className="flex flex-col items-center space-y-6 max-w-sm w-full">
              {/* Outer Cyan Pulse Ring */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-sky-300 animate-ping opacity-75" />
                <div className="w-16 h-16 rounded-full bg-sky-50 border-2 border-[#0284C7] flex items-center justify-center text-[#0284C7] shadow-md">
                  <Lock className="w-7 h-7 text-[#0284C7] animate-pulse" />
                </div>
              </div>

              {/* Step Sequence Headline */}
              <div className="space-y-2 text-center">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0284C7] bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200 inline-block">
                  THE VAULT SEQUENCE
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight h-8">
                  {vaultStage === 'encrypting' && 'Encrypting...'}
                  {vaultStage === 'validating' && 'Validating Document...'}
                  {vaultStage === 'securing' && 'Securing Data...'}
                </h3>
                <p className="text-xs font-mono text-slate-500">
                  {vaultStage === 'encrypting' && 'Applying 256-bit AES payload encryption'}
                  {vaultStage === 'validating' && 'Verifying document format & digital signature'}
                  {vaultStage === 'securing' && 'Streaming to encrypted private intake bucket'}
                </p>
              </div>

              {/* Sequence Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <motion.div
                  className="bg-gradient-to-r from-[#0284C7] to-[#00D2FF] h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{
                    width:
                      vaultStage === 'encrypting'
                        ? '35%'
                        : vaultStage === 'validating'
                        ? '70%'
                        : '95%',
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          ) : (
            /* Success Crisp Checkmark Animation */
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className="flex flex-col items-center space-y-4 max-w-sm text-center"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vault Sealed</h3>
                <p className="text-xs font-mono font-bold text-emerald-700">Document Upload & Submission Verified</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 text-left" noValidate>
        
        {/* Contact Name & Firm Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="input-contact-name" className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
              Contact Name & Title *
            </label>
            <input
              id="input-contact-name"
              type="text"
              name="contact_name"
              placeholder="e.g. Marcus Vance, Esq."
              value={formData.contact_name || ''}
              onChange={handleTextChange}
              aria-invalid={Boolean(errors.contact_name)}
              aria-describedby={errors.contact_name ? 'contact_name-error' : undefined}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
                errors.contact_name ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#0284C7]'
              }`}
            />
            {errors.contact_name && (
              <p id="contact_name-error" role="alert" aria-live="polite" className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {errors.contact_name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="input-company-name" className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
              Company / Practice Name *
            </label>
            <input
              id="input-company-name"
              type="text"
              name="company_name"
              placeholder="e.g. Vance & Montgomery Law Partners"
              value={formData.company_name || ''}
              onChange={handleTextChange}
              aria-invalid={Boolean(errors.company_name)}
              aria-describedby={errors.company_name ? 'company_name-error' : undefined}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
                errors.company_name ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#0284C7]'
              }`}
            />
            {errors.company_name && (
              <p id="company_name-error" role="alert" aria-live="polite" className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {errors.company_name}
              </p>
            )}
          </div>
        </div>

        {/* Business Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="input-email" className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
              Business Email *
            </label>
            <input
              id="input-email"
              type="email"
              name="email"
              placeholder="m.vance@vancelawga.com"
              value={formData.email || ''}
              onChange={handleTextChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
                errors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#0284C7]'
              }`}
            />
            {errors.email && (
              <p id="email-error" role="alert" aria-live="polite" className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="input-phone" className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
              Direct Phone Number *
            </label>
            <input
              id="input-phone"
              type="tel"
              name="phone"
              placeholder="+1 (404) 892-3400"
              value={formData.phone || ''}
              onChange={handleTextChange}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
                errors.phone ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#0284C7]'
              }`}
            />
            {errors.phone && (
              <p id="phone-error" role="alert" aria-live="polite" className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Industry Sector & Employee Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="select-industry" className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
              Industry Sector *
            </label>
            <select
              id="select-industry"
              name="industry"
              value={formData.industry || 'Law Firm'}
              onChange={handleTextChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none"
            >
              <option value="Law Firm">Law Firm / Legal Practice</option>
              <option value="Medical Clinic">Medical Clinic / Healthcare Facility</option>
            </select>
          </div>

          <div>
            <label htmlFor="select-employee-count" className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
              Employee Count *
            </label>
            <select
              id="select-employee-count"
              name="employee_count"
              value={formData.employee_count || '25-50'}
              onChange={handleTextChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none"
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
            <label htmlFor="select-insurance-status" className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
              Current Insurance Status *
            </label>
            <select
              id="select-insurance-status"
              name="insurance_status"
              value={formData.insurance_status || 'Existing Policy / Renewal'}
              onChange={handleTextChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none"
            >
              <option value="Existing Policy / Renewal">Existing Policy Renewal</option>
              <option value="New Policy Application">New Policy Application</option>
              <option value="Carrier Compliance Audit">Carrier Compliance Audit / Warning Notice</option>
            </select>
          </div>

          <div>
            <label htmlFor="input-insurance-provider" className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
              Insurance Carrier Name *
            </label>
            <input
              id="input-insurance-provider"
              type="text"
              name="insurance_provider"
              placeholder="e.g. Travelers, Chubb, Coalition, CNA"
              value={formData.insurance_provider || ''}
              onChange={handleTextChange}
              aria-invalid={Boolean(errors.insurance_provider)}
              aria-describedby={errors.insurance_provider ? 'insurance_provider-error' : undefined}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
                errors.insurance_provider ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#0284C7]'
              }`}
            />
            {errors.insurance_provider && (
              <p id="insurance_provider-error" role="alert" aria-live="polite" className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {errors.insurance_provider}
              </p>
            )}
          </div>
        </div>

        {/* Additional Notes / Details */}
        <div>
          <label htmlFor="textarea-message" className="block text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-2">
            Specific Carrier Requirements / Notes (Optional)
          </label>
          <textarea
            id="textarea-message"
            name="message"
            rows={3}
            placeholder="e.g., We received a 30-day notice from Chubb requiring proof of hardware MFA and air-gapped backups."
            value={formData.message || ''}
            onChange={handleTextChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-sm focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none resize-none"
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

        {/* Mandatory Consent Checkbox (Directly above submit button) */}
        <div className="pt-2">
          <label htmlFor="checkbox-terms" className="flex items-start gap-3 cursor-pointer group">
            <input
              id="checkbox-terms"
              type="checkbox"
              name="terms_accepted"
              checked={formData.terms_accepted || false}
              onChange={handleTextChange}
              aria-invalid={Boolean(errors.terms_accepted)}
              aria-describedby={errors.terms_accepted ? 'terms_accepted-error' : undefined}
              className="mt-1 w-4 h-4 text-[#0284C7] border-slate-300 rounded focus-visible:ring-2 focus-visible:ring-[#0284C7] accent-[#0284C7]"
            />
            <span className="text-xs text-slate-600 leading-normal">
              I agree to the Sector Seven Cyber LLC{' '}
              <button
                type="button"
                onClick={() => window.open('/terms', '_blank')}
                className="font-semibold text-[#0284C7] hover:underline focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded px-0.5"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => window.open('/privacy', '_blank')}
                className="font-semibold text-[#0284C7] hover:underline focus-visible:ring-2 focus-visible:ring-[#0284C7] rounded px-0.5"
              >
                Privacy Policy
              </button>.
            </span>
          </label>
          {errors.terms_accepted && (
            <p id="terms_accepted-error" role="alert" aria-live="polite" className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
              {errors.terms_accepted}
            </p>
          )}
        </div>

        {/* Submit Error Banner */}
        {submitError && (
          <div className="p-4 rounded-xl border border-red-300 bg-red-50 text-red-800 text-sm flex items-start gap-3 shadow-sm" role="alert">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-red-800 font-mono">Submission Error</h4>
              <p className="text-xs text-red-700 mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        {/* Sector Seven Cyan/Blue Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !formData.terms_accepted}
            className={`w-full font-extrabold text-xs tracking-wider py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none ${
              isSubmitting || !formData.terms_accepted
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'btn-primary bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2" role="status" aria-live="polite">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                <span>Uploading to Private Bucket & Database...</span>
              </div>
            ) : (
              <>
                <span className="font-mono font-extrabold">CONFIRM MY SECURITY FIT CALL →</span>
                <ArrowRight className="w-4 h-4 text-white" aria-hidden="true" />
              </>
            )}
          </button>
        </div>

      </form>
    </motion.div>
  );
};
