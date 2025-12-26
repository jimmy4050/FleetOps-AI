
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

/**
 * Browser-safe Supabase Client
 * For use in "use client" components.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createBrowserClient();
