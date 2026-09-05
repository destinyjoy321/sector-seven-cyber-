import { z } from 'zod';

export const applicationFormSchema = z.object({
  contact_name: z.string().min(2, 'Full contact name is required (minimum 2 characters)'),
  company_name: z.string().min(2, 'Company or practice name is required'),
  email: z.string().email('Please enter a valid business email address'),
  phone: z.string().min(10, 'Please enter a valid phone number (minimum 10 digits)'),
  industry: z.enum(['Law Firm', 'Medical Clinic', 'Other B2B Professional Service'], {
    required_error: 'Please select your industry sector',
  }),
  employee_count: z.string().min(1, 'Please select employee count range'),
  insurance_status: z.enum(['Existing Policy / Renewal', 'New Policy Application', 'Carrier Compliance Audit'], {
    required_error: 'Please select your current insurance status',
  }),
  insurance_provider: z.string().min(2, 'Insurance carrier name is required (e.g. Travelers, Chubb, CNA, Coalition)'),
  message: z.string().optional(),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy to submit an assessment request.',
  }),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
