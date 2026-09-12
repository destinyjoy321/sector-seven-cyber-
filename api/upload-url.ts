import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Strict extension whitelist: documents only (PDF, DOCX/DOC, EXCEL)
const ALLOWED_EXTENSIONS = new Set(['pdf', 'docx', 'doc', 'xlsx', 'xls']);

// Rate Limiting Map (Max 15 signed upload requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true; // Same-origin or non-browser server requests
  try {
    const url = new URL(origin);
    const host = url.hostname;
    return (
      host === 'sectorsevencyber.com' ||
      host.endsWith('.sectorsevencyber.com') ||
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.vercel.app')
    );
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
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

  // Rate limiting check
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const rateData = rateLimitMap.get(clientIp) || { count: 0, resetTime: now + 60000 };
  if (now > rateData.resetTime) {
    rateData.count = 0;
    rateData.resetTime = now + 60000;
  }
  rateData.count += 1;
  rateLimitMap.set(clientIp, rateData);

  if (rateData.count > 15) {
    return res.status(429).json({ error: 'Too many upload requests. Please try again in a minute.' });
  }

  try {
    const { filePath } = req.body || {};

    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid filePath' });
    }

    // Security check 1: Prevent directory traversal
    if (filePath.includes('..') || filePath.startsWith('/') || filePath.startsWith('\\')) {
      return res.status(400).json({ error: 'Invalid path format' });
    }

    // Security check 2: Strict extension verification (PDF, DOCX, DOC, XLSX, XLS only)
    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return res.status(400).json({
        error: 'Invalid file extension. Only PDF, DOCX, and Excel files (.pdf, .docx, .doc, .xlsx, .xls) are accepted.',
      });
    }

    // Security check 3: Path structure validation (e.g. SS-YYYY-XXXX/filename.pdf)
    const pathRegex = /^[a-zA-Z0-9_\-\/ ]+\.(pdf|docx|doc|xlsx|xls)$/i;
    if (!pathRegex.test(filePath)) {
      return res.status(400).json({ error: 'File path does not match security intake specifications.' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmexwjocppravvmtwvzc.supabase.co';
    const serviceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!serviceKey) {
      console.error('CRITICAL: VITE_SUPABASE_SERVICE_ROLE_KEY is not configured on server.');
      return res.status(500).json({ error: 'Server storage configuration error' });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // Generate signed upload URL (valid for 10 minutes)
    const { data, error } = await supabaseAdmin.storage
      .from('insurance-questionnaires')
      .createSignedUploadUrl(filePath);

    if (error || !data) {
      console.error('Supabase createSignedUploadUrl error:', error?.message);
      return res.status(500).json({ error: 'Failed to generate secure upload credentials' });
    }

    return res.status(200).json({
      success: true,
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token,
    });
  } catch (err: any) {
    console.error('Upload URL generation exception:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
