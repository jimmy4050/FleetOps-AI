
import React from 'react';
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
  Terminal
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

const Architecture: React.FC = () => {
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="text-left space-y-2">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">System Architecture Blueprint</h2>
          <p className="text-lg text-slate-500 max-w-2xl">
            Enterprise project structure designed for massive scale and modularity.
          </p>
        </div>
        <div className="flex gap-3">
          <a 
            href="#" 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
          >
            <Terminal size={18} />
            Deployment Guide
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Structure Tree */}
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
          <div className="mt-8 pt-6 border-t border-slate-800 text-[10px] text-slate-500 font-mono italic">
            // Optimized for Vercel & Next.js 14 (App Router)
          </div>
        </div>

        {/* High Level Detail Cards */}
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

      {/* Real-time Data Flow Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Layers size={300} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold flex items-center gap-3">
              <Zap className="text-amber-400" /> 
              Real-time Data Flow
            </h3>
            
            <div className="space-y-6">
              {[
                { step: "01", label: "IoT Edge Ingestion", desc: "Vehicle GPS/OBD-II data sent via encrypted MQTT/HTTPS." },
                { step: "02", label: "Edge Processing", desc: "Vercel Functions normalize data and check for geofence violations." },
                { step: "03", label: "Supabase Realtime", desc: "WebSocket broadcast pushes updates to the frontend in <200ms." },
                { step: "04", label: "AI Prediction", desc: "Gemini models analyze usage patterns for predictive maintenance." }
              ].map((flow, i) => (
                <div key={i} className="flex gap-6 group">
                  <span className="text-indigo-400 font-mono text-lg font-bold">{flow.step}</span>
                  <div>
                    <p className="font-bold text-lg group-hover:text-indigo-300 transition-colors">{flow.label}</p>
                    <p className="text-slate-400 text-sm mt-1">{flow.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-white/10 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-emerald-400" size={20} />
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-400">Security Model</span>
            </div>
            <div className="space-y-4">
              {[
                "Row Level Security (RLS) on all tables",
                "AES-256 Encryption for Telematics Storage",
                "SOC2 Type II Compliant Infrastructure",
                "Strict MFA for Administrative Portals",
                "Automated SQL Injection Prevention via Prisma/Postgres"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 mt-6 border-t border-white/10">
              <button className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
                <Code2 size={20} />
                View API Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Architecture;
