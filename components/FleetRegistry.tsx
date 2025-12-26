
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Truck, 
  MapPin, 
  Fuel, 
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Loader2,
  Trash2,
  Edit2
} from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { VehicleStatus, Vehicle } from '../types';
import { mockVehicles } from '../mockData';

const FleetRegistry: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    vin: '',
    registrationNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    status: VehicleStatus.ACTIVE,
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      // Attempting to fetch from real DB, falling back to mock if setup is incomplete
      const data = await vehicleService.getAllVehicles().catch(() => mockVehicles);
      setVehicles(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch fleet data.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        vin: vehicle.vin,
        registrationNumber: vehicle.registrationNumber,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        status: vehicle.status,
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        vin: '',
        registrationNumber: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        status: VehicleStatus.ACTIVE,
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to decommission this asset?")) return;
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting vehicle. Asset might be active in a live trip.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingVehicle) {
        const updated = await vehicleService.updateVehicle(editingVehicle.id, formData);
        setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? updated : v));
      } else {
        // Prepare new vehicle object with default telematics for demo
        const newVehicle: Omit<Vehicle, 'id'> = {
          ...formData,
          lastMaintenance: new Date().toISOString().split('T')[0],
          nextMaintenance: new Date(Date.now() + 15552000000).toISOString().split('T')[0], // +6 months
          mileage: 0,
          fuelLevel: 100,
          location: { lat: 34.0522, lng: -118.2437, address: 'Headquarters Depot' },
        };
        const created = await vehicleService.createVehicle(newVehicle);
        setVehicles(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save asset registry entry.");
      // Fallback for local demo environment where Supabase might not be connected
      if (err.message?.includes('NEXT_PUBLIC_SUPABASE_URL')) {
        alert("Development Mode: Supabase environment variables missing. Simulation active.");
        setIsModalOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.make?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.vin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Fleet Registry</h2>
          <p className="text-slate-500 mt-1">Global inventory of enterprise transportation assets.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
          Register Asset
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by VIN, Reg No, or Make..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Status
          </button>
          <button onClick={fetchVehicles} className="flex items-center justify-center p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
            <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {loading && vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-slate-500 font-medium animate-pulse">Syncing with Fleet Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Telematics</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Maintenance</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          <Truck size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{vehicle.make} {vehicle.model}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded uppercase tracking-tighter">
                              {vehicle.registrationNumber || 'NO-REG'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[80px]">{vehicle.vin}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          vehicle.status === VehicleStatus.ACTIVE ? 'bg-emerald-500 animate-pulse' :
                          vehicle.status === VehicleStatus.MAINTENANCE ? 'bg-amber-500' :
                          vehicle.status === VehicleStatus.OUT_OF_SERVICE ? 'bg-rose-500' : 'bg-slate-400'
                        }`} />
                        <span className="text-sm font-semibold text-slate-700 capitalize">{vehicle.status.toLowerCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Fuel size={12} className="text-indigo-500" />
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full" style={{ width: `${vehicle.fuelLevel}%` }} />
                          </div>
                          <span>{vehicle.fuelLevel}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <MapPin size={12} className="text-rose-500" />
                          <span className="truncate max-w-[140px]">{vehicle.location?.address || 'Locating...'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <Calendar size={12} className="text-slate-400" />
                          Due: {vehicle.nextMaintenance}
                        </div>
                        <p className="text-slate-400 pl-4">{vehicle.mileage?.toLocaleString() || 0} miles</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(vehicle)}
                          className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-2 hover:bg-rose-100 rounded-lg text-rose-600 transition-colors"
                          title="Decommission Asset"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filteredVehicles.length === 0 && (
          <div className="py-24 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No matching assets</h3>
            <p className="text-slate-500 mt-2">Adjust filters or register a new vehicle to the registry.</p>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{editingVehicle ? 'Update Fleet Asset' : 'Register New Asset'}</h3>
                  <p className="text-xs text-indigo-100 font-medium">Enterprise Inventory Management</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Reg Number (License)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. CA-FLEET-01"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.registrationNumber}
                    onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">VIN Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="17-digit alphanumeric"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.vin}
                    onChange={e => setFormData({...formData, vin: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Manufacturer</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Kenworth"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.make}
                    onChange={e => setFormData({...formData, make: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Model / Series</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. T680"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.model}
                    onChange={e => setFormData({...formData, model: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Year</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.year}
                    onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Asset Status</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as VehicleStatus})}
                  >
                    <option value={VehicleStatus.ACTIVE}>Active / On Duty</option>
                    <option value={VehicleStatus.MAINTENANCE}>Under Maintenance</option>
                    <option value={VehicleStatus.IDLE}>Idle / Reserved</option>
                    <option value={VehicleStatus.OUT_OF_SERVICE}>Out of Service</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 text-rose-700 animate-in shake duration-300">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-xs font-bold">{error}</p>
                </div>
              )}
              
              <div className="mt-8 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 flex items-center gap-2"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {editingVehicle ? 'Update Record' : 'Commit Registry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetRegistry;
