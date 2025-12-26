
import React from 'react';
import { 
  Compass, 
  Map as MapIcon, 
  Smartphone, 
  BrainCircuit, 
  Users2, 
  Globe2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Milestone,
  Sparkles
} from 'lucide-react';

const RoadmapCard = ({ title, description, icon, status, tags, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50`} />
    <div className="relative z-10">
      <div className={`p-4 bg-${color}-50 text-${color}-600 w-fit rounded-2xl mb-6`}>
        {icon}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{status}</span>
        <div className="h-1 w-1 rounded-full bg-slate-300" />
        <div className="flex gap-1">
          {tags.map((tag: string) => (
            <span key={tag} className={`text-[8px] font-bold px-1.5 py-0.5 rounded bg-${color}-50 text-${color}-700 uppercase`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">
        {description}
      </p>
      <div className="flex items-center text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer">
        Explore Specification
        <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
);

const Roadmap: React.FC = () => {
  const enhancements = [
    {
      title: "Real-time GPS Live Tracking",
      description: "High-precision geospatial tracking with sub-second latency. Features include active route breadcrumbs, dynamic geofencing, and automated ETA recalculation using live traffic data.",
      icon: <MapIcon size={24} />,
      status: "Q3 2024",
      tags: ["Geo", "Real-time"],
      color: "blue"
    },
    {
      title: "Native Mobile Driver Hub",
      description: "A specialized iOS/Android companion app for drivers. Digitize Bills of Lading (BOL), handle electronic pre-trip inspections, and enable instant push communication with dispatch.",
      icon: <Smartphone size={24} />,
      status: "Q4 2024",
      tags: ["Mobile", "Personnel"],
      color: "emerald"
    },
    {
      title: "AI Fuel Anomaly Detection",
      description: "Deep-learning integration with Gemini to identify fuel theft, siphoning, or engine inefficiencies. Cross-references fuel logs with GPS data to flag suspicious transactions.",
      icon: <BrainCircuit size={24} />,
      status: "Q4 2024",
      tags: ["AI", "Security"],
      color: "rose"
    },
    {
      title: "Granular Role Customization",
      description: "Moving beyond basic RBAC to fully custom permission manifests. Define granular access for regional managers, specialized maintenance crews, and 3rd-party auditors.",
      icon: <Users2 size={24} />,
      status: "Q1 2025",
      tags: ["RBAC", "Governance"],
      color: "indigo"
    },
    {
      title: "Enterprise Multi-Tenant SaaS",
      description: "Complete architectural scaling to support isolated organizational nodes. Allows large logistics firms to manage sub-fleets or franchised partners with strict data silos.",
      icon: <Globe2 size={24} />,
      status: "Q2 2025",
      tags: ["SaaS", "Scale"],
      color: "amber"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
          <Sparkles size={14} />
          Strategic Vision 2025
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">The Future of FleetOps AI</h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Our engineering roadmap is focused on hyper-scaling operational intelligence through Gemini-native features and cross-platform mobility.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {enhancements.map((item, i) => (
          <RoadmapCard key={i} {...item} />
        ))}
        
        {/* Placeholder for 'Your Suggestion' */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col justify-center items-center text-center group transition-all">
          <div className="p-4 bg-white/5 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Have a Feature Idea?</h3>
          <p className="text-slate-400 text-sm mb-6">Our product engineers are always looking for enterprise feedback.</p>
          <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
            Contact Product Team
          </button>
        </div>
      </div>

      {/* Vision Statement */}
      <div className="bg-white rounded-[3rem] border border-slate-200 p-12 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Milestone size={240} />
        </div>
        <div className="lg:w-1/2 space-y-6 relative z-10">
          <h3 className="text-3xl font-black text-slate-900 leading-tight">Empowering Global Logistics through <span className="text-indigo-600">Predictive Intelligence</span></h3>
          <p className="text-slate-600 leading-relaxed italic">
            "Our goal isn't just to manage trucks; it's to build a self-healing, hyper-efficient logistics organism that predicts failure before it happens and optimizes every mile with surgical precision."
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm">CTO</div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Marcus Vane</p>
              <p className="text-xs text-slate-500 font-medium">Chief Technology Officer, FleetOps AI</p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h4 className="text-3xl font-black text-indigo-600">99.9%</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Uptime Target</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h4 className="text-3xl font-black text-emerald-600">200ms</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Edge Latency</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h4 className="text-3xl font-black text-rose-600">AI-First</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Architecture</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h4 className="text-3xl font-black text-amber-600">Global</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Scale Reach</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
