
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Truck,
  ShieldCheck,
  Clock,
  ExternalLink
} from 'lucide-react';
import { mockVehicles, mockDrivers } from '../mockData';

const data = [
  { name: 'Mon', fuel: 400, miles: 2400 },
  { name: 'Tue', fuel: 300, miles: 3398 },
  { name: 'Wed', fuel: 500, miles: 5800 },
  { name: 'Thu', fuel: 278, miles: 3908 },
  { name: 'Fri', fuel: 189, miles: 4800 },
  { name: 'Sat', fuel: 239, miles: 3800 },
  { name: 'Sun', fuel: 349, miles: 4300 },
];

const StatCard = ({ title, value, icon, trend, trendValue, color }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 bg-${color}-50 rounded-2xl text-${color}-600`}>
        {icon}
      </div>
      <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trendValue}
        {trend === 'up' ? <ArrowUpRight size={14} className="ml-1" /> : <ArrowDownRight size={14} className="ml-1" />}
      </div>
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
    <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{value}</h3>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">
            <ShieldCheck size={14} />
            System Secure & Active
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Fleet Command Center</h2>
          <p className="text-slate-500 mt-1">Operational integrity: <span className="text-emerald-600 font-bold">99.8%</span> across all nodes.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            Regional View
          </button>
          <button className="px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2">
            Export Analytics
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="In-Transit Assets" 
          value={mockVehicles.filter(v => v.status === 'ACTIVE').length} 
          icon={<TrendingUp size={24} />} 
          trend="up" 
          trendValue="+12.5%" 
          color="indigo"
        />
        <StatCard 
          title="Safety Exceptions" 
          value="04" 
          icon={<AlertTriangle size={24} />} 
          trend="down" 
          trendValue="-22.1%" 
          color="rose"
        />
        <StatCard 
          title="Fuel Cost Savings" 
          value="$12.4k" 
          icon={<Zap size={24} />} 
          trend="up" 
          trendValue="+4.2%" 
          color="emerald"
        />
        <StatCard 
          title="Telematics Health" 
          value="98.2%" 
          icon={<Activity size={24} />} 
          trend="up" 
          trendValue="+0.4%" 
          color="blue"
        />
      </div>

      {/* Primary Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Fleet Efficiency Engine</h3>
              <p className="text-sm text-slate-400">Miles traveled vs Fuel consumption per cycle</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl">
              <button className="px-3 py-1.5 text-xs font-bold bg-white shadow-sm rounded-lg text-indigo-600">7D</button>
              <button className="px-3 py-1.5 text-xs font-bold text-slate-500">30D</button>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMiles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <Tooltip 
                  cursor={{stroke: '#4f46e5', strokeWidth: 1}}
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                />
                <Area type="monotone" dataKey="miles" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorMiles)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Feed / Alerts */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="text-indigo-400" />
            <h3 className="font-bold text-lg">System Live Feed</h3>
          </div>
          <div className="space-y-6 flex-1">
            {[
              { time: "09:42 AM", user: "Driver J. Wilson", event: "Completed Pre-trip Inspection", type: "info" },
              { time: "09:15 AM", user: "Kenworth T680", event: "Telematics Lost Connection", type: "error" },
              { time: "08:30 AM", user: "Manager S. Miller", event: "Approved 2 Service Records", type: "success" },
              { time: "07:55 AM", user: "Volvo VNL 860", event: "Low Fuel Alert - Chicago IL", type: "warning" }
            ].map((log, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="pt-1.5 flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    log.type === 'error' ? 'bg-rose-500' : 
                    log.type === 'warning' ? 'bg-amber-500' : 
                    log.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
                  } group-hover:scale-125 transition-transform`} />
                  <div className="w-[1px] h-full bg-slate-800 mt-2" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-slate-500 font-bold uppercase">{log.time}</p>
                  <p className="text-sm font-bold mt-0.5">{log.event}</p>
                  <p className="text-xs text-slate-400">{log.user}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
            Full Audit Log
          </button>
        </div>
      </div>

      {/* Secondary Data View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Mileage Distribution</h3>
            <button className="text-indigo-600 text-sm font-bold hover:underline">Download CSV</button>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="miles" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">High-Performance Drivers</h3>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
              <Activity size={18} />
            </div>
          </div>
          <div className="space-y-6 flex-1">
            {mockDrivers.slice(0, 4).map((driver) => (
              <div key={driver.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{driver.name}</p>
                    <p className="text-xs text-slate-500">Rating: <span className="text-indigo-600 font-bold">{driver.rating}</span> • {driver.tripsCompleted} Trips</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{(driver.tripsCompleted * 1.2).toFixed(0)}h</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Duty Time</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
            Manage Personnel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
