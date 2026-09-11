export type ApplicationStatus = 
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
  company_name: string;
  email: string;
  phone: string;
  industry: string;
  employee_count: string;
  insurance_status: string;
  insurance_provider: string;
  message?: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_path: string;
  status: ApplicationStatus;
  notification_status?: 'SENT' | 'FAILED' | 'PENDING';
  terms_accepted: boolean;
  terms_accepted_at: string;
  terms_version: string;
  notes?: string;
}

export interface ErasureRequest {
  id: string;
  request_date: string;
  requester_email: string;
  application_id?: string;
  scope: string; // e.g. 'FULL_ERASURE_AND_ANONYMIZATION' | 'FILE_ONLY' | 'ANONYMIZE_RECORD'
  status: 'PENDING' | 'VERIFIED' | 'COMPLETED';
  identity_verified_at?: string;
  legal_hold_check: boolean; // True if legal/tax hold check passed with no active hold
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
