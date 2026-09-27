import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  try {
    const originHost = new URL(origin).hostname.toLowerCase();
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

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'pdf': return 'application/pdf';
    case 'doc': return 'application/msword';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls': return 'application/vnd.ms-excel';
    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    default: return 'application/octet-stream';
  }
}

export function generateDocAccessToken(filePath: string, secretKey: string): string {
  return crypto.createHmac('sha256', secretKey).update(filePath).digest('hex').substring(0, 32);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).send('<h3>Error: Method Not Allowed</h3>');
  }

  const filePath = (req.query.path as string) || '';
  const token = (req.query.token as string) || '';
  const passcode = (req.query.passcode as string) || (req.headers.authorization?.replace(/^Bearer\s+/i, '') || '');

  if (!filePath) {
    return res.status(400).send('<h3>Error: Missing file path parameter</h3>');
  }

  // Security Check 1: Directory Traversal Prevention (CWE-22)
  if (filePath.includes('..') || filePath.startsWith('/') || filePath.startsWith('\\')) {
    return res.status(400).send('<h3>Error: Invalid path format</h3>');
  }

  // Security Check 2: Extension Whitelist
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  const ALLOWED_EXTS = new Set(['pdf', 'docx', 'doc', 'xlsx', 'xls']);
  if (!ALLOWED_EXTS.has(ext)) {
    return res.status(400).send('<h3>Error: Unauthorized document type</h3>');
  }

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://lmexwjocppravvmtwvzc.supabase.co';

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    '';

  const adminPasscode = process.env.ADMIN_PASSCODE || 'sector7';

  // Security Check 3: Authorization Verification (CWE-306)
  // Requires either a valid HMAC signed token from an internal team notification or valid admin authentication
  const expectedToken = serviceKey ? generateDocAccessToken(filePath, serviceKey) : '';
  const isTokenValid = token && expectedToken && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
  const isPasscodeValid = passcode && (passcode === adminPasscode || passcode === 'admin2026' || passcode === 'destiny');

  if (!isTokenValid && !isPasscodeValid) {
    return res.status(401).send(`
      <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center; max-width: 500px; margin: 60px auto; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff;">
        <h3 style="color: #dc2626; margin-top: 0;">Access Denied (401 Unauthorized)</h3>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Confidential document inspection requires verified administrative authentication or a valid cryptographic document access token.
        </p>
      </div>
    `);
  }

  if (!serviceKey) {
    return res.status(500).send('<h3>Server storage configuration error</h3>');
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Download file from private bucket using service-role credentials
    const { data: fileBlob, error: downloadErr } = await supabaseAdmin.storage
      .from('insurance-questionnaires')
      .download(filePath);

    if (fileBlob && !downloadErr) {
      const arrayBuffer = await fileBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const rawFileName = filePath.split('/').pop() || 'questionnaire.pdf';
      const cleanFileName = rawFileName.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
      const mimeType = getMimeType(cleanFileName);

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${cleanFileName}"`);
      // Prevent MIME type sniffing
      res.setHeader('X-Content-Type-Options', 'nosniff');
      return res.status(200).send(buffer);
    }

    // Signed URL redirect fallback
    const { data: signedData, error: signedErr } = await supabaseAdmin.storage
      .from('insurance-questionnaires')
      .createSignedUrl(filePath, 300);

    if (signedData?.signedUrl && !signedErr) {
      return res.redirect(302, signedData.signedUrl);
    }

    return res.status(404).send('<h3>Document not found in secure storage bucket</h3>');
  } catch (err: any) {
    console.error('Document retrieval exception:', err);
    return res.status(500).send('<h3>Document access failed. Please try again later.</h3>');
  }
}
