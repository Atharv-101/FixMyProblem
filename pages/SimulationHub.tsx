
import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Problem } from '../types.ts';
import { Code2, ArrowLeft, Zap, Terminal, Search, Award, Info, Lock, ArrowRight, BrainCircuit, ShieldCheck, Upload, FileArchive, X, Loader2, ArrowUpRight } from 'lucide-react';
import ProblemDetailModal from '../components/ProblemDetailModal.tsx';
import Modal from '../components/Modal.tsx';
import SubmissionSuccessModal from '../components/SubmissionSuccessModal.tsx';

interface SimulationHubProps {
  onBack: () => void;
}

const SimulationHub: React.FC<SimulationHubProps> = ({ onBack }) => {
  const { problems, user, addSolution } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  
  // Submission State
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [solutionText, setSolutionText] = useState('');
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulations = useMemo(() => {
    return problems.filter(p => p.isSimulation || p.companyName.toLowerCase().includes('practice'))
      .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [problems, searchQuery]);

  const handleOpenTerminal = (p: Problem) => {
    setSelectedProblem(p);
  };

  const handleStartSolve = (problemId: string) => {
    if (!user) {
        alert("Authentication required to access the terminal.");
        return;
    }
    setSubmittingId(problemId);
    setSelectedProblem(null);
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
    
    setIsSubmitting(true);
    try {
        await addSolution(submittingId, solutionText, solutionFile || undefined);
        setSubmittingId(null);
        setSolutionText('');
        setSolutionFile(null);
        setShowSuccess(true);
    } catch (error) {
        alert("Transmission failed.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const activeSubmittingProb = simulations.find(p => p.id === submittingId);

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
                    Hone your skills with industry-inspired simulations. No real money, only <span className="text-black">pure proof-of-work</span> and verified badges. 😁
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

        <div className="mb-12 relative group reveal">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-forest transition-colors" />
            <input 
               type="text" 
               placeholder="Filter simulations by tech (React, Rust, Debugging)..." 
               className="w-full pl-16 pr-8 py-6 rounded-[2rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 outline-none transition-all text-xl font-bold placeholder:text-gray-300" 
               value={searchQuery} 
               onChange={e => setSearchQuery(e.target.value)} 
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 reveal">
            {simulations.map((p, idx) => (
                <div 
                    key={p.id} 
                    onClick={() => handleOpenTerminal(p)}
                    className="tactile-card p-10 rounded-[3rem] bg-white cursor-pointer group flex flex-col h-full hover:bg-paper transition-all"
                >
                    <div className="sticker-tape opacity-20"></div>
                    <div className="flex justify-between items-start mb-8">
                        <div className="px-4 py-1.5 bg-gray-50 border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-forest" /> Practice
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

                    <button className="tactile-btn w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-forest">
                        Open Terminal <Terminal className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>

        {simulations.length === 0 && (
            <div className="text-center py-32 tactile-card border-dashed bg-white/50 rounded-[3rem]">
                <BrainCircuit className="w-20 h-20 text-gray-200 mx-auto mb-8 animate-pulse" />
                <p className="text-gray-400 text-2xl font-black uppercase tracking-[0.2em]">Awaiting Simulation Data...</p>
                <button onClick={() => setSearchQuery('')} className="mt-8 text-forest font-black underline decoration-citrus decoration-4 underline-offset-8 text-lg">Reset Simulation Filter</button>
            </div>
        )}

        <div className="mt-24 p-12 bg-black text-white rounded-[4rem] border-4 border-black shadow-[12px_12px_0px_0px_rgba(253,224,71,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Code2 className="w-64 h-64" /></div>
            <div className="max-w-2xl relative z-10">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Built for <span className="text-citrus">Solvers.</span></h2>
                <p className="text-xl md:text-2xl font-bold text-gray-400 leading-relaxed mb-10">
                    Once you submit a solution, a <span className="text-white">Mentor</span> will audit your code. Verified solves unlock specialized badges and boost your rank on the global grid. 😁
                </p>
                <div className="flex items-center gap-6">
                    <div className="flex -space-x-4">
                        {[1,2,3,4].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=s${i}`} className="w-14 h-14 rounded-2xl border-4 border-black bg-white" />)}
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

      <Modal isOpen={!!submittingId} onClose={() => setSubmittingId(null)} title="Sandbox Commit">
        <form onSubmit={handleSubmitSolution} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest/10 text-forest rounded-xl text-[10px] font-black uppercase tracking-widest border border-forest/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Practice Environment: Verified
            </div>

            <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Target Simulation</label>
                <div className="p-3 bg-gray-100 border-2 border-black rounded-xl font-black text-forest text-sm truncate">
                    {activeSubmittingProb?.title}
                </div>
            </div>

            <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Technical Summary</label>
                <textarea 
                    required 
                    className="w-full border-2 border-black rounded-2xl p-5 h-48 font-mono text-sm focus:ring-0 outline-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none bg-paper" 
                    placeholder="// Explain your logic and steps taken to fix the simulation..." 
                    value={solutionText} 
                    onChange={e => setSolutionText(e.target.value)} 
                />
            </div>

            <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Source Payload (ZIP)</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-black border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-citrus/5 ${solutionFile ? 'bg-forest/5' : 'bg-paper'}`}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".zip,.rar,.7z" />
                    {solutionFile ? (
                        <div className="flex items-center gap-4 animate-pop">
                            <FileArchive className="w-10 h-10 text-forest" />
                            <div className="text-left">
                                <p className="text-sm font-black text-black truncate max-w-[200px]">{solutionFile.name}</p>
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
                disabled={isSubmitting || !solutionText.trim()} 
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
