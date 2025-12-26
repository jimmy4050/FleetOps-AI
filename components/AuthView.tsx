
import React, { useState } from 'react';
import { Truck, ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface AuthViewProps {
  onLogin: (role: 'ADMIN' | 'MANAGER' | 'DRIVER') => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate Supabase Auth Flow
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, we assign role based on email keyword or default to ADMIN
      if (email.includes('manager')) onLogin('MANAGER');
      else if (email.includes('driver')) onLogin('DRIVER');
      else onLogin('ADMIN');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20 mb-4">
            <Truck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">FleetOps AI</h1>
          <p className="text-slate-500 mt-2">Enterprise Fleet Management System</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200">
          <div className="flex gap-4 p-1 bg-slate-100 rounded-xl mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-xs font-bold text-indigo-600 hover:underline">Forgot password?</button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-3 text-slate-400">
            <ShieldCheck size={18} />
            <p className="text-[10px] font-medium uppercase tracking-widest">Secure Enterprise Authentication</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 leading-relaxed">
            By continuing, you agree to the <span className="text-indigo-600 font-bold underline cursor-pointer">Terms of Service</span> and <span className="text-indigo-600 font-bold underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
