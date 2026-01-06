
import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Problem, User, Solution } from '../types.ts';
import { 
  Users, CheckCircle2, Star, Trophy, Loader2, Shield, Activity, 
  Terminal, Cpu, IndianRupee, Settings, Trash2, Ban, Plus, 
  Briefcase, Layers, Info, Tag, Wand2, AlertTriangle, BarChart3, 
  BrainCircuit, Layout, Zap, Edit2, Eye, XCircle, Download, FileArchive, ArrowUpRight, ShieldCheck, UserCheck, FileSpreadsheet, X, HelpCircle,
  Square, CheckSquare, Trash
} from 'lucide-react';
import ProblemDetailModal from '../components/ProblemDetailModal.tsx';
import Modal from '../components/Modal.tsx';
import StarRatingInput from '../components/StarRatingInput.tsx';
import { refineProblemDescription } from '../services/geminiService.ts';
import * as XLSX from 'xlsx';

// Memoized table row for performance
const ProblemRow = memo(({ 
    p, 
    isSelected, 
    onToggle, 
    onDetail, 
    onDelete 
}: { 
    p: Problem, 
    isSelected: boolean, 
    onToggle: (id: string) => void,
    onDetail: (p: Problem) => void,
    onDelete: (id: string) => void
}) => (
    <tr className={`hover:bg-gray-50 group transition-colors ${isSelected ? 'bg-citrus/5' : ''}`}>
        <td className="p-6">
            <button onClick={() => onToggle(p.id)} className="transition-all hover:scale-110">
                {isSelected ? <CheckSquare className="w-5 h-5 text-forest" /> : <Square className="w-5 h-5 text-gray-200" />}
            </button>
        </td>
        <td className="p-6 font-bold text-black max-w-xs truncate text-lg group-hover:text-coral transition-colors">{p.title}</td>
        <td className="p-6">
            <span className={`px-2 py-1 rounded text-[8px] font-black uppercase border border-black/10 ${p.isSimulation ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                {p.isSimulation ? 'SIM' : 'REAL'}
            </span>
        </td>
        <td className="p-6 font-black text-[9px] uppercase tracking-widest">{p.difficulty || 'MEDIUM'}</td>
        <td className="p-6 flex gap-2">
            <button onClick={() => onDetail(p)} className="p-2.5 bg-paper border-2 border-black rounded-lg hover:bg-citrus transition-all"><Eye className="w-4 h-4"/></button>
            <button onClick={() => onDelete(p.id)} className="p-2.5 bg-white border-2 border-black rounded-lg text-coral hover:bg-black transition-all"><Trash2 className="w-4 h-4"/></button>
        </td>
    </tr>
));

const AdminPortal: React.FC<{ onProfileClick: (id: string) => void }> = ({ onProfileClick }) => {
  const { allUsers, problems, adminDeleteProblem, bulkDeleteProblems, bulkAddProblems } = useStore();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'CONTENT' | 'SIMULATION_AUDITS' | 'SETTINGS'>('OVERVIEW');
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
  const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab !== 'CONTENT') setSelectedProblemIds([]);
    setVisibleCount(20); // Reset visible count on tab change
  }, [activeTab]);

  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const onlineUsers = allUsers.filter(u => u.lastSeen && (Date.now() - new Date(u.lastSeen).getTime()) < 5 * 60 * 1000).length;
    const totalSimulations = problems.filter(p => p.isSimulation).length;
    const totalBountyValue = problems.reduce((acc, p) => acc + (parseFloat(p.bounty.replace(/[^0-9.]/g, '')) || 0), 0);
    return { totalUsers, onlineUsers, totalSimulations, totalBountyValue };
  }, [allUsers, problems]);

  const pendingSimulationAudits = useMemo(() => {
    return problems.flatMap(p => (p.solutions || []).filter(s => s.reviewStatus === 'PENDING').map(s => ({ problem: p, solution: s })));
  }, [problems]);

  const handleDownloadTemplate = () => {
    const headers = ["Title", "Description", "Bounty", "Difficulty", "Tags"];
    const csvContent = [headers, ["Sample React Debugging", "Fix the memory leak...", "5000", "MEDIUM", "React, Hooks"]].map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(new Blob([csvContent], { type: 'text/csv' })));
    link.setAttribute("download", "simulation_template.csv");
    link.click();
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSyncing(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
        try {
            const data: any[] = XLSX.utils.sheet_to_json(XLSX.read(evt.target?.result, { type: 'binary' }).Sheets[XLSX.read(evt.target?.result, { type: 'binary' }).SheetNames[0]]);
            const pToUp = data.map(item => ({
                title: item.Title || 'Untitled Simulation',
                description: item.Description || '',
                bounty: (item.Bounty || '0').toString(),
                difficulty: (item.Difficulty || 'MEDIUM').toUpperCase(),
                tags: (item.Tags || '').split(',').map((t: string) => t.trim()),
                isSimulation: true
            }));
            if (pToUp.length) await bulkAddProblems(pToUp);
        } catch (err) { alert("Format Error."); } finally { setIsSyncing(false); }
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkDelete = async () => {
    if (!selectedProblemIds.length) return;
    if (confirm(`Execute wipe protocol for ${selectedProblemIds.length} nodes?`)) {
        setIsBulkDeleting(true);
        try { await bulkDeleteProblems(selectedProblemIds); setSelectedProblemIds([]); } finally { setIsBulkDeleting(false); }
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-32 px-4 pb-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 reveal">
            <div className="tactile-card bg-black text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden flex-1 w-full">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 p-4"><Shield className="w-64 h-64" /></div>
              <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-coral text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-black mb-6">
                     <Terminal className="w-4 h-4" /> System Oversight
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter leading-none">Admin <span className="text-citrus italic">Console.</span></h1>
                  <p className="text-gray-400 font-bold uppercase tracking-[0.2em] mt-4">Infrastructure & Audit Control 👀</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button onClick={handleDownloadTemplate} className="tactile-btn px-6 py-6 bg-paper text-black border-4 border-black rounded-[2rem] font-black shadow-xl"><Download className="w-5 h-5" /></button>
                <input type="file" ref={bulkInputRef} onChange={handleBulkUpload} className="hidden" accept=".xlsx,.xls,.csv" />
                <button disabled={isSyncing} onClick={() => bulkInputRef.current?.click()} className="tactile-btn px-8 py-6 bg-citrus text-black border-4 border-black rounded-[2rem] font-black text-lg flex items-center gap-4 shadow-xl">
                    {isSyncing ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileSpreadsheet className="w-6 h-6" />} Sync Nodes
                </button>
            </div>
        </div>

        <div className="flex space-x-4 mb-10 overflow-x-auto pb-4">
           {['OVERVIEW', 'USERS', 'CONTENT', 'SIMULATION_AUDITS', 'SETTINGS'].map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab as any)} className={`tactile-btn px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-black text-white' : 'bg-white text-black hover:bg-citrus'}`}>
                {tab.replace('_', ' ')} {tab === 'SIMULATION_AUDITS' && pendingSimulationAudits.length > 0 && <span className="ml-2 bg-coral text-white px-2 py-0.5 rounded-full text-[8px]">{pendingSimulationAudits.length}</span>}
             </button>
           ))}
        </div>

        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
             <div className="tactile-card p-8 rounded-3xl bg-white text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Online Now</p>
                <div className="text-5xl font-black text-black leading-none">{stats.onlineUsers}</div>
            </div>
            <div className="tactile-card p-8 rounded-3xl bg-white text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Nodes</p>
                <div className="text-5xl font-black text-black leading-none">{stats.totalUsers}</div>
            </div>
            <div className="tactile-card p-8 rounded-3xl bg-white text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Simulations</p>
                <div className="text-5xl font-black text-black leading-none">{stats.totalSimulations}</div>
            </div>
            <div className="tactile-card p-8 rounded-3xl bg-citrus text-center border-black">
                <p className="text-[10px] font-black text-black uppercase tracking-widest opacity-40 mb-2">Volume</p>
                <div className="text-4xl font-black text-black">₹{stats.totalBountyValue.toLocaleString('en-IN')}</div>
            </div>
          </div>
        )}

        {activeTab === 'CONTENT' && (
            <div className="tactile-card bg-white rounded-[2.5rem] overflow-hidden reveal mb-20 border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-black tracking-widest border-b-2 border-black/5">
                        <tr>
                            <th className="p-6 w-12">
                                <button onClick={() => setSelectedProblemIds(selectedProblemIds.length === problems.length ? [] : problems.map(p => p.id))}>
                                    {selectedProblemIds.length === problems.length ? <CheckSquare className="w-5 h-5 text-forest" /> : <Square className="w-5 h-5" />}
                                </button>
                            </th>
                            <th className="p-6">Title</th>
                            <th className="p-6">Type</th>
                            <th className="p-6">Difficulty</th>
                            <th className="p-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-50">
                        {problems.slice(0, visibleCount).map(p => (
                            <ProblemRow 
                                key={p.id} 
                                p={p} 
                                isSelected={selectedProblemIds.includes(p.id)} 
                                onToggle={(id) => setSelectedProblemIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])}
                                onDelete={adminDeleteProblem}
                                onDetail={(p) => { setCurrentProblemForDetails(p); setShowProblemDetailModal(true); }}
                            />
                        ))}
                    </tbody>
                    </table>
                </div>
                {visibleCount < problems.length && (
                    <div className="p-8 text-center bg-gray-50 border-t-2 border-black/5">
                        <button onClick={() => setVisibleCount(c => c + 30)} className="text-sm font-black uppercase text-coral hover:underline">Reveal More Nodes ({problems.length - visibleCount} hidden)</button>
                    </div>
                )}
            </div>
        )}

        {selectedProblemIds.length > 0 && activeTab === 'CONTENT' && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-2xl px-6 animate-pop">
                <div className="bg-coral text-white p-6 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-black border-2 border-white/20">{selectedProblemIds.length}</div>
                        <div><p className="font-black uppercase tracking-widest text-xs">Node extraction sequence</p></div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setSelectedProblemIds([])} className="px-6 py-3 bg-black/20 rounded-xl font-black text-[10px] uppercase">Cancel</button>
                        <button onClick={handleBulkDelete} disabled={isBulkDeleting} className="px-8 py-3 bg-white text-coral rounded-xl font-black text-[10px] uppercase flex items-center gap-2">
                            {isBulkDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash className="w-4 h-4" /> Wipe Nodes</>}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
      <ProblemDetailModal isOpen={showProblemDetailModal} onClose={() => setShowProblemDetailModal(false)} problem={currentProblemForDetails} onProfileClick={onProfileClick} />
    </div>
  );
};

export default AdminPortal;
