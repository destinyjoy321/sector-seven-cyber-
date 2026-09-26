export type ApplicationStatus = 
  | 'ASSESSMENT SUBMITTED'
  | 'QUOTE GENERATED'
  | 'ACTIVATION STARTED'
  | 'PAID'
  | 'ONBOARDING'
  | 'ACTIVE'
  | 'CUSTOM QUOTE REQUIRED'
  // Legacy backward-compatibility statuses
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL_SENT'
  | 'CONVERTED'
  | 'DECLINED'
  | 'CLOSED';

export interface ProspectApplication {
  id: string; // e.g. SS-2026-0084
  created_at: string;
  updated_at: string;
  contact_name: string;
  contact_title?: string;
  company_name: string;
  email: string;
  phone: string;
  industry: string;
  industry_other?: string;
  referred_by_broker?: 'Yes' | 'No' | string;
  broker_name?: string;
  
  // Numerical fields for pricing engine
  device_count: number; // Number of company desktops/laptops requiring protection
  cloud_user_count: number; // Number of employees with company M365 or Google Workspace account
  evaluating_quantity?: number; // Higher of device_count and cloud_user_count
  calculated_monthly_price?: number | null; // e.g. 500, 750, 1000 or null if custom
  plan_name?: string; // 'Sector Seven Cyber Protection' or 'Custom Cybersecurity Plan'
  is_custom_quote?: boolean;

  // Internal metrics (strictly admin only, never exposed to client quote)
  internal_estimated_cost?: number; // (device_count * 2.00) + (cloud_user_count * 2.50)
  internal_estimated_margin?: number | null;

  // Insurance & Service metadata
  insurance_status: string;
  insurance_provider?: string;
  message?: string;

  // Activation & Payment tracking
  agreement_signed?: boolean;
  agreement_signed_at?: string;
  agreement_signer_name?: string;
  stripe_session_id?: string;
  stripe_subscription_id?: string;
  paid_at?: string;
  onboarding_status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

  // Status & System fields
  status: ApplicationStatus;
  notification_status?: 'SENT' | 'FAILED' | 'PENDING';
  terms_accepted: boolean;
  terms_accepted_at: string;
  terms_version: string;
  notes?: string;

  // Legacy fields retained for backward-compatibility
  employee_count?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  file_path?: string;
}

export interface ErasureRequest {
  id: string;
  request_date: string;
  requester_email: string;
  application_id?: string;
  scope: string;
  status: 'PENDING' | 'VERIFIED' | 'COMPLETED';
  identity_verified_at?: string;
  legal_hold_check: boolean;
  completed_at?: string;
  notes?: string;
}

export interface RiskCalculatorInput {
  mfaEnabled: boolean;
  immutableBackups: boolean;
  edrDeployed: boolean;
  securityTraining: boolean;
  employeeCount: number;
}
