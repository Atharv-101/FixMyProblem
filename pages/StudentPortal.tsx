
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Problem, Solution, User } from '../types.ts';
import { Search, Star, Loader2, Code2, Terminal, IndianRupee, Lock, ArrowUpRight, Zap, Target, ShieldCheck } from 'lucide-react';
import Modal from '../components/Modal.tsx';
import ProfileEditModal from '../components/ProfileEditModal.tsx';
import SubmissionSuccessModal from '../components/SubmissionSuccessModal.tsx';
import ProblemDetailModal from '../components/ProblemDetailModal.tsx';
import ProfileCard from '../components/ProfileCard.tsx';

interface StudentPortalProps {
  onProfileClick: (id: string) => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ onProfileClick }) => {
    const { user, allUsers, problems, addSolution, payments } = useStore();
    const [selectedProblemIdForSubmission, setSelectedProblemIdForSubmission] = useState<string | null>(null);
    const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null);
    const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
    const [solutionText, setSolutionText] = useState('');
    const [solutionFile, setSolutionFile] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showStudentProfileCard, setShowStudentProfileCard] = useState(false);

    const currentUserData = allUsers.find(u => u.id === user?.id) || user;
    const activeProblemForSubmission = problems.find(p => p.id === selectedProblemIdForSubmission);
    const totalEarned = payments.reduce((acc, p) => acc + (parseFloat(p.netAmount?.replace(/[^\d.]/g, '') || '0')), 0);

    const filteredProblems = useMemo(() => {
        return problems.filter(p => {
          const query = searchQuery.toLowerCase();
          return !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.tags.some(tag => tag.toLowerCase().includes(query));
        }).sort((a, b) => {
            if (a.status === 'OPEN' && b.status !== 'OPEN') return -1;
            if (a.status !== 'OPEN' && b.status === 'OPEN') return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [problems, searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProblemIdForSubmission && solutionText.trim()) {
            setIsSubmitting(true);
            try {
                await addSolution(selectedProblemIdForSubmission, solutionText, solutionFile || undefined);
                setSolutionText(''); 
                setSolutionFile(null); 
                setSelectedProblemIdForSubmission(null);
                setShowSuccessModal(true);
            } catch (error: any) { alert(`Submission Failed: ${error.message}`); }
            setIsSubmitting(false);
        }
    };

    const handleOpenProblemDetails = (problem: Problem) => {
        setCurrentProblemForDetails(problem);
        setShowProblemDetailModal(true);
    };

    const handleSolveFromDetails = (problemId: string) => {
        setSelectedProblemIdForSubmission(problemId);
        setShowProblemDetailModal(false);
    };

    return (
        <div className="min-h-screen bg-transparent pt-24 md:pt-32 px-4 md:px-10 pb-12">
           <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-10 md:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 md:gap-8">
                    <div className="space-y-4 w-full lg:w-auto">
                        <div className="flex flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-black shadow-[3px_3px_0px_0px_rgba(253,224,71,1)]">
                               <Zap className="w-4 h-4 text-citrus fill-citrus animate-pulse" /> Protocol: Solver Tier Alpha
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest text-citrus rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                               <ShieldCheck className="w-4 h-4" /> College Node Verified
                            </div>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter leading-none">
                           Solver <span className="text-coral italic">Workspace.</span>
                        </h1>
                        <div 
                          className="flex items-center gap-3 md:gap-4 relative group cursor-pointer"
                          onMouseEnter={() => setShowStudentProfileCard(true)}
                          onMouseLeave={() => setShowStudentProfileCard(false)}
                          onClick={() => currentUserData && onProfileClick(currentUserData.id)}
                        >
                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl border-2 border-black bg-citrus overflow-hidden flex items-center justify-center font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                               {currentUserData?.profilePicUrl ? <img src={currentUserData.profilePicUrl} className="w-full h-full object-cover" /> : currentUserData?.name.charAt(0)}
                            </div>
                            <div>
                                <span className="text-lg md:text-2xl font-black hover:text-coral transition-colors">{currentUserData?.name}</span>
                                <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">{currentUserData?.university || 'Academic'} Grid</div>
                            </div>
                            {showStudentProfileCard && currentUserData && <ProfileCard user={currentUserData} onClose={() => setShowStudentProfileCard(false)} positionClasses="top-full left-0 mt-4" />}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 md:gap-6 w-full lg:w-auto">
                       <div className="tactile-card bg-forest text-white p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col justify-between">
                          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 md:mb-4">Net Extraction</p>
                          <div className="flex items-center text-xl md:text-3xl font-black">
                             <IndianRupee className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                             {totalEarned.toLocaleString('en-IN')}
                          </div>
                       </div>
                       <div className="tactile-card bg-citrus text-black p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col justify-between border-black">
                          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 md:mb-4">Reputation Score</p>
                          <div className="flex items-center text-xl md:text-3xl font-black">
                             {currentUserData?.rating?.toFixed(1) || '0.0'}
                             <Star className="w-4 h-4 md:w-5 md:h-5 ml-1 fill-black" />
                          </div>
                       </div>
                    </div>
                </div>

                {/* Main Filter & Grid */}
                <div className="mb-8 md:mb-12 relative group">
                    <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-gray-400 group-focus-within:text-coral transition-colors" />
                    <input 
                       type="text" 
                       placeholder="Scan roadblocks by tech stack, keywords or tags..." 
                       className="w-full pl-12 md:pl-16 pr-6 md:pr-8 py-4 md:py-6 rounded-2xl md:rounded-[2rem] border-[3px] md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 outline-none transition-all text-base md:text-xl font-bold placeholder:text-gray-300" 
                       value={searchQuery} 
                       onChange={e => setSearchQuery(e.target.value)} 
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {filteredProblems.map((p, idx) => (
                        <div 
                            key={p.id} 
                            onClick={() => handleOpenProblemDetails(p)}
                            className={`tactile-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] cursor-pointer group flex flex-col h-full transition-all duration-300 ${idx % 2 === 0 ? 'md:rotate-[-0.5deg]' : 'md:rotate-[0.5deg]'} hover:rotate-0`}
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
                                {p.status === 'OPEN' ? (
                                    <>
                                        <Code2 className="w-4 h-4 mr-2" />
                                        Initialize Solution
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4 mr-2" />
                                        System Locked
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {filteredProblems.length === 0 && (
                    <div className="text-center py-20 md:py-32 tactile-card border-dashed bg-white/50 rounded-[2rem] px-6">
                        <Terminal className="w-12 h-12 md:w-16 md:h-16 text-gray-200 mx-auto mb-6 animate-pulse" />
                        <p className="text-gray-400 text-base md:text-xl font-black uppercase tracking-widest">Awaiting Grid Inputs...</p>
                        <button onClick={() => setSearchQuery('')} className="mt-6 text-coral font-black underline decoration-citrus decoration-4 underline-offset-8 text-sm md:text-base">Reset Filter</button>
                    </div>
                )}
           </div>

           <ProblemDetailModal
                isOpen={showProblemDetailModal}
                onClose={() => setShowProblemDetailModal(false)}
                problem={currentProblemForDetails}
                onSolveClick={handleSolveFromDetails}
                onProfileClick={onProfileClick}
            />

           <Modal isOpen={!!selectedProblemIdForSubmission} onClose={() => setSelectedProblemIdForSubmission(null)} title="Deploy Protocol">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Target Node</label>
                        <div className="p-3 bg-gray-100 border-2 border-black rounded-xl font-black text-forest text-xs md:text-sm truncate">
                            {activeProblemForSubmission?.title}
                        </div>
                    </div>

                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Solution Payload</label>
                        <textarea 
                            required 
                            className="w-full border-2 border-black rounded-xl md:rounded-2xl p-4 md:p-5 h-48 md:h-64 font-mono text-xs md:text-sm focus:ring-0 outline-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none bg-paper" 
                            placeholder="// Type your execution plan here..." 
                            value={solutionText} 
                            onChange={e => setSolutionText(e.target.value)} 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="tactile-btn w-full bg-forest text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest flex items-center justify-center gap-3 md:gap-4"
                    >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Commit Changes <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" /></>}
                    </button>
                </form>
           </Modal>

           <ProfileEditModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
           <SubmissionSuccessModal 
                isOpen={showSuccessModal} 
                onClose={() => setShowSuccessModal(false)} 
                problemTitle={activeProblemForSubmission?.title || 'the challenge'}
            />
        </div>
    );
};

export default StudentPortal;
