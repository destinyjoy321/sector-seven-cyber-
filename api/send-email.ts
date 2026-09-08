import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Rate Limiting Map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function sanitizeStr(str: any): string {
  if (typeof str !== 'string') return '';
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmexwjocppravvmtwvzc.supabase.co';
    const serviceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const resendApiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY || '';
    const fromEmail = process.env.FROM_EMAIL || process.env.VITE_FROM_EMAIL || 'Sector Seven Cyber <onboarding@resend.dev>';
    const teamEmail = process.env.VITE_INTERNAL_NOTIFICATION_EMAIL || process.env.INTERNAL_NOTIFICATION_EMAIL || 'ikehemmanuel70@gmail.com';
    const gmailUser = process.env.GMAIL_USER || '';
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
    const siteUrl = process.env.VITE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const rawPayload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const payload = {
      id: sanitizeStr(rawPayload.id),
      contact_name: sanitizeStr(rawPayload.contact_name),
      company_name: sanitizeStr(rawPayload.company_name),
      email: sanitizeStr(rawPayload.email),
      phone: sanitizeStr(rawPayload.phone),
      industry: sanitizeStr(rawPayload.industry),
      employee_count: sanitizeStr(rawPayload.employee_count),
      insurance_provider: sanitizeStr(rawPayload.insurance_provider),
      insurance_status: sanitizeStr(rawPayload.insurance_status),
      file_name: sanitizeStr(rawPayload.file_name),
      file_path: rawPayload.file_path || '',
      message: sanitizeStr(rawPayload.message || ''),
    };

    const viewQuestionnaireUrl = `${siteUrl}/api/view-questionnaire?path=${encodeURIComponent(payload.file_path)}`;

    // Fetch file from Supabase Storage for Attachment
    let attachments: Array<{ filename: string; content: string }> = [];
    if (payload.file_path) {
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #0f172a; color: #ffffff; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 16px; font-family: monospace; letter-spacing: 1px;">NEW CYBER INSURANCE ASSESSMENT</h2>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1e293b;">
          <tr><td style="padding: 10px 0; font-weight: bold; width: 150px; color: #475569;">Company:</td><td style="font-weight: bold; color: #0f172a;">${payload.company_name}</td></tr>
          <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Contact:</td><td>${payload.contact_name}</td></tr>
          <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Email:</td><td><a href="mailto:${payload.email}" style="color: #2563eb; font-weight: bold;">${payload.email}</a></td></tr>
          <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Phone:</td><td>${payload.phone}</td></tr>
          <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Industry:</td><td>${payload.industry} (${payload.employee_count} employees)</td></tr>
          <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Insurance Status:</td><td>${payload.insurance_status} (${payload.insurance_provider})</td></tr>
          <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Questionnaire:</td><td>📄 ${payload.file_name} ${attachments.length > 0 ? '(Attached)' : ''}</td></tr>
          <tr>
            <td style="padding: 16px 0;" colspan="2">
              <a href="${viewQuestionnaireUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-family: monospace; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 8px;">[VIEW QUESTIONNAIRE]</a>
            </td>
          </tr>
          <tr><td style="padding: 10px 0; font-weight: bold; color: #475569;">Application ID:</td><td style="font-family: monospace; font-weight: bold; color: #2563eb;">${payload.id}</td></tr>
        </table>
        
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; font-family: monospace;">
          Sector Seven Cyber LLC • Georgia Cyber Readiness Intake System
        </div>
      </div>
    `;

    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #0f172a; color: #ffffff; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 16px; font-family: monospace;">SECTOR SEVEN CYBER LLC</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Cyber Insurance Readiness & Technical Remediation</p>
        </div>

        <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">Thank you for contacting Sector Seven Cyber.</p>

        <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">
          We have received your information and insurance questionnaire.
        </p>

        <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">
          Our team will review the submitted information and contact you regarding the next steps.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; font-size: 13px; font-family: monospace; color: #2563eb; text-transform: uppercase;">Submission Reference</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.8;">
            <li><strong>Application ID:</strong> ${payload.id}</li>
            <li><strong>Company:</strong> ${payload.company_name}</li>
            <li><strong>Questionnaire:</strong> ${payload.file_name}</li>
          </ul>
        </div>

        <p style="font-size: 12px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-family: monospace;">
          Sector Seven Cyber LLC • Direct Phone: +1 (404) 892-3400
        </p>
      </div>
    `;

    // 1. Try Gmail SMTP if credentials present
    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailUser, pass: gmailPass },
        });

        const teamInfo = await transporter.sendMail({
          from: `"Sector Seven Intake" <${gmailUser}>`,
          to: teamEmail,
          subject: `NEW CYBER INSURANCE ASSESSMENT: ${payload.company_name} [${payload.id}]`,
          html: teamEmailHtml,
          attachments: attachments.map(a => ({
            filename: a.filename,
            content: Buffer.from(a.content, 'base64'),
          })),
        });

        let clientInfo = null;
        if (payload.email) {
          clientInfo = await transporter.sendMail({
            from: `"Sector Seven Cyber" <${gmailUser}>`,
            replyTo: gmailUser,
            to: payload.email,
            subject: 'Your Cyber Insurance Assessment Request Has Been Received',
            html: clientEmailHtml,
          });
        }

        return res.status(200).json({
          success: true,
          provider: 'gmail_smtp',
          teamMessageId: teamInfo.messageId,
          clientMessageId: clientInfo?.messageId,
        });
      } catch (gmailErr: any) {
        console.warn('Gmail SMTP error, falling back to Resend API:', gmailErr?.message || gmailErr);
      }
    }

    // 2. Resend API Fallback
    if (resendApiKey) {
      const teamRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [teamEmail],
          subject: `NEW CYBER INSURANCE ASSESSMENT: ${payload.company_name} [${payload.id}]`,
          html: teamEmailHtml,
          attachments: attachments.length > 0 ? attachments : undefined,
        }),
      });
      const teamData = await teamRes.json();

      let clientData = null;
      if (payload.email) {
        let clientRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [payload.email],
            subject: 'Your Cyber Insurance Assessment Request Has Been Received',
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
              from: fromEmail,
              to: [teamEmail],
              subject: `[PROSPECT CONFIRMATION COPY for ${payload.email}] Your Cyber Insurance Assessment Request Has Been Received`,
              html: clientEmailHtml,
            }),
          });
          clientData = await copyRes.json();
        }
      }

      return res.status(200).json({ success: true, provider: 'resend_api', teamResend: teamData, clientResend: clientData });
    }

    return res.status(500).json({ error: 'No email service configured' });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
}
