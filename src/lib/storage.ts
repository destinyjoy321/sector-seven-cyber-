import { ProspectApplication, ApplicationStatus, ErasureRequest } from '../types';
import { supabase, supabaseAdmin } from './supabaseClient';
import { sendApplicationEmailAlert } from './email';

const DB_KEY = 'sector_seven_applications_db';
const ERASURE_KEY = 'sector_seven_erasure_requests_db';

// Production Clean State: Zero hardcoded dummy applications.
// Only applications submitted by real prospects through the assessment flow or stored in Supabase are displayed.
const INITIAL_APPLICATIONS: ProspectApplication[] = [];

// Known dummy mock IDs and emails to permanently purge from storage
const MOCK_IDS = new Set(['SS-2026-0084', 'SS-2026-0083', 'SS-2026-0082', 'SS-2026-DEMO']);
const MOCK_EMAILS = new Set(['m.vance@vancelawga.com', 'sjenkins@peachtreesurgical.org', 'dsterling@sterlingcpa.com', 'client@company.com']);

export function getStoredApplications(): ProspectApplication[] {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Filter out any legacy dummy mock records
    const realApps = parsed.filter((a: any) => 
      !MOCK_IDS.has(a.id) && !MOCK_EMAILS.has(a.email)
    );
    // If the storage contained dummy data, persist the sanitized array
    if (realApps.length !== parsed.length) {
      localStorage.setItem(DB_KEY, JSON.stringify(realApps));
    }
    return realApps;
  } catch (e) {
    return [];
  }
}

function normalizeApplicationRecord(a: any): ProspectApplication {
  let deviceCount = a.device_count;
  let cloudUserCount = a.cloud_user_count;
  let calculatedPrice = a.calculated_monthly_price;
  let planName = a.plan_name;
  let evaluatingQty = a.evaluating_quantity;

  if (deviceCount === undefined || deviceCount === null) {
    const devMatch = (a.employee_count || '').match(/(\d+)\s*devices?/i);
    if (devMatch) {
      deviceCount = parseInt(devMatch[1], 10);
    } else {
      const numMatch = (a.employee_count || '').match(/\d+/);
      deviceCount = numMatch ? parseInt(numMatch[0], 10) : 10;
    }
  }

  if (cloudUserCount === undefined || cloudUserCount === null) {
    const cloudMatch = (a.employee_count || '').match(/(\d+)\s*cloud\s*users?/i);
    cloudUserCount = cloudMatch ? parseInt(cloudMatch[1], 10) : 0;
  }

  if (evaluatingQty === undefined || evaluatingQty === null) {
    evaluatingQty = Math.max(Number(deviceCount) || 1, Number(cloudUserCount) || 0);
  }

  if (calculatedPrice === undefined || calculatedPrice === null) {
    const priceMatch = (a.message || a.insurance_provider || '').match(/\$([0-9,]+)/);
    if (priceMatch) {
      calculatedPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
    }
  }

  const isCustomQuote = a.is_custom_quote ?? (evaluatingQty > 30 || calculatedPrice === null);

  return {
    ...a,
    device_count: Number(deviceCount) || 1,
    cloud_user_count: Number(cloudUserCount) || 0,
    evaluating_quantity: evaluatingQty,
    calculated_monthly_price: calculatedPrice !== undefined && calculatedPrice !== null ? Number(calculatedPrice) : null,
    plan_name: planName || (evaluatingQty > 30 ? 'Custom Cybersecurity Plan' : 'Sector Seven Cyber Protection'),
    is_custom_quote: isCustomQuote,
    status: a.status || 'NEW',
    terms_accepted: Boolean(a.terms_accepted),
    insurance_provider: a.insurance_provider || 'Standard Infrastructure',
    insurance_status: a.insurance_status || 'CURRENTLY_INSURED',
  };
}

