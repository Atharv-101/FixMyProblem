
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Problem, User, Solution } from '../types.ts';
import { 
  Users, CheckCircle2, Star, Trophy, Loader2, Shield, Activity, 
  Terminal, Cpu, IndianRupee, Settings, Trash2, Ban, Plus, 
  Briefcase, Layers, Info, Tag, Wand2, AlertTriangle, BarChart3, 
  BrainCircuit, Layout, Zap, Edit2, Eye, XCircle, Download, FileArchive, ArrowUpRight
} from 'lucide-react';
import ProblemDetailModal from '../components/ProblemDetailModal.tsx';
import ProfileCard from '../components/ProfileCard.tsx';
import Modal from '../components/Modal.tsx';
import StarRatingInput from '../components/StarRatingInput.tsx';
import { refineProblemDescription } from '../services/geminiService.ts';

interface AdminPortalProps {
  onProfileClick: (id: string) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onProfileClick }) => {
  const { allUsers, problems, siteConfig, updateSiteConfig, adminDeleteUser, adminDeleteProblem, adminBanUser, addProblem, editProblem, verifySimulationSolution } = useStore();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'CONTENT' | 'SIMULATION_AUDITS' | 'SETTINGS'>('OVERVIEW');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
  const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null);
  
  // Simulation Review State
  const [reviewingItem, setReviewingItem] = useState<{ solution: Solution, problem: Problem } | null>(null);
  const [auditRating, setAuditRating] = useState(5);
  const [auditFeedback, setAuditFeedback] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);

  // Post/Edit Simulation State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [currentBehavior, setCurrentBehavior] = useState('');
  const [techStack, setTechStack] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [tags, setTags] = useState('');

  const [showProfileCard, setShowProfileCard] = useState<string | null>(null);
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);

  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const totalCompanies = allUsers.filter(u => u.role === UserRole.COMPANY).length;
    const totalStudents = allUsers.filter(u => u.role === UserRole.STUDENT).length;
    const onlineUsers = allUsers.filter(u => {
      if (!u.lastSeen) return false;
      const lastSeenTime = new Date(u.lastSeen).getTime();
      return (Date.now() - lastSeenTime) < 5 * 60 * 1000;
    }).length;
    
    const totalProblems = problems.length;
    const totalSimulations = problems.filter(p => p.isSimulation).length;
    const totalBountyValue = problems.reduce((acc, p) => {
      const val = parseFloat(p.bounty.replace(/[^0-9.]/g, '')) || 0;
      return acc + val;
    }, 0);

    return { totalUsers, totalCompanies, totalStudents, onlineUsers, totalProblems, totalSimulations, totalBountyValue };
  }, [allUsers, problems]);

  const pendingSimulationAudits = useMemo(() => {
    return problems
      .filter(p => p.isSimulation || p.companyName.toLowerCase().includes('practice'))
      .flatMap(p => (p.solutions || []).filter(s => s.reviewStatus === 'PENDING' || (!s.isVerified && !s.isRejected)).map(s => ({ problem: p, solution: s })));
  }, [problems]);

  const handleRefine = async () => {
    if (!desc.trim()) return;
    setIsRefining(true);
    const refined = await refineProblemDescription(desc);
    setDesc(refined);
    setIsRefining(false);
  };

  const handlePostOrUpdateSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingId('POSTING');
    const problemData: Partial<Problem> = {
        title,
        description: desc,
        expectedBehavior,
        currentBehavior,
        techStack,
        stepsToReproduce,
        bounty: '₹0 (Practice)',
        isSimulation: true,
        difficulty,
        companyName: 'Simulation Hub',
        tags: tags.split(',').map(t => t.trim()).filter(t => t)
    };

    try {
        if (editingId) {
            await editProblem(editingId, problemData);
        } else {
            await addProblem(problemData);
        }
        setIsPostModalOpen(false);
        resetForm();
    } catch (error) {
        alert("Operation failed on the grid.");
    } finally {
        setProcessingId(null);
    }
  };

  const resetForm = () => {
      setTitle(''); setDesc(''); setExpectedBehavior(''); setCurrentBehavior('');
      setTechStack(''); setStepsToReproduce(''); setTags(''); setDifficulty('MEDIUM');
      setEditingId(null);
  };

  const handleAuditAction = async (status: 'VERIFIED' | 'REJECTED') => {
    if (!reviewingItem) return;
    setIsAuditing(true);
    try {
      await verifySimulationSolution(
        reviewingItem.problem.id,
        reviewingItem.solution.id,
        reviewingItem.solution.studentId,
        auditRating,
        auditFeedback,
        status
      );
      setReviewingItem(null);
      setAuditFeedback('');
      setAuditRating(5);
    } catch (error: any) {
      console.error("Verification Error Details:", error);
      alert(`Verification protocol failure: ${error.message || 'Check browser console for RPC details.'}`);
    } finally {
      setIsAuditing(false);
    }
  };

  const startEdit = (p: Problem) => {
      setTitle(p.title);
      setDesc(p.description);
      setExpectedBehavior(p.expectedBehavior || '');
      setCurrentBehavior(p.currentBehavior || '');
      setTechStack(p.techStack || '');
      setStepsToReproduce(p.stepsToReproduce || '');
      setTags(p.tags.join(', '));
      setDifficulty(p.difficulty || 'MEDIUM');
      setEditingId(p.id);
      setIsPostModalOpen(true);
  };

  const handleBanToggle = async (id: string, currentStatus: boolean) => {
      if(confirm(currentStatus ? "Unban this protocol user?" : "Ban this user? They will be detached immediately.")) {
          setProcessingId(id);
          try { await adminBanUser(id, currentStatus); } catch(e) { alert("Error updating user status"); }
          setProcessingId(null);
      }
  };

  const handleDeleteUser = async (id: string) => {
      if(confirm("Permanently wipe user identity from grid?")) {
          setProcessingId(id);
          try { await adminDeleteUser(id); } catch(e) { alert("Error deleting user"); }
          setProcessingId(null);
      }
  };

  const handleDeleteProblem = async (id: string) => {
      if(confirm("Permanently delete this problem from grid?")) {
          setProcessingId(id);
          try { await adminDeleteProblem(id); } catch(e) { alert("Error deleting problem"); }
          setProcessingId(null);
      }
  }

  const handleOpenProblemDetails = (problem: Problem) => {
    setCurrentProblemForDetails(problem);
    setShowProblemDetailModal(true);
  };

  const handleProfileHover = (user: User) => {
    setHoveredUser(user);
    setShowProfileCard(user.id);
  };

  const handleProfileLeave = () => {
    setShowProfileCard(null);
    setHoveredUser(null);
  };

  return (
    <div className="min-h-screen bg-transparent pt-32 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 reveal">
            <div className="tactile-card bg-black text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden flex-1 w-full">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 p-4">
                 <Shield className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-coral text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-black mb-6">
                     <Terminal className="w-4 h-4" /> Root Protocol Access
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter leading-none">
                    Admin <span className="text-citrus italic">Console.</span>
                  </h1>
                  <p className="text-gray-400 font-bold uppercase tracking-[0.2em] mt-4">Platform Oversight & Infrastructure 👀</p>
              </div>
            </div>
            
            <button 
                onClick={() => { resetForm(); setIsPostModalOpen(true); }}
                className="tactile-btn px-10 py-6 bg-forest text-citrus rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-black transition-all shrink-0 w-full md:w-auto shadow-xl"
            >
                <Plus className="w-6 h-6" /> Deploy Simulation
            </button>
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
             <div className="tactile-card p-8 rounded-3xl bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-citrus p-3 rounded-2xl border-2 border-black"><Zap className="w-6 h-6 text-black" /></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Online Now</span>
                </div>
                <div className="text-5xl font-black text-black leading-none">{stats.onlineUsers}</div>
                <div className="text-xs text-forest font-black mt-4 flex items-center">
                   <span className="w-2.5 h-2.5 bg-forest rounded-full mr-2 animate-pulse"></span> Grid Active
                </div>
            </div>

            <div className="tactile-card p-8 rounded-3xl bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-coral p-3 rounded-2xl border-2 border-black text-white"><Users className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grid Population</span>
                </div>
                <div className="text-5xl font-black text-black leading-none">{stats.totalUsers}</div>
                <div className="text-xs text-gray-500 font-bold mt-4 flex justify-between">
                  <span>{stats.totalStudents} Solvers</span>
                  <span>{stats.totalCompanies} Grids</span>
                </div>
            </div>

            <div className="tactile-card p-8 rounded-3xl bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-forest p-3 rounded-2xl border-2 border-black text-white"><BrainCircuit className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Simulations</span>
                </div>
                <div className="text-5xl font-black text-black leading-none">{stats.totalSimulations}</div>
                <div className="text-xs text-coral font-black mt-4">
                   {stats.totalProblems - stats.totalSimulations} Real Bounties
                </div>
            </div>

            <div className="tactile-card p-8 rounded-3xl bg-citrus">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-black p-3 rounded-2xl border-2 border-black text-white"><IndianRupee className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black text-black uppercase tracking-widest opacity-40">Total Volume</span>
                </div>
                <div className="text-4xl font-black text-black leading-none">₹{stats.totalBountyValue.toLocaleString('en-IN')}</div>
                <p className="text-[9px] font-black uppercase text-black/40 mt-4 tracking-widest">System Liquidity</p>
            </div>
          </div>
        )}

        {activeTab === 'USERS' && (
          <div className="tactile-card bg-white rounded-[2.5rem] overflow-hidden reveal">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-black tracking-widest border-b-2 border-black/5">
                   <tr>
                     <th className="p-6 min-w-[200px]">Identity</th>
                     <th className="p-6 min-w-[120px]">Role</th>
                     <th className="p-6 min-w-[120px]">Grid Status</th>
                     <th className="p-6 min-w-[120px]">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y-2 divide-gray-50">
                   {allUsers.map(u => {
                      const isOnline = u.lastSeen && (Date.now() - new Date(u.lastSeen).getTime() < 5 * 60 * 1000);
                      return (
                     <tr key={u.id} className="hover:bg-gray-50 group">
                       <td className="p-6 font-bold text-black">
                          <div 
                            className="flex items-center relative cursor-pointer"
                            onMouseEnter={() => handleProfileHover(u)}
                            onMouseLeave={handleProfileLeave}
                            onClick={() => onProfileClick(u.id)}
                          >
                              <div className="w-12 h-12 rounded-xl bg-paper border-2 border-black flex items-center justify-center mr-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-black">
                                {u.profilePicUrl ? <img src={u.profilePicUrl} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                              </div>
                              <div className="cursor-help">
                                  <div className="text-lg leading-tight group-hover:text-coral transition-colors">{u.name}</div>
                                  <span className="text-xs text-gray-400 font-bold">{u.email}</span>
                              </div>
                              {showProfileCard === u.id && hoveredUser && <ProfileCard user={hoveredUser} onClose={handleProfileLeave} positionClasses="bottom-full left-0 mb-4" />}
                          </div>
                       </td>
                       <td className="p-6">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-lg border-2 border-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-black text-white' : u.role === 'COMPANY' ? 'bg-forest text-white' : 'bg-citrus text-black'}`}>
                            {u.role}
                          </span>
                       </td>
                       <td className="p-6">
                          <div className="flex flex-col gap-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit border-2 ${isOnline ? 'bg-green-100 text-forest border-forest' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                              <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-forest animate-pulse' : 'bg-gray-300'}`}></span>
                              {isOnline ? 'Active' : 'Offline'}
                              </span>
                              {u.isBanned && <span className="text-[9px] font-black bg-coral text-white px-3 py-1 rounded-lg border-2 border-black uppercase tracking-widest w-fit">DETACHED</span>}
                          </div>
                       </td>
                       <td className="p-6 flex gap-3">
                          {u.role !== UserRole.ADMIN && (
                              <>
                                  <button 
                                      onClick={() => handleBanToggle(u.id, !!u.isBanned)}
                                      disabled={processingId === u.id}
                                      className={`p-3 rounded-xl border-2 border-black transition-all ${u.isBanned ? 'bg-citrus text-black hover:scale-110' : 'bg-coral text-white hover:scale-110'}`}
                                      title={u.isBanned ? "Reconnect User" : "Detach User"}
                                  >
                                      {processingId === u.id ? <Loader2 className="w-5 h-5 animate-spin" /> : (u.isBanned ? <CheckCircle2 className="w-5 h-5" /> : <Ban className="w-5 h-5" />)}
                                  </button>
                                  <button 
                                      onClick={() => handleDeleteUser(u.id)}
                                      disabled={processingId === u.id}
                                      className="p-3 bg-white border-2 border-black rounded-xl text-coral hover:bg-black transition-all hover:scale-110"
                                      title="Wipe User Data"
                                  >
                                      <Trash2 className="w-5 h-5" />
                                  </button>
                              </>
                          )}
                       </td>
                     </tr>
                   )})}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'CONTENT' && (
            <div className="tactile-card bg-white rounded-[2.5rem] overflow-hidden reveal">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-black tracking-widest border-b-2 border-black/5">
                        <tr>
                        <th className="p-6 min-w-[200px]">Challenge Brief</th>
                        <th className="p-6 min-w-[100px]">Type</th>
                        <th className="p-6 min-w-[80px]">Difficulty</th>
                        <th className="p-6 min-w-[100px]">Solves</th>
                        <th className="p-6 min-w-[120px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-50">
                        {problems.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 group">
                            <td 
                                className="p-6 font-bold text-black max-w-xs truncate text-lg group-hover:text-coral transition-colors cursor-pointer" 
                                title={p.title}
                                onClick={() => handleOpenProblemDetails(p)}
                            >
                                {p.title}
                            </td>
                            <td className="p-6">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-black/10 ${p.isSimulation ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {p.isSimulation ? 'SIMULATION' : 'REAL BOUNTY'}
                                </span>
                            </td>
                            <td className="p-6">
                                <span className={`text-[9px] font-black uppercase ${p.difficulty === 'HARD' ? 'text-coral' : p.difficulty === 'MEDIUM' ? 'text-citrus' : 'text-forest'}`}>
                                    {p.difficulty || 'MEDIUM'}
                                </span>
                            </td>
                            <td className="p-6 font-black text-black">{p.solutions?.length || 0}</td>
                            <td className="p-6">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleOpenProblemDetails(p)}
                                        className="p-2.5 bg-paper border-2 border-black rounded-lg hover:bg-citrus transition-all"
                                        title="View Submissions"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    {p.isSimulation && (
                                        <button 
                                            onClick={() => startEdit(p)}
                                            className="p-2.5 bg-paper border-2 border-black rounded-lg hover:bg-forest hover:text-white transition-all"
                                            title="Edit Simulation"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteProblem(p.id); }}
                                        disabled={processingId === p.id}
                                        className="p-2.5 bg-white border-2 border-black rounded-lg text-coral hover:bg-black transition-all"
                                        title="Delete Permanently"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'SIMULATION_AUDITS' && (
            <div className="reveal space-y-8">
                <h2 className="text-3xl font-black text-black tracking-tighter flex items-center gap-3">
                    <BrainCircuit className="w-10 h-10 text-forest" /> Simulation Audit Stream
                </h2>
                
                {pendingSimulationAudits.length === 0 ? (
                  <div className="tactile-card bg-white p-20 rounded-[3rem] text-center border-dashed">
                      <CheckCircle2 className="w-20 h-20 text-gray-100 mx-auto mb-6" />
                      <p className="text-gray-400 font-black uppercase tracking-widest text-xl">All simulation nodes are verified. 🪄</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                      {pendingSimulationAudits.map((item) => (
                        <div key={item.solution.id} className="tactile-card p-8 bg-white rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 border-2 border-black/5 hover:border-forest/40 transition-all group">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                  <span className="bg-citrus text-black px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-black">{item.problem.difficulty}</span>
                                  <h3 className="text-2xl font-black tracking-tighter group-hover:text-forest transition-colors leading-none">{item.problem.title}</h3>
                                </div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    Submitted by: <span onClick={() => onProfileClick(item.solution.studentId)} className="text-black hover:underline cursor-pointer font-black">{item.solution.studentName}</span>
                                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                                    {new Date(item.solution.submittedAt).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500 font-bold italic line-clamp-2 mt-4 bg-gray-50 p-4 rounded-xl">"{item.solution.content}"</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                {item.solution.attachmentUrl && (
                                  <a href={item.solution.attachmentUrl} target="_blank" className="p-4 bg-paper border-2 border-black rounded-xl hover:bg-citrus transition-all flex items-center justify-center">
                                      <FileArchive className="w-5 h-5" />
                                  </a>
                                )}
                                <button 
                                  onClick={() => setReviewingItem(item)}
                                  className="tactile-btn px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-forest"
                                >
                                    Review Solution <ArrowUpRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                      ))}
                  </div>
                )}
            </div>
        )}

        {activeTab === 'SETTINGS' && (
            <div className="tactile-card bg-white p-12 rounded-[3rem] max-w-2xl reveal">
                <h3 className="text-3xl font-black mb-10 flex items-center tracking-tighter"><Settings className="w-8 h-8 mr-4 text-coral" /> Global Protocols 👀</h3>
                
                <div className="space-y-12">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Grid Scale (Base Font)</label>
                        <div className="flex items-center space-x-6">
                            <span className="text-[10px] font-black uppercase">Alpha</span>
                            <input 
                                type="range" 
                                min="12" max="20" step="1"
                                value={siteConfig.baseFontSize}
                                onChange={(e) => updateSiteConfig({ baseFontSize: parseInt(e.target.value) })}
                                className="flex-1 h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black border-2 border-black"
                            />
                            <span className="text-[10px] font-black uppercase">Omega</span>
                            <span className="w-16 text-center font-black text-xl border-2 border-black rounded-xl p-2 bg-citrus">{siteConfig.baseFontSize}px</span>
                        </div>
                    </div>

                    <div className="tactile-card flex items-center justify-between p-8 bg-paper rounded-3xl border-2 border-black">
                        <div>
                            <span className="block font-black text-lg text-black uppercase tracking-tighter">Night Ops Mode 🪄</span>
                            <span className="text-xs font-bold text-gray-400">Force high-contrast cyber theme globally. 😁</span>
                        </div>
                        <div className="relative inline-block w-14 h-8 select-none transition duration-200 ease-in">
                            <input 
                                type="checkbox" 
                                checked={siteConfig.enableDarkMode} 
                                onChange={(e) => updateSiteConfig({ enableDarkMode: e.target.checked })}
                                className="absolute block w-8 h-8 rounded-xl bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out border-black"
                                style={{ transform: siteConfig.enableDarkMode ? 'translateX(75%)' : 'translateX(0)' }}
                            />
                            <label className={`block overflow-hidden h-8 rounded-xl cursor-pointer border-2 border-black ${siteConfig.enableDarkMode ? 'bg-citrus' : 'bg-gray-200'}`}></label>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Post/Edit Simulation Modal */}
      <Modal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} title={editingId ? "Reconfigure Simulation" : "Deploy Practice Simulation"}>
          <form onSubmit={handlePostOrUpdateSimulation} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Terminal className="w-3 h-3"/> Simulation Title</label>
                    <input required className="w-full border-2 border-black p-4 rounded-xl font-black bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="Broken React Component Hook" value={title} onChange={e => setTitle(e.target.value)} />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Info className="w-3 h-3"/> Technical Brief</label>
                        <button 
                            type="button" 
                            onClick={handleRefine}
                            disabled={isRefining || !desc.trim()}
                            className="flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-forest disabled:opacity-40 transition-all border border-citrus/30"
                        >
                            {isRefining ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} AI Refine
                        </button>
                    </div>
                    <textarea required className="w-full border-2 border-black p-4 rounded-xl h-24 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" placeholder="Describe the simulation scenario..." value={desc} onChange={e => setDesc(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><CheckCircle2 className="w-3 h-3"/> Target Outcome</label>
                        <textarea className="w-full border-2 border-black p-4 rounded-xl h-24 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" placeholder="What is the expected fix?" value={expectedBehavior} onChange={e => setExpectedBehavior(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><AlertTriangle className="w-3 h-3"/> Current Error/Bug</label>
                        <textarea className="w-full border-2 border-black p-4 rounded-xl h-24 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" placeholder="What is currently failing?" value={currentBehavior} onChange={e => setCurrentBehavior(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Activity className="w-3 h-3"/> Tier Level</label>
                        <select 
                            className="w-full border-2 border-black p-4 rounded-xl font-black bg-paper outline-none focus:bg-citrus/5 transition-all appearance-none" 
                            value={difficulty} 
                            onChange={e => setDifficulty(e.target.value as any)}
                        >
                            <option value="EASY">EASY PROTOCOL</option>
                            <option value="MEDIUM">MEDIUM PROTOCOL</option>
                            <option value="HARD">HARD PROTOCOL</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Tag className="w-3 h-3"/> Metadata Tags</label>
                        <input className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="React, Vite, Bug..." value={tags} onChange={e => setTags(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Cpu className="w-3 h-3"/> System Stack</label>
                    <input className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="TypeScript, Node.js..." value={techStack} onChange={e => setTechStack(e.target.value)} />
                </div>

                <button 
                    type="submit" 
                    disabled={!!processingId}
                    className="tactile-btn w-full bg-black text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest mt-4 flex items-center justify-center gap-4"
                >
                    {processingId === 'POSTING' ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Plus className="w-6 h-6" /> {editingId ? 'Sync Updates' : 'Deploy Simulation'}</>}
                </button>
          </form>
      </Modal>

      {/* Simulation Review Modal */}
      <Modal isOpen={!!reviewingItem} onClose={() => setReviewingItem(null)} title="Technical Validation">
          {reviewingItem && (
            <div className="space-y-8">
                <div className="p-6 bg-paper border-2 border-black rounded-3xl">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1">Subject Node</label>
                    <h4 className="text-xl font-black leading-tight mb-4">{reviewingItem.problem.title}</h4>
                    <div className="p-4 bg-white border-2 border-black rounded-2xl font-mono text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {reviewingItem.solution.content}
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Competency Rank</label>
                    <StarRatingInput rating={auditRating} setRating={setAuditRating} />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block px-1">Audit Feedback</label>
                    <textarea 
                        className="w-full border-2 border-black p-5 rounded-2xl h-32 font-bold bg-paper outline-none focus:bg-citrus/5 transition-all text-sm" 
                        placeholder="Log technical corrections or praise..." 
                        value={auditFeedback} 
                        onChange={e => setAuditFeedback(e.target.value)} 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                      onClick={() => handleAuditAction('REJECTED')}
                      disabled={isAuditing || !auditFeedback.trim()}
                      className="tactile-btn bg-coral text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                      {isAuditing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><XCircle className="w-5 h-5" /> Reject</>}
                  </button>
                  <button 
                      onClick={() => handleAuditAction('VERIFIED')}
                      disabled={isAuditing || !auditFeedback.trim()}
                      className="tactile-btn bg-forest text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                      {isAuditing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Verify</>}
                  </button>
                </div>
            </div>
          )}
      </Modal>

      <ProblemDetailModal 
          isOpen={showProblemDetailModal}
          onClose={() => setShowProblemDetailModal(false)}
          problem={currentProblemForDetails}
          onProfileClick={onProfileClick}
      />
    </div>
  );
};

export default AdminPortal;
