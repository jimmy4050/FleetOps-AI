
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Download, Filter, Calendar, TrendingUp, TrendingDown, Activity, 
  DollarSign, Truck, Map, Fuel, FileSpreadsheet, Loader2, ChevronDown,
  ArrowUpRight, ArrowDownRight, Printer
} from 'lucide-react';
import { reportService } from '../services/reportService';
import { vehicleService } from '../services/vehicleService';
import { mockVehicles, mockMaintenance, mockFuelLogs, mockTrips } from '../mockData';
import { VehicleStatus } from '../types';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ReportsAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30D');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setStats({
        tco: 42500,
        efficiency: 6.8,
        utilization: 84,
        distance: 124500
      });
      setLoading(false);
    }, 800)
  }, []);

  const utilizationData = [
    { name: 'Mon', active: 32, total: 40 },
    { name: 'Tue', active: 35, total: 40 },
    { name: 'Wed', active: 38, total: 40 },
    { name: 'Thu', active: 30, total: 40 },
    { name: 'Fri', active: 36, total: 40 },
    { name: 'Sat', active: 22, total: 40 },
    { name: 'Sun', active: 18, total: 40 },
  ];

  const costBreakdown = [
    { name: 'Fuel', value: 28000 },
    { name: 'Routine Maint.', value: 8500 },
    { name: 'Emergency Repair', value: 4500 },
    { name: 'Compliance', value: 1500 },
  ];

  const handleExport = () => {
    const exportData = mockVehicles.map(v => ({
      Vehicle: v.registrationNumber,
      Make: v.make,
      Model: v.model,
      Status: v.status,
      Mileage: v.mileage,
      Fuel_Level: v.fuelLevel
    }));
    reportService.generateCSV(exportData, `Fleet_Report_${new Date().toISOString().split('T')[0]}`);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Aggregating Fleet Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Business Intelligence</h2>
          <p className="text-slate-500 mt-1">Holistic fleet performance auditing and cost-benefit analysis.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            {['7D', '30D', '90D', '1Y'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  dateRange === range ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <FileSpreadsheet size={18} className="text-emerald-600" />
            Export CSV
          </button>
          <button 
            onClick={() => window.print()}
            className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      {/* KPI Overlays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Fleet TCO', value: `$${stats?.tco.toLocaleString()}`, trend: '+4.2%', up: false, icon: <DollarSign />, color: 'indigo' },
          { label: 'Avg Efficiency', value: `${stats?.efficiency} MPG`, trend: '-1.5%', up: true, icon: <Activity />, color: 'emerald' },
          { label: 'Gross Utilization', value: `${stats?.utilization}%`, trend: '+2.1%', up: true, icon: <Truck />, color: 'amber' },
          { label: 'Operational Miles', value: stats?.distance.toLocaleString(), trend: '+12k', up: true, icon: <Map />, color: 'blue' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-2xl group-hover:scale-110 transition-transform`}>
                {kpi.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${kpi.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{kpi.value}</h3>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${kpi.color}-500 opacity-20`} />
          </div>
        ))}
      </div>

      {/* Primary Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Fleet Utilization Heatmap</h3>
            <span className="text-xs text-slate-400 font-medium">Daily Active vs. Capacity</span>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationData}>
                <defs>
                  <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="active" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUtil)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Expense Allocation</h3>
            <span className="text-xs text-slate-400 font-medium">Segmented Operational Cost</span>
          </div>
          <div className="h-[350px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Audit View Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Asset Efficiency Audit</h3>
          <div className="flex gap-2">
             <div className="relative">
               <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
               <input 
                type="text" 
                placeholder="Audit ID or VIN..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-64"
               />
             </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Asset Identification</th>
                <th className="px-8 py-4">Operational Days</th>
                <th className="px-8 py-4">Fuel Segment Cost</th>
                <th className="px-8 py-4">Maint. Index</th>
                <th className="px-8 py-4 text-right">Yield Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockVehicles.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900">{v.registrationNumber}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{v.vin}</p>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">28/30</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: '65%' }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600">$4,250</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-md">OPTIMAL</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <p className="text-sm font-black text-slate-900">0.92</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50 text-center">
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 tracking-widest uppercase">
            Load Historical Audit Data
          </button>
        </div>
      </div>
    </div>
  );
};

const Search = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

export default ReportsAnalytics;
