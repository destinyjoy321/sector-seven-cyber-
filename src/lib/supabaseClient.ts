import { createClient } from '@supabase/supabase-js';

// SECURITY: All VITE_ variables are bundled into the browser JavaScript and are
// visible to anyone who opens browser DevTools. The Supabase service role key
// MUST NEVER use the VITE_ prefix. It belongs only in serverless API routes
// (api/send-email.ts, api/view-questionnaire.ts) accessed via process.env.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Public anon client — all RLS policies apply. Safe to use in the browser.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// In the browser, supabaseAdmin intentionally equals the safe anon client.
// The real service-role admin client is created only inside serverless functions
// using process.env.VITE_SUPABASE_SERVICE_ROLE_KEY (server-only, never bundled).
export const supabaseAdmin = supabase;

