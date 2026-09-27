import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const id = (req.query.id as string || '').trim();
  if (!id || !/^[a-zA-Z0-9_\-]+$/.test(id)) {
    return res.status(400).json({ error: 'Missing or invalid application id' });
  }

  if (!serviceKey) {
    return res.status(500).json({ error: 'Database service role key not configured on server.' });
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Critical Requirement: FINAL FINAL.docx Section 11:
    // "THIS INFORMATION MUST NEVER APPEAR ON THE CUSTOMER-FACING WEBSITE OR QUOTE.
    // Do not show: $2.00, $2.50, Internal cost, Vendor cost, Margin, Profit, Markup."
    const sanitizedApp = { ...data };
    delete (sanitizedApp as any).internal_estimated_cost;
    delete (sanitizedApp as any).internal_estimated_margin;

    return res.status(200).json({ application: sanitizedApp });
  } catch (err: any) {
    console.error('get-application exception:', err);
    return res.status(500).json({ error: 'Failed to retrieve application record.' });
  }
}
