
import { supabase } from '../lib/supabase';
import { FuelLog, MaintenanceRecord, Trip, Vehicle } from '../types';

export const reportService = {
  async getFleetHealthSummary() {
    // In a production environment, these would be RPC calls or complex joins
    // Here we simulate the aggregation logic
    const { data: vehicles } = await supabase.from('vehicles').select('*');
    const { data: maintenance } = await supabase.from('maintenance_records').select('cost, type');
    const { data: fuel } = await supabase.from('fuel_logs').select('cost, amount');
    const { data: trips } = await supabase.from('trips').select('distance');

    const totalMaintenance = maintenance?.reduce((acc, r) => acc + r.cost, 0) || 0;
    const totalFuel = fuel?.reduce((acc, r) => acc + r.cost, 0) || 0;
    const totalDistance = trips?.reduce((acc, r) => acc + (r.distance || 0), 0) || 0;

    return {
      tco: totalMaintenance + totalFuel,
      avgEfficiency: totalDistance / (fuel?.reduce((acc, r) => acc + r.amount, 0) || 1),
      utilizationRate: (vehicles?.filter(v => v.status === 'ACTIVE').length || 0) / (vehicles?.length || 1) * 100,
      totalDistance
    };
  },

  generateCSV(data: any[], filename: string) {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${val}"`).join(',')
    ).join('\n');
    
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
