// Transactional Email Service via Resend API (Section 12, 13, 14 of Specification)

export interface EmailNotificationPayload {
  id: string;
  contact_name: string;
  company_name: string;
  email: string;
  phone: string;
  industry: string;
  employee_count: string;
  insurance_provider: string;
  insurance_status: string;
  file_name: string;
  message?: string;
}

export async function sendApplicationEmailAlert(app: EmailNotificationPayload): Promise<void> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';
  const recipientEmail = import.meta.env.VITE_INTERNAL_NOTIFICATION_EMAIL || 'ikehemmanuel70@gmail.com';

  if (!apiKey) {
    console.log('Resend API key missing in environment. Set VITE_RESEND_API_KEY in .env.local to enable real-time email alerts.');
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Sector Seven Intake <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: `🚨 NEW INTAKE: ${app.company_name} (${app.industry}) [${app.id}]`,

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="background-color: #2563eb; color: #ffffff; padding: 16px 20px; border-radius: 12px; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 18px; font-weight: bold;">SECTOR SEVEN CYBER LLC - NEW LEAD INTAKE</h2>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1e293b;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 140px; color: #64748b;">Reference ID:</td><td style="font-family: monospace; font-weight: bold; color: #2563eb;">${app.id}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Company Name:</td><td style="font-weight: bold;">${app.company_name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Contact Name:</td><td>${app.contact_name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Email Address:</td><td><a href="mailto:${app.email}" style="color: #2563eb;">${app.email}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Phone Number:</td><td>${app.phone}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Industry / Staff:</td><td>${app.industry} (${app.employee_count} employees)</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Carrier & Status:</td><td>${app.insurance_provider} (${app.insurance_status})</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Uploaded Document:</td><td>📄 ${app.file_name}</td></tr>
              ${app.message ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Notes:</td><td><em>"${app.message}"</em></td></tr>` : ''}
            </table>
            
            <div style="margin-top: 24px; padding-top: 16px; border-t: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; font-family: monospace;">
              Sector Seven Cyber LLC • Georgia B2B Intake Service • Section 42 Compliant
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();
    console.log('Resend email response:', data);
  } catch (err) {
    console.warn('Resend email error:', err);
  }
}
