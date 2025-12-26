
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

/**
 * Server-side Supabase Client
 * For use in Server Actions, Metadata, and Route Handlers.
 */
export const createServerClient = (options?: { useServiceRole?: boolean }) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const key = options?.useServiceRole ? serviceRoleKey : supabaseAnonKey;

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    }
  });
};

/**
 * Service Role Client (Admin Access)
 * EXTREME CAUTION: Bypasses RLS. 
 * Use only for backend maintenance tasks.
 */
export const supabaseAdmin = createServerClient({ useServiceRole: true });
