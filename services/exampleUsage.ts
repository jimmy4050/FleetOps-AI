
import { createServerClient } from '../lib/supabase/server';
import { supabase as browserClient } from '../lib/supabase/client';

/**
 * EXAMPLE: Fetching data in a Server Component (Safe & RLS-enforced)
 */
export const getMyFleetAssets = async () => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('vehicles')
    .select('*');
  
  if (error) throw error;
  return data;
};

/**
 * EXAMPLE: Admin-only task using Service Role (Bypasses RLS)
 */
export const systemWipeAllLogs = async () => {
  const supabase = createServerClient({ useServiceRole: true });
  const { error } = await supabase
    .from('fuel_logs')
    .delete()
    .neq('id', '0'); // Dangerous admin action
    
  return { success: !error };
};

/**
 * EXAMPLE: Client-side realtime subscription
 */
export const subscribeToGlobalAlerts = (callback: (payload: any) => void) => {
  return browserClient
    .channel('alerts')
    .on('postgres_changes', { event: 'INSERT', table: 'notifications' }, callback)
    .subscribe();
};
