import { z } from 'zod';

export const applicationFormSchema = z.object({
  contact_name: z.string().min(2, 'Full Name is required (minimum 2 characters)'),
  contact_title: z.string().min(2, 'Executive Title is required (e.g. Managing Partner, CEO)'),
  company_name: z.string().min(2, 'Legal Entity Name is required'),
  email: z.string().email('Please enter a valid business email address'),
  phone: z.string().min(10, 'Please enter a valid phone number (minimum 10 digits)'),
  industry: z.string().min(1, 'Please select your target business sector'),
  industry_other: z.string().optional(),
  referred_by_broker: z.string().min(1, 'Please select whether you were referred by an independent broker'),
  broker_name: z.string().optional(),
  employee_count: z.string().min(1, 'Please select approximate number of business devices'),
  cloud_user_count: z.string().min(1, 'Please select approximate number of cloud users'),
  insurance_status: z.string().min(1, 'Please select current cyber liability coverage status'),
  insurance_provider: z.string().min(1, 'Please select active defense infrastructure'),
  message: z.string().optional().default('24/7 Managed Detection & Response (MDR)'),
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

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
