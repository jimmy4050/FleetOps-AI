
import { supabase } from '../lib/supabase';
import { FuelLog } from '../types';

export const fuelService = {
  async getAllLogs() {
    const { data, error } = await supabase
      .from('fuel_logs')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data as FuelLog[];
  },

  async createLog(log: Omit<FuelLog, 'id'>) {
    const { data, error } = await supabase
      .from('fuel_logs')
      .insert([log])
      .select()
      .single();
    
    if (error) throw error;
    return data as FuelLog;
  },

  async deleteLog(id: string) {
    const { error } = await supabase
      .from('fuel_logs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  calculateEfficiency(logs: FuelLog[]) {
    // Sort logs by odometer
    const sorted = [...logs].sort((a, b) => a.odometer - b.odometer);
    if (sorted.length < 2) return null;

    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    
    const totalDistance = last.odometer - first.odometer;
    const totalFuel = sorted.slice(1).reduce((acc, log) => acc + log.amount, 0);

    if (totalFuel === 0) return 0;
    return totalDistance / totalFuel; // Miles per Unit or KM per Unit
  }
};
