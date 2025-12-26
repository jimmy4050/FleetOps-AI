
import { createClient } from '@supabase/supabase-js';

/**
 * Browser-safe Supabase Client
 * For use in "use client" components.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Singleton instance for the browser
export const supabase = createBrowserClient();