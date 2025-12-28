
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store';
import { UserRole, Problem, Solution, User } from '../types';
// Added Activity to the imported icons from lucide-react
import { Briefcase, Edit2, Power, Download, Award, Star, IndianRupee, Sparkles, CheckCircle2, Globe, Loader2, BookOpenText, CalendarDays, Wallet, Lock, Info, ArrowUpRight, Plus, Activity } from 'lucide-react';
import { refineProblemDescription } from '../services/geminiService';
import Modal from '../components/Modal';
import ProfileEditModal from '../components/ProfileEditModal';
import StarRatingInput from '../components/StarRatingInput';
import ProblemDetailModal from '../components/ProblemDetailModal';
import ProfileCard from '../components/ProfileCard';
import PaymentGatewayModal from '../components/PaymentGatewayModal';

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
        <div className="min-h-screen bg-transparent pt-32 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 reveal">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter leading-none mb-4">
                           Company <span className="text-forest italic">Grid.</span>
                        </h1>
                        <div className="relative group cursor-help" onMouseEnter={() => setShowCompanyProfileCard(true)} onMouseLeave={() => setShowCompanyProfileCard(false)}>
                            <button onClick={() => setIsProfileOpen(true)} className="text-lg font-black text-coral flex items-center group">
                                <Edit2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" /> {user?.companyName} Profile
                            </button>
                            {showCompanyProfileCard && user && <ProfileCard user={user} onClose={() => setShowCompanyProfileCard(false)} positionClasses="top-full left-0 mt-4" />}
                        </div>
                    </div>
                    <button onClick={openPostModal} className="tactile-btn px-10 py-5 bg-black text-white rounded-2xl font-black text-xl flex items-center shadow-md hover:bg-forest transition-all">
                        <Plus className="w-6 h-6 mr-3" /> Post Challenge
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-10 reveal">
                        <h2 className="text-2xl font-black text-black tracking-widest uppercase flex items-center">
                            <Briefcase className="w-6 h-6 mr-3 text-coral" /> Active Bounties
                        </h2>
                        {myProblems.map((p, idx) => (
                            <div key={p.id} className={`tactile-card p-10 rounded-[2.5rem] bg-white transition-all duration-300 ${idx % 2 === 0 ? 'rotate-[-0.5deg]' : 'rotate-[0.5deg]'} hover:rotate-0`}>
                                <div className="sticker-tape opacity-10"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-3xl font-black text-black tracking-tighter hover:text-coral transition-colors cursor-pointer" onClick={() => openProblemDetails(p)}>{p.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => openEditModal(p)} className="p-3 bg-paper border-2 border-black rounded-xl hover:bg-citrus transition-all"><Edit2 className="w-5 h-5" /></button>
                                        {p.status === 'OPEN' && <button onClick={() => handleCloseProblem(p.id)} className="p-3 bg-paper border-2 border-black rounded-xl hover:bg-coral hover:text-white transition-all"><Power className="w-5 h-5"/></button>}
                                        <span className={`px-4 py-1.5 rounded-full border-2 border-black font-black text-[10px] uppercase tracking-[0.2em] ${p.status === 'OPEN' ? 'bg-citrus' : 'bg-gray-100 text-gray-400'}`}>{p.status}</span>
                                    </div>
                                </div>
                                <div onClick={() => openProblemDetails(p)} className="cursor-pointer mb-8">
                                  <p className="text-gray-500 font-bold leading-relaxed line-clamp-3 opacity-80">{p.description}</p>
                                </div>
                                <div className="pt-8 border-t-2 border-black/5">
                                    <h4 className="font-black text-[10px] text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                       <Activity className="w-4 h-4" /> Solver Submissions
                                    </h4>
                                    <div className="space-y-4">
                                        {p.solutions?.map(s => (
                                            <div key={s.id} className={`tactile-card flex flex-col sm:flex-row justify-between items-center p-6 rounded-2xl ${s.isAccepted ? 'bg-citrus/10 border-forest' : 'bg-gray-50 border-black/5 shadow-none'}`}>
                                                <div className="text-center sm:text-left mb-4 sm:mb-0">
                                                   <span className="font-black text-black text-lg block">{s.studentName}</span>
                                                   <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Protocol Version: 1.2</span>
                                                </div>
                                                <div className="flex gap-4">
                                                    {s.attachmentUrl && <a href={s.attachmentUrl} target="_blank" className="p-3 bg-white border-2 border-black rounded-xl hover:scale-110 transition-transform"><Download className="w-5 h-5 text-black"/></a>}
                                                    {p.status === 'OPEN' && !s.isAccepted && <button onClick={() => setAcceptModalOpen(s)} className="tactile-btn bg-black text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-forest">Audit & Accept</button>}
                                                    {s.isAccepted && <span className="px-4 py-2 bg-forest text-citrus rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"><CheckCircle2 className="w-4 h-4"/> Accepted</span>}
                                                </div>
                                            </div>
                                        ))}
                                        {(!p.solutions || p.solutions.length === 0) && (
                                            <p className="text-center text-xs font-black text-gray-300 uppercase py-10 border-2 border-dashed border-black/10 rounded-2xl">Awaiting Solver Protocol...</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-12 reveal">
                        <div className="tactile-card bg-black text-white p-10 rounded-[3rem] overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-citrus/10 rounded-full -mr-16 -mt-16"></div>
                            <h2 className="text-2xl font-black tracking-widest uppercase mb-8 flex items-center gap-3">
                                <Award className="w-6 h-6 text-citrus fill-citrus" /> Solver Rankings
                            </h2>
                            <div className="space-y-6 relative z-10">
                                {topStudents.map((s, idx) => (
                                    <div key={s.id} className="flex items-center justify-between py-4 border-b-2 border-white/5 last:border-0 group cursor-help">
                                        <div className="flex items-center">
                                            <span className="text-xs font-black text-coral mr-4">0{idx+1}</span>
                                            <div>
                                                <div className="font-black text-lg group-hover:text-citrus transition-colors">{s.name}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{s.university}</div>
                                            </div>
                                        </div>
                                        <div className="font-black text-citrus text-xl">{s.rating?.toFixed(1) || '0.0'}</div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-citrus transition-colors">View Grid Rankings</button>
                        </div>

                        <div className="tactile-card bg-citrus p-10 rounded-[3rem]">
                           <h3 className="text-xl font-black mb-4">Pro Tip: 🪄</h3>
                           <p className="font-bold text-black/70 leading-relaxed">Use the AI Polish tool to make your descriptions technical and clear. Better briefs get better results! 😁</p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={!!modalMode} onClose={() => setModalMode(null)} title={modalMode === 'EDIT' ? 'Audit Challenge' : 'Initialize Challenge'}>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Challenge Title</label>
                        <input required className="w-full border-2 border-black p-4 rounded-xl text-lg font-black bg-paper shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all outline-none" placeholder="E.g. Database Grid Optimization" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-1">
                           <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Technical Brief</label>
                           <button type="button" onClick={handleAIRefine} className="px-4 py-1.5 bg-black text-citrus rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center hover:bg-forest transition-all">
                                {isRefining ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-2" />} Gemini Refine
                           </button>
                        </div>
                        <textarea required className="w-full border-2 border-black p-5 rounded-2xl h-48 font-bold bg-paper shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all outline-none" placeholder="Provide deep technical context..." value={desc} onChange={e => setDesc(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bounty Extraction</label>
                            <input required className="w-full border-2 border-black p-4 rounded-xl font-black bg-paper shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none" placeholder="₹50,000" value={bounty} onChange={e => setBounty(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grid Tags</label>
                            <input className="w-full border-2 border-black p-4 rounded-xl font-black bg-paper shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none" placeholder="Rust, K8s, AI" value={tags} onChange={e => setTags(e.target.value)} />
                        </div>
                    </div>

                    <button type="submit" className="tactile-btn w-full bg-black text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest mt-4">Publish to Grid</button>
                </form>
            </Modal>

            {/* Accept Audit Modal */}
            <Modal isOpen={!!acceptModalOpen && !showPaymentGateway} onClose={() => setAcceptModalOpen(null)} title="Approve Execution">
                <div className="space-y-8">
                    <div className="tactile-card bg-black text-white p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet className="w-20 h-20" /></div>
                        <div>
                            <p className="text-[10px] text-citrus font-black uppercase tracking-[0.3em] mb-2">Total Bounty Unlock</p>
                            <p className="text-5xl font-black">₹{grossVal.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/10 space-y-3">
                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                <span className="opacity-40">Solver Payout (90%)</span>
                                <span className="text-citrus">₹{studentTakeHome.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                <span className="opacity-40">Grid Fee (10%)</span>
                                <span className="text-coral">₹{platformFee.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-forest/5 p-6 rounded-2xl border-2 border-forest/10 flex items-start gap-4">
                        <Info className="w-6 h-6 text-forest mt-1" />
                        <p className="text-sm font-bold text-forest leading-relaxed">FixMyProblem Protocol handles all tax compliance and platform overhead. The payout is final and instant upon confirmation. 😁</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Execution Quality Ranking</label>
                        <StarRatingInput rating={rating} setRating={setRating} />
                    </div>
                    
                    <textarea className="w-full border-2 border-black p-4 rounded-2xl h-32 font-bold bg-paper focus:ring-0 outline-none" placeholder="Encourage your solver..." value={feedback} onChange={e => setFeedback(e.target.value)} />
                    
                    <button onClick={handleAcceptClick} className="tactile-btn w-full bg-coral text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl">
                        <Wallet className="w-6 h-6" /> Unlock Extraction 🪄
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
