
import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase Client
 * For use in Server Actions, Metadata, and Route Handlers.
 */
export const createServerClient = (options?: { useServiceRole?: boolean }) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

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
 */
export const supabaseAdmin = createServerClient({ useServiceRole: true });