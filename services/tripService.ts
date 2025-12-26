
import { supabase } from '../lib/supabase';
import { Trip, TripStatus } from '../types';

export const tripService = {
  async getAllTrips() {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Trip[];
  },

  async createTrip(trip: Omit<Trip, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('trips')
      .insert([{ ...trip, createdAt: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Trip;
  },

  async startTrip(id: string, startOdometer: number) {
    const { data, error } = await supabase
      .from('trips')
      .update({
        status: TripStatus.ACTIVE,
        startOdometer,
        startedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Trip;
  },

  async completeTrip(id: string, endOdometer: number) {
    // 1. Get trip to calculate distance
    const { data: trip, error: fetchError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;

    const distance = endOdometer - (trip.startOdometer || 0);

    const { data, error } = await supabase
      .from('trips')
      .update({
        status: TripStatus.COMPLETED,
        endOdometer,
        distance,
        completedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Trip;
  },

  async cancelTrip(id: string) {
    const { data, error } = await supabase
      .from('trips')
      .update({ status: TripStatus.CANCELLED })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Trip;
  }
};
