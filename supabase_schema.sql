-- ==============================================================================
-- SECTOR SEVEN CYBER LLC - MASTER RELATIONAL DATABASE SCHEMA (V2.0 ENTERPRISE)
-- Target Platform: Supabase PostgreSQL (lmexwjocppravvmtwvzc.supabase.co)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & SETUP
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. TABLE: applications (Primary Assessment & Client Pipeline)
-- ------------------------------------------------------------------------------
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
  referred_by_broker TEXT DEFAULT 'No',
  broker_name TEXT,
  device_count INTEGER DEFAULT 1 NOT NULL,
  cloud_user_count INTEGER DEFAULT 0 NOT NULL,
  evaluating_quantity INTEGER DEFAULT 1,
  calculated_monthly_price NUMERIC DEFAULT 500,
  plan_name TEXT DEFAULT 'Sector Seven Cyber Protection',
  is_custom_quote BOOLEAN DEFAULT FALSE,
  internal_estimated_cost NUMERIC,
  internal_estimated_margin NUMERIC,
  insurance_status TEXT DEFAULT 'Active coverage (Facing upcoming audit/renewal)',
  insurance_provider TEXT DEFAULT 'Standard Infrastructure',
  status TEXT DEFAULT 'ASSESSMENT SUBMITTED' NOT NULL,
  terms_accepted BOOLEAN DEFAULT FALSE NOT NULL,
  terms_accepted_at TIMESTAMPTZ,
  terms_version TEXT DEFAULT '2026-09-01',
  agreement_signed BOOLEAN DEFAULT FALSE,
  agreement_signed_at TIMESTAMPTZ,
  agreement_signer_name TEXT,
  stripe_session_id TEXT,
  stripe_subscription_id TEXT,
  paid_at TIMESTAMPTZ,
  onboarding_status TEXT DEFAULT 'NOT_STARTED',
  notes TEXT,
  -- Legacy nullable fields for backward compatibility
  employee_count TEXT,
  message TEXT,
  file_name TEXT,
  file_size BIGINT,
  file_type TEXT,
  file_path TEXT
);

-- Ensure all modern columns exist on existing table instances
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS contact_title TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS industry_other TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS referred_by_broker TEXT DEFAULT 'No';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS broker_name TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS device_count INTEGER DEFAULT 1;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS cloud_user_count INTEGER DEFAULT 0;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS evaluating_quantity INTEGER DEFAULT 1;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS calculated_monthly_price NUMERIC DEFAULT 500;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS plan_name TEXT DEFAULT 'Sector Seven Cyber Protection';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS is_custom_quote BOOLEAN DEFAULT FALSE;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS internal_estimated_cost NUMERIC;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS internal_estimated_margin NUMERIC;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS agreement_signed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS agreement_signed_at TIMESTAMPTZ;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS agreement_signer_name TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS onboarding_status TEXT DEFAULT 'NOT_STARTED';

-- Drop legacy NOT NULL constraints that break modern submissions
ALTER TABLE public.applications ALTER COLUMN employee_count DROP NOT NULL;
ALTER TABLE public.applications ALTER COLUMN insurance_provider DROP NOT NULL;
ALTER TABLE public.applications ALTER COLUMN file_name DROP NOT NULL;
ALTER TABLE public.applications ALTER COLUMN file_size DROP NOT NULL;
ALTER TABLE public.applications ALTER COLUMN file_type DROP NOT NULL;
ALTER TABLE public.applications ALTER COLUMN file_path DROP NOT NULL;

-- ------------------------------------------------------------------------------
-- 3. TABLE: pricing_engine_config (Live Tier Rates & Unit Margins)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pricing_engine_config (
  id TEXT PRIMARY KEY DEFAULT 'current',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_by TEXT DEFAULT 'ADMIN',
  config_json JSONB NOT NULL
);

