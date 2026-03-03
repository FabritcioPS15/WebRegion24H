export function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Falta variable de entorno: ${name}`);
  }
  return value;
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

