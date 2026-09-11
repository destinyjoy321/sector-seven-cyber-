// Transactional Email Service via Resend API (Section 12, 13, 14 of Specification)

export interface EmailNotificationPayload {
  id: string;
  contact_name: string;
  contact_title?: string;
  company_name: string;
  email: string;
  phone: string;
  industry: string;
  industry_other?: string;
  referred_by_broker?: string;
  broker_name?: string;
  employee_count: string;
  insurance_provider: string;
  insurance_status: string;
  file_name: string;
  file_path?: string;
  message?: string;
}

export async function sendApplicationEmailAlert(app: EmailNotificationPayload): Promise<boolean> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';
  const recipientEmail = import.meta.env.VITE_INTERNAL_NOTIFICATION_EMAIL || 'ikehemmanuel70@gmail.com';

  if (!apiKey) {
    console.log('Resend API key missing in environment. Set VITE_RESEND_API_KEY in .env.local to enable real-time email alerts.');
    return false;
  }

  // 1. Try server endpoint first (bypasses browser CORS & handles dual emails)
  try {
    const apiRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(app),
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      console.log('Dual transactional email notifications dispatched via Resend API:', data);
      return true;
    }
  } catch (err) {
    console.warn('Server email endpoint fallback active:', err);
  }

  // 2. Direct Resend API fallback
  try {
    let envSiteUrl = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    if (!envSiteUrl || envSiteUrl.includes('localhost')) {
      envSiteUrl = 'https://sectorsevencyber.vercel.app';
    }
    const siteUrl = envSiteUrl;
    const viewQuestionnaireUrl = `${siteUrl}/api/view-questionnaire?path=${encodeURIComponent(app.file_path || '')}`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: import.meta.env.VITE_FROM_EMAIL || 'Sector Seven Cyber <contact@sectorsevencyber.com>',
        to: [recipientEmail],
        subject: `NEW CYBER INSURANCE ASSESSMENT: ${app.company_name} [${app.id}]`,

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff;">
            <div style="background-color: #0f172a; color: #ffffff; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 16px; font-family: monospace; letter-spacing: 1px;">NEW CYBER INSURANCE ASSESSMENT</h2>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1e293b;">
              <tr><td style="padding: 10px 0; font-weight: bold; width: 150px; color: #475569;">Company:</td><td style="font-weight: bold; color: #0f172a;">${app.company_name}</td></tr>
              <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Contact:</td><td>${app.contact_name}</td></tr>
              <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Email:</td><td><a href="mailto:${app.email}" style="color: #2563eb; font-weight: bold;">${app.email}</a></td></tr>
              <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Phone:</td><td>${app.phone}</td></tr>
              <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Industry:</td><td>${app.industry} (${app.employee_count} employees)</td></tr>
              <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Insurance Status:</td><td>${app.insurance_status} (${app.insurance_provider})</td></tr>
              <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Questionnaire:</td><td>📄 ${app.file_name}</td></tr>
              <tr>
                <td style="padding: 16px 0;" colspan="2">
                  <a href="${viewQuestionnaireUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-family: monospace; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px;">[VIEW QUESTIONNAIRE]</a>
                </td>
              </tr>
              <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Application ID:</td><td style="font-family: monospace; font-weight: bold; color: #2563eb;">${app.id}</td></tr>
            </table>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; font-family: monospace;">
              Sector Seven Cyber LLC • Georgia Cyber Readiness Intake System
            </div>
          </div>
        `,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Direct Resend email fallback response:', data);
      return true;
    }
  } catch (err) {
    console.warn('Direct Resend email fallback error:', err);
  }

  return false;
}

