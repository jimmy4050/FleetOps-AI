
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Edit2,
  Star,
  Truck
} from 'lucide-react';
import { driverService } from '../services/driverService';
import { vehicleService } from '../services/vehicleService';
import { Driver, Vehicle } from '../types';
import { mockDrivers, mockVehicles } from '../mockData';

const DriverManagement: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    status: 'OFF_DUTY' as 'ON_DUTY' | 'OFF_DUTY',
    vehicleId: '',
    rating: 5,
    tripsCompleted: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [driversData, vehiclesData] = await Promise.all([
        driverService.getAllDrivers().catch(() => mockDrivers as Driver[]),
        vehicleService.getAllVehicles().catch(() => mockVehicles)
      ]);
      setDrivers(driversData);
      setVehicles(vehiclesData);
    } catch (err: any) {
      console.error(err);
      setError("Failed to synchronize personnel records.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (driver?: Driver) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name,
        email: driver.email || '',
        phone: driver.phone || '',
        licenseNumber: driver.licenseNumber,
        licenseExpiry: driver.licenseExpiry || '',
        status: driver.status,
        vehicleId: driver.vehicleId || '',
        rating: driver.rating,
        tripsCompleted: driver.tripsCompleted
      });
    } else {
      setEditingDriver(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        licenseNumber: '',
        licenseExpiry: '',
        status: 'OFF_DUTY',
        vehicleId: '',
        rating: 5,
        tripsCompleted: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently remove this driver from the fleet registry?")) return;
    try {
      await driverService.deleteDriver(id);
      setDrivers(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert("System integrity error: Personnel records cannot be deleted while assigned to an active route.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingDriver) {
        const updated = await driverService.updateDriver(editingDriver.id, formData);
        setDrivers(prev => prev.map(d => d.id === editingDriver.id ? updated : d));
      } else {
        const created = await driverService.createDriver(formData);
        setDrivers(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Credential validation failed.");
      if (err.message?.includes('NEXT_PUBLIC_SUPABASE_URL')) {
        setIsModalOpen(false); // Demo fallback
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLicenseExpired = (date: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const isLicenseNearExpiry = (date: string) => {
    if (!date) return false;
    const expiry = new Date(date);
    const today = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return expiry.getTime() - today.getTime() < thirtyDays && expiry > today;
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Personnel Management</h2>
          <p className="text-slate-500 mt-1">Manage driver credentials, performance, and asset assignments.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
        >
          <UserPlus size={18} />
          Onboard Driver
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Filter by name, license, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Filter size={16} />
            Duty Status
          </button>
          <button onClick={fetchData} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600">
            <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map(driver => (
          <div key={driver.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{driver.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star size={12} fill="currentColor" />
                      {driver.rating} • {driver.tripsCompleted} Trips
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  driver.status === 'ON_DUTY' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {driver.status.replace('_', ' ')}
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CreditCard size={16} className="text-slate-400" />
                  <div className="flex-1 flex justify-between">
                    <span className="font-mono">{driver.licenseNumber}</span>
                    <div className={`flex items-center gap-1 font-bold ${
                      isLicenseExpired(driver.licenseExpiry) ? 'text-rose-500' :
                      isLicenseNearExpiry(driver.licenseExpiry) ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      <Calendar size={12} />
                      {driver.licenseExpiry || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Truck size={16} className="text-slate-400" />
                  <span className="font-medium">
                    {driver.vehicleId ? (
                      vehicles.find(v => v.id === driver.vehicleId)?.registrationNumber || 'Assigned'
                    ) : (
                      <span className="italic text-slate-400">No Vehicle Assigned</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span className="truncate">{driver.email || 'no-email@system.ai'}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleOpenModal(driver)}
                className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                <Edit2 size={14} />
                Edit Profile
              </button>
              <button 
                onClick={() => handleDelete(driver.id)}
                className="p-2 hover:bg-rose-100 rounded-lg text-rose-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {filteredDrivers.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Registry empty</h3>
            <p className="text-slate-500 mt-2">No personnel found matching the specified criteria.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{editingDriver ? 'Update Personnel Record' : 'Onboard New Driver'}</h3>
                  <p className="text-xs text-indigo-100 font-medium tracking-wider uppercase">Fleet Registry Division</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                  <input 
                    type="text" required placeholder="James Wilson"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duty Status</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="OFF_DUTY">Off Duty / Available</option>
                    <option value="ON_DUTY">On Duty / Active Route</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Email</label>
                  <input 
                    type="email" required placeholder="j.wilson@fleetops.ai"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                  <input 
                    type="tel" placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">License Number (CDL)</label>
                  <input 
                    type="text" required placeholder="TX-452134"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all font-mono"
                    value={formData.licenseNumber}
                    onChange={e => setFormData({...formData, licenseNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">License Expiry Date</label>
                  <input 
                    type="date" required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.licenseExpiry}
                    onChange={e => setFormData({...formData, licenseExpiry: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Fleet Asset</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    value={formData.vehicleId}
                    onChange={e => setFormData({...formData, vehicleId: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        [{v.registrationNumber}] {v.make} {v.model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 text-rose-700">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-xs font-bold leading-relaxed">{error}</p>
                </div>
              )}
              
              <div className="mt-8 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 flex items-center gap-2"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {editingDriver ? 'Commit Updates' : 'Complete Onboarding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
