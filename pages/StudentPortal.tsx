
import React, { useState, useMemo, useRef, memo } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Problem, Solution, User } from '../types.ts';
import { Search, Star, Loader2, Code2, Terminal, IndianRupee, Lock, ArrowUpRight, Zap, Target, ShieldCheck, Upload, FileArchive, X, Github, Cpu, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal.tsx';
import ProfileEditModal from '../components/ProfileEditModal.tsx';
import SubmissionSuccessModal from '../components/SubmissionSuccessModal.tsx';
import ProblemDetailModal from '../components/ProblemDetailModal.tsx';

// Fix for Error on line 48: Defined missing interface
interface StudentPortalProps {
  onProfileClick: (id: string) => void;
}

// Memoized Card for performance
const ProblemCard = memo(({ p, onClick, idx }: { p: Problem, onClick: (p: Problem) => void, idx: number }) => (
    <div 
        onClick={() => onClick(p)}
        className={`tactile-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] cursor-pointer group flex flex-col h-full transition-all duration-300 ${idx % 2 === 0 ? 'md:rotate-[-0.5deg]' : 'md:rotate-[0.5deg]'} hover:rotate-0 bg-white`}
    >
        <div className="sticker-tape opacity-10 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex justify-between items-start mb-6">
            <div className="px-3 py-1 bg-gray-50 border-2 border-black rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 max-w-[60%]">
                <Target className="w-3 h-3 text-coral shrink-0" />
                <span className="truncate">{p.companyName}</span>
            </div>
            <div className="text-right shrink-0">
                <div className="flex items-center font-black text-forest text-lg md:text-2xl">
                    <IndianRupee className="w-3 h-3 md:w-4 md:h-4" />
                    {p.bounty.replace(/[^\d]/g, '')}
                </div>
            </div>
        </div>
        <h3 className="text-lg md:text-2xl font-black text-black mb-3 md:mb-4 line-clamp-2 leading-tight group-hover:text-coral transition-colors">{p.title}</h3>
        <p className="text-gray-500 text-xs md:text-sm font-bold line-clamp-3 mb-6 md:mb-8 flex-grow leading-relaxed opacity-70">{p.description}</p>
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
            {p.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] bg-citrus/20 border border-black/5 px-2 py-1 rounded">
                    {tag}
                </span>
            ))}
        </div>
        <button 
            disabled={p.status !== 'OPEN'} 
            className={`tactile-btn w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center transition-all ${p.status === 'OPEN' ? 'bg-black text-white hover:bg-coral' : 'bg-gray-100 text-gray-400 cursor-not-allowed border-black/10 shadow-none'}`}
        >
            {p.status === 'OPEN' ? <><Code2 className="w-4 h-4 mr-2" /> Initialize Solution</> : <><Lock className="w-4 h-4 mr-2" /> Locked</>}
        </button>
    </div>
));

