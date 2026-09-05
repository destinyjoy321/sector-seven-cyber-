import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lmexwjocppravvmtwvzc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZXh3am9jcHByYXZ2bXR3dnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDQzOTcsImV4cCI6MjEwNDEyMDM5N30.rvMzef50fsKh3pupIDuydCzMSiEv3V95I_Sk1SN8EJg';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

