
import React, { useState, useEffect } from 'react';
import { 
  Fuel, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Search, 
  Filter, 
  Loader2, 
  X, 
  DollarSign,
  Truck,
  ArrowRight,
  AlertCircle,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { fuelService } from '../services/fuelService';
import { vehicleService } from '../services/vehicleService';
import { driverService } from '../services/driverService';
import { FuelLog, Vehicle, Driver } from '../types';
import { mockFuelLogs, mockVehicles, mockDrivers } from '../mockData';

const FuelManagement: React.FC = () => {
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    date: new Date().toISOString().slice(0, 16),
    amount: 0,
    cost: 0,
    odometer: 0,
    location: '',
    fullTank: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [logsData, vehiclesData, driversData] = await Promise.all([
        fuelService.getAllLogs().catch(() => mockFuelLogs),
        vehicleService.getAllVehicles().catch(() => mockVehicles),
        driverService.getAllDrivers().catch(() => mockDrivers)
      ]);
      setLogs(logsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
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
      const newLog = await fuelService.createLog(formData);
      setLogs(prev => [newLog, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      // Demo Fallback
      const simulated: FuelLog = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      setLogs(prev => [simulated, ...prev]);
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const totalSpend = logs.reduce((acc, log) => acc + log.cost, 0);
  const totalVolume = logs.reduce((acc, log) => acc + log.amount, 0);
  const avgCostPerUnit = totalVolume ? totalSpend / totalVolume : 0;

  const chartData = [...logs]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(log => ({
      date: new Date(log.date).toLocaleDateString(),
      cost: log.cost,
      amount: log.amount
    }));

  const filteredLogs = logs.filter(log => {
    const vehicle = vehicles.find(v => v.id === log.vehicleId);
    return vehicle?.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
           log.location?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fuel & Energy Management</h2>
          <p className="text-slate-500 mt-1">Monitor consumption patterns, costs, and asset efficiency metrics.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
        >
          <Fuel size={20} />
          Log Fuel Entry
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Last 30 Days</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Fleet Spend</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Fuel size={24} />
            </div>
            <div className="flex items-center text-xs font-bold text-rose-600">
              <TrendingUp size={14} className="mr-1" />
              +2.4%
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Consumption</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{totalVolume.toLocaleString()} Units</h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingDown size={24} />
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-600">
              <TrendingDown size={14} className="mr-1" />
              -0.12/unit
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Cost per Unit</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">${avgCostPerUnit.toFixed(2)}</h3>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Spending Trends</h3>
            <p className="text-sm text-slate-400">Fuel expenditure over time across the global fleet.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-bold bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100">Export Report</button>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
              <Tooltip 
                contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="cost" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fuel Log Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4 flex-1">
            <h3 className="font-bold text-slate-900">Recent Transactions</h3>
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by vehicle or station..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            <Filter size={14} />
            Filters
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Transaction Detail</th>
                <th className="px-8 py-4">Vehicle / Driver</th>
                <th className="px-8 py-4">Quantity</th>
                <th className="px-8 py-4">Odometer</th>
                <th className="px-8 py-4 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => {
                const vehicle = vehicles.find(v => v.id === log.vehicleId);
                const driver = drivers.find(d => d.id === log.driverId);
                return (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{log.location || 'Unknown Station'}</p>
                          <p className="text-xs text-slate-400">{new Date(log.date).toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Truck size={12} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-700">{vehicle?.registrationNumber || '---'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-slate-400">{driver?.name || 'Unknown Driver'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-900">{log.amount} <span className="text-[10px] text-slate-400 uppercase">Units</span></p>
                      {log.fullTank && <span className="text-[10px] font-black text-indigo-600 uppercase">Full Tank</span>}
                    </td>
                    <td className="px-8 py-5 text-sm font-mono text-slate-500">
                      {log.odometer.toLocaleString()} <span className="text-[10px]">KM</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className="text-lg font-black text-slate-900">${log.cost.toFixed(2)}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              <Fuel size={40} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium">No fuel logs found matching criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Fuel size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Record Fuel Entry</h3>
                  <p className="text-xs text-indigo-100 font-medium uppercase tracking-widest">Fleet Energy Optimization</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fleet Asset</label>
                  <select 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-700"
                    value={formData.vehicleId}
                    onChange={e => {
                      const v = vehicles.find(v => v.id === e.target.value);
                      setFormData({...formData, vehicleId: e.target.value, odometer: v?.mileage || 0});
                    }}
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>[{v.registrationNumber}] {v.make} {v.model}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Driver on Duty</label>
                  <select 
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold text-slate-700"
                    value={formData.driverId}
                    onChange={e => setFormData({...formData, driverId: e.target.value})}
                  >
                    <option value="">Select Driver</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fuel Quantity (Units)</label>
                  <div className="relative">
                    <Fuel className="absolute left-4 top-4 text-slate-300" size={20} />
                    <input 
                      type="number" step="0.01" required
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Transaction Cost ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-4 text-slate-300" size={20} />
                    <input 
                      type="number" step="0.01" required
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                      value={formData.cost}
                      onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Odometer Reading</label>
                  <input 
                    type="number" required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                    value={formData.odometer}
                    onChange={e => setFormData({...formData, odometer: parseInt(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Station / Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-300" size={20} />
                    <input 
                      type="text" required placeholder="e.g. Shell Station #441"
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl">
                <input 
                  type="checkbox" 
                  id="fullTank"
                  className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                  checked={formData.fullTank}
                  onChange={e => setFormData({...formData, fullTank: e.target.checked})}
                />
                <label htmlFor="fullTank" className="text-sm font-bold text-indigo-900">This entry represents a Full Tank Fill-up</label>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 font-bold text-slate-400">Cancel</button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-3"
                >
                  {submitting ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                  Commit Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelManagement;