export async function fetchLiveApplications(): Promise<ProspectApplication[]> {
  const localApps = getStoredApplications().map(normalizeApplicationRecord);
  try {
    const adminPasscode = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('sector_seven_admin_passcode') || '') : '';
    const res = await fetch(`/api/admin-applications?passcode=${encodeURIComponent(adminPasscode)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.applications) && data.applications.length > 0) {
        return data.applications
          .filter((a: any) => !MOCK_IDS.has(a.id) && !MOCK_EMAILS.has(a.email))
          .map(normalizeApplicationRecord);
      }
    }
  } catch (err) {
    console.warn('Could not fetch live admin apps via API:', err);
  }
  return localApps;
}

export async function getApplicationById(id: string): Promise<ProspectApplication | null> {
  const localApps = getStoredApplications();
  const matched = localApps.find((a) => a.id === id);
  if (matched) return normalizeApplicationRecord(matched);

  try {
    const res = await fetch(`/api/get-application?id=${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.application && !MOCK_IDS.has(data.application.id)) {
        return normalizeApplicationRecord(data.application);
      }
    }
  } catch (err) {
    console.warn('Error fetching application by id via secure API:', err);
  }

  return null;
}

export async function saveApplication(
  app: ProspectApplication,
  fileInput?: File[] | File
): Promise<void> {
  app.notification_status = 'PENDING';
  const filesList: File[] = Array.isArray(fileInput) ? fileInput : fileInput ? [fileInput] : [];

  // Optional file upload support
  if (filesList.length > 0) {
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      const ext = file.name.split('.').pop() || 'pdf';
      const targetFilePath = app.file_path || `${app.id}/document.${ext}`;
      const dirPath = targetFilePath.includes('/')
        ? targetFilePath.substring(0, targetFilePath.lastIndexOf('/'))
        : targetFilePath;
      const randomId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID().slice(0, 8)
        : Math.floor(100000 + Math.random() * 900000).toString(36);
      const storagePath =
        filesList.length === 1
          ? targetFilePath
          : `${dirPath}/doc-${i + 1}-${randomId}.${ext}`;

      try {
        await supabase.storage.from('insurance-questionnaires').upload(storagePath, file, { upsert: true });
      } catch (e) {
        console.warn('Storage upload fallback notice:', e);
      }
    }
  }

  // 1. Save to local storage
  const current = getStoredApplications();
  const filtered = current.filter((a) => a.id !== app.id);
  const updated = [app, ...filtered];
  localStorage.setItem(DB_KEY, JSON.stringify(updated));

  // 2. Insert into Supabase (with automatic fallback to backward-compatible schema if columns are pending migration)
  try {
    const { error: initialErr } = await supabase.from('applications').upsert([app]);
    if (initialErr) {
      console.warn('Supabase native V2 upsert returned schema notice, syncing with compatible adapter:', initialErr.message);
      const rateLabel = app.is_custom_quote || app.calculated_monthly_price === null
        ? 'Custom Quote Required'
        : `$${app.calculated_monthly_price}/month`;

      const legacyPayload = {
        id: app.id,
        created_at: app.created_at || new Date().toISOString(),
        updated_at: app.updated_at || new Date().toISOString(),
        contact_name: app.contact_name,
        company_name: app.company_name,
        email: app.email,
        phone: app.phone,
        industry: app.industry,
        employee_count: `${app.device_count || 1} devices, ${app.cloud_user_count || 0} cloud users`,
        insurance_status: app.insurance_status || 'CURRENTLY_INSURED',
        insurance_provider: `Sector Seven MDR (${rateLabel})`,
        file_name: app.file_name || 'assessment_scope.json',
        file_size: app.file_size || 1024,
        file_type: app.file_type || 'application/json',
        file_path: app.file_path || `direct_intake/${app.id}.json`,
        status: app.status || 'NEW',
        terms_accepted: Boolean(app.terms_accepted),
        terms_accepted_at: app.terms_accepted_at || new Date().toISOString(),
        terms_version: app.terms_version || '2026-09-01',
        message: `Plan: ${app.plan_name || 'Sector Seven Cyber Protection'} | Rate: ${rateLabel} | Devices: ${app.device_count} | Cloud Users: ${app.cloud_user_count} | Title: ${app.contact_title || 'N/A'} | Broker: ${app.referred_by_broker || 'No'}${app.broker_name ? ` (${app.broker_name})` : ''}`,
        notes: app.notes || ''
      };

      const { error: adapterErr } = await supabase.from('applications').upsert([legacyPayload]);
      if (adapterErr) {
        console.error('Supabase fallback upsert notice:', adapterErr);
      } else {
        console.log('Successfully written to Supabase via compatible adapter.');
      }
    } else {
      console.log('Successfully written to Supabase with native V2 schema.');
    }

    // Log audit event to live audit_logs table & initialize onboarding deployment
    try {
      await supabase.from('audit_logs').insert([{
        event_type: 'ASSESSMENT_SUBMITTED',
        actor: 'CLIENT',
        application_id: app.id,
        title: 'New Assessment Intake',
        detail: `${app.company_name} · ${app.contact_name} ($${app.calculated_monthly_price || 500}/mo)`,
        metadata: {
          devices: app.device_count,
          cloud_users: app.cloud_user_count,
          plan: app.plan_name,
          broker_referral: app.referred_by_broker === 'Yes' ? app.broker_name : 'Direct'
        }
      }]);

      await supabase.from('onboarding_deployments').upsert([{
        application_id: app.id,
        agents_target: app.device_count || 1,
        milestone_status: 'PHASE_1_TENANT_CONNECTION'
      }], { onConflict: 'application_id' });
    } catch (e) {
      console.warn('Audit/Deployment init notice:', e);
    }
  } catch (err) {
    console.warn('Supabase DB upsert network notice:', err);
  }

  // 3. Trigger transactional email alert via API (dual alert to client and internal team)
  try {
    const emailSent = await sendApplicationEmailAlert({
      id: app.id,
      contact_name: app.contact_name,
      contact_title: app.contact_title,
      company_name: app.company_name,
      email: app.email,
      phone: app.phone,
      industry: app.industry,
      industry_other: app.industry_other,
      referred_by_broker: app.referred_by_broker,
      broker_name: app.broker_name,
      device_count: app.device_count,
      cloud_user_count: app.cloud_user_count,
      employee_count: `${app.device_count} computers/devices`,
      calculated_monthly_price: app.calculated_monthly_price,
      plan_name: app.plan_name,
      is_custom_quote: app.is_custom_quote,
      insurance_provider: app.insurance_provider || 'Standard Infrastructure',
      insurance_status: app.insurance_status,
      file_name: app.file_name,
      file_path: app.file_path,
      message: app.message,
    });
    app.notification_status = emailSent ? 'SENT' : 'FAILED';
  } catch (emailErr) {
    app.notification_status = 'FAILED';
  }

  // Persist updated notification status
  const currentStored = getStoredApplications();
  const index = currentStored.findIndex((a) => a.id === app.id);
  if (index !== -1) {
    currentStored[index].notification_status = app.notification_status;
    localStorage.setItem(DB_KEY, JSON.stringify(currentStored));
  }
}

