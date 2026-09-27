import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Rate Limiting Map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function sanitizeStr(str: any): string {
  if (typeof str !== 'string') return '';
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function isOriginAllowed(origin: string | undefined, hostHeader?: string): boolean {
  if (!origin) return true;
  try {
    const originHost = new URL(origin).hostname.toLowerCase();
    const cleanHost = (hostHeader || '').split(':')[0].trim().toLowerCase();

    // Automatically allow same-host requests from whatever domain the app is deployed on
    if (cleanHost && (originHost === cleanHost || originHost.endsWith('.' + cleanHost) || cleanHost.endsWith('.' + originHost))) {
      return true;
    }

    return (
      originHost === 'sectorsevencyber.com' ||
      originHost.endsWith('.sectorsevencyber.com') ||
      originHost === 'localhost' ||
      originHost === '127.0.0.1' ||
      originHost.endsWith('.vercel.app')
    );
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hostHeader = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string) || '';
  const origin = req.headers.origin as string | undefined;
  if (origin && isOriginAllowed(origin, hostHeader)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate Limiting Check
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const rateData = rateLimitMap.get(clientIp) || { count: 0, resetTime: now + 60000 };
  if (now > rateData.resetTime) {
    rateData.count = 0;
    rateData.resetTime = now + 60000;
  }
  rateData.count += 1;
  rateLimitMap.set(clientIp, rateData);

  if (rateData.count > 10) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Server-Side Schema Validation
  if (!req.body) {
    return res.status(400).json({ error: 'Missing request body.' });
  }

  const rawPayload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!rawPayload.contact_name || typeof rawPayload.contact_name !== 'string' || !rawPayload.contact_name.trim()) {
    return res.status(400).json({ error: 'Invalid or missing contact name.' });
  }
  if (!rawPayload.email || typeof rawPayload.email !== 'string' || !emailRegex.test(rawPayload.email.trim())) {
    return res.status(400).json({ error: 'Invalid or missing email address.' });
  }
  if (!rawPayload.company_name || typeof rawPayload.company_name !== 'string' || !rawPayload.company_name.trim()) {
    return res.status(400).json({ error: 'Invalid or missing company name.' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmexwjocppravvmtwvzc.supabase.co';
    const serviceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const resendApiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY || '';
    const fromEmail = process.env.FROM_EMAIL || process.env.VITE_FROM_EMAIL || 'Sector Seven Cyber <contact@sectorsevencyber.com>';
    const teamEmail = process.env.VITE_INTERNAL_NOTIFICATION_EMAIL || process.env.INTERNAL_NOTIFICATION_EMAIL || 'contact@sectorsevencyber.com';
    const hostHeader = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
    const protoHeader = (req.headers['x-forwarded-proto'] as string) || 'https';
    let envSiteUrl = process.env.VITE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || '';
    if (envSiteUrl && !envSiteUrl.startsWith('http')) {
      envSiteUrl = `https://${envSiteUrl}`;
    }

    let siteUrl = 'https://sectorsevencyber.com';
    if (envSiteUrl && !envSiteUrl.includes('localhost')) {
      siteUrl = envSiteUrl;
    } else if (hostHeader && !hostHeader.includes('localhost')) {
      siteUrl = `${protoHeader}://${hostHeader}`;
    }

    const deviceCount = typeof rawPayload.device_count === 'number' ? rawPayload.device_count : parseInt(rawPayload.device_count || rawPayload.employee_count || '0', 10);
    const cloudUserCount = typeof rawPayload.cloud_user_count === 'number' ? rawPayload.cloud_user_count : parseInt(rawPayload.cloud_user_count || '0', 10);
    const monthlyRate = rawPayload.calculated_monthly_price;
    const isCustom = rawPayload.is_custom_quote || monthlyRate === null;
    const rateDisplay = isCustom ? 'Custom Cybersecurity Plan (Quote Required)' : `$${monthlyRate}/month`;

    const payload = {
      id: sanitizeStr(rawPayload.id),
      contact_name: sanitizeStr(rawPayload.contact_name),
      contact_title: sanitizeStr(rawPayload.contact_title || ''),
      company_name: sanitizeStr(rawPayload.company_name),
      email: sanitizeStr(rawPayload.email),
      phone: sanitizeStr(rawPayload.phone),
      industry: sanitizeStr(rawPayload.industry),
      industry_other: sanitizeStr(rawPayload.industry_other || ''),
      referred_by_broker: sanitizeStr(rawPayload.referred_by_broker || 'No'),
      broker_name: sanitizeStr(rawPayload.broker_name || ''),
      device_count: deviceCount,
      cloud_user_count: cloudUserCount,
      employee_count: `${deviceCount} computers/devices`,
      insurance_provider: sanitizeStr(rawPayload.insurance_provider || 'Standard'),
      insurance_status: sanitizeStr(rawPayload.insurance_status || 'Underwriting Review'),
      file_name: sanitizeStr(rawPayload.file_name || 'None'),
      file_path: rawPayload.file_path || 'NONE',
      message: sanitizeStr(rawPayload.message || '24/7 Managed Detection & Response (MDR)'),
    };

    const hasFile = payload.file_path && payload.file_path !== 'NONE';
    const docToken = hasFile && serviceKey ? crypto.createHmac('sha256', serviceKey).update(payload.file_path).digest('hex').substring(0, 32) : '';
    const viewQuestionnaireUrl = hasFile ? `${siteUrl}/api/view-questionnaire?path=${encodeURIComponent(payload.file_path)}${docToken ? `&token=${docToken}` : ''}` : '';

    // Fetch file from Supabase Storage for Attachment (if present)
    let attachments: Array<{ filename: string; content: string }> = [];
    if (hasFile) {
      try {
        const supabaseAdmin = createClient(supabaseUrl, serviceKey);
        const { data: fileBlob } = await supabaseAdmin.storage
          .from('insurance-questionnaires')
          .download(payload.file_path);

        if (fileBlob) {
          const arrayBuffer = await fileBlob.arrayBuffer();
          const base64Content = Buffer.from(arrayBuffer).toString('base64');
          attachments.push({
            filename: payload.file_name || 'Questionnaire.pdf',
            content: base64Content,
          });
        }
      } catch (attErr) {
        console.warn('Attachment download notice:', attErr);
      }
    }

    const teamEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #0f172a; color: #ffffff; padding: 18px 24px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 16px; font-family: monospace; letter-spacing: 1px; color: #38bdf8;">NEW CYBERSECURITY ASSESSMENT INTAKE</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Cloud & Endpoint Managed Detection & Response (MDR)</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #1e293b;">
          <tr><td style="padding: 9px 0; font-weight: bold; width: 170px; color: #475569;">Company:</td><td style="font-weight: bold; color: #0f172a; font-size: 14px;">${payload.company_name}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Executive Contact:</td><td>${payload.contact_name} ${payload.contact_title ? `(${payload.contact_title})` : ''}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Business Email:</td><td><a href="mailto:${payload.email}" style="color: #0284C7; font-weight: bold;">${payload.email}</a></td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Direct Phone:</td><td>${payload.phone}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Industry Sector:</td><td>${payload.industry} ${payload.industry_other ? `[Focus: ${payload.industry_other}]` : ''}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Protected Environment:</td><td style="font-weight: bold; color: #0284C7;">${payload.device_count} computers/devices • ${payload.cloud_user_count} cloud accounts</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Calculated Rate:</td><td style="font-weight: bold; color: #0f172a;">${rateDisplay}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Broker Referral:</td><td>${payload.referred_by_broker === 'Yes' ? `Referred by: ${payload.broker_name || 'Independent Broker'}` : 'Direct Lead (No Broker)'}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Cyber Liability Status:</td><td>${payload.insurance_status}</td></tr>
          <tr><td style="padding: 9px 0; font-weight: bold; color: #475569;">Application ID:</td><td style="font-family: monospace; font-weight: bold; color: #0284C7;">${payload.id}</td></tr>
        </table>
        
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; font-family: monospace;">
          Sector Seven Cyber LLC • Georgia Managed Cybersecurity SOC Telemetry
        </div>
      </div>
    `;

    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #0f172a; color: #ffffff; padding: 18px 24px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 16px; font-family: monospace; color: #38bdf8;">SECTOR SEVEN CYBER LLC</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Cloud & Endpoint Managed Detection & Response (MDR)</p>
        </div>

        <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">Dear ${payload.contact_name},</p>

        <p style="font-size: 14px; color: #1e293b; line-height: 1.6; font-weight: bold;">
          Assessment received. Sector Seven Cyber will review your submission and contact you regarding the next steps.
        </p>

        <p style="font-size: 13px; color: #334155; line-height: 1.6;">
          Our engineering team is evaluating your environment specifications to prepare your technical onboarding and 24/7 Security Operations Center (SOC) scope.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 12px 0; font-size: 13px; font-family: monospace; color: #0284C7; text-transform: uppercase;">Assessment Summary</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.8;">
            <li><strong>Application Reference ID:</strong> <span style="font-family: monospace; font-weight: bold;">${payload.id}</span></li>
            <li><strong>Organization:</strong> ${payload.company_name}</li>
            <li><strong>Protected Footprint:</strong> ${payload.device_count} computers/devices • ${payload.cloud_user_count} cloud accounts</li>
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

    // 1. Try Resend API First (Primary Production Provider)
    if (resendApiKey) {
      try {
        let activeFrom = fromEmail;
        let teamRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: activeFrom,
            to: [teamEmail],
            subject: `NEW CYBERSECURITY ASSESSMENT: ${payload.company_name} [${payload.id}]`,
            html: teamEmailHtml,
            attachments: attachments.length > 0 ? attachments : undefined,
          }),
        });

        let teamData = await teamRes.json();

        // If custom domain is not yet verified in Resend (status 403), fallback to onboarding@resend.dev during DNS propagation
        if (!teamRes.ok && teamData?.name === 'validation_error') {
          activeFrom = 'Sector Seven Cyber <onboarding@resend.dev>';
          teamRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: activeFrom,
              to: [teamEmail],
              subject: `NEW CYBERSECURITY ASSESSMENT: ${payload.company_name} [${payload.id}]`,
              html: teamEmailHtml,
              attachments: attachments.length > 0 ? attachments : undefined,
            }),
          });
          teamData = await teamRes.json();
        }

        if (teamRes.ok) {
          let clientData = null;
          if (payload.email) {
            let clientRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`,
              },
              body: JSON.stringify({
                from: activeFrom,
                to: [payload.email],
                subject: `Cybersecurity Assessment Received - Sector Seven Cyber [${payload.id}]`,
                html: clientEmailHtml,
              }),
            });
            clientData = await clientRes.json();

            if (!clientRes.ok) {
              const copyRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${resendApiKey}`,
                },
                body: JSON.stringify({
                  from: activeFrom,
                  to: [teamEmail],
                  subject: `[PROSPECT CONFIRMATION COPY for ${payload.email}] Cybersecurity Assessment Received - Sector Seven Cyber [${payload.id}]`,
                  html: clientEmailHtml,
                }),
              });
              clientData = await copyRes.json();
            }
          }

          return res.status(200).json({ success: true, provider: 'resend_api', senderUsed: activeFrom, teamResend: teamData, clientResend: clientData });
        } else {
          console.error('Resend API returned non-OK status:', teamData);
          return res.status(502).json({ error: 'Failed to deliver notification email via Resend API.', details: teamData });
        }
      } catch (resendErr: any) {
        console.error('Resend API dispatch error:', resendErr);
        return res.status(502).json({ error: 'Resend API network error.', details: resendErr?.message });
      }
    }

    return res.status(500).json({
      error: 'Enterprise email service not configured. Set VITE_RESEND_API_KEY in environment.',
      debug: {
        hasResendKey: !!resendApiKey,
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'An internal error occurred. Please try again.' });
  }
}
