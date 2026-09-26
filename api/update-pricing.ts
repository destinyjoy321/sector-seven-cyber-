import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://lmexwjocppravvmtwvzc.supabase.co';

const supabaseServiceRole =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  '';

// Initialize Supabase Admin client with service-role privileges (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Methods
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Retrieve current live pricing configuration
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('pricing_engine_config')
        .select('*')
        .eq('id', 'current')
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ config: data?.config_json, updated_at: data?.updated_at });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch pricing' });
    }
  }

  // POST: Persist updated pricing configuration (Admin authenticated)
  if (req.method === 'POST') {
    const { config, passcode } = req.body || {};

    const validPasscodes = ['sector7', 'admin2026', 'destiny'];
    if (!passcode || !validPasscodes.includes(passcode)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid admin credentials' });
    }

    if (!config || !Array.isArray(config.tiers) || config.tiers.length === 0) {
      return res.status(400).json({ error: 'Invalid pricing configuration payload: tiers array is required' });
    }

    try {
      const now = new Date().toISOString();
      const { error: upsertError } = await supabaseAdmin
        .from('pricing_engine_config')
        .upsert([
          {
            id: 'current',
            updated_at: now,
            updated_by: 'ADMIN',
            config_json: config,
          },
        ]);

      if (upsertError) {
        console.error('Supabase admin pricing upsert error:', upsertError);
        return res.status(500).json({ error: upsertError.message });
      }

      // Record audit log entry
      try {
        await supabaseAdmin.from('audit_logs').insert([
          {
            event_type: 'CONFIG_UPDATED',
            actor: 'ADMIN',
            title: 'Pricing Engine Variables Updated',
            detail: `Updated ${config.tiers.length} tiers. Band 1: $${config.tiers[0]?.monthlyPrice}/mo, Band 2: $${config.tiers[1]?.monthlyPrice}/mo, Band 3: $${config.tiers[2]?.monthlyPrice}/mo`,
            metadata: {
              tiers: config.tiers,
              endpointUnitCost: config.endpointUnitCost,
              cloudUserUnitCost: config.cloudUserUnitCost,
              customQuoteThreshold: config.customQuoteThreshold,
            },
          },
        ]);
      } catch (auditErr) {
        console.warn('Audit log recording notice:', auditErr);
      }

      return res.status(200).json({
        success: true,
        message: 'Pricing engine configuration updated successfully in backend database',
        config,
        updated_at: now,
      });
    } catch (err: any) {
      console.error('Error saving pricing configuration:', err);
      return res.status(500).json({ error: err.message || 'Server error saving pricing' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
