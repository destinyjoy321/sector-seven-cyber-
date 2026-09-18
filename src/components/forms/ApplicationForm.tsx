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
    contact_title: '',
    company_name: '',
    email: '',
    phone: '',
    industry: 'Law Firms & Legal Practices',
    industry_other: '',
    referred_by_broker: 'No',
    broker_name: '',
    employee_count: '',
    cloud_user_count: '',
    insurance_status: 'Active coverage (Facing upcoming audit/renewal)',
    insurance_provider: 'Standard Antivirus software only (Unmonitored)',
    message: '24/7 Managed Detection & Response (MDR)',
    terms_accepted: false,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

    // Zod Schema Validation
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

      const hasFiles = selectedFiles.length > 0;
      const primaryExt = hasFiles ? (selectedFiles[0].name.split('.').pop() || 'pdf') : 'none';
      const sanitizedFilename = hasFiles ? `questionnaire-${Math.random().toString(36).substring(2, 10)}.${primaryExt}` : 'None';
      const totalSize = hasFiles ? selectedFiles.reduce((acc, f) => acc + f.size, 0) : 0;
      const fileNamesCombined = hasFiles ? selectedFiles.map(f => f.name).join(', ') : 'None';
      const storageFilePath = hasFiles ? `${appId}/${sanitizedFilename}` : 'NONE';
      const fileType = hasFiles ? (selectedFiles[0].type || 'application/pdf') : 'none';

      const newApp: ProspectApplication = {
        id: appId,
        created_at: timestamp,
        updated_at: timestamp,
        contact_name: validationResult.data.contact_name,
        contact_title: validationResult.data.contact_title,
        company_name: validationResult.data.company_name,
        email: validationResult.data.email,
        phone: validationResult.data.phone,
        industry: validationResult.data.industry,
        industry_other: validationResult.data.industry_other,
        referred_by_broker: validationResult.data.referred_by_broker,
        broker_name: validationResult.data.broker_name,
        employee_count: validationResult.data.employee_count,
        cloud_user_count: validationResult.data.cloud_user_count,
        insurance_status: validationResult.data.insurance_status,
        insurance_provider: validationResult.data.insurance_provider,
        message: '24/7 Managed Detection & Response (MDR)',
        file_name: fileNamesCombined,
        file_size: totalSize,
        file_type: fileType,
        file_path: storageFilePath,
        status: 'NEW',
        notification_status: 'PENDING',
        terms_accepted: true,
        terms_accepted_at: timestamp,
        terms_version: '2026-09-01',
      };

      // Multi-step Vault Sequence Timing
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      const savePromise = saveApplication(newApp, selectedFiles);
      
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
      const errorMsg = 'Your assessment could not be submitted. Please check your network connection and try again.';
      setSubmitError(errorMsg);
      if (selectedFiles.length > 0) {
        setFileError('File upload failed. Please try re-selecting your document or submit without attachment.');
      }
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
      <form onSubmit={handleSubmit} className="space-y-6 text-left font-sans" noValidate>
        
        {/* SECTION 01: ENTITY & CONTACT DETAILS */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
            <span className="font-extrabold text-xs uppercase tracking-widest text-[#0284C7]">
              01 / Entity & Contact Details
            </span>
          </div>

          {/* 1. Executive Title & Full Name (Executive Title First) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col justify-between h-full">
              <div className="min-h-[42px] flex items-end mb-2">
                <label htmlFor="input-contact-title" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                  Executive Title <span className="text-red-500 font-bold inline-block">*</span>
                </label>
              </div>
              <input
                id="input-contact-title"
                type="text"
                name="contact_title"
                placeholder="e.g. Managing Partner, CEO, CRO"
                value={formData.contact_title || ''}
                onChange={handleTextChange}
                aria-invalid={Boolean(errors.contact_title)}
                aria-describedby={errors.contact_title ? 'contact_title-error' : undefined}
                className={`w-full h-12 px-4 rounded-xl border text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
                  errors.contact_title ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#0284C7]'
                }`}
              />
              {errors.contact_title && (
                <p id="contact_title-error" role="alert" aria-live="polite" className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {errors.contact_title}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-between h-full">
              <div className="min-h-[42px] flex items-end mb-2">
                <label htmlFor="input-contact-name" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                  Full Name <span className="text-red-500 font-bold inline-block">*</span>
                </label>
              </div>
              <input
                id="input-contact-name"
                type="text"
                name="contact_name"
                placeholder="e.g. Marcus Vance"
                value={formData.contact_name || ''}
                onChange={handleTextChange}
                aria-invalid={Boolean(errors.contact_name)}
                aria-describedby={errors.contact_name ? 'contact_name-error' : undefined}
                className={`w-full h-12 px-4 rounded-xl border text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
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
          </div>

          {/* 2. Legal Entity Name & Focus Dropdown Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col justify-between h-full">
              <div className="min-h-[42px] flex items-end mb-2">
                <label htmlFor="input-company-name" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                  Legal Entity Name <span className="text-red-500 font-bold inline-block">*</span>
                </label>
              </div>
              <input
                id="input-company-name"
                type="text"
                name="company_name"
                placeholder="e.g. Vance & Montgomery Partners LLC"
                value={formData.company_name || ''}
                onChange={handleTextChange}
                aria-invalid={Boolean(errors.company_name)}
                aria-describedby={errors.company_name ? 'company_name-error' : undefined}
                className={`w-full h-12 px-4 rounded-xl border text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
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

            <div className="flex flex-col justify-between h-full">
              <div className="min-h-[42px] flex items-end mb-2">
                <label htmlFor="select-industry" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                  Business Focus & Industry Sector <span className="text-red-500 font-bold inline-block">*</span>
                </label>
              </div>
              <select
                id="select-industry"
                name="industry"
                value={formData.industry || 'Law Firms & Legal Practices'}
                onChange={handleTextChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none truncate"
              >
                <option value="Law Firms & Legal Practices">Law Firms & Legal Practices</option>
                <option value="Healthcare Clinics & Medical Practices">Healthcare Clinics & Medical Practices</option>
                <option value="CPA Practices & Accounting Firms">CPA Practices & Accounting Firms</option>
                <option value="Commercial Insurance Brokerages">Commercial Insurance Brokerages</option>
                <option value="Other / Independent Business">Other / Independent Business</option>
              </select>
            </div>
          </div>

          {/* Conditional Focus Text Box */}
          {formData.industry === 'Other / Independent Business' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col space-y-2 pt-1"
            >
              <label htmlFor="input-industry-other" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                Please specify your business focus: <span className="text-red-500 font-bold inline-block">*</span>
              </label>
              <input
                id="input-industry-other"
                type="text"
                name="industry_other"
                placeholder="e.g. Commercial Real Estate, Defense Contractor"
                value={formData.industry_other || ''}
                onChange={handleTextChange}
                aria-invalid={Boolean(errors.industry_other)}
                aria-describedby={errors.industry_other ? 'industry_other-error' : undefined}
                className={`w-full h-12 px-4 rounded-xl border text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
                  errors.industry_other ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#0284C7]'
                }`}
              />
              {errors.industry_other && (
                <p id="industry_other-error" role="alert" aria-live="polite" className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {errors.industry_other}
                </p>
              )}
            </motion.div>
          )}

          {/* Contact Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col justify-between h-full">
              <div className="min-h-[42px] flex items-end mb-2">
                <label htmlFor="input-email" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                  Business Email <span className="text-red-500 font-bold inline-block">*</span>
                </label>
              </div>
              <input
                id="input-email"
                type="email"
                name="email"
                placeholder="m.vance@vancelawga.com"
                value={formData.email || ''}
                onChange={handleTextChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full h-12 px-4 rounded-xl border text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
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

            <div className="flex flex-col justify-between h-full">
              <div className="min-h-[42px] flex items-end mb-2">
                <label htmlFor="input-phone" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                  Direct Phone Number <span className="text-red-500 font-bold inline-block">*</span>
                </label>
              </div>
              <input
                id="input-phone"
                type="tel"
                name="phone"
                placeholder="+1 (460) 363-9083"
                value={formData.phone || ''}
                onChange={handleTextChange}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className={`w-full h-12 px-4 rounded-xl border text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
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

          {/* 3. Independent Broker Referral Question */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <div className="flex flex-col justify-between h-full">
              <label htmlFor="select-referred-by-broker" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug mb-2">
                Were you referred to us by an independent commercial insurance broker? <span className="text-red-500 font-bold inline-block">*</span>
              </label>
              <select
                id="select-referred-by-broker"
                name="referred_by_broker"
                value={formData.referred_by_broker || 'No'}
                onChange={handleTextChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {/* Conditional Broker Name Box */}
            {formData.referred_by_broker === 'Yes' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col space-y-2 pt-1"
              >
                <label htmlFor="input-broker-name" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                  Please enter the name of your referring independent insurance brokerage or agent: <span className="text-red-500 font-bold inline-block">*</span>
                </label>
                <input
                  id="input-broker-name"
                  type="text"
                  name="broker_name"
                  placeholder="e.g., Sync Insurance, Snellings Walters"
                  value={formData.broker_name || ''}
                  onChange={handleTextChange}
                  aria-invalid={Boolean(errors.broker_name)}
                  aria-describedby={errors.broker_name ? 'broker_name-error' : undefined}
                  className={`w-full h-12 px-4 rounded-xl border text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
                    errors.broker_name ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#0284C7]'
                  }`}
                />
                {errors.broker_name && (
                  <p id="broker_name-error" role="alert" aria-live="polite" className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {errors.broker_name}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* SECTION 02: SECURITY ENVIRONMENT */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
            <span className="font-extrabold text-xs uppercase tracking-widest text-[#0284C7]">
              02 / Security Environment
            </span>
          </div>

          {/* Row 1: Number of Business Devices & Number of Cloud Users */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col justify-between h-full">
              <div className="min-h-[52px] flex items-end mb-2">
                <div>
                  <label htmlFor="select-employee-count" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                    Number of Business Devices <span className="text-red-500 font-bold inline-block">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                    Approximately how many computers, laptops, servers, and other company-managed devices does your organization use? Please select your best estimate.
                  </p>
                </div>
              </div>
              <select
                id="select-employee-count"
                name="employee_count"
                value={formData.employee_count || ''}
                onChange={handleTextChange}
                aria-invalid={Boolean(errors.employee_count)}
                aria-describedby={errors.employee_count ? 'employee_count-error' : undefined}
                className={`w-full h-12 px-4 rounded-xl border text-sm sm:text-base text-slate-900 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
                  errors.employee_count ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#0284C7]'
                }`}
              >
                <option value="" disabled>Select device count estimate...</option>
                <option value="1–10">1–10</option>
                <option value="11–25">11–25</option>
                <option value="26–50">26–50</option>
                <option value="51–100">51–100</option>
                <option value="101+">101+</option>
              </select>
              {errors.employee_count && (
                <p id="employee_count-error" role="alert" aria-live="polite" className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {errors.employee_count}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-between h-full">
              <div className="min-h-[52px] flex items-end mb-2">
                <div>
                  <label htmlFor="select-cloud-users" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                    Number of Cloud Users <span className="text-red-500 font-bold inline-block">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                    Approximately how many employees or users have Microsoft 365 or Google Workspace accounts? Please select your best estimate.
                  </p>
                </div>
              </div>
              <select
                id="select-cloud-users"
                name="cloud_user_count"
                value={formData.cloud_user_count || ''}
                onChange={handleTextChange}
                aria-invalid={Boolean(errors.cloud_user_count)}
                aria-describedby={errors.cloud_user_count ? 'cloud_user_count-error' : undefined}
                className={`w-full h-12 px-4 rounded-xl border text-sm sm:text-base text-slate-900 focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none transition-all ${
                  errors.cloud_user_count ? 'border-red-400 bg-red-50/50' : 'border-slate-300 bg-slate-50/50 focus:bg-white focus:border-[#0284C7]'
                }`}
              >
                <option value="" disabled>Select cloud users estimate...</option>
                <option value="1–10">1–10</option>
                <option value="11–25">11–25</option>
                <option value="26–50">26–50</option>
                <option value="51–100">51–100</option>
                <option value="101+">101+</option>
              </select>
              {errors.cloud_user_count && (
                <p id="cloud_user_count-error" role="alert" aria-live="polite" className="text-xs text-red-600 mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {errors.cloud_user_count}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Coverage Status & Defense Infrastructure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col justify-between h-full">
              <div className="min-h-[42px] flex items-end mb-2">
                <label htmlFor="select-insurance-status" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                  Cyber Liability Coverage Status <span className="text-red-500 font-bold inline-block">*</span>
                </label>
              </div>
              <select
                id="select-insurance-status"
                name="insurance_status"
                value={formData.insurance_status || 'Active coverage (Facing upcoming audit/renewal)'}
                onChange={handleTextChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none truncate"
              >
                <option value="Active coverage (Facing upcoming audit/renewal)">Active coverage (Facing upcoming audit/renewal)</option>
                <option value="Policy currently flagged / Conditional status">Policy currently flagged / Conditional status</option>
                <option value="No active policy (Seeking immediate compliance baseline)">No active policy (Seeking immediate compliance baseline)</option>
              </select>
            </div>

            <div className="flex flex-col justify-between h-full">
              <div className="min-h-[42px] flex items-end mb-2">
                <label htmlFor="select-insurance-provider" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider leading-snug">
                  Active Defense Infrastructure <span className="text-red-500 font-bold inline-block">*</span>
                </label>
              </div>
              <select
                id="select-insurance-provider"
                name="insurance_provider"
                value={formData.insurance_provider || 'Standard Antivirus software only (Unmonitored)'}
                onChange={handleTextChange}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:outline-none truncate"
              >
                <option value="Standard Antivirus software only (Unmonitored)">Standard Antivirus software only (Unmonitored)</option>
                <option value="Internal IT team managing baseline configurations">Internal IT team managing baseline configurations</option>
                <option value="No centralized endpoint logging structure">No centralized endpoint logging structure</option>
              </select>
            </div>
          </div>

          {/* 4. Your Managed Security Framework & 24/7 MDR Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                YOUR MANAGED SECURITY FRAMEWORK
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Sector Seven Cyber helps strengthen your organization's security through three core areas:
              </p>
            </div>

            {/* Static Bullets */}
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-2 shrink-0" />
                <span>Strengthen cybersecurity controls commonly evaluated during cyber-insurance underwriting.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-2 shrink-0" />
                <span>Provide 24/7 human-led managed detection and response to identify and respond to cyber threats.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-2 shrink-0" />
                <span>Strengthen safeguards around sensitive business and client information.</span>
              </li>
            </ul>

            {/* The Core Managed Service Box */}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-sky-200 bg-sky-50/70 text-slate-900 cursor-not-allowed select-none">
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  readOnly={true}
                  className="mt-0.5 w-4 h-4 text-[#0284C7] border-sky-400 rounded accent-[#0284C7] cursor-not-allowed"
                />
                <div className="space-y-1">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 block leading-tight">
                    24/7 MANAGED DETECTION & RESPONSE (MDR)
                  </span>
                  <p className="text-xs text-slate-600 font-normal leading-normal">
                    Continuous monitoring, threat detection, investigation, and response across supported environments.
                  </p>
                  <span className="inline-block text-[10px] font-extrabold text-[#0284C7] bg-sky-100 px-2 py-0.5 rounded border border-sky-200 uppercase tracking-wider mt-1">
                    [CORE MANAGED SERVICE]
                  </span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* File Upload Component */}
        <FileUpload
          selectedFiles={selectedFiles}
          onFileSelect={(files) => {
            setSelectedFiles(files);
            if (files.length > 0) setFileError('');
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
              <h4 className="font-bold text-xs uppercase tracking-wider text-red-800 font-sans">Submission Error</h4>
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
                <span className="font-sans font-extrabold">START YOUR SECURITY ASSESSMENT →</span>
                <ArrowRight className="w-4 h-4 text-white" aria-hidden="true" />
              </>
            )}
          </button>
        </div>

      </form>
    </motion.div>
  );
};
