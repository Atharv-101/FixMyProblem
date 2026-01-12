
import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Problem, User, Solution, VerificationStatus } from '../types.ts';
import { 
  Users, CheckCircle2, Star, Trophy, Loader2, Shield, Activity, 
  Terminal, Cpu, IndianRupee, Settings, Trash2, Ban, Plus, 
  Briefcase, Layers, Info, Tag, Wand2, AlertTriangle, BarChart3, 
  BrainCircuit, Layout, Zap, Edit2, Eye, XCircle, Download, FileArchive, ArrowUpRight, ShieldCheck, UserCheck, FileSpreadsheet, X, HelpCircle,
  Square, CheckSquare, Trash, Building2, Check, X as XIcon
} from 'lucide-react';
import ProblemDetailModal from '../components/ProblemDetailModal.tsx';
import Modal from '../components/Modal.tsx';
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
  const { allUsers, problems, adminDeleteProblem, bulkDeleteProblems, bulkAddProblems, adminUpdateCompanyStatus, addProblem } = useStore();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'CONTENT' | 'COMPANY_AUDITS' | 'SETTINGS'>('OVERVIEW');
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
  const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  
  // Post Challenge State
  const [showPostModal, setShowPostModal] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [currentBehavior, setCurrentBehavior] = useState('');
  const [techStack, setTechStack] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [impact, setImpact] = useState('');
  const [bounty, setBounty] = useState('');
  const [tags, setTags] = useState('');
  const [isSimulation, setIsSimulation] = useState(true);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');

  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab !== 'CONTENT') setSelectedProblemIds([]);
    setVisibleCount(20); 
  }, [activeTab]);

  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const onlineUsers = allUsers.filter(u => u.lastSeen && (Date.now() - new Date(u.lastSeen).getTime()) < 5 * 60 * 1000).length;
    const totalSimulations = problems.filter(p => p.isSimulation).length;
    const totalBountyValue = problems.reduce((acc, p) => acc + (parseFloat(p.bounty.replace(/[^0-9.]/g, '')) || 0), 0);
    return { totalUsers, onlineUsers, totalSimulations, totalBountyValue };
  }, [allUsers, problems]);

  const pendingCompanies = useMemo(() => {
    return allUsers.filter(u => u.role === UserRole.COMPANY && (u.verificationStatus === 'PENDING_VERIFICATION' || !u.verificationStatus));
  }, [allUsers]);

  const handleDownloadTemplate = () => {
    const headers = [
      "Title", 
      "Description", 
      "Bounty", 
      "Difficulty", 
      "Tags", 
      "ExpectedBehavior", 
      "CurrentBehavior", 
      "TechStack", 
      "StepsToReproduce", 
      "Impact", 
      "IsSimulation"
    ];
    
    const sampleData = [
      "API Memory Leak Recovery",
      "Fix the critical memory leak in the core extraction API.",
      "5000",
      "HARD",
      "Rust, Kafka, AWS",
      "Stable memory usage under 10k RPS load.",
      "OOM killer terminates pod after 5 minutes of high traffic.",
      "Rust (Actix), Kafka, AWS EKS",
      "1. Trigger high volume traffic. 2. Monitor Grafana. 3. Observe OOM.",
      "CRITICAL",
      "TRUE"
    ];

    const csvContent = [
      headers.join(","),
      sampleData.map(item => `"${item.replace(/"/g, '""')}"`).join(",")
    ].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(new Blob([csvContent], { type: 'text/csv' })));
    link.setAttribute("download", "problem_deployment_template.csv");
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
                tags: (item.Tags || '').split(',').map((t: string) => t.trim()).filter((t: string) => t),
                expectedBehavior: item.ExpectedBehavior || '',
                currentBehavior: item.CurrentBehavior || '',
                techStack: item.TechStack || '',
                stepsToReproduce: item.StepsToReproduce || '',
                impact: item.Impact || '',
                isSimulation: item.IsSimulation?.toString().toUpperCase() === 'TRUE' || item.IsSimulation === true
            }));
            if (pToUp.length) await bulkAddProblems(pToUp);
        } catch (err) { 
            console.error("Bulk Upload Failed:", err);
            alert("Format Error during extraction."); 
        } finally { 
            setIsSyncing(false); 
            if (bulkInputRef.current) bulkInputRef.current.value = '';
        }
    };
    reader.readAsBinaryString(file);
  };

  const handleManualPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const problemData = {
        title,
        description: desc,
        expectedBehavior,
        currentBehavior,
        techStack,
        stepsToReproduce,
        impact,
        bounty: bounty.startsWith('₹') ? bounty : `₹${bounty}`,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        isSimulation,
        difficulty
    };

    try {
        await addProblem(problemData);
        setShowPostModal(false);
        resetForm();
    } catch (err) {
        alert("Failed to deploy challenge node.");
    }
  };

  const resetForm = () => {
    setTitle(''); setDesc(''); setBounty(''); setTags('');
    setExpectedBehavior(''); setCurrentBehavior('');
    setTechStack(''); setStepsToReproduce(''); setImpact('');
    setIsSimulation(true); setDifficulty('MEDIUM');
  };

  const handleRefine = async () => {
    if (!desc.trim()) return;
    setIsRefining(true);
    const refined = await refineProblemDescription(desc);
    setDesc(refined);
    setIsRefining(false);
  };

  const handleBulkDelete = async () => {
    if (!selectedProblemIds.length) return;
    if (confirm(`Execute wipe protocol for ${selectedProblemIds.length} nodes?`)) {
        setIsBulkDeleting(true);
        try { await bulkDeleteProblems(selectedProblemIds); setSelectedProblemIds([]); } finally { setIsBulkDeleting(false); }
    }
  };

  const handleCompanyVerification = async (userId: string, status: VerificationStatus) => {
    try {
        await adminUpdateCompanyStatus(userId, status);
    } catch (err) {
        alert("Verification update failed.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-32 px-4 pb-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8 reveal">
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
            <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                <button onClick={() => setShowPostModal(true)} className="tactile-btn flex-1 lg:flex-none px-8 py-6 bg-black text-white border-4 border-black rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 shadow-xl hover:bg-forest transition-all">
                    <Plus className="w-6 h-6 text-citrus" /> Manual Entry
                </button>
                <button onClick={handleDownloadTemplate} title="Download Full Template CSV" className="tactile-btn p-6 bg-paper text-black border-4 border-black rounded-[2rem] font-black shadow-xl"><Download className="w-5 h-5" /></button>
                <input type="file" ref={bulkInputRef} onChange={handleBulkUpload} className="hidden" accept=".xlsx,.xls,.csv" />
                <button disabled={isSyncing} onClick={() => bulkInputRef.current?.click()} className="tactile-btn flex-1 lg:flex-none px-8 py-6 bg-citrus text-black border-4 border-black rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 shadow-xl">
                    {isSyncing ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileSpreadsheet className="w-6 h-6" />} Bulk Sync
                </button>
            </div>
        </div>

        <div className="flex space-x-4 mb-10 overflow-x-auto pb-4">
           {['OVERVIEW', 'USERS', 'CONTENT', 'COMPANY_AUDITS', 'SETTINGS'].map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab as any)} className={`tactile-btn px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-black text-white' : 'bg-white text-black hover:bg-citrus'}`}>
                {tab.replace('_', ' ')} {tab === 'COMPANY_AUDITS' && pendingCompanies.length > 0 && <span className="ml-2 bg-coral text-white px-2 py-0.5 rounded-full text-[8px]">{pendingCompanies.length}</span>}
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

        {activeTab === 'COMPANY_AUDITS' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-black tracking-widest uppercase flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-coral" /> Pending Company Nodes
                </h2>
                
                {pendingCompanies.length === 0 ? (
                    <div className="p-20 text-center border-4 border-dashed border-black/10 rounded-[3rem] bg-white/50">
                        <CheckCircle2 className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xl">No pending entities for verification.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {pendingCompanies.map((c) => (
                            <div key={c.id} className="tactile-card p-8 bg-white rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 border-2 border-black shadow-[8_8px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center font-black text-2xl">
                                            {c.companyName?.charAt(0) || c.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tighter">{c.companyName || c.name}</h3>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Auth Email: {c.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-black/5">
                                            <p className="text-[8px] font-black uppercase text-gray-400">Team Size</p>
                                            <p className="font-bold text-sm">{c.teamSize || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-black/5">
                                            <p className="text-[8px] font-black uppercase text-gray-400">Location</p>
                                            <p className="font-bold text-sm">{c.location || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                    <button 
                                        onClick={() => handleCompanyVerification(c.id, 'REJECTED')}
                                        className="px-8 py-4 bg-white text-coral border-2 border-coral rounded-xl font-black text-xs uppercase tracking-widest hover:bg-coral hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <XIcon className="w-4 h-4" /> Reject Node
                                    </button>
                                    <button 
                                        onClick={() => handleCompanyVerification(c.id, 'VERIFIED')}
                                        className="px-8 py-4 bg-forest text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" /> Verify Entity
                                    </button>
                                </div>
                            </div>
                        ))}
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

      {/* Manual Post Modal */}
      <Modal isOpen={showPostModal} onClose={() => setShowPostModal(false)} title="Manual Deployment">
          <form onSubmit={handleManualPost} className="space-y-6 max-h-[75vh] overflow-y-auto px-1 custom-scrollbar">
              <div className="flex gap-4 p-4 bg-citrus/10 border-2 border-black rounded-2xl">
                  <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="isSim" 
                        checked={isSimulation} 
                        onChange={e => setIsSimulation(e.target.checked)}
                        className="w-5 h-5 accent-black border-2 border-black"
                      />
                      <label htmlFor="isSim" className="text-xs font-black uppercase cursor-pointer">Practice Mode</label>
                  </div>
                  <div className="h-6 w-px bg-black/10 mx-2"></div>
                  <div className="flex-1 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-gray-400">Level:</span>
                      <select 
                        value={difficulty} 
                        onChange={e => setDifficulty(e.target.value as any)}
                        className="bg-transparent text-xs font-black uppercase outline-none flex-1"
                      >
                          <option value="EASY">EASY</option>
                          <option value="MEDIUM">MEDIUM</option>
                          <option value="HARD">HARD</option>
                      </select>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Terminal className="w-3 h-3"/> Title</label>
                      <input required className="w-full border-2 border-black p-4 rounded-xl font-black bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="API Memory Leak" value={title} onChange={e => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><IndianRupee className="w-3 h-3"/> Bounty</label>
                      <input required className="w-full border-2 border-black p-4 rounded-xl font-black bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="5,000" value={bounty} onChange={e => setBounty(e.target.value)} />
                  </div>
              </div>

              <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Info className="w-3 h-3"/> Detailed Summary</label>
                      <button 
                          type="button" 
                          onClick={handleRefine}
                          disabled={isRefining || !desc.trim()}
                          className="flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-forest disabled:opacity-40 transition-all border border-citrus/30"
                      >
                          {isRefining ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} AI Refine
                      </button>
                  </div>
                  <textarea required className="w-full border-2 border-black p-4 rounded-xl h-32 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" placeholder="Define the challenge parameters..." value={desc} onChange={e => setDesc(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><CheckCircle2 className="w-3 h-3"/> Expected State</label>
                      <textarea className="w-full border-2 border-black p-4 rounded-xl h-24 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" placeholder="Success criteria..." value={expectedBehavior} onChange={e => setExpectedBehavior(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><AlertTriangle className="w-3 h-3"/> Error State</label>
                      <textarea className="w-full border-2 border-black p-4 rounded-xl h-24 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" placeholder="Current bug logs..." value={currentBehavior} onChange={e => setCurrentBehavior(e.target.value)} />
                  </div>
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Cpu className="w-3 h-3"/> System Stack</label>
                  <input className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="Rust, WebAssembly, Kafka..." value={techStack} onChange={e => setTechStack(e.target.value)} />
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Layers className="w-3 h-3"/> Steps to Reproduce</label>
                  <textarea className="w-full border-2 border-black p-4 rounded-xl h-24 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" placeholder="Protocol to trigger the bug..." value={stepsToReproduce} onChange={e => setStepsToReproduce(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Activity className="w-3 h-3"/> System Impact</label>
                      <input className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="Critical, Systemic, Minor..." value={impact} onChange={e => setImpact(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Tag className="w-3 h-3"/> Grid Tags</label>
                      <input className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="Security, Performance, UI..." value={tags} onChange={e => setTags(e.target.value)} />
                  </div>
              </div>

              <button type="submit" className="tactile-btn w-full bg-black text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(253,224,71,1)] hover:bg-forest transition-all">Deploy Challenge <Zap className="inline-block ml-3 w-6 h-6 text-citrus" /></button>
          </form>
      </Modal>

      <ProblemDetailModal isOpen={showProblemDetailModal} onClose={() => setShowProblemDetailModal(false)} problem={currentProblemForDetails} onProfileClick={onProfileClick} />
    </div>
  );
};

export default AdminPortal;
