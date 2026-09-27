/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Client-safe environment variables only
  readonly VITE_SITE_URL: string;
  readonly VITE_INTERNAL_NOTIFICATION_EMAIL: string;
  readonly VITE_FROM_EMAIL: string;
}


interface ImportMeta {
  readonly env: ImportMetaEnv;
}