export function updateApplicationFields(
  id: string,
  updates: Partial<ProspectApplication>
): ProspectApplication | null {
  const current = getStoredApplications();
  let updatedRecord: ProspectApplication | null = null;

  const updated = current.map((app) => {
    if (app.id === id) {
      updatedRecord = {
        ...app,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return updatedRecord;
    }
    return app;
  });

  if (updatedRecord) {
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    try {
      supabaseAdmin
        .from('applications')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .then(async () => {
          if (updates.agreement_signed && updates.agreement_signer_name) {
            await supabaseAdmin.from('signed_agreements').insert([{
              application_id: id,
              signer_name: updates.agreement_signer_name,
              company_name: (updatedRecord as ProspectApplication)?.company_name || 'Organization',
              signer_email: (updatedRecord as ProspectApplication)?.email || 'N/A',
              accepted_rate: (updatedRecord as ProspectApplication)?.calculated_monthly_price || 500,
              terms_version: (updatedRecord as ProspectApplication)?.terms_version || '2026-V2.0'
            }]);

            await supabaseAdmin.from('audit_logs').insert([{
              event_type: 'AGREEMENT_SIGNED',
              actor: 'CLIENT',
              application_id: id,
              title: 'Master Services Agreement Executed',
              detail: `Signed by ${updates.agreement_signer_name}`,
              metadata: { terms_version: '2026-V2.0' }
            }]);
          }

          if (updates.status === 'PAID') {
            await supabaseAdmin.from('audit_logs').insert([{
              event_type: 'PAYMENT_COMPLETED',
              actor: 'STRIPE_WEBHOOK',
              application_id: id,
              title: 'Subscription Activated',
              detail: `Payment confirmed for ${(updatedRecord as ProspectApplication)?.company_name || id}`,
              metadata: { session_id: updates.stripe_session_id }
            }]);
          } else if (updates.status) {
            await supabaseAdmin.from('audit_logs').insert([{
              event_type: 'STATUS_CHANGED',
              actor: 'ADMIN',
              application_id: id,
              title: `Status Changed: ${updates.status}`,
              detail: `Application status transitioned to ${updates.status}`,
              metadata: { status: updates.status }
            }]);
          }
        });
    } catch (e) {
      console.warn('Supabase update notice:', e);
    }
  }

  return updatedRecord;
}

export function upsertStoredApplication(app: ProspectApplication): void {
  try {
    const normalized = normalizeApplicationRecord(app);
    const current = getStoredApplications();
    const index = current.findIndex((a) => a.id === normalized.id);
    if (index !== -1) {
      current[index] = { ...current[index], ...normalized };
    } else {
      current.unshift(normalized);
    }
    localStorage.setItem(DB_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Upsert stored application notice:', e);
  }
}

export function updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string): void {
  updateApplicationFields(id, {
    status,
    ...(notes !== undefined ? { notes } : {}),
  });

  try {
    const adminPasscode = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('sector_seven_admin_passcode') || '') : '';
    fetch('/api/admin-applications', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminPasscode}`,
      },
      body: JSON.stringify({ id, status, notes }),
    }).catch(() => {});
  } catch (err) {
    // ignore
  }
}

// Data Erasure Request (Retained for regulatory compliance)
export function getErasureRequests(): ErasureRequest[] {
  try {
    const raw = localStorage.getItem(ERASURE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function createErasureRequest(
  email: string,
  applicationId?: string,
  scope: string = 'FULL_ERASURE_AND_ANONYMIZATION'
): ErasureRequest {
  const current = getErasureRequests();
  const newReq: ErasureRequest = {
    id: `DEL-${Date.now().toString(36).toUpperCase()}`,
    request_date: new Date().toISOString(),
    requester_email: email,
    application_id: applicationId,
    scope,
    status: 'PENDING',
    legal_hold_check: true,
  };
  localStorage.setItem(ERASURE_KEY, JSON.stringify([newReq, ...current]));
  supabase.from('erasure_requests').insert([newReq]).then();
  return newReq;
}

export async function fetchLiveAuditLogs(): Promise<any[]> {
  try {
    const adminPasscode = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('sector_seven_admin_passcode') || '') : '';
    const res = await fetch(`/api/admin-applications?passcode=${encodeURIComponent(adminPasscode)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.auditLogs)) return data.auditLogs;
    }
  } catch (e) {
    console.warn('Fetch audit logs error:', e);
  }
  return [];
}

export async function saveReadinessAssessment(assessment: {
  score: number;
  risk_level: string;
  mfa_enabled: boolean;
  immutable_backups: boolean;
  edr_deployed: boolean;
  security_training: boolean;
  employee_count: number;
  prospect_email?: string;
  prospect_company?: string;
}): Promise<void> {
  try {
    await supabase.from('readiness_assessments').insert([assessment]);
  } catch (e) {
    console.warn('Save readiness assessment notice:', e);
  }
}

