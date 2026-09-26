import { z } from 'zod';

export const assessmentFormSchema = z.object({
  contact_name: z.string().trim().min(2, 'Full Name is required (minimum 2 characters)'),
  contact_title: z.string().trim().min(2, 'Executive Title is required (e.g. Managing Partner, CEO, IT Director)'),
  company_name: z.string().trim().min(2, 'Legal Entity Name is required'),
  email: z.string().trim().email('Please enter a valid business email address'),
  phone: z.string().trim().min(10, 'Please enter a valid phone number (minimum 10 digits)'),
  industry: z.string().min(1, 'Please select your business focus and industry sector'),
  industry_other: z.string().optional(),
  referred_by_broker: z.enum(['Yes', 'No'], {
    errorMap: () => ({ message: 'Please select whether you were referred by an independent broker' }),
  }),
  broker_name: z.string().optional(),
  insurance_status: z.string().min(1, 'Please select your cyber liability coverage status'),
  device_count: z.coerce
    .number({ invalid_type_error: 'Please enter a valid whole number of devices' })
    .int('Whole numbers only')
    .min(1, 'Please enter at least 1 computer/device'),
  cloud_user_count: z.coerce
    .number({ invalid_type_error: 'Please enter a valid whole number of cloud users' })
    .int('Whole numbers only')
    .min(0, 'Cloud user count cannot be negative'),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy to submit an assessment request.',
  }),
}).superRefine((data, ctx) => {
  if (data.industry === 'Other / Independent Business' && (!data.industry_other || data.industry_other.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['industry_other'],
      message: 'Please specify your business focus',
    });
  }
  if (data.referred_by_broker === 'Yes' && (!data.broker_name || data.broker_name.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['broker_name'],
      message: 'Please enter the name of your referring independent insurance brokerage or agent',
    });
  }
});

export type AssessmentFormData = z.infer<typeof assessmentFormSchema>;

export const step1Schema = z.object({
  contact_name: z.string().trim().min(2, 'Full Name is required (minimum 2 characters)'),
  contact_title: z.string().trim().min(2, 'Executive Title is required (e.g. Managing Partner, CEO, IT Director)'),
  company_name: z.string().trim().min(2, 'Legal Entity Name is required'),
  email: z.string().trim().email('Please enter a valid business email address'),
  phone: z.string().trim().min(10, 'Please enter a valid phone number (minimum 10 digits)'),
  industry: z.string().min(1, 'Please select your business focus and industry sector'),
  industry_other: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.industry === 'Other / Independent Business' && (!data.industry_other || data.industry_other.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['industry_other'],
      message: 'Please specify your business focus',
    });
  }
});

export type Step1FormData = z.infer<typeof step1Schema>;

// Alias for backwards compatibility
export const applicationFormSchema = assessmentFormSchema;
export type ApplicationFormData = AssessmentFormData;
