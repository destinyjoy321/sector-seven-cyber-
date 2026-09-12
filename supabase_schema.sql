-- Sector Seven Cyber LLC - Live Supabase PostgreSQL Schema (Section 7, 15, 42)

-- 1. Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  contact_name TEXT NOT NULL,
  contact_title TEXT,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  industry TEXT NOT NULL,
  industry_other TEXT,
  referred_by_broker TEXT,
  broker_name TEXT,
  employee_count TEXT NOT NULL,
  insurance_status TEXT NOT NULL,
  insurance_provider TEXT NOT NULL,
  message TEXT,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT DEFAULT 'NEW' NOT NULL,
  terms_accepted BOOLEAN DEFAULT FALSE NOT NULL,
  terms_accepted_at TIMESTAMPTZ,
  terms_version TEXT,
  notes TEXT
);

-- Migration Statements for Existing Database Instances
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS contact_title TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS industry_other TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS referred_by_broker TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS broker_name TEXT;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public lead submission" ON public.applications;
DROP POLICY IF EXISTS "Staff admin full access" ON public.applications;

-- Create policy for anonymous client submission
CREATE POLICY "Public lead submission" 
  ON public.applications FOR INSERT 
  WITH CHECK (terms_accepted = true);

-- Create policy for staff admin full access
CREATE POLICY "Staff admin full access" 
  ON public.applications FOR ALL 
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 3. Create erasure_requests audit table (Section 42.6 Logged Erasure Workflow)
CREATE TABLE IF NOT EXISTS public.erasure_requests (
  id TEXT PRIMARY KEY,
  request_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  requester_email TEXT NOT NULL,
  application_id TEXT,
  scope TEXT DEFAULT 'FULL_ERASURE_AND_ANONYMIZATION' NOT NULL,
  status TEXT DEFAULT 'PENDING' NOT NULL,
  identity_verified_at TIMESTAMPTZ,
  legal_hold_check BOOLEAN DEFAULT TRUE NOT NULL,
  completed_at TIMESTAMPTZ,
  notes TEXT
);

ALTER TABLE public.erasure_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff erasure request access" ON public.erasure_requests;

CREATE POLICY "Staff erasure request access" 
  ON public.erasure_requests FOR ALL 
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 4. Storage Objects Policies for insurance-questionnaires bucket (Strict Extension Validation)
DROP POLICY IF EXISTS "Public upload to insurance-questionnaires" ON storage.objects;

CREATE POLICY "Public upload to insurance-questionnaires"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'insurance-questionnaires' 
    AND (
      name ILIKE '%.pdf' OR 
      name ILIKE '%.png' OR 
      name ILIKE '%.jpg' OR 
      name ILIKE '%.jpeg' OR 
      name ILIKE '%.doc' OR 
      name ILIKE '%.docx' OR 
      name ILIKE '%.xls' OR 
      name ILIKE '%.xlsx'
    )
  );


