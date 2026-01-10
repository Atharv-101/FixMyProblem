
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Problem } from '../types.ts';
import { Code2, ArrowLeft, Zap, Terminal, Search, Award, Info, Lock, ArrowRight, BrainCircuit, ShieldCheck, Upload, FileArchive, X, Loader2, ArrowUpRight, Github, Cpu, AlertCircle, Filter, Tag as TagIcon, BarChart, Clock, LogOut } from 'lucide-react';
import ProblemDetailModal from '../components/ProblemDetailModal.tsx';
import Modal from '../components/Modal.tsx';
import SubmissionSuccessModal from '../components/SubmissionSuccessModal.tsx';

interface SimulationHubProps {
  onBack: () => void;
}

const SimulationHub: React.FC<SimulationHubProps> = ({ onBack }) => {
  const { problems, user, addSolution, lockProblem, unlockProblem } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  
  // Submission State
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [solutionText, setSolutionText] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [techStack, setTechStack] = useState('');
  const [limitations, setLimitations] = useState('');
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulationBase = useMemo(() => {
    return problems.filter(p => p.isSimulation || p.companyName.toLowerCase().includes('practice'));
  }, [problems]);

  const allAvailableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    simulationBase.forEach(p => p.tags.forEach(t => tagsSet.add(t)));
    return ['All', ...Array.from(tagsSet).sort()];
  }, [simulationBase]);

  const simulations = useMemo(() => {
    return simulationBase
      .filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesTag = selectedTag === 'All' || p.tags.includes(selectedTag);
        const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
        return matchesSearch && matchesTag && matchesDifficulty;
      });
  }, [simulationBase, searchQuery, selectedTag, selectedDifficulty]);

  const handleOpenTerminal = (p: Problem) => {
    setSelectedProblem(p);
  };

  const handleStartSolve = async (problemId: string) => {
    if (!user) {
        alert("Authentication required to access the terminal.");
        return;
    }

    const target = simulationBase.find(p => p.id === problemId);
    if (!target) return;

    // Check if it's already locked by someone else
    const isLockedByOthers = target.lockedByStudentId && target.lockedByStudentId !== user.id && new Date(target.lockExpiresAt!) > new Date();
    if (isLockedByOthers) {
        alert("This node is currently reserved by another solver.");
        return;
    }

    // Auto-lock if not already locked by current user
    if (target.lockedByStudentId !== user.id) {
        try {
            await lockProblem(problemId);
        } catch (error) {
            console.error("Lock Protocol Failed:", error);
        }
    }

    setSubmittingId(problemId);
    setSelectedProblem(null);
  };

  const resetForm = () => {
    setSubmittingId(null);
    setSolutionText('');
    setGithubLink('');
    setTechStack('');
    setLimitations('');
    setSolutionFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 50 * 1024 * 1024) {
            alert("Payload too heavy. Max 50MB.");
            return;
        }
        setSolutionFile(file);
    }
  };

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingId || !solutionText.trim()) return;

    if (!window.confirm("Are you sure you want to submit this solution?")) return;
    
    setIsSubmitting(true);
    try {
        await addSolution(submittingId, solutionText, solutionFile || undefined, {
          githubLink,
          techStack,
          limitations
        });
        resetForm();
        setShowSuccess(true);
    } catch (error) {
        alert("Transmission failed.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleLockIn = async (pId: string) => {
    if (!user) return;
    if (window.confirm("Initialize 15-day Lock-In protocol? This problem will be reserved for your identity node.")) {
        await lockProblem(pId);
    }
  };

  const handleGiveUp = async (pId: string) => {
    if (window.confirm("Terminate Lock-In sequence? The problem will be released back to the global grid.")) {
        await unlockProblem(pId);
    }
  };

  const checkIsLocked = (p: Problem) => {
    if (!p.lockedByStudentId || !p.lockExpiresAt) return false;
    const now = new Date();
    const expiry = new Date(p.lockExpiresAt);
    return expiry > now;
  };

  const activeSubmittingProb = simulationBase.find(p => p.id === submittingId);

  return (
    <div className="min-h-screen bg-paper pt-32 px-6 md:px-10 pb-20 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
        <BrainCircuit className="w-[500px] h-[500px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <button onClick={onBack} className="tactile-btn mb-12 px-6 py-3 bg-white border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
          <ArrowLeft className="w-4 h-4" /> Exit Simulation
        </button>

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-citrus shadow-[3px_3px_0px_0px_rgba(253,224,71,1)]">
                    <Zap className="w-3.5 h-3.5 text-citrus fill-citrus animate-pulse" /> Sandbox Mode Active
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter leading-none italic underline decoration-forest decoration-8 underline-offset-8">
                    Practice Hub.
                </h1>
                <p className="text-xl md:text-2xl font-bold text-gray-500 max-w-2xl">
                    Hone your skills with industry-inspired simulations. Once locked, a node is yours for <span className="text-black">15 Grid Cycles.</span> 😁
                </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col items-end gap-3">
                <div className="p-6 bg-citrus/10 border-2 border-black rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-citrus" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Your Reputation</p>
                        <p className="text-2xl font-black text-black leading-none">{user?.simSolvedCount || 0} Solved</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Search & Main Filters */}
        <div className="space-y-8 reveal mb-16">
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-forest transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filter simulations by tech (React, Rust, Debugging)..." 
                  className="w-full pl-16 pr-8 py-6 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 outline-none transition-all text-xl font-bold placeholder:text-gray-300 bg-white" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                />
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        <BarChart className="w-3.5 h-3.5" /> Sorting Sequence: Difficulty
                    </div>
                    <div className="flex bg-white p-2 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-fit">
                        {['All', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                            <button 
                                key={diff}
                                onClick={() => setSelectedDifficulty(diff)}
                                className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedDifficulty === diff ? 'bg-black text-white' : 'hover:bg-citrus/20'}`}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                        <TagIcon className="w-3.5 h-3.5" /> Node Cluster: Tags
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar no-scrollbar-on-mobile">
                        {allAvailableTags.map((tag) => (
                            <button 
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={`px-6 py-3 rounded-2xl border-4 border-black font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${selectedTag === tag ? 'bg-forest text-citrus' : 'bg-white text-black'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 reveal">
            {simulations.map((p, idx) => {
                const isLocked = checkIsLocked(p);
                const lockedByMe = p.lockedByStudentId === user?.id;
                const daysLeft = isLocked ? Math.ceil((new Date(p.lockExpiresAt!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

                return (
                <div 
                    key={p.id} 
                    onClick={() => handleOpenTerminal(p)}
                    className={`tactile-card p-10 rounded-[3rem] bg-white cursor-pointer group flex flex-col h-full hover:bg-paper transition-all relative overflow-hidden ${isLocked && !lockedByMe ? 'opacity-70 grayscale pointer-events-none' : ''}`}
                >
                    <div className="sticker-tape opacity-20"></div>
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex flex-col gap-2">
                            <div className="px-4 py-1.5 bg-gray-50 border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                               <ShieldCheck className="w-4 h-4 text-forest" /> Practice
                            </div>
                            {isLocked && (
                                <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase flex items-center gap-1.5 ${lockedByMe ? 'bg-forest text-citrus' : 'bg-coral text-white'}`}>
                                    <Clock className="w-3 h-3" /> {lockedByMe ? `My Node (${daysLeft}d left)` : `Reserved by ${p.lockedByStudentName?.split(' ')[0]}`}
                                </div>
                            )}
                        </div>
                        <div className={`px-4 py-1.5 rounded-xl border-2 border-black text-[10px] font-black uppercase tracking-widest ${p.difficulty === 'HARD' ? 'bg-coral text-white' : p.difficulty === 'MEDIUM' ? 'bg-citrus text-black' : 'bg-forest text-white'}`}>
                            {p.difficulty || 'MEDIUM'}
                        </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-black mb-6 leading-none tracking-tighter group-hover:text-forest transition-colors">{p.title}</h3>
                    <p className="text-gray-500 font-bold line-clamp-3 mb-10 leading-relaxed text-base flex-grow opacity-70 italic">"{p.description}"</p>
                    
                    <div className="flex flex-wrap gap-2 mb-10">
                        {p.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-lg border border-black/5">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {lockedByMe ? (
                            <>
                                <button className="tactile-btn w-full py-5 bg-forest text-citrus rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                    Open Terminal <Terminal className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleGiveUp(p.id); }}
                                    className="w-full py-4 bg-white text-coral border-2 border-coral rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-coral hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-3.5 h-3.5" /> Give Up Protocol
                                </button>
                            </>
                        ) : isLocked ? (
                            <button disabled className="w-full py-5 bg-gray-100 text-gray-400 border-2 border-black/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                <Lock className="w-4 h-4" /> Node Occupied
                            </button>
                        ) : (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleLockIn(p.id); }}
                                className="tactile-btn w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <Zap className="w-4 h-4 text-citrus" /> Lock & Start
                            </button>
                        )}
                    </div>
                </div>
            )})}
        </div>

        {simulations.length === 0 && (
            <div className="text-center py-32 tactile-card border-dashed bg-white/50 rounded-[3rem]">
                <BrainCircuit className="w-20 h-20 text-gray-200 mx-auto mb-8 animate-pulse" />
                <p className="text-gray-400 text-2xl font-black uppercase tracking-[0.2em]">Awaiting Simulation Data...</p>
                <button onClick={() => { setSearchQuery(''); setSelectedTag('All'); setSelectedDifficulty('All'); }} className="mt-8 text-forest font-black underline decoration-citrus decoration-4 underline-offset-8 text-lg">Reset All Grid Filters</button>
            </div>
        )}

        <div className="mt-24 p-12 bg-black text-white rounded-[4rem] border-4 border-black shadow-[12px_12px_0px_0px_rgba(253,224,71,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Code2 className="w-64 h-64" /></div>
            <div className="max-w-2xl relative z-10">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Built for <span className="text-citrus">Solvers.</span></h2>
                <p className="text-xl md:text-2xl font-bold text-gray-400 leading-relaxed mb-10">
                    The 15-day lock ensures you have enough time to deliver quality code without competition pressure. Commit wisely! 😁
                </p>
                <div className="flex items-center gap-6">
                    <div className="flex -space-x-4">
                        {[1,2,3,4].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=s${i}`} className="w-14 h-14 rounded-2xl border-4 border-black bg-white" alt={`Active Solver ${i}`} />)}
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-citrus">892 Active Solvers Right Now</span>
                </div>
            </div>
        </div>
      </div>

      <ProblemDetailModal 
        isOpen={!!selectedProblem}
        onClose={() => setSelectedProblem(null)}
        problem={selectedProblem}
        onSolveClick={handleStartSolve}
      />

      <Modal isOpen={!!submittingId} onClose={resetForm} title="Sandbox Commit">
        <form onSubmit={handleSubmitSolution} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest/10 text-forest rounded-xl text-[10px] font-black uppercase tracking-widest border border-forest/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Practice Environment: Verified
            </div>

            <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Target Simulation</label>
                <div className="p-3 bg-gray-100 border-2 border-black rounded-xl font-black text-forest text-sm truncate">
                    {activeSubmittingProb?.title}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 flex items-center gap-1.5"><Github className="w-3 h-3"/> GitHub Link</label>
                    <input 
                      type="url"
                      className="w-full border-2 border-black rounded-xl p-4 font-bold bg-paper outline-none text-xs md:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
                      placeholder="https://github.com/..."
                      value={githubLink}
                      onChange={e => setGithubLink(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 flex items-center gap-1.5"><Cpu className="w-3 h-3"/> System Stack</label>
                    <input 
                      type="text"
                      className="w-full border-2 border-black rounded-xl p-4 font-bold bg-paper outline-none text-xs md:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
                      placeholder="React, TypeScript..."
                      value={techStack}
                      onChange={e => setTechStack(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Technical Report</label>
                <textarea 
                    required 
                    className="w-full border-2 border-black rounded-2xl p-5 h-32 font-mono text-xs md:text-sm focus:ring-0 outline-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none bg-paper" 
                    placeholder="// Explain your logic and steps taken to fix the simulation..." 
                    value={solutionText} 
                    onChange={e => setSolutionText(e.target.value)} 
                />
            </div>

            <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2 flex items-center gap-1.5"><AlertCircle className="w-3 h-3"/> Known Limitations</label>
                <textarea 
                    className="w-full border-2 border-black rounded-xl p-4 font-mono text-xs focus:ring-0 outline-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none bg-paper" 
                    placeholder="// Edge cases or unfinished items..." 
                    value={limitations} 
                    onChange={e => setLimitations(e.target.value)} 
                />
            </div>

            <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Source Archive (ZIP)</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-black border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-citrus/5 ${solutionFile ? 'bg-forest/5' : 'bg-paper'}`}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".zip,.rar,.7z" />
                    {solutionFile ? (
                        <div className="flex items-center gap-4 animate-pop">
                            <FileArchive className="w-10 h-10 text-forest" />
                            <div className="text-left">
                                <p className="text-sm font-black text-black truncate max-w-[150px]">{solutionFile.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">READY FOR UPLOAD</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-gray-300 mb-2" />
                            <p className="text-xs font-black text-black uppercase tracking-widest">Attach Archive</p>
                        </>
                    )}
                </div>
            </div>
            
            <button 
                type="submit" 
                disabled={isSubmitting || !solutionText.trim() || (!solutionFile && !githubLink)} 
                className="tactile-btn w-full bg-black text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 disabled:opacity-50"
            >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Deploy Solution <ArrowUpRight className="w-6 h-6" /></>}
            </button>
        </form>
      </Modal>

      <SubmissionSuccessModal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)} 
        problemTitle={activeSubmittingProb?.title || "Simulation"} 
      />
    </div>
  );
};

export default SimulationHub;
