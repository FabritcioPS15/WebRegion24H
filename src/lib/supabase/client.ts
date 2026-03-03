import { createClient } from '@supabase/supabase-js';
import { requireEnv, SUPABASE_ANON_KEY, SUPABASE_URL } from './env';

export const supabaseClient = createClient(
  requireEnv('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL),
  requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY),
);

