import { createClient } from '@supabase/supabase-js';

// SECURITY: Client-safe Supabase configuration.
// All VITE_ and NEXT_PUBLIC_ variables are bundled into browser JavaScript.
// The public anon key is safe for browser use with Supabase Row Level Security (RLS).
// Server-only keys (service role) must only be accessed in api/ routes via process.env.

const FALLBACK_SUPABASE_URL = 'https://lmexwjocppravvmtwvzc.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZXh3am9jcHByYXZ2bXR3dnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDQzOTcsImV4cCI6MjEwNDEyMDM5N30.rvMzef50fsKh3pupIDuydCzMSiEv3V95I_Sk1SN8EJg';

const envUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  (import.meta.env as any).NEXT_PUBLIC_SUPABASE_URL ||
  ''
).trim();

const envKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (import.meta.env as any).NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''
).trim();

// Use configured env vars first; fallback to verified project URL and anon key to guarantee zero-crash deployments
export const supabaseUrl = envUrl || FALLBACK_SUPABASE_URL;
export const supabaseAnonKey = envKey || FALLBACK_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function createSafeClient() {
  try {
    if (supabaseUrl && supabaseAnonKey) {
      return createClient(supabaseUrl, supabaseAnonKey);
    }
  } catch (err) {
    console.warn('Supabase client initialization warning:', err);
  }

  // Graceful proxy client to prevent any runtime unhandled crashes if completely unconfigured
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === 'then') return undefined;
      return new Proxy(() => {}, {
        apply() {
          return new Proxy({}, handler);
        },
        get(_t, p) {
          if (p === 'then') {
            return (resolve: any) => resolve({ data: null, error: null });
          }
          return (..._args: any[]) => new Proxy({}, handler);
        },
      });
    },
  };

  return new Proxy({}, handler) as any;
}

// Public anon client — all RLS policies apply. Safe to use in the browser.
export const supabase = createSafeClient();

// In the browser, supabaseAdmin intentionally equals the safe anon client.
// The real service-role admin client is created only inside serverless functions.
export const supabaseAdmin = supabase;


