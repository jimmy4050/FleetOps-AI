
import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Lock, 
  Zap, 
  Globe, 
  Layers, 
  ArrowRight, 
  Shield, 
  CheckCircle2,
  Code2,
  FolderTree,
  FileCode,
  Box,
  ExternalLink,
  Terminal,
  X,
  Copy
} from 'lucide-react';

const FolderNode = ({ name, children, isFile = false }: any) => (
  <div className="ml-4 border-l border-slate-700/50 pl-4 py-1">
    <div className="flex items-center gap-2 group cursor-default">
      {isFile ? <FileCode size={14} className="text-slate-400 group-hover:text-indigo-400" /> : <Box size={14} className="text-indigo-400 group-hover:text-indigo-300" />}
      <span className={`text-xs font-mono ${isFile ? 'text-slate-400' : 'text-slate-200 font-bold'}`}>{name}</span>
    </div>
    {children}
  </div>
);

const DeploymentModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  const sqlSchema = `-- Run this in Supabase SQL Editor
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vin TEXT UNIQUE NOT NULL,
  registration_number TEXT NOT NULL,
  make TEXT,
  model TEXT,
  year INTEGER,
  status TEXT DEFAULT 'ACTIVE',
  mileage INTEGER DEFAULT 0,
  fuel_level INTEGER DEFAULT 100,
  location JSONB,
  driver_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add other tables (drivers, trips, fuel_logs, notifications) as per DEPLOYMENT.md`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl">
              <Terminal size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black">Production Deployment Guide</h3>
              <p className="text-sm text-slate-400">Vercel + Supabase Enterprise Stack</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto space-y-8">
          <section>
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
              Supabase SQL Initialization
            </h4>
            <div className="relative group">
              <pre className="bg-slate-900 text-indigo-300 p-6 rounded-2xl text-xs font-mono overflow-x-auto border border-slate-800">
                {sqlSchema}
              </pre>
              <button 
                onClick={() => copyToClipboard(sqlSchema)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Copy size={16} />
              </button>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
              Vercel Environment Variables
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'NEXT_PUBLIC_SUPABASE_URL', desc: 'Supabase Project URL' },
                { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', desc: 'Supabase Public API Key' },
                { key: 'API_KEY', desc: 'Google Gemini AI Key' },
                { key: 'SUPABASE_SERVICE_ROLE_KEY', desc: 'Supabase Admin Key (Server Only)' }
              ].map(env => (
                <div key={env.key} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{env.desc}</p>
                  <p className="font-mono text-xs font-bold text-slate-700 mt-1">{env.key}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-4 items-center">
            <Shield className="text-indigo-600" size={32} />
            <p className="text-sm text-indigo-900 leading-relaxed font-medium">
              Ensure <strong>Row Level Security (RLS)</strong> is enabled on all production tables. 
              Never expose your <code>SERVICE_ROLE_KEY</code> in client-side code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Architecture: React.FC = () => {
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  const sections = [
    {
      title: "Cloud-Native Infrastructure",
      icon: <Server className="text-blue-500" />,
      content: "Built on Vercel's Edge Runtime and Next.js 14, providing high-availability and low-latency SSR for real-time fleet dashboards.",
      chips: ["Next.js 14", "Vercel Edge", "TypeScript"]
    },
    {
      title: "Data Persistence Layer",
      icon: <Database className="text-indigo-500" />,
      content: "PostgreSQL managed by Supabase. Utilizing PostGIS for geospatial indexing and Table Partitioning for high-volume telemetry ingestion.",
      chips: ["PostGIS", "Supabase DB", "Wal-G"]
    },
    {
      title: "Identity & RBAC Flow",
      icon: <Lock className="text-emerald-500" />,
      content: "Centralized Auth via Supabase Go-True. Granular Row Level Security (RLS) ensures data isolation between different regional fleet nodes.",
      chips: ["RBAC", "RLS", "Supabase Auth"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DeploymentModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-left space-y-2">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">System Architecture Blueprint</h2>
          <p className="text-lg text-slate-500 max-w-2xl">
            Enterprise project structure designed for massive scale and modularity.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsDeployModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
          >
            <Terminal size={18} />
            Deployment Guide
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
            <FolderTree className="text-indigo-400" size={20} />
            <h3 className="text-white font-bold">Project Structure</h3>
          </div>
          <div className="space-y-1">
            <FolderNode name="app/">
              <FolderNode name="(auth)/">
                <FolderNode name="login/page.tsx" isFile />
                <FolderNode name="register/page.tsx" isFile />
              </FolderNode>
              <FolderNode name="(dashboard)/">
                <FolderNode name="fleet/page.tsx" isFile />
                <FolderNode name="layout.tsx" isFile />
              </FolderNode>
              <FolderNode name="api/">
                <FolderNode name="telemetry/route.ts" isFile />
              </FolderNode>
              <FolderNode name="layout.tsx" isFile />
            </FolderNode>
            <FolderNode name="components/">
              <FolderNode name="ui/" />
              <FolderNode name="features/" />
            </FolderNode>
            <FolderNode name="hooks/">
              <FolderNode name="useFleet.ts" isFile />
            </FolderNode>
            <FolderNode name="lib/">
              <FolderNode name="supabase.ts" isFile />
              <FolderNode name="gemini.ts" isFile />
            </FolderNode>
            <FolderNode name="middleware.ts" isFile />
            <FolderNode name="types.ts" isFile />
            <FolderNode name="DEPLOYMENT.md" isFile />
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, i) => (
            <div key={i} className={`bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all ${i === 2 ? 'md:col-span-2' : ''}`}>
              <div className="mb-6 p-4 bg-slate-50 w-fit rounded-2xl">
                {section.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{section.content}</p>
              <div className="flex flex-wrap gap-2">
                {section.chips.map(chip => (
                  <span key={chip} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Architecture;
