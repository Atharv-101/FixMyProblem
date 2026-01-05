
import React, { useState, useMemo, useRef, useEffect } from 'react';
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

interface AdminPortalProps {
  onProfileClick: (id: string) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onProfileClick }) => {
  const { allUsers, problems, siteConfig, updateSiteConfig, adminDeleteUser, adminDeleteProblem, bulkDeleteProblems, adminBanUser, adminVerifyUser, addProblem, bulkAddProblems, editProblem, verifySimulationSolution } = useStore();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'CONTENT' | 'SIMULATION_AUDITS' | 'SETTINGS'>('OVERVIEW');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
  const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null);
  
  // Selection State
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Clear selection if current tab isn't CONTENT to save memory
  useEffect(() => {
    if (activeTab !== 'CONTENT') setSelectedProblemIds([]);
  }, [activeTab]);

  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const totalCompanies = allUsers.filter(u => u.role === UserRole.COMPANY).length;
    const totalStudents = allUsers.filter(u => u.role === UserRole.STUDENT).length;
    const pendingCompanies = allUsers.filter(u => u.role === UserRole.COMPANY && !u.isVerified).length;
    const onlineUsers = allUsers.filter(u => u.lastSeen && (Date.now() - new Date(u.lastSeen).getTime()) < 5 * 60 * 1000).length;
    const totalProblems = problems.length;
    const totalSimulations = problems.filter(p => p.isSimulation).length;
    const totalBountyValue = problems.reduce((acc, p) => acc + (parseFloat(p.bounty.replace(/[^0-9.]/g, '')) || 0), 0);

    return { totalUsers, totalCompanies, totalStudents, onlineUsers, totalProblems, totalSimulations, totalBountyValue, pendingCompanies };
  }, [allUsers, problems]);

  const pendingSimulationAudits = useMemo(() => {
    return problems
      .filter(p => p.isSimulation || p.companyName.toLowerCase().includes('practice'))
      .flatMap(p => (p.solutions || []).filter(s => s.reviewStatus === 'PENDING').map(s => ({ problem: p, solution: s })));
  }, [problems]);

  const handleBulkDelete = async () => {
    if (selectedProblemIds.length === 0) return;
    const count = selectedProblemIds.length;
    if (confirm(`CRITICAL: Permanent extraction of ${count} nodes initiated. This cannot be reverted. Proceed?`)) {
        setIsBulkDeleting(true);
        try {
            await bulkDeleteProblems(selectedProblemIds);
            setSelectedProblemIds([]);
            alert(`SUCCESS: ${count} nodes extracted from grid.`);
        } catch (e) {
            alert("Node extraction protocol failure.");
        } finally {
            setIsBulkDeleting(false);
        }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedProblemIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedProblemIds(selectedProblemIds.length === problems.length ? [] : problems.map(p => p.id));
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
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button 
                    onClick={() => setActiveTab('CONTENT')}
                    className="tactile-btn px-8 py-6 bg-white text-black border-4 border-black rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 hover:bg-citrus transition-all shrink-0 shadow-xl"
                >
                    <Layout className="w-6 h-6" /> Node Manager
                </button>
            </div>
        </div>

        <div className="flex space-x-4 mb-10 overflow-x-auto pb-4 reveal">
           {['OVERVIEW', 'USERS', 'CONTENT', 'SIMULATION_AUDITS', 'SETTINGS'].map((tab) => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)} 
                className={`tactile-btn px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-black text-white' : 'bg-white text-black hover:bg-citrus'}`}
             >
                {tab.replace('_', ' ')} {tab === 'SIMULATION_AUDITS' && pendingSimulationAudits.length > 0 && <span className="ml-2 bg-coral text-white px-2 py-0.5 rounded-full text-[8px]">{pendingSimulationAudits.length}</span>}
             </button>
           ))}
        </div>

        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 reveal">
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
                <p className="text-[10px] font-black text-black uppercase tracking-widest opacity-40 mb-2">System Volume</p>
                <div className="text-4xl font-black text-black leading-none">₹{stats.totalBountyValue.toLocaleString('en-IN')}</div>
            </div>
          </div>
        )}

        {activeTab === 'CONTENT' && (
            <div className="tactile-card bg-white rounded-[2.5rem] overflow-hidden reveal mb-20 border-2 border-black">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-black tracking-widest border-b-2 border-black/5">
                        <tr>
                        <th className="p-6 w-12">
                            <button onClick={toggleSelectAll}>{selectedProblemIds.length === problems.length ? <CheckSquare className="w-5 h-5 text-forest" /> : <Square className="w-5 h-5" />}</button>
                        </th>
                        <th className="p-6">Title</th>
                        <th className="p-6">Type</th>
                        <th className="p-6">Difficulty</th>
                        <th className="p-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-50">
                        {problems.map(p => (
                        <tr key={p.id} className={`hover:bg-gray-50 group transition-colors ${selectedProblemIds.includes(p.id) ? 'bg-citrus/5' : ''}`}>
                            <td className="p-6"><button onClick={() => toggleSelection(p.id)}>{selectedProblemIds.includes(p.id) ? <CheckSquare className="w-5 h-5 text-forest" /> : <Square className="w-5 h-5 text-gray-200" />}</button></td>
                            <td className="p-6 font-bold text-black max-w-xs truncate">{p.title}</td>
                            <td className="p-6"><span className="px-2 py-1 bg-gray-100 rounded text-[8px] font-black uppercase">{p.isSimulation ? 'SIM' : 'REAL'}</span></td>
                            <td className="p-6 font-black text-[9px] uppercase">{p.difficulty || 'MEDIUM'}</td>
                            <td className="p-6 flex gap-2">
                                <button onClick={() => { setCurrentProblemForDetails(p); setShowProblemDetailModal(true); }} className="p-2 hover:bg-citrus rounded-lg transition-colors"><Eye className="w-4 h-4"/></button>
                                <button onClick={() => adminDeleteProblem(p.id)} className="p-2 hover:bg-coral hover:text-white rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Bulk Wipe Panel */}
        {selectedProblemIds.length > 0 && activeTab === 'CONTENT' && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-2xl px-6 animate-pop">
                <div className="bg-coral text-white p-6 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-black text-xl border-2 border-white/20">{selectedProblemIds.length}</div>
                        <div>
                            <p className="font-black uppercase tracking-widest text-xs">Node extraction sequence</p>
                            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Ready for permanent wipe protocol</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setSelectedProblemIds([])} className="px-6 py-3 bg-black/20 hover:bg-black/30 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                        <button onClick={handleBulkDelete} disabled={isBulkDeleting} className="px-8 py-3 bg-white text-coral rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
