import { z } from 'zod';

export const applicationFormSchema = z.object({
  contact_name: z.string().min(2, 'Full contact name is required (minimum 2 characters)'),
  company_name: z.string().min(2, 'Legal Entity Name & Primary Focus is required'),
  email: z.string().email('Please enter a valid business email address'),
  phone: z.string().min(10, 'Please enter a valid phone number (minimum 10 digits)'),
  industry: z.string().optional().default('Law Firm'),
  employee_count: z.string().min(1, 'Please specify active endpoint count'),
  insurance_status: z.string().min(1, 'Please select current cyber liability coverage status'),
  insurance_provider: z.string().min(1, 'Please select active defense infrastructure'),
  message: z.string().min(1, 'Please select primary operational goal'),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy to submit an assessment request.',
  }),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
