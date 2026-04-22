// Configures and exports the single Supabase client used across the app.
// Lives in /api because all backend communication flows through this module —
// pages, hooks, and utils import { supabase } from here rather than creating
// their own client instances. Fails loudly at load time if env vars are missing
// so misconfiguration surfaces immediately instead of as cryptic runtime errors.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. Add it to .env.local (local dev) and Vercel environment variables (production).'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. Add it to .env.local (local dev) and Vercel environment variables (production).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
