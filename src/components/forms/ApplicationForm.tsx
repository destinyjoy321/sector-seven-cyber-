import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  assessmentFormSchema, 
  step1Schema, 
  AssessmentFormData 
} from '../../lib/validation';
import { calculateQuote, fetchRemotePricingConfig } from '../../lib/pricing';
import { saveApplication } from '../../lib/storage';
import { ProspectApplication } from '../../types';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Laptop, 
  Cloud, 
  ShieldCheck, 
  Lock, 
  AlertCircle,
  Briefcase
} from 'lucide-react';

interface ApplicationFormProps {
  onSuccess: (applicationId: string) => void;
  onNavigate: (path: string) => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSuccess, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState<number>(1);

  const [formData, setFormData] = useState<Partial<AssessmentFormData>>({
    contact_name: '',
    contact_title: '',
    company_name: '',
    email: '',
    phone: '',
    industry: 'Law Firms & Legal Practices',
    industry_other: '',
    referred_by_broker: 'No',
    broker_name: '',
    device_count: undefined,
    cloud_user_count: undefined,
    insurance_status: 'Active coverage (Facing upcoming audit/renewal)',
    terms_accepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const numVal = value === '' ? undefined : Number(value);
      setFormData(prev => ({ ...prev, [name]: numVal }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBrokerSelect = (val: 'No' | 'Yes') => {
    setFormData(prev => ({ 
      ...prev, 
      referred_by_broker: val,
      broker_name: val === 'No' ? '' : prev.broker_name 
    }));
    if (errors.referred_by_broker) {
      setErrors(prev => ({ ...prev, referred_by_broker: '' }));
    }
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');

    // Validate Step 1 fields
    const result = step1Schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setDirection(1);
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setErrors({});
    setDirection(-1);
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');

    // Full validation
    const validationResult = assessmentFormSchema.safeParse(formData);
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
    setIsEvaluating(true);

    try {
      const data = validationResult.data;
      const deviceCount = Number(data.device_count);
      const cloudUserCount = Number(data.cloud_user_count);

      // Ensure we have latest live pricing from backend
      let activeConfig;
      try {
        activeConfig = await fetchRemotePricingConfig();
      } catch (e) {
        // graceful fallback to local cache
      }

      // Execute dynamic pricing calculation
      const quote = calculateQuote(deviceCount, cloudUserCount, activeConfig);

      // Unique Sector Seven identifier: SS-YYYY-XXXXXX (cryptographically random to prevent enumeration)
      const timestamp = new Date().toISOString();
      const randomBuf = new Uint32Array(1);
      crypto.getRandomValues(randomBuf);
      const uniqueSuffix = (100000 + (randomBuf[0] % 900000)).toString();
      const applicationId = `SS-${new Date().getFullYear()}-${uniqueSuffix}`;

      const applicationRecord: ProspectApplication = {
        id: applicationId,
        created_at: timestamp,
        updated_at: timestamp,
        contact_name: data.contact_name,
        contact_title: data.contact_title,
        company_name: data.company_name,
        email: data.email,
        phone: data.phone,
        industry: data.industry,
        industry_other: data.industry_other,
        referred_by_broker: data.referred_by_broker,
        broker_name: data.broker_name,
        device_count: deviceCount,
        cloud_user_count: cloudUserCount,
        evaluating_quantity: quote.evaluatingQuantity,
        calculated_monthly_price: quote.monthlyPrice,
        plan_name: quote.isCustomQuote ? 'Custom Cybersecurity Plan' : 'Sector Seven Cyber Protection',
        is_custom_quote: quote.isCustomQuote,
        internal_estimated_cost: quote.internalEstimatedCost,
        internal_estimated_margin: quote.internalEstimatedMargin,
        insurance_status: data.insurance_status,
        insurance_provider: 'Standard Infrastructure',
        status: quote.isCustomQuote ? 'CUSTOM QUOTE REQUIRED' : 'QUOTE GENERATED',
        terms_accepted: data.terms_accepted,
        terms_accepted_at: timestamp,
        terms_version: '2026-09-01',
      };

      // Persist locally & sync to Supabase
      await saveApplication(applicationRecord);
      sessionStorage.setItem('sector_seven_last_application_id', applicationId);

      // Smooth evaluation transition
      setTimeout(() => {
        setIsEvaluating(false);
        setIsSubmitting(false);
        onSuccess(applicationId);
      }, 700);

    } catch (err: any) {
      console.error('Submission error:', err);
      setIsEvaluating(false);
      setIsSubmitting(false);
      setSubmitError(err.message || 'Unable to generate quote. Please review your information and try again.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 relative overflow-hidden">
      
      {/* Evaluating Computation Screen Overlay */}
      {isEvaluating && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-full border-4 border-slate-100 border-t-[#0284C7] animate-spin mb-4" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-3 py-1 rounded-md border border-sky-100 mb-2 font-mono">
            Computation Engine
          </span>
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            Analyzing Environment Specifications...
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Calculating fixed monthly rate & generating proposal
          </p>
        </div>
      )}

      {/* Card Header & 2-Point Stepper (Matching Inspirational Design) */}
      <div className="pt-7 px-6 sm:px-10 pb-6 border-b border-slate-100">
        
        {/* Top Centered Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Security Assessment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step {currentStep} of 2 · Confidential Pre-Screening
          </p>
        </div>

        {/* 2-Point Progress Stepper */}
        <div className="relative max-w-xs mx-auto">
          {/* Background Connecting Line */}
          <div className="absolute top-3.5 left-10 right-10 h-0.5 bg-slate-100 -z-0">
            <div 
              className="h-full bg-[#0284C7] transition-all duration-300"
              style={{ width: currentStep === 1 ? '0%' : '100%' }}
            />
          </div>

          <div className="flex items-center justify-between relative z-10">
            {/* Point 1: Organization */}
            <button
              type="button"
              onClick={() => currentStep === 2 && handlePrevStep()}
              className="flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-[#0284C7] text-white shadow-sm ring-4 ring-sky-100'
                    : 'bg-[#0284C7] text-white'
                }`}
              >
                {currentStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
              </div>
              <span className={`text-[11px] mt-1.5 font-semibold transition-colors ${
                currentStep === 1 ? 'text-[#0284C7]' : 'text-slate-700'
              }`}>
                Organization
              </span>
            </button>

            {/* Point 2: Coverage Status */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  currentStep === 2
                    ? 'bg-[#0284C7] text-white shadow-sm ring-4 ring-sky-100'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                2
              </div>
              <span className={`text-[11px] mt-1.5 font-semibold transition-colors ${
                currentStep === 2 ? 'text-[#0284C7]' : 'text-slate-400'
              }`}>
                Coverage Status
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Form Steps Body */}
      <div className="p-6 sm:p-10">
        <form onSubmit={handleSubmit}>
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: ORGANIZATION INFORMATION */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: direction * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                    Step 01 / Organization Details
                  </span>
                  <p className="text-xs text-slate-500">
                    Enter primary executive contact and corporate entity information
                  </p>
                </div>

                <div className="space-y-4">
                  
                  {/* Full Name & Executive Title (2-Column Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact_name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="contact_name"
                          name="contact_name"
                          type="text"
                          placeholder="e.g. Marcus Vance, Esq."
                          value={formData.contact_name || ''}
                          onChange={handleTextChange}
                          className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.contact_name 
                              ? 'border-red-400 focus:ring-red-100 bg-red-50/30' 
                              : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                          }`}
                        />
                        <User className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      {errors.contact_name && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.contact_name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact_title" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Executive Title <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="contact_title"
                          name="contact_title"
                          type="text"
                          placeholder="e.g. Managing Partner, CEO"
                          value={formData.contact_title || ''}
                          onChange={handleTextChange}
                          className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.contact_title 
                              ? 'border-red-400 focus:ring-red-100 bg-red-50/30' 
                              : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                          }`}
                        />
                        <Briefcase className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      {errors.contact_title && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.contact_title}</p>
                      )}
                    </div>
                  </div>

                  {/* Legal Entity Name */}
                  <div>
                    <label htmlFor="company_name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Legal Entity / Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="company_name"
                        name="company_name"
                        type="text"
                        placeholder="e.g. Vance & Montgomery Partners LLC"
                        value={formData.company_name || ''}
                        onChange={handleTextChange}
                        className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.company_name 
                            ? 'border-red-400 focus:ring-red-100 bg-red-50/30' 
                            : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                        }`}
                      />
                      <Building2 className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    {errors.company_name && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.company_name}</p>
                    )}
                  </div>

                  {/* Business Email & Direct Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Business Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="marcus@vancelaw.com"
                          value={formData.email || ''}
                          onChange={handleTextChange}
                          className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.email 
                              ? 'border-red-400 focus:ring-red-100 bg-red-50/30' 
                              : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                          }`}
                        />
                        <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Direct Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(470) 555-0199"
                          value={formData.phone || ''}
                          onChange={handleTextChange}
                          className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.phone 
                              ? 'border-red-400 focus:ring-red-100 bg-red-50/30' 
                              : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                          }`}
                        />
                        <Phone className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Business Focus & Industry Sector */}
                  <div>
                    <label htmlFor="industry" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Business Focus & Industry Sector <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry || 'Law Firms & Legal Practices'}
                      onChange={handleTextChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:border-[#0284C7] focus:ring-sky-100 transition-all text-slate-900 cursor-pointer"
                    >
                      <option value="Law Firms & Legal Practices">Law Firms & Legal Practices</option>
                      <option value="Healthcare Clinics & Medical Practices">Healthcare Clinics & Medical Practices</option>
                      <option value="CPA Practices & Accounting Firms">CPA Practices & Accounting Firms</option>
                      <option value="Commercial Insurance Brokerages">Commercial Insurance Brokerages</option>
                      <option value="Other / Independent Business">Other / Independent Business</option>
                    </select>
                  </div>

                  {/* Conditional Other Field */}
                  {formData.industry === 'Other / Independent Business' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-1"
                    >
                      <label htmlFor="industry_other" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Please specify your business focus: <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="industry_other"
                        name="industry_other"
                        type="text"
                        placeholder="e.g. Architecture, Financial Advisory, Commercial Construction"
                        value={formData.industry_other || ''}
                        onChange={handleTextChange}
                        className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.industry_other 
                            ? 'border-red-400 focus:ring-red-100 bg-red-50/30' 
                            : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                        }`}
                      />
                      {errors.industry_other && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.industry_other}</p>
                      )}
                    </motion.div>
                  )}

                </div>

                {/* Step 1 Primary Action Button (Matches Inspirational Image) */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm py-3.5 px-6 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </motion.div>
            )}

            {/* STEP 2: COVERAGE STATUS & FOOTPRINT */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: direction * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                    Step 02 / Coverage Status & Environment
                  </span>
                  <p className="text-xs text-slate-500">
                    Specify current cyber liability context and device quantities
                  </p>
                </div>

                <div className="space-y-5">
                  
                  {/* Broker Referral Segmented Selector (Like Payment Method selector in image) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Were you referred to us by an independent commercial insurance broker? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['No', 'Yes'] as const).map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleBrokerSelect(option)}
                          className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                            formData.referred_by_broker === option
                              ? 'bg-sky-50/80 border-[#0284C7] text-[#0284C7] shadow-xs'
                              : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Broker Name Input (If Yes) */}
                  {formData.referred_by_broker === 'Yes' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <label htmlFor="broker_name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Please enter the name of your referring independent insurance brokerage or agent: <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="broker_name"
                        name="broker_name"
                        type="text"
                        placeholder="e.g. Risk Strategies, Gallagher, Marsh McLennan, local agency"
                        value={formData.broker_name || ''}
                        onChange={handleTextChange}
                        className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.broker_name 
                            ? 'border-red-400 focus:ring-red-100 bg-red-50/30' 
                            : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                        }`}
                      />
                      {errors.broker_name && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.broker_name}</p>
                      )}
                    </motion.div>
                  )}

                  {/* Cyber Liability Coverage Status */}
                  <div>
                    <label htmlFor="insurance_status" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Cyber Liability Coverage Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="insurance_status"
                      name="insurance_status"
                      value={formData.insurance_status || 'Active coverage (Facing upcoming audit/renewal)'}
                      onChange={handleTextChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:border-[#0284C7] focus:ring-sky-100 transition-all text-slate-900 cursor-pointer"
                    >
                      <option value="Active coverage (Facing upcoming audit/renewal)">Active coverage (Facing upcoming audit/renewal)</option>
                      <option value="Currently applying for new cyber-insurance coverage">Currently applying for new cyber-insurance coverage</option>
                      <option value="Carrier requested security questionnaire or EDR evidence">Carrier requested security questionnaire or EDR evidence</option>
                      <option value="Coverage non-renewed or facing steep premium increase">Coverage non-renewed or facing steep premium increase</option>
                      <option value="No active policy / Proactively strengthening cybersecurity">No active policy / Proactively strengthening cybersecurity</option>
                    </select>
                  </div>

                  {/* Environment Footprint Grid (Devices & Cloud Users) */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block font-mono mb-3">
                      Protected Environment Footprint
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Device Count */}
                      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Laptop className="w-4 h-4 text-[#0284C7]" />
                          <label htmlFor="device_count" className="text-xs font-bold">
                            How many company computers/devices require protection? <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          Enter the number of company desktops and laptops requiring protection. Whole numbers only.
                        </p>
                        <input
                          id="device_count"
                          name="device_count"
                          type="number"
                          min="1"
                          step="1"
                          placeholder="e.g. 15"
                          value={formData.device_count !== undefined ? formData.device_count : ''}
                          onChange={handleTextChange}
                          className={`w-full px-3.5 py-2 text-sm font-semibold bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.device_count 
                              ? 'border-red-400 focus:ring-red-100 bg-red-50/30' 
                              : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                          }`}
                        />
                        {errors.device_count && (
                          <p className="text-[11px] text-red-600 font-mono">{errors.device_count}</p>
                        )}
                      </div>

                      {/* Cloud User Count */}
                      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Cloud className="w-4 h-4 text-[#0284C7]" />
                          <label htmlFor="cloud_user_count" className="text-xs font-bold">
                            How many employees have a company Microsoft 365 or Google Workspace account? <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          For example, if 20 employees each have a company Microsoft 365 or Google Workspace account, enter 20. Whole numbers only.
                        </p>
                        <input
                          id="cloud_user_count"
                          name="cloud_user_count"
                          type="number"
                          min="0"
                          step="1"
                          placeholder="e.g. 18"
                          value={formData.cloud_user_count !== undefined ? formData.cloud_user_count : ''}
                          onChange={handleTextChange}
                          className={`w-full px-3.5 py-2 text-sm font-semibold bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.cloud_user_count 
                              ? 'border-red-400 focus:ring-red-100 bg-red-50/30' 
                              : 'border-slate-200 focus:border-[#0284C7] focus:ring-sky-100'
                          }`}
                        />
                        {errors.cloud_user_count && (
                          <p className="text-[11px] text-red-600 font-mono">{errors.cloud_user_count}</p>
                        )}
                      </div>

                    </div>

                    {/* Notice Regarding Environment Scale */}
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                      <p>
                        <strong>Notice Regarding Environment Scale:</strong> Pricing is based on the information and quantities provided during your assessment. If the number of devices or cloud users requiring protection differs during onboarding or changes during the service period, your service plan and recurring monthly charge may be adjusted accordingly.
                      </p>
                    </div>
                  </div>

                  {/* Terms & Privacy Checkbox */}
                  <div className="pt-2">
                    <div className="flex items-start gap-2.5">
                      <input
                        id="terms_accepted"
                        name="terms_accepted"
                        type="checkbox"
                        checked={formData.terms_accepted || false}
                        onChange={handleTextChange}
                        className="w-4 h-4 mt-0.5 text-[#0284C7] border-slate-300 rounded focus:ring-[#0284C7] cursor-pointer"
                      />
                      <label htmlFor="terms_accepted" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                        I am an authorized representative of the organization and agree to the{' '}
                        <button
                          type="button"
                          onClick={() => onNavigate('/terms')}
                          className="text-[#0284C7] underline hover:text-[#0369A1] font-semibold"
                        >
                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => onNavigate('/privacy')}
                          className="text-[#0284C7] underline hover:text-[#0369A1] font-semibold"
                        >
                          Privacy Policy
                        </button>
                        . <span className="text-red-500">*</span>
                      </label>
                    </div>
                    {errors.terms_accepted && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.terms_accepted}</p>
                    )}
                  </div>

                  {/* Submission Error Banner */}
                  {submitError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                </div>

                {/* Step 2 Bottom Actions: Back + Submit */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-5 py-3.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm py-3.5 px-6 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Evaluating Environment...' : 'Generate Quote'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </form>
      </div>

      {/* Card Footer: Security & Confidence Indicators */}
      <div className="py-3.5 px-6 sm:px-10 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#0284C7]" />
          256-Bit SSL Encrypted
        </span>
        <span className="flex items-center gap-1.5 font-medium text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Automated Fixed Pricing
        </span>
      </div>

    </div>
  );
};
