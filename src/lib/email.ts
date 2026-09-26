// Sector Seven Cyber LLC - Transactional Email Service via Resend API
// Grounded strictly in Final Specification (B2B MDR, Dual Notification, Transparent Scope)

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
  device_count?: number;
  cloud_user_count?: number | string;
  employee_count?: string;
  calculated_monthly_price?: number | null;
  plan_name?: string;
  is_custom_quote?: boolean;
  insurance_provider?: string;
  insurance_status?: string;
  file_name?: string;
  file_path?: string;
  message?: string;
}

export async function sendApplicationEmailAlert(app: EmailNotificationPayload): Promise<boolean> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';
  const recipientEmail = import.meta.env.VITE_INTERNAL_NOTIFICATION_EMAIL || 'contact@sectorsevencyber.com';

  if (!apiKey) {
    console.log('Resend API key missing in environment. Set VITE_RESEND_API_KEY in .env.local to enable real-time email alerts.');
    return false;
  }

  // 1. Try serverless endpoint first (bypasses browser CORS & handles dual emails + file attachments)
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
      console.log('Dual transactional email notifications dispatched via serverless endpoint:', data);
      return true;
    }
  } catch (err) {
    console.warn('Server email endpoint fallback active, attempting direct Resend dispatch:', err);
  }

  // 2. Direct Resend API Fallback
  try {
    const fromEmail = import.meta.env.VITE_FROM_EMAIL || 'Sector Seven Cyber <contact@sectorsevencyber.com>';
    const isCustom = app.is_custom_quote || app.calculated_monthly_price === null;
    const rateDisplay = isCustom ? 'Custom Cybersecurity Plan (Quote Required)' : `$${app.calculated_monthly_price}/month`;

    const teamHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #0f172a; color: #ffffff; padding: 18px 24px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 16px; font-family: monospace; letter-spacing: 1px; color: #38bdf8;">NEW CYBERSECURITY ASSESSMENT INTAKE</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Cloud & Endpoint Managed Detection & Response (MDR)</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #1e293b;">
          <tr><td style="padding: 9px 0; font-weight: bold; width: 170px; color: #475569;">Company:</td><td style="font-weight: bold; color: #0f172a; font-size: 14px;">${app.company_name}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Executive Contact:</td><td>${app.contact_name} ${app.contact_title ? `(${app.contact_title})` : ''}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Business Email:</td><td><a href="mailto:${app.email}" style="color: #0284C7; font-weight: bold;">${app.email}</a></td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Direct Phone:</td><td>${app.phone}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Industry Sector:</td><td>${app.industry} ${app.industry_other ? `[Focus: ${app.industry_other}]` : ''}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Protected Environment:</td><td style="font-weight: bold; color: #0284C7;">${app.device_count || app.employee_count} computers/devices • ${app.cloud_user_count || '0'} cloud identity accounts</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Quoted Service Rate:</td><td style="font-weight: bold; color: #0f172a;">${rateDisplay}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Broker Referral:</td><td>${app.referred_by_broker === 'Yes' ? `Referred by: ${app.broker_name || 'Independent Broker'}` : 'Direct Lead (No Broker)'}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Cyber Liability Status:</td><td>${app.insurance_status || 'Standard Application'}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Reference ID:</td><td style="font-family: monospace; font-weight: bold; color: #0284C7;">${app.id}</td></tr>
        </table>
        
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; font-family: monospace;">
          Sector Seven Cyber LLC • Georgia Managed Cybersecurity SOC Telemetry
        </div>
      </div>
    `;

    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #0f172a; color: #ffffff; padding: 18px 24px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 16px; font-family: monospace; color: #38bdf8;">SECTOR SEVEN CYBER LLC</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Cloud & Endpoint Managed Detection & Response (MDR)</p>
        </div>

        <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">Dear ${app.contact_name},</p>

        <p style="font-size: 14px; color: #1e293b; line-height: 1.6; font-weight: bold;">
          Assessment received. Sector Seven Cyber will review your submission and contact you regarding the next steps.
        </p>

        <p style="font-size: 13px; color: #334155; line-height: 1.6;">
          Our engineering team is evaluating your environment specifications to prepare your technical onboarding and 24/7 Security Operations Center (SOC) scope.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 12px 0; font-size: 13px; font-family: monospace; color: #0284C7; text-transform: uppercase;">Assessment Summary</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.8;">
            <li><strong>Application Reference ID:</strong> <span style="font-family: monospace; font-weight: bold;">${app.id}</span></li>
            <li><strong>Organization:</strong> ${app.company_name}</li>
            <li><strong>Protected Footprint:</strong> ${app.device_count || app.employee_count} computers/devices • ${app.cloud_user_count || '0'} cloud accounts</li>
            <li><strong>Calculated Rate:</strong> <strong>${rateDisplay}</strong></li>
            <li><strong>Included Capabilities:</strong> 24/7 SOC Active Response, EDR Telemetry, Cloud Identity Defense (M365/Google Workspace), Security Posture Rating, and Asset Inventory.</li>
          </ul>
        </div>

        <p style="font-size: 12px; color: #64748b; line-height: 1.6;">
          Pricing is based on the information and quantities provided during your assessment. If the number of devices or cloud users requiring protection differs during onboarding or changes during the service period, your service plan and recurring monthly charge may be adjusted accordingly.
        </p>

        <p style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-family: monospace;">
          Sector Seven Cyber LLC • Direct Phone: +1 (470) 363-9083 • contact@sectorsevencyber.com • Atlanta, Georgia
        </p>
      </div>
    `;

    // Dispatch internal alert to Sector Seven
    const resTeam = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipientEmail],
        subject: `NEW CYBERSECURITY ASSESSMENT: ${app.company_name} [${app.id}] — Cloud & Endpoint MDR`,
        html: teamHtml,
      }),
    });

    // Dispatch confirmation to respondent
    if (app.email) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [app.email],
          subject: `Sector Seven Cyber — Cybersecurity Assessment Received [${app.id}]`,
          html: clientHtml,
        }),
      });
    }

    if (resTeam.ok) {
      console.log('Direct Resend email fallback successfully dispatched.');
      return true;
    }
  } catch (err) {
    console.warn('Direct Resend email fallback error:', err);
  }

  return false;
}
