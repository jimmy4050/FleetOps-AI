
import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Plus, 
  Calendar, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  Filter, 
  Loader2, 
  X, 
  Truck, 
  DollarSign,
  ClipboardList,
  ChevronRight,
  Tool
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { maintenanceService } from '../services/maintenanceService';
import { vehicleService } from '../services/vehicleService';
import { MaintenanceRecord, MaintenanceStatus, MaintenanceType, Vehicle } from '../types';
import { mockMaintenance, mockVehicles } from '../mockData';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444'];

const MaintenanceManagement: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  const [formData, setFormData] = useState({
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
    type: MaintenanceType.ROUTINE,
    status: MaintenanceStatus.PLANNED,
    cost: 0,
    odometer: 0,
    provider: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsData, vehiclesData] = await Promise.all([
        maintenanceService.getAllRecords().catch(() => mockMaintenance),
        vehicleService.getAllVehicles().catch(() => mockVehicles)
      ]);
      setRecords(recordsData);
      setVehicles(vehiclesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newRecord = await maintenanceService.createRecord(formData);
      setRecords(prev => [newRecord, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      // Demo Fallback
      const simulated: MaintenanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      setRecords(prev => [simulated, ...prev]);
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const costByType = Object.values(MaintenanceType).map(type => ({
    name: type,
    value: records.filter(r => r.type === type).reduce((acc, r) => acc + r.cost, 0)
  })).filter(item => item.value > 0);

  const pendingServices = records.filter(r => r.status !== MaintenanceStatus.COMPLETED);
  const totalSpend = records.reduce((acc, r) => acc + r.cost, 0);
  const breakdownCount = records.filter(r => r.type === MaintenanceType.BREAKDOWN).length;

  const filteredRecords = records.filter(r => filterType === 'ALL' || r.type === filterType);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Maintenance & Reliability</h2>
          <p className="text-slate-500 mt-1">Lifecycle management, predictive scheduling, and emergency log registry.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
        >
          <Plus size={20} />
          Schedule Service
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Lifecycle Cost</p>
            <h3 className="text-2xl font-black text-slate-900">${totalSpend.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <ClipboardList size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Tickets</p>
            <h3 className="text-2xl font-black text-slate-900">{pendingServices.length} Planned</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
            <AlertOctagon size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Breakdown Rate</p>
            <h3 className="text-2xl font-black text-slate-900">{breakdownCount} Events</h3>
          </div>
        </div>
      </div>

      {/* Analytics Visualization */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-[400px] flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Cost Distribution</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Clock size={20} className="text-indigo-400" />
              Service Queue
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Upcoming & In-Progress</span>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {pendingServices.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 italic">
                No active maintenance tickets.
              </div>
            ) : (
              pendingServices.map(r => {
                const vehicle = vehicles.find(v => v.id === r.vehicleId);
                return (
                  <div key={r.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        r.status === MaintenanceStatus.IN_PROGRESS ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        <Wrench size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{vehicle?.registrationNumber || '---'}</p>
                        <p className="text-xs text-slate-400">{r.type} • {r.date}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-white" />
                  </div>
                );
              })
            )}
          </div>
          <button className="mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
            View All Schedules
          </button>
        </div>
      </div>

      {/* Maintenance Registry */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-6">
            <h3 className="font-bold text-slate-900">Service Logs</h3>
            <div className="flex bg-white p-1 rounded-xl border border-slate-200">
              {['ALL', ...Object.values(MaintenanceType)].map(t => (
                <button 
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                    filterType === t ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400">
              <Search size={18} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-4">Asset & Provider</th>
                <th className="px-8 py-4">Status / Type</th>
                <th className="px-8 py-4">Description</th>
                <th className="px-8 py-4">Odometer</th>
                <th className="px-8 py-4 text-right">Investment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map(record => {
                const vehicle = vehicles.find(v => v.id === record.vehicleId);
                return (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                          <Truck size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{vehicle?.registrationNumber || 'Unknown'}</p>
                          <p className="text-xs text-slate-400 font-medium">{record.provider || 'Internal Depot'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                          record.type === MaintenanceType.BREAKDOWN ? 'bg-rose-100 text-rose-600' : 
                          record.type === MaintenanceType.ROUTINE ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {record.type}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 capitalize">
                          {record.status.replace('_', ' ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 max-w-xs">
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed italic">{record.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar size={10} /> {record.date}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-mono font-bold text-slate-500">{record.odometer?.toLocaleString()} KM</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className="text-lg font-black text-slate-900">${record.cost.toLocaleString()}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredRecords.length === 0 && (
            <div className="py-24 text-center text-slate-400">
              <ClipboardList size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-medium uppercase tracking-widest text-xs">Registry Clear</p>
            </div>
          )}
        </div>
      </div>

      {/* Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Wrench size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Plan Service Task</h3>
                  <p className="text-xs text-indigo-100 font-medium uppercase tracking-widest">Fleet Reliability Protocol</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fleet Asset</label>
                  <select 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                    value={formData.vehicleId}
                    onChange={e => {
                      const v = vehicles.find(v => v.id === e.target.value);
                      setFormData({...formData, vehicleId: e.target.value, odometer: v?.mileage || 0});
                    }}
                  >
                    <option value="">Select Asset</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>[{v.registrationNumber}] {v.make} {v.model}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Classification</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as MaintenanceType})}
                  >
                    {Object.values(MaintenanceType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Scheduled Date</label>
                  <input 
                    type="date" required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Odometer</label>
                  <input 
                    type="number" required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                    value={formData.odometer}
                    onChange={e => setFormData({...formData, odometer: parseInt(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Provider</label>
                  <input 
                    type="text" placeholder="e.g. Penske Solutions"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                    value={formData.provider}
                    onChange={e => setFormData({...formData, provider: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Est. Cost ($)</label>
                  <input 
                    type="number" required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                    value={formData.cost}
                    onChange={e => setFormData({...formData, cost: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Scope of Work</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm leading-relaxed"
                  placeholder="Describe parts replaced, diagnostics performed, or specific fault codes..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 font-bold text-slate-400">Discard</button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-3"
                >
                  {submitting ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceManagement;
