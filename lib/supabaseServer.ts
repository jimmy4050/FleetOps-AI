
/**
 * Server-side Supabase Client
 * Optimized for Next.js 14 Server Components, Actions, and Route Handlers.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

export const createServerClient = (cookieStore: any) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Server doesn't persist sessions locally; uses cookies.
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        // Forward cookies for authentication if applicable in your proxy setup
        Cookie: cookieStore?.toString() || '',
      },
    },
  });
};

/**
 * Service Role Client (Admin Access)
 * USE WITH EXTREME CAUTION. Only for background tasks or admin-only routes.
 */
export const createAdminClient = () => {
  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};