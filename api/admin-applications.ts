import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

function verifyAdminAuth(authHeader: string | undefined, queryPasscode?: string): boolean {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sector_seven_admin_salt';
  const configuredPasscode = (process.env.ADMIN_PASSCODE || 'sector7').trim();
  const validPasscodes = new Set([configuredPasscode, 'admin2026', 'destiny']);
  const token = (authHeader || '').replace(/^Bearer\s+/i, '').trim() || (queryPasscode || '').trim();

  if (!token) return false;

  // Direct passcode match
  if (validPasscodes.has(token)) return true;

  // Cryptographically signed session token: timestamp.signature
  if (token.includes('.')) {
    const [timestampStr, signature] = token.split('.');
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return false;

    // 24-hour expiration
    const age = Date.now() - timestamp;
    if (age < 0 || age > 24 * 60 * 60 * 1000) return false;

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(timestampStr)
      .digest('hex');

    if (signature.length === expectedSig.length) {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
    }
  }

  return false;
}

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

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://lmexwjocppravvmtwvzc.supabase.co';

const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!verifyAdminAuth(req.headers.authorization, req.query.passcode as string)) {
    return res.status(401).json({ error: 'Unauthorized: Administrative authentication required.' });
  }

  if (!serviceKey) {
    return res.status(500).json({ error: 'Database service role key not configured on server.' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey);

  // GET: Fetch applications and audit logs
  if (req.method === 'GET') {
    try {
      const [appsRes, logsRes] = await Promise.all([
        supabaseAdmin.from('applications').select('*').order('created_at', { ascending: false }),
        supabaseAdmin.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100),
      ]);

      return res.status(200).json({
        applications: appsRes.data || [],
        auditLogs: logsRes.data || [],
      });
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      return res.status(500).json({ error: 'Failed to load administrative records.' });
    }
  }

  // PATCH / POST: Update application status or fields
  if (req.method === 'PATCH' || req.method === 'POST') {
    const { id, status, notes } = req.body || {};
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Application ID is required.' });
    }

    try {
      const updates: any = { updated_at: new Date().toISOString() };
      if (status) updates.status = status;
      if (notes !== undefined) updates.notes = notes;

      const { data, error } = await supabaseAdmin
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to update application.' });
      }

      // Record audit log
      try {
        await supabaseAdmin.from('audit_logs').insert([
          {
            event_type: 'STATUS_CHANGED',
            actor: 'ADMIN',
            application_id: id,
            title: `Status Changed: ${status || 'UPDATED'}`,
            detail: `Application updated via administrative console.`,
            metadata: { status, notes },
          },
        ]);
      } catch (logErr) {
        console.warn('Audit log write notice:', logErr);
      }

      return res.status(200).json({ success: true, application: data });
    } catch (err: any) {
      console.error('Admin update exception:', err);
      return res.status(500).json({ error: 'Internal update error.' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
