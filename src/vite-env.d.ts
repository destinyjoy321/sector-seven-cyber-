/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // NOTE: VITE_SUPABASE_SERVICE_ROLE_KEY is intentionally NOT listed here.
  // Any VITE_ variable is bundled into the browser JavaScript and visible to users.
  // The service role key lives only in serverless routes via process.env.
  readonly VITE_RESEND_API_KEY: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_INTERNAL_NOTIFICATION_EMAIL: string;
  readonly VITE_FROM_EMAIL: string;
}


interface ImportMeta {
  readonly env: ImportMetaEnv;
}
