
import { supabase } from '../lib/supabase';
import { MaintenanceRecord, MaintenanceStatus, VehicleStatus } from '../types';

export const maintenanceService = {
  async getAllRecords() {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data as MaintenanceRecord[];
  },

  async createRecord(record: Omit<MaintenanceRecord, 'id'>) {
    // If status is IN_PROGRESS, optionally update vehicle status
    if (record.status === MaintenanceStatus.IN_PROGRESS) {
      await supabase
        .from('vehicles')
        .update({ status: VehicleStatus.MAINTENANCE })
        .eq('id', record.vehicleId);
    }

    const { data, error } = await supabase
      .from('maintenance_records')
      .insert([record])
      .select()
      .single();
    
    if (error) throw error;
    return data as MaintenanceRecord;
  },

  async completeRecord(id: string, nextMaintenanceDate: string) {
    const { data: record, error: fetchError } = await supabase
      .from('maintenance_records')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;

    // 1. Update record status
    const { data: updatedRecord, error: updateError } = await supabase
      .from('maintenance_records')
      .update({ 
        status: MaintenanceStatus.COMPLETED,
        completedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 2. Update vehicle metadata
    await supabase
      .from('vehicles')
      .update({ 
        status: VehicleStatus.ACTIVE,
        lastMaintenance: record.date,
        nextMaintenance: nextMaintenanceDate,
        mileage: record.odometer
      })
      .eq('id', record.vehicleId);

    return updatedRecord as MaintenanceRecord;
  },

  async deleteRecord(id: string) {
    const { error } = await supabase
      .from('maintenance_records')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