const StudentPortal: React.FC<StudentPortalProps> = ({ onProfileClick }) => {
    const { user, allUsers, problems, addSolution, payments } = useStore();
    const [selectedProblemIdForSubmission, setSelectedProblemIdForSubmission] = useState<string | null>(null);
    const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null);
    const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
    
    const [solutionText, setSolutionText] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [techStack, setTechStack] = useState('');
    const [limitations, setLimitations] = useState('');
    const [solutionFile, setSolutionFile] = useState<File | null>(null);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentUserData = useMemo(() => allUsers.find(u => u.id === user?.id) || user, [allUsers, user]);
    const totalEarned = useMemo(() => payments.reduce((acc, p) => acc + (parseFloat(p.netAmount?.replace(/[^\d.]/g, '') || '0')), 0), [payments]);

    const filteredProblems = useMemo(() => {
        return problems.filter(p => {
          const query = searchQuery.toLowerCase();
          return !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.tags.some(tag => tag.toLowerCase().includes(query));
        });
    }, [problems, searchQuery]);

    // Fix for Error on line 133: Implemented missing handler
    const handleOpenProblemDetails = (p: Problem) => {
        setCurrentProblemForDetails(p);
        setShowProblemDetailModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProblemIdForSubmission && solutionText.trim()) {
            setIsSubmitting(true);
            try {
                await addSolution(selectedProblemIdForSubmission, solutionText, solutionFile || undefined, { githubLink, techStack, limitations });
                setSolutionText(''); setGithubLink(''); setTechStack(''); setLimitations(''); setSolutionFile(null);
                setSelectedProblemIdForSubmission(null);
                setShowSuccessModal(true);
            } catch (error: any) { alert(`Submission Failed: ${error.message}`); }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-24 md:pt-32 px-4 md:px-10 pb-12">
           <div className="max-w-7xl mx-auto">
                <div className="mb-10 md:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-8">
                    <div className="space-y-4 w-full lg:w-auto">
                        <div className="flex flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-black shadow-[3px_3px_0px_0px_rgba(253,224,71,1)]">
                               <Zap className="w-4 h-4 text-citrus fill-citrus animate-pulse" /> Solver Tier Alpha
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest text-citrus rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-black shadow-[0,0,0,1]">
                               <ShieldCheck className="w-4 h-4" /> College Verified
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter leading-none">Solver <span className="text-coral italic">Workspace.</span></h1>
                        <div onClick={() => currentUserData && onProfileClick(currentUserData.id)} className="flex items-center gap-3 md:gap-4 cursor-pointer group">
                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl border-2 border-black bg-citrus overflow-hidden flex items-center justify-center font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                               {currentUserData?.profilePicUrl ? <img src={currentUserData.profilePicUrl} className="w-full h-full object-cover" /> : currentUserData?.name.charAt(0)}
                            </div>
                            <div>
                                <span className="text-lg md:text-2xl font-black hover:text-coral transition-colors">{currentUserData?.name}</span>
                                <div className="text-[9px] md:text-[10px] font-black uppercase text-gray-400">{currentUserData?.university || 'Academic'} Grid</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-6 w-full lg:w-auto">
                       <div className="tactile-card bg-forest text-white p-4 md:p-6 rounded-2xl md:rounded-3xl">
                          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Net Extraction</p>
                          <div className="flex items-center text-xl md:text-3xl font-black"><IndianRupee className="w-4 h-4 md:w-5 md:h-5 mr-1" />{totalEarned.toLocaleString('en-IN')}</div>
                       </div>
                       <div className="tactile-card bg-citrus text-black p-4 md:p-6 rounded-2xl md:rounded-3xl border-black">
                          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Reputation</p>
                          <div className="flex items-center text-xl md:text-3xl font-black">{currentUserData?.rating?.toFixed(1) || '0.0'}<Star className="w-4 h-4 md:w-5 md:h-5 ml-1 fill-black" /></div>
                       </div>
                    </div>
                </div>

                <div className="mb-8 md:mb-12 relative group">
                    <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-gray-400 group-focus-within:text-coral transition-colors" />
                    <input type="text" placeholder="Scan roadblocks by tech stack or tags..." className="w-full pl-12 md:pl-16 pr-6 md:pr-8 py-4 md:py-6 rounded-2xl md:rounded-[2rem] border-[3px] md:border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] outline-none transition-all text-base md:text-xl font-bold" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {filteredProblems.slice(0, visibleCount).map((p, idx) => (
                        <ProblemCard key={p.id} p={p} onClick={handleOpenProblemDetails} idx={idx} />
                    ))}
                </div>

                {visibleCount < filteredProblems.length && (
                    <div className="mt-16 text-center">
                        <button onClick={() => setVisibleCount(c => c + 12)} className="tactile-btn px-12 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-forest transition-all">Reveal More Roadblocks ({filteredProblems.length - visibleCount} hidden)</button>
                    </div>
                )}

                {filteredProblems.length === 0 && (
                    <div className="text-center py-20 md:py-32 tactile-card border-dashed bg-white/50 rounded-[2rem]">
                        <Terminal className="w-12 h-12 md:w-16 md:h-16 text-gray-200 mx-auto mb-6 animate-pulse" />
                        <p className="text-gray-400 text-base md:text-xl font-black uppercase tracking-widest">Awaiting Grid Inputs...</p>
                        <button onClick={() => setSearchQuery('')} className="mt-6 text-coral font-black underline decoration-citrus decoration-4 underline-offset-8">Reset Filter</button>
                    </div>
                )}
           </div>

           <ProblemDetailModal isOpen={showProblemDetailModal} onClose={() => setShowProblemDetailModal(false)} problem={currentProblemForDetails} onSolveClick={(id) => { setSelectedProblemIdForSubmission(id); setShowProblemDetailModal(false); }} onProfileClick={onProfileClick} />

           <Modal isOpen={!!selectedProblemIdForSubmission} onClose={() => setSelectedProblemIdForSubmission(null)} title="Deploy Protocol">
                <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                    <div className="p-3 bg-gray-100 border-2 border-black rounded-xl font-black text-forest text-xs truncate">Target: {filteredProblems.find(p => p.id === selectedProblemIdForSubmission)?.title}</div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input type="url" className="w-full border-2 border-black rounded-xl p-4 font-bold bg-paper outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" placeholder="GitHub Repository" value={githubLink} onChange={e => setGithubLink(e.target.value)} />
                      <input type="text" className="w-full border-2 border-black rounded-xl p-4 font-bold bg-paper outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" placeholder="Tech Stack" value={techStack} onChange={e => setTechStack(e.target.value)} />
                    </div>
                    <textarea required className="w-full border-2 border-black rounded-xl p-5 h-32 font-mono text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-paper" placeholder="// Methodology summary..." value={solutionText} onChange={e => setSolutionText(e.target.value)} />
                    <textarea className="w-full border-2 border-black rounded-xl p-4 font-mono text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-paper" placeholder="// Known limitations..." value={limitations} onChange={e => setLimitations(e.target.value)} />
                    <div onClick={() => fileInputRef.current?.click()} className={`w-full border-2 border-black border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-citrus/5 ${solutionFile ? 'bg-forest/5' : 'bg-paper'}`}>
                        <input type="file" ref={fileInputRef} onChange={e => e.target.files?.[0] && setSolutionFile(e.target.files[0])} className="hidden" accept=".zip,.rar,.7z" />
                        {solutionFile ? <div className="flex items-center gap-4 animate-pop"><FileArchive className="w-10 h-10 text-forest" /><div className="text-left"><p className="text-sm font-black truncate max-w-[150px]">{solutionFile.name}</p></div></div> : <><Upload className="w-8 h-8 text-gray-300 mb-2" /><p className="text-xs font-black uppercase">Attach ZIP</p></>}
                    </div>
                    <button type="submit" disabled={isSubmitting || (!solutionFile && !githubLink)} className="tactile-btn w-full bg-forest text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Commit Changes <ArrowUpRight className="w-6 h-6" /></>}
                    </button>
                </form>
           </Modal>
           <ProfileEditModal isOpen={false} onClose={() => {}} />
           <SubmissionSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} problemTitle={filteredProblems.find(p => p.id === selectedProblemIdForSubmission)?.title || 'Task'} />
        </div>
    );
};

export default StudentPortal;
