// Sector Seven Cyber LLC - Transactional Email Service
// All email dispatches are securely proxied via serverless /api/send-email.
// API keys are strictly kept server-side to prevent public credential exposure.

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
  try {
    const apiRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(app),
    });

    if (apiRes.ok) {
      const data = await apiRes.json().catch(() => ({}));
      console.log('Transactional email notifications successfully dispatched:', data);
      return true;
    } else {
      console.warn('Server email dispatch returned status:', apiRes.status);
      return false;
    }
  } catch (err) {
    console.warn('Network error while dispatching email alert:', err);
    return false;
  }
}
