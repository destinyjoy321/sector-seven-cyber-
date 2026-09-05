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
  industry: 'Law Firm' | 'Medical Clinic' | 'Other B2B Professional Service';
  employee_count: string;
  insurance_status: 'Existing Policy / Renewal' | 'New Policy Application' | 'Carrier Compliance Audit';
  insurance_provider: string;
  message?: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_path: string;
  status: ApplicationStatus;
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
  status: 'PENDING' | 'VERIFIED' | 'COMPLETED';
  completed_at?: string;
}

export interface RiskCalculatorInput {
  mfaEnabled: boolean;
  immutableBackups: boolean;
  edrDeployed: boolean;
  securityTraining: boolean;
  employeeCount: number;
}
