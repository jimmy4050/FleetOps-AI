
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  LogOut, 
  Cpu, 
  Wrench,
  ShieldCheck,
  User,
  MapPin,
  Fuel,
  FileText,
  BarChart3,
  Compass
} from 'lucide-react';
import { UserRole, Notification } from '../types';
import { notificationService } from '../services/notificationService';
import { mockNotifications } from '../mockData';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: {
    name: string;
    role: UserRole;
    email: string;
  };
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const data = await notificationService.getNotifications().catch(() => mockNotifications);
      setUnreadCount(data.filter(n => !n.isRead).length);
    };
    fetchUnread();
    
    const sub = notificationService.subscribeToAlerts(() => {
      fetchUnread();
    });
    return () => { sub.unsubscribe(); };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.DRIVER] },
    { id: 'alerts', label: 'Alerts Center', icon: <Bell size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.DRIVER], badge: unreadCount },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'trips', label: 'Trips', icon: <MapPin size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.DRIVER] },
    { id: 'fleet', label: 'Fleet Registry', icon: <Truck size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'drivers', label: 'Drivers', icon: <Users size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'fuel', label: 'Fuel', icon: <Fuel size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.DRIVER] },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'documents', label: 'Documents', icon: <FileText size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.DRIVER] },
    { id: 'ai', label: 'AI Advisor', icon: <Cpu size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'roadmap', label: 'Strategy & Roadmap', icon: <Compass size={20} />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'architecture', label: 'Architecture', icon: <ShieldCheck size={20} />, roles: [UserRole.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/20">
              <Truck size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">FleetOps AI</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group shrink-0 ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === item.id ? 'bg-white text-indigo-600' : 'bg-rose-600 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2 shrink-0">
          <div className="px-4 py-3 bg-slate-800/50 rounded-xl mb-4 border border-white/5">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Access Level</p>
            <p className="text-xs font-bold text-white uppercase">{user.role}</p>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-96">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="System-wide search..." 
              className="bg-transparent border-none outline-none ml-2 text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('alerts')}
              className={`relative p-2 rounded-xl transition-all ${activeTab === 'alerts' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500 lowercase">{user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                {user.name[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <section className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
