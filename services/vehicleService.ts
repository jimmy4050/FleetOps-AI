
import { supabase } from '../lib/supabase';
import { Vehicle, VehicleStatus } from '../types';

export const vehicleService = {
  async getAllVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Vehicle[];
  },

  async getVehicleById(id: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Vehicle;
  },

  async createVehicle(vehicle: Omit<Vehicle, 'id'>) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicle])
      .select()
      .single();
    
    if (error) throw error;
    return data as Vehicle;
  },

  async updateVehicle(id: string, updates: Partial<Vehicle>) {
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Vehicle;
  },

  async deleteVehicle(id: string) {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
