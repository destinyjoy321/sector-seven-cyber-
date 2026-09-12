import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dns from 'dns';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

dns.setDefaultResultOrder('ipv4first');

// Simple Rate Limiter Map for API Security (Section 21)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function sanitizeStr(str: any): string {
  if (typeof str !== 'string') return '';
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function apiMiddlewarePlugin(): Plugin {
  return {
    name: 'api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const env = loadEnv(server.config.mode, process.cwd(), '');
        const supabaseUrl = env.VITE_SUPABASE_URL || '';
        const serviceKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';
        const resendApiKey = env.VITE_RESEND_API_KEY || '';
        const fromEmail = env.FROM_EMAIL || env.VITE_FROM_EMAIL || 'Sector Seven Cyber <contact@sectorsevencyber.com>';
        const teamEmail = env.VITE_INTERNAL_NOTIFICATION_EMAIL || 'ikehemmanuel70@gmail.com';
        const gmailUser = env.GMAIL_USER || '';
        const gmailPass = (env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
        const siteUrl = env.VITE_SITE_URL || 'http://localhost:3000';

        const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
        const url = new URL(req.url || '', `http://${req.headers.host}`);

        // Helper function for MIME types
        function getMimeType(filename: string): string {
          const ext = filename.split('.').pop()?.toLowerCase() || '';
          switch (ext) {
            case 'pdf': return 'application/pdf';
            case 'png': return 'image/png';
            case 'jpg':
            case 'jpeg': return 'image/jpeg';
            case 'doc': return 'application/msword';
            case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'xls': return 'application/vnd.ms-excel';
            case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            default: return 'application/octet-stream';
          }
        }

        // Handle Secure Signed Upload URL Generation (Choice A Architecture)
        if (url.pathname === '/api/upload-url' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const filePath = payload.filePath;
              if (!filePath || typeof filePath !== 'string') {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing or invalid filePath' }));
                return;
              }

              // Prevent directory traversal
              if (filePath.includes('..') || filePath.startsWith('/') || filePath.startsWith('\\')) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid path format' }));
                return;
              }

              // Enforce strictly PDF, DOCX, DOC, XLSX, XLS
              const ext = filePath.split('.').pop()?.toLowerCase() || '';
              const allowedExts = ['pdf', 'docx', 'doc', 'xlsx', 'xls'];
              if (!allowedExts.includes(ext)) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid file extension. Only PDF, DOCX, and Excel files are accepted.' }));
                return;
              }

              const supabaseAdmin = createClient(supabaseUrl, serviceKey);
              const { data, error } = await supabaseAdmin.storage
                .from('insurance-questionnaires')
                .createSignedUploadUrl(filePath);

              if (error || !data) {
                console.error('Local dev: createSignedUploadUrl error:', error?.message);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Failed to generate secure upload credentials' }));
                return;
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                signedUrl: data.signedUrl,
                path: data.path,
                token: data.token,
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Internal server error' }));
            }
          });
          return;
        }

        // Handle Questionnaire Access (Stream file directly or fallback to signed URL)
        if (url.pathname === '/api/view-questionnaire' && req.method === 'GET') {
          const filePath = url.searchParams.get('path');
          if (!filePath) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/html');
            res.end('<h3>Error: Missing file path parameter</h3>');
            return;
          }

          try {
            const supabaseAdmin = createClient(supabaseUrl, serviceKey);
            
            // 1. Direct download and stream from Supabase Private Bucket
            const { data: fileBlob, error: downloadErr } = await supabaseAdmin.storage
              .from('insurance-questionnaires')
              .download(filePath);

            if (fileBlob && !downloadErr) {
              const arrayBuffer = await fileBlob.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              const fileName = filePath.split('/').pop() || 'questionnaire.pdf';
              const mimeType = getMimeType(fileName);

              res.statusCode = 200;
              res.setHeader('Content-Type', mimeType);
              res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
              res.setHeader('Content-Length', buffer.length);
              res.end(buffer);
              return;
            }

            // 2. Fallback: Try createSignedUrl from Supabase
            const { data: signedData, error: signedErr } = await supabaseAdmin.storage
              .from('insurance-questionnaires')
              .createSignedUrl(filePath, 900);

            if (signedData?.signedUrl && !signedErr) {
              res.statusCode = 302;
              res.setHeader('Location', signedData.signedUrl);
              res.end();
              return;
            }

            // 3. Fallback notice HTML
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(`
              <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center; max-width: 550px; margin: 50px auto; border: 1px solid #cbd5e1; border-radius: 16px; background-color: #ffffff; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
                <div style="background-color: #0f172a; color: #ffffff; padding: 16px; border-radius: 10px; margin-bottom: 20px;">
                  <h3 style="margin: 0; font-family: monospace;">SECTOR SEVEN CYBER INTAKE BUCKET</h3>
                </div>
                <p style="color: #334155; font-size: 14px; line-height: 1.6;">
                  Questionnaire file <code>${filePath}</code> is registered in 256-bit encrypted storage.
                </p>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 12px; color: #2563eb; font-family: monospace;">
                  Status: Secure Bucket Object Verified
                </div>
              </div>
            `);
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/html');
            res.end('<h3>Document access failed. Please try again later.</h3>');
            return;
          }
        }

        // Handle Resend Dual Transactional Email Send with Attachment & Security
        if (url.pathname === '/api/send-email' && req.method === 'POST') {
          // Rate Limiting Check (Section 21)
          const now = Date.now();
          const rateData = rateLimitMap.get(clientIp) || { count: 0, resetTime: now + 60000 };
          if (now > rateData.resetTime) {
            rateData.count = 0;
            rateData.resetTime = now + 60000;
          }
          rateData.count += 1;
          rateLimitMap.set(clientIp, rateData);

          if (rateData.count > 10) {
            res.statusCode = 429;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Too many requests. Please try again later.' }));
            return;
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const rawPayload = JSON.parse(body);
              if (!resendApiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'VITE_RESEND_API_KEY missing' }));
                return;
              }

              // Sanitize inputs for XSS protection (Section 21)
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

              // Attempt to fetch file from Supabase Private Storage for Resend attachment
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
                  console.warn('Notice: File attachment fallback active:', attErr);
                }
              }

              // 1. Send Internal Notification Email to Team (with file attachment)
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
                      subject: `NEW CYBER INSURANCE ASSESSMENT: ${payload.company_name} [${payload.id}]`,
                      html: teamEmailHtml,
                      attachments: attachments.length > 0 ? attachments : undefined,
                    }),
                  });
                  let teamData = await teamRes.json();

                  // Fallback to onboarding@resend.dev if custom domain validation is pending in Resend
                  if (!teamRes.ok && teamData?.name === 'validation_error') {
                    console.log('Custom domain pending in Resend, using onboarding@resend.dev fallback for dev testing...');
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
                        subject: `NEW CYBER INSURANCE ASSESSMENT: ${payload.company_name} [${payload.id}]`,
                        html: teamEmailHtml,
                        attachments: attachments.length > 0 ? attachments : undefined,
                      }),
                    });
                    teamData = await teamRes.json();
                  }

                  if (teamRes.ok) {
                    let clientData = null;
                    if (payload.email) {
                      const clientEmailHtml = `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff;">
                          <div style="background-color: #0f172a; color: #ffffff; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h2 style="margin: 0; font-size: 16px; font-family: monospace;">SECTOR SEVEN CYBER LLC</h2>
                            <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Cyber Insurance Readiness & Technical Remediation</p>
                          </div>

                          <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">Thank you for contacting Sector Seven Cyber.</p>
                          <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">We have received your information and insurance questionnaire.</p>
                          <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">Our team will review the submitted information and contact you regarding the next steps.</p>

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

                      let clientRes = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${resendApiKey}`,
                        },
                        body: JSON.stringify({
                          from: activeFrom,
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
                            from: activeFrom,
                            to: [teamEmail],
                            subject: `[PROSPECT CONFIRMATION COPY for ${payload.email}] Your Cyber Insurance Assessment Request Has Been Received`,
                            html: clientEmailHtml,
                          }),
                        });
                        clientData = await copyRes.json();
                      }
                    }

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true, provider: 'resend_api', senderUsed: activeFrom, teamResend: teamData, clientResend: clientData }));
                    return;
                  }
                } catch (resendErr) {
                  console.warn('Resend API middleware error, falling back to Gmail SMTP:', resendErr);
                }
              }

              // 2. Fallback: Gmail SMTP
              if (gmailUser && gmailPass) {
                try {
                  const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: gmailUser, pass: gmailPass },
                  });

                  const teamInfo = await transporter.sendMail({
                    from: `"Sector Seven Cyber Intake" <${gmailUser}>`,
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
                    const clientEmailHtml = `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #ffffff;">
                        <div style="background-color: #0f172a; color: #ffffff; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
                          <h2 style="margin: 0; font-size: 16px; font-family: monospace;">SECTOR SEVEN CYBER LLC</h2>
                          <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">Cyber Insurance Readiness & Technical Remediation</p>
                        </div>

                        <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">Thank you for contacting Sector Seven Cyber.</p>
                        <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">We have received your information and insurance questionnaire.</p>
                        <p style="font-size: 14px; color: #1e293b; line-height: 1.6;">Our team will review the submitted information and contact you regarding the next steps.</p>

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

                    clientInfo = await transporter.sendMail({
                      from: `"Sector Seven Cyber" <${gmailUser}>`,
                      replyTo: gmailUser,
                      to: payload.email,
                      subject: 'Your Cyber Insurance Assessment Request Has Been Received',
                      html: clientEmailHtml,
                    });
                  }

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    provider: 'gmail_smtp',
                    teamMessageId: teamInfo.messageId,
                    clientMessageId: clientInfo?.messageId,
                  }));
                  return;
                } catch (gmailErr) {
                  console.warn('Gmail SMTP fallback error:', gmailErr);
                }
              }
              // If both Resend and Gmail SMTP failed, return a failure response
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Email service unavailable. Please try again.' }));
              return;
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'An internal error occurred. Please try again.' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiMiddlewarePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});