-- Seed default pricing configuration if not present
INSERT INTO public.pricing_engine_config (id, config_json)
VALUES (
  'current',
  '{
    "tier1Max": 10,
    "tier1Price": 500,
    "tier2Max": 20,
    "tier2Price": 750,
    "tier3Max": 30,
    "tier3Price": 1000,
    "endpointUnitCost": 15,
    "cloudUserUnitCost": 3,
    "targetMarginPercent": 65
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. TABLE: audit_logs (Enterprise Security & Activity Telemetry Stream)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  event_type TEXT NOT NULL, -- 'ASSESSMENT_SUBMITTED', 'QUOTE_GENERATED', 'PAYMENT_COMPLETED', 'AGREEMENT_SIGNED', 'STATUS_CHANGED', 'CONFIG_UPDATED', 'ONBOARDING_UPDATE'
  actor TEXT DEFAULT 'SYSTEM' NOT NULL, -- 'CLIENT', 'ADMIN', 'SYSTEM', 'STRIPE_WEBHOOK'
  application_id TEXT REFERENCES public.applications(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  detail TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_app_id ON public.audit_logs(application_id);

-- ------------------------------------------------------------------------------
-- 5. TABLE: subscriptions & payment_transactions (Stripe Recurring Billing History)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY, -- Stripe Subscription ID (sub_...)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  application_id TEXT REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'past_due', 'canceled', 'incomplete'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  monthly_amount NUMERIC NOT NULL,
  protected_device_count INTEGER NOT NULL,
  protected_cloud_user_count INTEGER NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id TEXT PRIMARY KEY, -- Stripe Invoice or PaymentIntent ID (in_... / pi_...)
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  subscription_id TEXT REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  application_id TEXT REFERENCES public.applications(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'usd' NOT NULL,
  status TEXT NOT NULL, -- 'succeeded', 'failed', 'refunded'
  receipt_url TEXT,
  payment_method_brand TEXT,
  payment_method_last4 TEXT
);

-- ------------------------------------------------------------------------------
-- 6. TABLE: onboarding_deployments (Customer Technical Rollout & Milestones)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.onboarding_deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  application_id TEXT REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL UNIQUE,
  assigned_security_architect TEXT DEFAULT 'Sector Seven Cyber Operations Center',
  cloud_tenant_provider TEXT, -- 'Microsoft 365' or 'Google Workspace'
  cloud_tenant_domain TEXT,
  cloud_tenant_connected BOOLEAN DEFAULT FALSE,
  cloud_tenant_connected_at TIMESTAMPTZ,
  agents_deployed INTEGER DEFAULT 0,
  agents_target INTEGER DEFAULT 1,
  soc_telemetry_active BOOLEAN DEFAULT FALSE,
  soc_telemetry_activated_at TIMESTAMPTZ,
  initial_posture_score INTEGER, -- 0 to 100 baseline posture rating
  posture_rating_label TEXT, -- 'EXCELLENT', 'ADEQUATE', 'ACTION_REQUIRED'
  milestone_status TEXT DEFAULT 'PHASE_1_TENANT_CONNECTION' NOT NULL
);

-- ------------------------------------------------------------------------------
-- 7. TABLE: readiness_assessments (Interactive Readiness Calculator Inbound Leads)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.readiness_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  score INTEGER NOT NULL,
  risk_level TEXT NOT NULL, -- 'LOW RISK', 'MODERATE GAP', 'HIGH CARRIER DENIAL RISK'
  mfa_enabled BOOLEAN NOT NULL,
  immutable_backups BOOLEAN NOT NULL,
  edr_deployed BOOLEAN NOT NULL,
  security_training BOOLEAN NOT NULL,
  employee_count INTEGER DEFAULT 25,
  prospect_email TEXT,
  prospect_company TEXT,
  converted_to_application_id TEXT REFERENCES public.applications(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------------------------
-- 8. TABLE: broker_partners (Independent Insurance Broker Directory & Referrals)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.broker_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL UNIQUE,
  primary_contact_name TEXT,
  email TEXT,
  phone TEXT,
  region TEXT DEFAULT 'Georgia / Southeast',
  referral_count INTEGER DEFAULT 0,
  active_client_mrr NUMERIC DEFAULT 0,
  is_verified_partner BOOLEAN DEFAULT TRUE
);

-- Seed common regional commercial broker partners
INSERT INTO public.broker_partners (name, region)
VALUES 
  ('Risk Strategies', 'National / Georgia Practice'),
  ('Gallagher', 'Atlanta Metro Commercial'),
  ('Marsh McLennan Agency', 'Southeast Practice'),
  ('Independent Local Brokerage', 'Georgia')
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 9. TABLE: signed_agreements (Formal Master Services Agreement Legal Records)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.signed_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  application_id TEXT REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  signer_name TEXT NOT NULL,
  signer_title TEXT,
  company_name TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  accepted_rate NUMERIC NOT NULL,
  terms_version TEXT DEFAULT '2026-V2.0' NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  legal_jurisdiction TEXT DEFAULT 'State of Georgia (Fulton County)' NOT NULL
);

-- ------------------------------------------------------------------------------
-- 10. TABLE: erasure_requests (GDPR / Section 42.6 Logged Erasure Workflow)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public lead submission" ON public.applications;
CREATE POLICY "Public lead submission" 
  ON public.applications FOR INSERT 
  WITH CHECK (terms_accepted = true);

