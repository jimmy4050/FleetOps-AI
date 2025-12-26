
/**
 * Browser-side Supabase Client
 * Used in "use client" components.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Fallback to dummy values to prevent "supabaseUrl is required" crash on boot.
// Actual API calls will fail gracefully and fall back to mock data in the UI.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// This client is safe to use on the browser.
export const createBrowserClient = () => 
  createClient(supabaseUrl, supabaseAnonKey);

export const supabase = createBrowserClient();
