
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Problem, Solution, User } from '../types.ts';
import { Briefcase, Edit2, Power, Download, Award, Star, IndianRupee, CheckCircle2, Sparkles, Loader2, Wallet, Plus, Activity, Info, AlertTriangle, Cpu, Terminal, Layers, Tag, Wand2, FileArchive, ShieldAlert, FileText, Clock, XCircle } from 'lucide-react';
import Modal from '../components/Modal.tsx';
import ProfileEditModal from '../components/ProfileEditModal.tsx';
import StarRatingInput from '../components/StarRatingInput.tsx';
import ProblemDetailModal from '../components/ProblemDetailModal.tsx';
import PaymentGatewayModal from '../components/PaymentGatewayModal.tsx';
import { refineProblemDescription } from '../services/geminiService.ts';

interface CompanyPortalProps {
  onProfileClick: (id: string) => void;
}

const CompanyPortal: React.FC<CompanyPortalProps> = ({ onProfileClick }) => {
    const { user, problems, addProblem, acceptSolution, allUsers, editProblem, manualCloseProblem } = useStore();
    
    const [modalMode, setModalMode] = useState<'POST' | 'EDIT' | null>(null);
    const [acceptModalOpen, setAcceptModalOpen] = useState<Solution | null>(null);
    const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
    const [showPaymentGateway, setShowPaymentGateway] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
    
    // Detailed form state
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [expectedBehavior, setExpectedBehavior] = useState('');
    const [currentBehavior, setCurrentBehavior] = useState('');
    const [techStack, setTechStack] = useState('');
    const [stepsToReproduce, setStepsToReproduce] = useState('');
    const [impact, setImpact] = useState('');
    const [bounty, setBounty] = useState('');
    const [tags, setTags] = useState('');
    
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const myProblems = problems.filter(p => p.companyId === user?.id);
    const topStudents = useMemo(() => allUsers.filter(u => u.role === UserRole.STUDENT).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5), [allUsers]);

    // LOCKED VIEW LOGIC
    if (user?.role === UserRole.COMPANY && user.verificationStatus !== 'VERIFIED') {
        const isRejected = user.verificationStatus === 'REJECTED';
        
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 pt-32 overflow-hidden relative">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                <div className="max-w-3xl w-full relative z-10 animate-pop">
                    <div className={`tactile-card bg-white p-10 md:p-20 rounded-[3rem] border-4 border-black shadow-[12px_12px_0px_0px_rgba(253,224,71,1)] relative overflow-hidden text-center`}>
                        <div className="absolute top-[-20px] right-[-20px] p-4 opacity-5">
                            {isRejected ? <XCircle className="w-64 h-64" /> : <ShieldAlert className="w-64 h-64" />}
                        </div>

                        <div className={`w-24 h-24 rounded-full border-4 border-black flex items-center justify-center mx-auto mb-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-bounce ${isRejected ? 'bg-coral text-white' : 'bg-citrus text-black'}`}>
                           {isRejected ? <XCircle className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
                        </div>

                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-black rounded-xl text-[10px] font-black uppercase tracking-widest mb-8 border-2 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] ${isRejected ? 'text-coral border-coral' : 'text-citrus border-citrus'}`}>
                            {isRejected ? "Grid Access Revoked" : <><Clock className="w-3.5 h-3.5 animate-pulse" /> Manual Audit In Progress</>}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none mb-6">
                            Entity {isRejected ? <span className="text-coral italic">Rejected.</span> : <span className="text-coral italic">Restricted.</span>}
                        </h1>
                        
                        <p className="text-gray-500 font-bold text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
                            {isRejected ? (
                                "Your company node failed the grid audit protocol. Please contact ATHinnovations command center if you believe this is a system glitch. 😁"
                            ) : (
                                <>The grid requires manual verification for all <span className="text-black font-black">Company Nodes.</span> Our administrators are currently auditing your institutional details and documents. 😁</>
                            )}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
                           <div className="p-6 bg-gray-50 border-2 border-black rounded-2xl flex items-start gap-4">
                              <FileText className="w-6 h-6 text-coral shrink-0" />
                              <div>
                                <h4 className="font-black text-xs uppercase tracking-widest">Next Step</h4>
                                <p className="text-[10px] font-bold text-gray-400 mt-1 leading-relaxed italic">
                                    {isRejected ? '"Review platform guidelines before re-applying."' : '"Check your digital mail for document request protocols."'}
                                </p>
                              </div>
                           </div>
                           <div className="p-6 bg-gray-50 border-2 border-black rounded-2xl flex items-start gap-4">
                              <Activity className="w-6 h-6 text-forest shrink-0" />
                              <div>
                                <h4 className="font-black text-xs uppercase tracking-widest">SLA Time</h4>
                                <p className="text-[10px] font-bold text-gray-400 mt-1 leading-relaxed italic">"Verification typically takes 24-48 standard grid cycles."</p>
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => setIsProfileOpen(true)}
                                className="tactile-btn flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-forest transition-all"
                            >
                                <Edit2 className="w-4 h-4" /> {isRejected ? "Review Identity" : "Reconfigure Profile"}
                            </button>
                            <a 
                                href="mailto:support@fixmyproblem.in"
                                className="tactile-btn flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-black text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-citrus transition-all"
                            >
                                <Info className="w-4 h-4" /> {isRejected ? "Appeal Decision" : "Contact Support"}
                            </a>
                        </div>
                    </div>
                    
                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                            Protocol ID: {user.id.slice(0, 12)} • STATUS: {user.verificationStatus}
                        </p>
                    </div>
                </div>

                <ProfileEditModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            </div>
        );
    }

    const resetForm = () => {
        setTitle(''); setDesc(''); setBounty(''); setTags('');
        setExpectedBehavior(''); setCurrentBehavior('');
        setTechStack(''); setStepsToReproduce(''); setImpact('');
    };

    const handleRefine = async () => {
        if (!desc.trim()) return;
        setIsRefining(true);
        const refined = await refineProblemDescription(desc);
        setDesc(refined);
        setIsRefining(false);
    };

    const openPostModal = () => {
        setCurrentProblem(null);
        resetForm();
        setModalMode('POST');
    };

    const openEditModal = (problem: Problem) => {
        setCurrentProblem(problem);
        setTitle(problem.title);
        setDesc(problem.description);
        setExpectedBehavior(problem.expectedBehavior || '');
        setCurrentBehavior(problem.currentBehavior || '');
        setTechStack(problem.techStack || '');
        setStepsToReproduce(problem.stepsToReproduce || '');
        setImpact(problem.impact || '');
        setBounty(problem.bounty);
        setTags(problem.tags.join(', '));
        setModalMode('EDIT');
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const problemData = {
            title,
            description: desc,
            expectedBehavior,
            currentBehavior,
            techStack,
            stepsToReproduce,
            impact,
            bounty,
            tags: tags.split(',').map(t => t.trim()).filter(t => t)
        };

        if (modalMode === 'EDIT' && currentProblem) {
            await editProblem(currentProblem.id, problemData);
        } else {
            await addProblem(problemData);
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

    const grossVal = parseFloat(activeProblemBounty?.replace(/[^\d.]/g, '')) || 0;
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
                        <div className="relative group">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => setIsProfileOpen(true)} className="text-sm md:text-lg font-black text-coral flex items-center group text-left">
                                    <Edit2 className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:rotate-12 transition-transform" /> Edit Profile
                                </button>
                                <button onClick={() => user && onProfileClick(user.id)} className="text-sm md:text-lg font-black text-forest flex items-center group text-left">
                                    <Activity className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:scale-110 transition-transform" /> View Public Dossier
                                </button>
                            </div>
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
                                            <div key={s.id} className={`tactile-card flex items-center justify-between p-5 md:p-6 rounded-2xl gap-4 ${s.isAccepted ? 'bg-citrus/10 border-forest' : 'bg-gray-50 border-black/5 shadow-none'}`}>
                                                <div className="text-center md:text-left w-full md:w-auto cursor-pointer" onClick={() => onProfileClick(s.studentId)}>
                                                   <span className="font-black text-black text-base md:text-lg block hover:text-coral transition-colors">{s.studentName}</span>
                                                   <span className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">Execution ID: {s.id.slice(-4)}</span>
                                                </div>
                                                <div className="flex gap-2 md:gap-4 w-full md:w-auto">
                                                    {s.attachmentUrl && (
                                                      <a 
                                                        href={s.attachmentUrl} 
                                                        target="_blank" 
                                                        download={s.attachmentName || "payload.zip"}
                                                        className="flex-1 md:flex-none px-4 py-2.5 bg-black text-white border-2 border-black rounded-xl hover:bg-forest transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest"
                                                      >
                                                        <FileArchive className="w-4 h-4"/> Payload
                                                      </a>
                                                    )}
                                                    {p.status === 'OPEN' && !s.isAccepted && <button onClick={() => setAcceptModalOpen(s)} className="flex-[2] md:flex-none tactile-btn bg-coral text-white px-5 py-2 md:px-6 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-forest transition-colors">Audit Fix</button>}
                                                    {s.isAccepted && <span className="flex-1 md:flex-none px-3 py-2 md:px-4 bg-forest text-citrus rounded-xl font-black text-[9px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 md:gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"><CheckCircle2 className="w-3 h-3 md:w-4 h-4"/> Accepted</span>}
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

                    {/* Right Column: Rankings */}
                    <div className="space-y-8 md:space-y-12">
                        <div className="tactile-card bg-black text-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-citrus/10 rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16"></div>
                            <h2 className="text-lg md:text-2xl font-black tracking-widest uppercase mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
                                <Award className="w-5 h-5 md:w-6 md:h-6 text-citrus fill-citrus" /> Solver Rankings
                            </h2>
                            <div className="space-y-4 md:space-y-6 relative z-10">
                                {topStudents.map((s, idx) => (
                                    <div key={s.id} className="flex items-center justify-between py-3 md:py-4 border-b-2 border-white/5 last:border-0 group cursor-pointer" onClick={() => onProfileClick(s.id)}>
                                        <div className="flex items-center">
                                            <span className="text-[10px] md:text-xs font-black text-coral mr-3 md:mr-4">0{idx+1}</span>
                                            <div className="truncate max-w-[120px]">
                                                <div className="font-black text-base md:text-lg group-hover:text-citrus transition-colors truncate">{s.name}</div>
                                                <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 mt-0.5 truncate">{s.university || 'Academic'}</div>
                                            </div>
                                        </div>
                                        <div className="font-black text-citrus text-lg md:text-xl shrink-0">{s.rating?.toFixed(1) || '0.0'}</div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 md:mt-10 py-3.5 md:py-4 bg-white text-black rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-citrus transition-colors">Full Rankings</button>
                        </div>

                        <div className="tactile-card bg-citrus p-6 md:p-10 rounded-[2rem] md:rounded-[3rem]">
                           <h3 className="text-lg md:text-xl font-black mb-3 md:mb-4">Mission Briefing 🪄</h3>
                           <p className="font-bold text-black/70 leading-relaxed text-sm md:text-base">Structured information is the key to faster solutions. Provide error logs, reproduction steps, and clear impact analysis to attract top solvers. 😁</p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={!!modalMode} onClose={() => setModalMode(null)} title={modalMode === 'EDIT' ? 'Audit Protocol' : 'Deploy Challenge'}>
                <form onSubmit={handleFormSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Terminal className="w-3 h-3"/> Short Title</label>
                            <input required className="w-full border-2 border-black p-4 rounded-xl font-black bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="Database Grid Lag" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><IndianRupee className="w-3 h-3"/> Bounty Amount</label>
                            <input required className="w-full border-2 border-black p-4 rounded-xl font-black bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="₹25,000" value={bounty} onChange={e => setBounty(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Info className="w-3 h-3"/> Problem Summary</label>
                            <button 
                                type="button" 
                                onClick={handleRefine}
                                disabled={isRefining || !desc.trim()}
                                className="flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-forest disabled:opacity-40 transition-all border border-citrus/30"
                            >
                                {isRefining ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />} AI Refine
                            </button>
                        </div>
                        <textarea required className="w-full border-2 border-black p-4 rounded-xl h-24 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" placeholder="Briefly describe the roadblock..." value={desc} onChange={e => setDesc(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><CheckCircle2 className="w-3 h-3"/> Expected Behavior</label>
                            <textarea className="w-full border-2 border-black p-4 rounded-xl h-24 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" placeholder="What should be happening?" value={expectedBehavior} onChange={e => setExpectedBehavior(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><AlertTriangle className="w-3 h-3"/> Current Behavior / Error</label>
                            <textarea className="w-full border-2 border-black p-4 rounded-xl h-24 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" placeholder="What is actually happening? (Errors, Logs...)" value={currentBehavior} onChange={e => setCurrentBehavior(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Cpu className="w-3 h-3"/> Tech Stack</label>
                        <input className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="React, Node.js, AWS Lambda..." value={techStack} onChange={e => setTechStack(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Layers className="w-3 h-3"/> Steps to Reproduce</label>
                        <textarea className="w-full border-2 border-black p-4 rounded-xl h-24 font-bold bg-paper outline-none text-sm focus:bg-citrus/5 transition-all" placeholder="1. Go to... 2. Click... 3. Observe..." value={stepsToReproduce} onChange={e => setStepsToReproduce(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Activity className="w-3 h-3"/> Impact / Priority</label>
                            <input className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="Critical, High, Medium..." value={impact} onChange={e => setImpact(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Tag className="w-3 h-3"/> Search Tags</label>
                            <input className="w-full border-2 border-black p-4 rounded-xl font-bold bg-paper outline-none focus:bg-citrus/5 transition-all" placeholder="Frontend, API, Performance..." value={tags} onChange={e => setTags(e.target.value)} />
                        </div>
                    </div>

                    <button type="submit" className="tactile-btn w-full bg-black text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest mt-4">Commit Protocol</button>
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
            <ProblemDetailModal isOpen={showProblemDetailModal} onClose={() => setShowProblemDetailModal(false)} problem={currentProblem} onProfileClick={onProfileClick} />
        </div>
    );
};

export default CompanyPortal;
