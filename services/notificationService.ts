
import { supabase } from '../lib/supabase';
import { Notification } from '../types';

export const notificationService = {
  async getNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Notification[];
  },

  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ isRead: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Notification;
  },

  async markAllAsRead() {
    const { error } = await supabase
      .from('notifications')
      .update({ isRead: true })
      .eq('isRead', false);
    
    if (error) throw error;
    return true;
  },

  subscribeToAlerts(onUpdate: (payload: any) => void) {
    return supabase
      .channel('fleet-alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, onUpdate)
      .subscribe();
  }
};
