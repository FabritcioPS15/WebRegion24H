import { createClient } from '@supabase/supabase-js';
import {
  requireEnv,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from './env';

export function createSupabaseServerClient() {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL);
  const key =
    SUPABASE_SERVICE_ROLE_KEY ||
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', SUPABASE_ANON_KEY);

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

