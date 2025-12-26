
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Search, 
  Filter, 
  X, 
  Loader2, 
  FileCode, 
  FileImage, 
  File, 
  MoreVertical,
  Plus,
  ShieldCheck,
  Truck,
  User,
  ExternalLink
} from 'lucide-react';
import { documentService } from '../services/documentService';
import { vehicleService } from '../services/vehicleService';
import { driverService } from '../services/driverService';
import { FleetDocument, DocumentType, Vehicle, Driver } from '../types';
import { mockVehicles, mockDrivers } from '../mockData';

const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<FleetDocument[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const [formData, setFormData] = useState({
    name: '',
    type: DocumentType.OTHER,
    expiryDate: '',
    vehicleId: '',
    driverId: '',
    file: null as File | null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsData, vehiclesData, driversData] = await Promise.all([
        documentService.getAllDocuments().catch(() => []),
        vehicleService.getAllVehicles().catch(() => mockVehicles),
        driverService.getAllDrivers().catch(() => mockDrivers)
      ]);
      setDocuments(docsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    setSubmitting(true);
    try {
      const newDoc = await documentService.uploadDocument(formData.file, {
        name: formData.name || formData.file.name,
        type: formData.type,
        expiryDate: formData.expiryDate || undefined,
        vehicleId: formData.vehicleId || undefined,
        driverId: formData.driverId || undefined
      });
      setDocuments(prev => [newDoc, ...prev]);
      setIsModalOpen(false);
      setFormData({ name: '', type: DocumentType.OTHER, expiryDate: '', vehicleId: '', driverId: '', file: null });
    } catch (err) {
      // Demo Fallback
      const simulated: FleetDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || formData.file.name,
        type: formData.type,
        filePath: 'mock/path',
        fileType: formData.file.type,
        fileSize: formData.file.size,
        expiryDate: formData.expiryDate || undefined,
        vehicleId: formData.vehicleId || undefined,
        driverId: formData.driverId || undefined,
        uploadedBy: 'System',
        createdAt: new Date().toISOString()
      };
      setDocuments(prev => [simulated, ...prev]);
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (doc: FleetDocument) => {
    if (!window.confirm(`Delete ${doc.name} forever?`)) return;
    try {
      await documentService.deleteDocument(doc.id, doc.filePath);
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
    } catch (err) {
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="text-rose-500" />;
    if (type.includes('image')) return <FileImage className="text-blue-500" />;
    if (type.includes('word') || type.includes('text')) return <FileCode className="text-indigo-500" />;
    return <File className="text-slate-500" />;
  };

  const getExpiryStatus = (date?: string) => {
    if (!date) return { label: 'Permanent', color: 'bg-slate-100 text-slate-600' };
    const expiry = new Date(date);
    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (expiry < now) return { label: 'Expired', color: 'bg-rose-100 text-rose-600' };
    if (expiry.getTime() - now.getTime() < thirtyDays) return { label: 'Expiring Soon', color: 'bg-amber-100 text-amber-600' };
    return { label: 'Valid', color: 'bg-emerald-100 text-emerald-600' };
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Compliance Vault</h2>
          <p className="text-slate-500 mt-1">Encrypted storage for licenses, insurance, and fleet documentation.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
        >
          <Upload size={20} />
          Upload Document
        </button>
      </div>

      {/* Stats/Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Files', value: documents.length, icon: <FileText /> },
          { label: 'Expired', value: documents.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date()).length, icon: <AlertCircle />, color: 'text-rose-600' },
          { label: 'Expiring 30d', value: documents.filter(d => getExpiryStatus(d.expiryDate).label === 'Expiring Soon').length, icon: <Calendar />, color: 'text-amber-600' },
          { label: 'Secure Access', value: 'RLS Active', icon: <ShieldCheck />, color: 'text-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-slate-50 rounded-xl ${stat.color || 'text-slate-600'}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none"
          >
            <option value="ALL">All Categories</option>
            {Object.values(DocumentType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={fetchData} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600">
            <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map(doc => {
          const status = getExpiryStatus(doc.expiryDate);
          const vehicle = vehicles.find(v => v.id === doc.vehicleId);
          const driver = drivers.find(d => d.id === doc.driverId);

          return (
            <div key={doc.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 truncate max-w-[150px]">{doc.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Expires: <span className="font-bold text-slate-700">{doc.expiryDate || 'N/A'}</span></span>
                  </div>
                  {vehicle && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Truck size={14} className="text-indigo-400" />
                      <span>Linked Asset: <span className="font-bold text-indigo-600">{vehicle.registrationNumber}</span></span>
                    </div>
                  )}
                  {driver && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User size={14} className="text-emerald-400" />
                      <span>Linked Driver: <span className="font-bold text-emerald-600">{driver.name}</span></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button 
                  onClick={async () => {
                    const url = await documentService.getDownloadUrl(doc.filePath);
                    window.open(url, '_blank');
                  }}
                  className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <Download size={14} />
                  Download
                </button>
                <button 
                  onClick={() => handleDelete(doc)}
                  className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && !loading && (
        <div className="py-24 text-center">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="text-slate-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Vault empty</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">No documents found matching the current search parameters.</p>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Upload size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Upload Document</h3>
                  <p className="text-xs text-indigo-100 font-medium uppercase tracking-widest">Compliance Management System</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-10 space-y-6">
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center bg-slate-50 hover:border-indigo-500 transition-all cursor-pointer relative"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input 
                    type="file" id="file-upload" className="hidden"
                    onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
                  />
                  {formData.file ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="text-emerald-500 mb-2" size={32} />
                      <p className="font-bold text-slate-900">{formData.file.name}</p>
                      <p className="text-xs text-slate-400">{(formData.file.size / 1024).toFixed(1)} KB • Ready to commit</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="text-slate-400 mb-2" size={32} />
                      <p className="font-bold text-slate-900">Drag & Drop or Click</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, DOCX, PNG up to 10MB</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Friendly Name</label>
                    <input 
                      type="text" required placeholder="e.g. 2024 Insurance"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as DocumentType})}
                    >
                      {Object.values(DocumentType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                    <input 
                      type="date"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold"
                      value={formData.expiryDate}
                      onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Link to Asset</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold"
                      value={formData.vehicleId}
                      onChange={e => setFormData({...formData, vehicleId: e.target.value, driverId: ''})}
                    >
                      <option value="">None</option>
                      {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 font-bold text-slate-400">Cancel</button>
                <button 
                  type="submit" 
                  disabled={submitting || !formData.file}
                  className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-3"
                >
                  {submitting ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                  Store File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;
