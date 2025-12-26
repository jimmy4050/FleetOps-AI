
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Navigation, 
  Flag, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X,
  Play,
  CheckCircle,
  Truck,
  User,
  ArrowRight
} from 'lucide-react';
import { tripService } from '../services/tripService';
import { vehicleService } from '../services/vehicleService';
import { driverService } from '../services/driverService';
import { Trip, TripStatus, Vehicle, Driver } from '../types';
import { mockTrips, mockVehicles, mockDrivers } from '../mockData';

const TripManagement: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [actionType, setActionType] = useState<'START' | 'COMPLETE'>('START');
  const [odometerValue, setOdometerValue] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    origin: '',
    destination: '',
    startOdometer: 0,
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        tripService.getAllTrips().catch(() => mockTrips),
        vehicleService.getAllVehicles().catch(() => mockVehicles),
        driverService.getAllDrivers().catch(() => mockDrivers)
      ]);
      setTrips(tripsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newTrip = await tripService.createTrip({
        ...formData,
        status: TripStatus.PLANNED
      });
      setTrips(prev => [newTrip, ...prev]);
      setIsModalOpen(false);
      setFormData({
        vehicleId: '',
        driverId: '',
        origin: '',
        destination: '',
        startOdometer: 0,
        notes: ''
      });
    } catch (err) {
      // Demo fallback
      const simulated: Trip = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        status: TripStatus.PLANNED,
        createdAt: new Date().toISOString()
      };
      setTrips(prev => [simulated, ...prev]);
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleActionTrip = async () => {
    if (!selectedTrip) return;
    setSubmitting(true);
    try {
      if (actionType === 'START') {
        const updated = await tripService.startTrip(selectedTrip.id, odometerValue);
        setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
      } else {
        const updated = await tripService.completeTrip(selectedTrip.id, odometerValue);
        setTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
      }
      setIsActionModalOpen(false);
    } catch (err) {
      // Demo fallback
      setTrips(prev => prev.map(t => {
        if (t.id === selectedTrip.id) {
          return {
            ...t,
            status: actionType === 'START' ? TripStatus.ACTIVE : TripStatus.COMPLETED,
            startOdometer: actionType === 'START' ? odometerValue : t.startOdometer,
            endOdometer: actionType === 'COMPLETE' ? odometerValue : t.endOdometer,
            distance: actionType === 'COMPLETE' ? odometerValue - t.startOdometer : undefined,
            startedAt: actionType === 'START' ? new Date().toISOString() : t.startedAt,
            completedAt: actionType === 'COMPLETE' ? new Date().toISOString() : t.completedAt
          };
        }
        return t;
      }));
      setIsActionModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const openActionModal = (trip: Trip, type: 'START' | 'COMPLETE') => {
    setSelectedTrip(trip);
    setActionType(type);
    setOdometerValue(type === 'START' ? trip.startOdometer : (trip.startOdometer + 100));
    setIsActionModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trip Management</h2>
          <p className="text-slate-500 mt-1">Plan and track fleet routes, milestones, and asset utilization.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
          Plan New Trip
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {trips.map(trip => {
            const vehicle = vehicles.find(v => v.id === trip.vehicleId);
            const driver = drivers.find(d => d.id === trip.driverId);
            
            return (
              <div key={trip.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                <div className="p-8 flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 space-y-4 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          trip.status === TripStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' :
                          trip.status === TripStatus.COMPLETED ? 'bg-blue-100 text-blue-700' :
                          trip.status === TripStatus.PLANNED ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {trip.status}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">#{trip.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Clock size={14} />
                        {new Date(trip.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center pt-1.5">
                            <div className="w-4 h-4 rounded-full border-2 border-indigo-600 bg-white" />
                            <div className="w-[2px] h-10 bg-slate-100 my-1" />
                            <Flag className="text-rose-500" size={16} />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin</p>
                              <p className="font-bold text-slate-900">{trip.origin}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                              <p className="font-bold text-slate-900">{trip.destination}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicle</p>
                          <div className="flex items-center gap-2">
                            <Truck size={14} className="text-indigo-600" />
                            <p className="text-sm font-bold text-slate-700">{vehicle?.registrationNumber || 'Unknown'}</p>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">{vehicle?.make} {vehicle?.model}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Driver</p>
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-indigo-600" />
                            <p className="text-sm font-bold text-slate-700">{driver?.name || 'Unknown'}</p>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1">Rating: {driver?.rating} ★</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-48 w-full flex flex-col gap-3 justify-center items-center lg:border-l border-slate-100 lg:pl-8">
                    {trip.status === TripStatus.PLANNED && (
                      <button 
                        onClick={() => openActionModal(trip, 'START')}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                      >
                        <Play size={16} fill="currentColor" />
                        Start Trip
                      </button>
                    )}
                    {trip.status === TripStatus.ACTIVE && (
                      <button 
                        onClick={() => openActionModal(trip, 'COMPLETE')}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                      >
                        <CheckCircle size={16} fill="currentColor" />
                        Complete
                      </button>
                    )}
                    {trip.status === TripStatus.COMPLETED && (
                      <div className="text-center w-full bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Distance</p>
                        <p className="text-2xl font-black text-indigo-600">{trip.distance} <span className="text-xs">KM</span></p>
                      </div>
                    )}
                    <button className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plan Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <Navigation size={20} />
                <h3 className="text-xl font-bold">Plan Fleet Route</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateTrip} className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-2 sm:col-span-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Selection</label>
                <select 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  value={formData.vehicleId}
                  onChange={e => {
                    const v = vehicles.find(v => v.id === e.target.value);
                    setFormData({...formData, vehicleId: e.target.value, startOdometer: v?.mileage || 0});
                  }}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>[{v.registrationNumber}] {v.make} {v.model}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Driver</label>
                <select 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  value={formData.driverId}
                  onChange={e => setFormData({...formData, driverId: e.target.value})}
                >
                  <option value="">Select Driver</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Point of Origin</label>
                <input 
                  type="text" required placeholder="Depot A"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  value={formData.origin}
                  onChange={e => setFormData({...formData, origin: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Hub</label>
                <input 
                  type="text" required placeholder="Hub B"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  value={formData.destination}
                  onChange={e => setFormData({...formData, destination: e.target.value})}
                />
              </div>
              <div className="col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 font-bold text-slate-400">Cancel</button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Trip Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Modal (Start/Complete) */}
      {isActionModalOpen && selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className={`p-6 border-b border-slate-100 flex justify-between items-center ${actionType === 'START' ? 'bg-indigo-600' : 'bg-emerald-600'} text-white`}>
              <h3 className="text-xl font-bold">{actionType === 'START' ? 'Start Active Trip' : 'Complete Delivery'}</h3>
              <button onClick={() => setIsActionModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Route Summary</p>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-slate-900">{selectedTrip.origin}</p>
                  <ArrowRight size={14} className="text-slate-300" />
                  <p className="font-bold text-slate-900">{selectedTrip.destination}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Current Odometer Reading ({actionType === 'START' ? 'Start' : 'End'})
                </label>
                <input 
                  type="number" 
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-2xl font-black text-slate-900"
                  value={odometerValue}
                  onChange={e => setOdometerValue(parseInt(e.target.value) || 0)}
                />
                {actionType === 'COMPLETE' && (
                  <p className="text-xs text-slate-500 mt-2">
                    Start Odometer: <span className="font-bold">{selectedTrip.startOdometer}</span>
                    <br />
                    Distance Calculation: <span className="text-indigo-600 font-bold">{odometerValue - selectedTrip.startOdometer} KM</span>
                  </p>
                )}
              </div>
              <button 
                onClick={handleActionTrip}
                disabled={submitting || (actionType === 'COMPLETE' && odometerValue <= selectedTrip.startOdometer)}
                className={`w-full py-4 text-white rounded-xl font-bold text-lg shadow-xl transition-all disabled:opacity-50 ${
                  actionType === 'START' ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-emerald-600 shadow-emerald-500/20'
                }`}
              >
                {submitting ? <Loader2 className="animate-spin mx-auto" size={24} /> : (
                  actionType === 'START' ? 'Confirm Departure' : 'Finalize Trip'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripManagement;
