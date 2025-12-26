
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Search, 
  X, 
  Loader2, 
  ArrowRight,
  ShieldAlert,
  Inbox,
  Calendar,
  Wrench,
  Fuel,
  FileText,
  // Added Truck to the imports to fix the error on line 213
  Truck
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { Notification, NotificationSeverity, NotificationCategory } from '../types';
import { mockNotifications } from '../mockData';

const AlertCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
    const subscription = notificationService.subscribeToAlerts((payload) => {
      setNotifications(prev => [payload.new as Notification, ...prev]);
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications().catch(() => mockNotifications);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const getSeverityStyles = (severity: NotificationSeverity) => {
    switch (severity) {
      case NotificationSeverity.CRITICAL:
        return { 
          icon: <AlertCircle size={20} className="text-rose-600" />, 
          bg: 'bg-rose-50', 
          border: 'border-rose-100',
          label: 'text-rose-700'
        };
      case NotificationSeverity.WARNING:
        return { 
          icon: <AlertTriangle size={20} className="text-amber-600" />, 
          bg: 'bg-amber-50', 
          border: 'border-amber-100',
          label: 'text-amber-700'
        };
      default:
        return { 
          icon: <Info size={20} className="text-indigo-600" />, 
          bg: 'bg-indigo-50', 
          border: 'border-indigo-100',
          label: 'text-indigo-700'
        };
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case NotificationCategory.MAINTENANCE: return <Wrench size={14} />;
      case NotificationCategory.EXPIRY: return <Calendar size={14} />;
      case NotificationCategory.FUEL: return <Fuel size={14} />;
      case NotificationCategory.TRIP: return <ArrowRight size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const filtered = notifications.filter(n => {
    const matchesSeverity = filterSeverity === 'ALL' || n.severity === filterSeverity;
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Fleet Alert Center
            {unreadCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce">
                {unreadCount} NEW
              </span>
            )}
          </h2>
          <p className="text-slate-500 mt-1">Real-time safety signals and operational risk monitoring.</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 px-4 py-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition-all"
        >
          <CheckCheck size={18} />
          Mark all as read
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search alerts..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(s => (
            <button 
              key={s}
              onClick={() => setFilterSeverity(s)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                filterSeverity === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[2.5rem] py-24 text-center">
            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="text-emerald-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Fleet Operations Stable</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto italic">No active alerts found. Your fleet is operating within specified safety parameters.</p>
          </div>
        ) : (
          filtered.map(notif => {
            const style = getSeverityStyles(notif.severity);
            return (
              <div 
                key={notif.id} 
                className={`group relative bg-white border ${notif.isRead ? 'border-slate-100 opacity-80' : `${style.border} shadow-sm`} rounded-[2rem] overflow-hidden transition-all hover:shadow-md`}
              >
                {!notif.isRead && <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.label.replace('text', 'bg')}`} />}
                <div className="p-8 flex gap-6 items-start">
                  <div className={`p-4 rounded-2xl ${style.bg} shrink-0`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.label}`}>
                          {notif.severity}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {getCategoryIcon(notif.category)}
                          {notif.category}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900">{notif.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{notif.message}</p>
                    
                    <div className="pt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        {notif.metadata?.vehicleId && (
                          <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-600 rounded-lg flex items-center gap-1.5 transition-colors">
                            <Truck size={12} /> View Asset
                          </button>
                        )}
                        {notif.metadata?.driverId && (
                          <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-600 rounded-lg flex items-center gap-1.5 transition-colors">
                            <Inbox size={12} /> View Personnel
                          </button>
                        )}
                      </div>
                      {!notif.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertCenter;
