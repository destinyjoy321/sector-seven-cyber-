-- Sector Seven Cyber LLC - Live Supabase PostgreSQL Schema (Section 7, 15, 42)

-- 1. Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  contact_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  industry TEXT NOT NULL,
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

-- 3. Create erasure_requests audit table (Section 42.6)
CREATE TABLE IF NOT EXISTS public.erasure_requests (
  id TEXT PRIMARY KEY,
  request_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  requester_email TEXT NOT NULL,
  application_id TEXT,
  status TEXT DEFAULT 'PENDING' NOT NULL,
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.erasure_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff erasure request access" ON public.erasure_requests;

CREATE POLICY "Staff erasure request access" 
  ON public.erasure_requests FOR ALL 
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 4. Storage Objects Policies for insurance-questionnaires bucket
DROP POLICY IF EXISTS "Public upload to insurance-questionnaires" ON storage.objects;

CREATE POLICY "Public upload to insurance-questionnaires"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'insurance-questionnaires');