-- Security Hardening: Remove open public SELECT.
-- Public clients query individual applications by ID via secure serverless API (/api/get-application)
DROP POLICY IF EXISTS "Public read own application" ON public.applications;

DROP POLICY IF EXISTS "Staff admin full access on applications" ON public.applications;
DROP POLICY IF EXISTS "Service role full access on applications" ON public.applications;
CREATE POLICY "Service role full access on applications" 
  ON public.applications FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- pricing_engine_config
ALTER TABLE public.pricing_engine_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read pricing config" ON public.pricing_engine_config;
CREATE POLICY "Public read pricing config" 
  ON public.pricing_engine_config FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Staff update pricing config" ON public.pricing_engine_config;
DROP POLICY IF EXISTS "Service role update pricing config" ON public.pricing_engine_config;
CREATE POLICY "Service role update pricing config" 
  ON public.pricing_engine_config FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Staff read audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Service role read audit logs" ON public.audit_logs;
CREATE POLICY "Service role read audit logs" 
  ON public.audit_logs FOR SELECT 
  TO service_role
  USING (true);

DROP POLICY IF EXISTS "System insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Service role insert audit logs" ON public.audit_logs;
CREATE POLICY "Service role insert audit logs" 
  ON public.audit_logs FOR INSERT 
  TO service_role
  WITH CHECK (true);

-- subscriptions & payments
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff subscription access" ON public.subscriptions;
DROP POLICY IF EXISTS "Service role subscription access" ON public.subscriptions;
CREATE POLICY "Service role subscription access" 
  ON public.subscriptions FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Staff payment access" ON public.payment_transactions;
DROP POLICY IF EXISTS "Service role payment access" ON public.payment_transactions;
CREATE POLICY "Service role payment access" 
  ON public.payment_transactions FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- onboarding_deployments
ALTER TABLE public.onboarding_deployments ENABLE ROW LEVEL SECURITY;
-- Security Hardening: Remove open public SELECT on onboarding deployments
DROP POLICY IF EXISTS "Public read own onboarding" ON public.onboarding_deployments;

DROP POLICY IF EXISTS "Staff onboarding access" ON public.onboarding_deployments;
DROP POLICY IF EXISTS "Service role onboarding access" ON public.onboarding_deployments;
CREATE POLICY "Service role onboarding access" 
  ON public.onboarding_deployments FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- readiness_assessments
ALTER TABLE public.readiness_assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert readiness assessment" ON public.readiness_assessments;
CREATE POLICY "Public insert readiness assessment" 
  ON public.readiness_assessments FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Staff read readiness assessments" ON public.readiness_assessments;
DROP POLICY IF EXISTS "Service role read readiness assessments" ON public.readiness_assessments;
CREATE POLICY "Service role read readiness assessments" 
  ON public.readiness_assessments FOR SELECT 
  TO service_role
  USING (true);

-- broker_partners
ALTER TABLE public.broker_partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read broker partners" ON public.broker_partners;
CREATE POLICY "Public read broker partners" 
  ON public.broker_partners FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Staff broker partner access" ON public.broker_partners;
DROP POLICY IF EXISTS "Service role broker partner access" ON public.broker_partners;
CREATE POLICY "Service role broker partner access" 
  ON public.broker_partners FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- signed_agreements
ALTER TABLE public.signed_agreements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert signed agreements" ON public.signed_agreements;
DROP POLICY IF EXISTS "Staff signed agreements access" ON public.signed_agreements;
DROP POLICY IF EXISTS "Service role signed agreements access" ON public.signed_agreements;
CREATE POLICY "Service role signed agreements access" 
  ON public.signed_agreements FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- erasure_requests
ALTER TABLE public.erasure_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Staff erasure request access" ON public.erasure_requests;
DROP POLICY IF EXISTS "Service role erasure request access" ON public.erasure_requests;
CREATE POLICY "Service role erasure request access" 
  ON public.erasure_requests FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 12. STORAGE POLICIES: insurance-questionnaires
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public upload to insurance-questionnaires" ON storage.objects;
CREATE POLICY "Public upload to insurance-questionnaires"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    bucket_id = 'insurance-questionnaires' 
    AND (
      name ILIKE '%.pdf' OR 
      name ILIKE '%.docx' OR 
      name ILIKE '%.doc' OR 
      name ILIKE '%.xlsx' OR 
      name ILIKE '%.xls'
    )
  );
