
import { supabase } from '../lib/supabase';
import { Driver } from '../types';

export const driverService = {
  async getAllDrivers() {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Driver[];
  },

  async getDriverById(id: string) {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Driver;
  },

  async createDriver(driver: Omit<Driver, 'id' | 'joinedAt'>) {
    const { data, error } = await supabase
      .from('drivers')
      .insert([{ ...driver, joinedAt: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Driver;
  },

  async updateDriver(id: string, updates: Partial<Driver>) {
    const { data, error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Driver;
  },

  async deleteDriver(id: string) {
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async assignVehicle(driverId: string, vehicleId: string | null) {
    // 1. Unset vehicle from driver (transactional logic handled by RLS/Triggers usually, but explicit here)
    const { error: driverError } = await supabase
      .from('drivers')
      .update({ vehicleId })
      .eq('id', driverId);

    if (driverError) throw driverError;

    // 2. Update vehicle's driver reference if vehicleId is provided
    if (vehicleId) {
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .update({ driverId })
        .eq('id', vehicleId);
      
      if (vehicleError) throw vehicleError;
    }
    
    return true;
  }
};
