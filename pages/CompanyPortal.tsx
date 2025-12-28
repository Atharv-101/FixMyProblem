
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Problem, Solution, User } from '../types.ts';
import { Briefcase, Edit2, Power, Download, Award, Star, IndianRupee, CheckCircle2, Sparkles, Loader2, Wallet, Plus, Activity, Info } from 'lucide-react';
import { refineProblemDescription } from '../services/geminiService.ts';
import Modal from '../components/Modal.tsx';
import ProfileEditModal from '../components/ProfileEditModal.tsx';
import StarRatingInput from '../components/StarRatingInput.tsx';
import ProblemDetailModal from '../components/ProblemDetailModal.tsx';
import ProfileCard from '../components/ProfileCard.tsx';
import PaymentGatewayModal from '../components/PaymentGatewayModal.tsx';

const CompanyPortal: React.FC = () => {
    const { user, problems, addProblem, acceptSolution, allUsers, editProblem, manualCloseProblem } = useStore();
    
    const [modalMode, setModalMode] = useState<'POST' | 'EDIT' | null>(null);
    const [acceptModalOpen, setAcceptModalOpen] = useState<Solution | null>(null);
    const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
    const [showPaymentGateway, setShowPaymentGateway] = useState(false);
    
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [bounty, setBounty] = useState('');
    const [tags, setTags] = useState('');
    
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');

    const [isRefining, setIsRefining] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showCompanyProfileCard, setShowCompanyProfileCard] = useState(false);
    
    const myProblems = problems.filter(p => p.companyId === user?.id);
    const topStudents = useMemo(() => allUsers.filter(u => u.role === UserRole.STUDENT).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5), [allUsers]);

    const openPostModal = () => {
        setCurrentProblem(null);
        setTitle(''); setDesc(''); setBounty(''); setTags('');
        setModalMode('POST');
    };

    const openEditModal = (problem: Problem) => {
        setCurrentProblem(problem);
        setTitle(problem.title);
        setDesc(problem.description);
        setBounty(problem.bounty);
        setTags(problem.tags.join(', '));
        setModalMode('EDIT');
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'EDIT' && currentProblem) {
            await editProblem(currentProblem.id, title, desc, bounty, tags.split(',').map(t => t.trim()));
        } else {
            addProblem(title, desc, bounty, tags.split(',').map(t => t.trim()));
        }
        setModalMode(null);
    };

    const handleAcceptClick = () => {
        setShowPaymentGateway(true);
    };

    const handlePaymentSuccess = async (method: string) => {
        if (acceptModalOpen) {
            await acceptSolution(acceptModalOpen.problemId, acceptModalOpen.id, acceptModalOpen.studentId, rating, feedback, method);
            setShowPaymentGateway(false);
            setAcceptModalOpen(null);
            setRating(5);
            setFeedback('');
        }
    };

    const handleAIRefine = async () => {
        if (!desc) return;
        setIsRefining(true);
        try {
            const refined = await refineProblemDescription(desc);
            setDesc(refined);
        } catch (error) { console.error("AI Refinement failed", error); }
        setIsRefining(false);
    };
    
    const handleCloseProblem = async (problemId: string) => {
        if (window.confirm("Close this challenge protocol?")) {
            await manualCloseProblem(problemId);
        }
    };

    const openProblemDetails = (problem: Problem) => {
        setCurrentProblem(problem);
        setShowProblemDetailModal(true);
    };

    const activeProblemBounty = acceptModalOpen ? problems.find(p => p.id === acceptModalOpen.problemId)?.bounty : '₹0';
    const activeProblemTitle = acceptModalOpen ? problems.find(p => p.id === acceptModalOpen.problemId)?.title : '';

    const grossVal = parseFloat(activeProblemBounty?.replace(/[^\d.]/g, '') || '0');
    const studentTakeHome = grossVal * 0.9;
    const platformFee = grossVal * 0.1;

    return (
        <div className="min-h-screen bg-transparent pt-24 md:pt-32 px-4 md:px-10 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6 md:gap-8">
                    <div>
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter leading-none mb-4">
                           Company <span className="text-forest italic">Grid.</span>
                        </h1>
                        <div className="relative group cursor-help" onMouseEnter={() => setShowCompanyProfileCard(true)} onMouseLeave={() => setShowCompanyProfileCard(false)}>
                            <button onClick={() => setIsProfileOpen(true)} className="text-sm md:text-lg font-black text-coral flex items-center group">
                                <Edit2 className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:rotate-12 transition-transform" /> {user?.companyName} Profile
                            </button>
                            {showCompanyProfileCard && user && <ProfileCard user={user} onClose={() => setShowCompanyProfileCard(false)} positionClasses="top-full left-0 mt-4" />}
                        </div>
                    </div>
                    <button onClick={openPostModal} className="tactile-btn w-full md:w-auto px-8 py-4 md:px-10 md:py-5 bg-black text-white rounded-xl md:rounded-2xl font-black text-base md:text-xl flex items-center justify-center shadow-md hover:bg-forest transition-all">
                        <Plus className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" /> Post Challenge
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
                    {/* Left Column: Active Problems */}
                    <div className="lg:col-span-2 space-y-8 md:space-y-10">
                        <h2 className="text-lg md:text-2xl font-black text-black tracking-widest uppercase flex items-center">
                            <Briefcase className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-coral" /> Active Bounties
                        </h2>
                        
                        {myProblems.length === 0 ? (
                            <div className="tactile-card p-10 md:p-12 text-center bg-white rounded-[2rem] border-dashed">
                                <p className="text-gray-400 font-black uppercase tracking-widest text-sm md:text-base">No active protocols detected.</p>
                                <button onClick={openPostModal} className="mt-6 text-coral font-black underline underline-offset-4 decoration-2">Initialize First Challenge</button>
                            </div>
                        ) : myProblems.map((p, idx) => (
                            <div key={p.id} className={`tactile-card p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-white transition-all duration-300 ${idx % 2 === 0 ? 'md:rotate-[-0.5deg]' : 'md:rotate-[0.5deg]'} hover:rotate-0`}>
                                <div className="sticker-tape opacity-10"></div>
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                    <h3 className="text-xl md:text-3xl font-black text-black tracking-tighter hover:text-coral transition-colors cursor-pointer leading-tight" onClick={() => openProblemDetails(p)}>{p.title}</h3>
                                    <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                                        <button onClick={() => openEditModal(p)} className="flex-1 sm:flex-none p-2.5 md:p-3 bg-paper border-2 border-black rounded-xl hover:bg-citrus transition-all flex items-center justify-center"><Edit2 className="w-4 h-4 md:w-5 md:h-5" /></button>
                                        {p.status === 'OPEN' && <button onClick={() => handleCloseProblem(p.id)} className="flex-1 sm:flex-none p-2.5 md:p-3 bg-paper border-2 border-black rounded-xl hover:bg-coral hover:text-white transition-all flex items-center justify-center"><Power className="w-4 h-4 md:w-5 md:h-5"/></button>}
                                        <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full border-2 border-black font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] whitespace-nowrap ${p.status === 'OPEN' ? 'bg-citrus' : 'bg-gray-100 text-gray-400'}`}>{p.status}</span>
                                    </div>
                                </div>
                                
                                <div onClick={() => openProblemDetails(p)} className="cursor-pointer mb-6 md:mb-8">
                                  <p className="text-gray-500 font-bold leading-relaxed line-clamp-3 opacity-80 text-sm md:text-base">{p.description}</p>
                                </div>
                                
                                <div className="pt-6 md:pt-8 border-t-2 border-black/5">
                                    <h4 className="font-black text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-4 md:mb-6 flex items-center gap-2">
                                       <Activity className="w-4 h-4" /> Solver Submissions
                                    </h4>
                                    <div className="space-y-4">
                                        {p.solutions?.map(s => (
                                            <div key={s.id} className={`tactile-card flex flex-col md:flex-row justify-between items-center p-5 md:p-6 rounded-2xl gap-4 ${s.isAccepted ? 'bg-citrus/10 border-forest' : 'bg-gray-50 border-black/5 shadow-none'}`}>
                                                <div className="text-center md:text-left w-full md:w-auto">
                                                   <span className="font-black text-black text-base md:text-lg block">{s.studentName}</span>
                                                   <span className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">Execution ID: {s.id.slice(-4)}</span>
                                                </div>
                                                <div className="flex gap-2 md:gap-4 w-full md:w-auto">
                                                    {s.attachmentUrl && <a href={s.attachmentUrl} target="_blank" className="flex-1 md:flex-none p-2.5 md:p-3 bg-white border-2 border-black rounded-xl hover:scale-110 transition-transform flex items-center justify-center"><Download className="w-4 h-4 md:w-5 md:h-5 text-black"/></a>}
                                                    {p.status === 'OPEN' && !s.isAccepted && <button onClick={() => setAcceptModalOpen(s)} className="flex-[2] md:flex-none tactile-btn bg-black text-white px-5 py-2 md:px-6 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-forest">Audit</button>}
                                                    {s.isAccepted && <span className="flex-1 md:flex-none px-3 py-2 md:px-4 bg-forest text-citrus rounded-xl font-black text-[9px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 md:gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"><CheckCircle2 className="w-3 h-3 md:w-4 md:h-4"/> Accepted</span>}
                                                </div>
                                            </div>
                                        ))}
                                        {(!p.solutions || p.solutions.length === 0) && (
                                            <p className="text-center text-[10px] font-black text-gray-300 uppercase py-8 md:py-10 border-2 border-dashed border-black/10 rounded-2xl">Awaiting Solver Protocol...</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Rankings & Tips */}
                    <div className="space-y-8 md:space-y-12">
                        <div className="tactile-card bg-black text-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-citrus/10 rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16"></div>
                            <h2 className="text-lg md:text-2xl font-black tracking-widest uppercase mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
                                <Award className="w-5 h-5 md:w-6 md:h-6 text-citrus fill-citrus" /> Solver Rankings
                            </h2>
                            <div className="space-y-4 md:space-y-6 relative z-10">
                                {topStudents.map((s, idx) => (
                                    <div key={s.id} className="flex items-center justify-between py-3 md:py-4 border-b-2 border-white/5 last:border-0 group cursor-help">
                                        <div className="flex items-center">
                                            <span className="text-[10px] md:text-xs font-black text-coral mr-3 md:mr-4">0{idx+1}</span>
                                            <div>
                                                <div className="font-black text-base md:text-lg group-hover:text-citrus transition-colors">{s.name}</div>
                                                <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 mt-0.5">{s.university || 'Academic'}</div>
                                            </div>
                                        </div>
                                        <div className="font-black text-citrus text-lg md:text-xl">{s.rating?.toFixed(1) || '0.0'}</div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 md:mt-10 py-3.5 md:py-4 bg-white text-black rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-citrus transition-colors">Full Rankings</button>
                        </div>

                        <div className="tactile-card bg-citrus p-6 md:p-10 rounded-[2rem] md:rounded-[3rem]">
                           <h3 className="text-lg md:text-xl font-black mb-3 md:mb-4">Pro Tip: 🪄</h3>
                           <p className="font-bold text-black/70 leading-relaxed text-sm md:text-base">Ensure your descriptions are technical and clear. Better briefs get better results! 😁</p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={!!modalMode} onClose={() => setModalMode(null)} title={modalMode === 'EDIT' ? 'Audit Challenge' : 'Initialize'}>
                <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Challenge Title</label>
                        <input required className="w-full border-2 border-black p-3.5 rounded-xl text-base md:text-lg font-black bg-paper outline-none focus:translate-x-0.5 focus:translate-y-0.5 transition-all" placeholder="Database Grid Optimization" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    
                    <div className="space-y-1">
                        <div className="flex justify-between items-center mb-1">
                           <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Technical Brief</label>
                           <button type="button" onClick={handleAIRefine} className="px-2.5 py-1 bg-black text-citrus rounded-lg font-black text-[8px] uppercase tracking-widest flex items-center hover:bg-forest transition-all">
                                {isRefining ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1.5" />} Gemini Refine
                           </button>
                        </div>
                        <textarea required className="w-full border-2 border-black p-4 rounded-xl h-40 md:h-48 font-bold bg-paper outline-none text-xs md:text-sm" placeholder="Provide deep technical context..." value={desc} onChange={e => setDesc(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Bounty Extraction</label>
                            <input required className="w-full border-2 border-black p-3.5 rounded-xl font-black bg-paper outline-none" placeholder="₹50,000" value={bounty} onChange={e => setBounty(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Grid Tags</label>
                            <input className="w-full border-2 border-black p-3.5 rounded-xl font-black bg-paper outline-none" placeholder="Rust, K8s, AI" value={tags} onChange={e => setTags(e.target.value)} />
                        </div>
                    </div>

                    <button type="submit" className="tactile-btn w-full bg-black text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-xl uppercase tracking-widest mt-2">Publish Grid</button>
                </form>
            </Modal>

            <Modal isOpen={!!acceptModalOpen && !showPaymentGateway} onClose={() => setAcceptModalOpen(null)} title="Approve Execution">
                <div className="space-y-6 md:space-y-8">
                    <div className="tactile-card bg-black text-white p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden">
                        <div>
                            <p className="text-[9px] text-citrus font-black uppercase tracking-[0.3em] mb-1">Bounty Unlock</p>
                            <p className="text-3xl md:text-5xl font-black">₹{grossVal.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/10 space-y-2">
                            <div className="flex justify-between items-center text-[9px] md:text-xs font-black uppercase tracking-widest">
                                <span className="opacity-40">Solver (90%)</span>
                                <span className="text-citrus">₹{studentTakeHome.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center text-[9px] md:text-xs font-black uppercase tracking-widest">
                                <span className="opacity-40">Grid Fee (10%)</span>
                                <span className="text-coral">₹{platformFee.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-forest/5 p-4 md:p-5 rounded-xl border-2 border-forest/10 flex items-start gap-3">
                        <Info className="w-5 h-5 text-forest mt-0.5 shrink-0" />
                        <p className="text-[10px] md:text-xs font-bold text-forest leading-relaxed">FixMyProblem Protocol handles all tax compliance and platform overhead. Instant release. 😁</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4 md:mb-6">Protocol Quality</label>
                        <StarRatingInput rating={rating} setRating={setRating} />
                    </div>
                    
                    <textarea className="w-full border-2 border-black p-4 rounded-xl h-24 md:h-32 font-bold bg-paper outline-none text-xs md:text-sm" placeholder="Encourage your solver..." value={feedback} onChange={e => setFeedback(e.target.value)} />
                    
                    <button onClick={handleAcceptClick} className="tactile-btn w-full bg-coral text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-xl uppercase tracking-widest flex items-center justify-center gap-3 md:gap-4 shadow-xl">
                        <Wallet className="w-5 h-5 md:w-6 md:h-6" /> Release Extraction 🪄
                    </button>
                </div>
            </Modal>
            
            <PaymentGatewayModal 
                isOpen={showPaymentGateway} 
                onClose={() => setShowPaymentGateway(false)} 
                amount={activeProblemBounty || '₹0'}
                problemTitle={activeProblemTitle || ''}
                recipient={acceptModalOpen?.studentName || ''}
                onSuccess={handlePaymentSuccess}
            />
            
            <ProfileEditModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <ProblemDetailModal isOpen={showProblemDetailModal} onClose={() => setShowProblemDetailModal(false)} problem={currentProblem} />
        </div>
    );
};

export default CompanyPortal;
