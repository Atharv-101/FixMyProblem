
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store';
import { UserRole, Problem, Solution, User } from '../types';
import { Briefcase, Edit2, Power, Download, Award, Star, IndianRupee, Sparkles, CheckCircle2, Globe, Loader2, BookOpenText, CalendarDays, Wallet, Lock, Info } from 'lucide-react';
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
        // CRITICAL FIX: Don't set acceptModalOpen to null here.
        // We need it to keep activeProblemBounty calculated for the gateway.
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
        if (window.confirm("Are you sure? This will close the problem for new submissions.")) {
            await manualCloseProblem(problemId);
        }
    };

    const openProblemDetails = (problem: Problem) => {
        setCurrentProblem(problem);
        setShowProblemDetailModal(true);
    };

    // Use a more robust regex to handle currency symbols and commas
    const activeProblemBounty = acceptModalOpen ? problems.find(p => p.id === acceptModalOpen.problemId)?.bounty : '₹0';
    const activeProblemTitle = acceptModalOpen ? problems.find(p => p.id === acceptModalOpen.problemId)?.title : '';

    const grossVal = parseFloat(activeProblemBounty?.replace(/[^\d.]/g, '') || '0');
    const studentTakeHome = grossVal * 0.9;
    const platformFee = grossVal * 0.1;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Company Dashboard</h1>
                        <div className="relative group" onMouseEnter={() => setShowCompanyProfileCard(true)} onMouseLeave={() => setShowCompanyProfileCard(false)}>
                            <button onClick={() => setIsProfileOpen(true)} className="text-sm text-blue-600 hover:text-blue-800 font-bold mt-2 flex items-center">
                                <Edit2 className="w-4 h-4 mr-1" /> Edit Profile
                            </button>
                            {showCompanyProfileCard && user && <ProfileCard user={user} onClose={() => setShowCompanyProfileCard(false)} positionClasses="top-full left-0 mt-2" />}
                        </div>
                    </div>
                    <button onClick={openPostModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center shadow-md">
                        <Briefcase className="w-5 h-5 mr-2" /> Post Challenge
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Your Challenges
                        </h2>
                        {myProblems.map(p => (
                            <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between mb-4">
                                    <h3 className="text-lg font-bold">{p.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEditModal(p)} className="p-2 text-gray-400 hover:text-blue-600 rounded-full"><Edit2 className="w-4 h-4" /></button>
                                        {p.status === 'OPEN' && <button onClick={() => handleCloseProblem(p.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full"><Power className="w-4 h-4"/></button>}
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                                    </div>
                                </div>
                                <div onClick={() => openProblemDetails(p)} className="cursor-pointer">
                                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{p.description}</p>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-bold text-xs text-gray-400 uppercase mb-3">Submissions</h4>
                                    <div className="space-y-2">
                                        {p.solutions?.map(s => (
                                            <div key={s.id} className={`flex justify-between items-center p-3 rounded-lg border ${s.isAccepted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                                <span className="font-bold text-gray-800 text-sm">{s.studentName}</span>
                                                <div className="flex gap-2">
                                                    {s.attachmentUrl && <a href={s.attachmentUrl} target="_blank" className="p-2 text-gray-500 hover:text-blue-600"><Download className="w-4 h-4"/></a>}
                                                    {p.status === 'OPEN' && !s.isAccepted && <button onClick={() => setAcceptModalOpen(s)} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-700">Accept</button>}
                                                    {s.isAccepted && <span className="text-xs text-green-600 font-black uppercase flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Accepted</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <Award className="w-5 h-5 mr-2 text-yellow-500" /> Leaderboard
                            </h2>
                            <div className="space-y-4">
                                {topStudents.map((s, idx) => (
                                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center">
                                            <span className="text-xs font-bold text-gray-400 mr-3">#{idx+1}</span>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900">{s.name}</div>
                                                <div className="text-[10px] text-gray-500 uppercase">{s.university}</div>
                                            </div>
                                        </div>
                                        <div className="font-bold text-blue-600 text-sm">{s.rating?.toFixed(1) || '0.0'} ★</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={!!modalMode} onClose={() => setModalMode(null)} title={modalMode === 'EDIT' ? 'Edit Challenge' : 'Post Challenge'}>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input required className="w-full border p-3 rounded-lg text-sm" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                    <div className="flex justify-between items-center">
                       <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                       <button type="button" onClick={handleAIRefine} className="text-xs text-blue-600 font-bold flex items-center">
                            {isRefining ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />} AI Polish
                       </button>
                    </div>
                    <textarea required className="w-full border p-3 rounded-lg h-32 text-sm" placeholder="Details..." value={desc} onChange={e => setDesc(e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                        <input required className="border p-3 rounded-lg text-sm" placeholder="Bounty (e.g. ₹5000)" value={bounty} onChange={e => setBounty(e.target.value)} />
                        <input className="border p-3 rounded-lg text-sm" placeholder="Tags" value={tags} onChange={e => setTags(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Publish</button>
                </form>
            </Modal>

            <Modal isOpen={!!acceptModalOpen && !showPaymentGateway} onClose={() => setAcceptModalOpen(null)} title="Approve Solution">
                <div className="space-y-6">
                    <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Total Payout Release</p>
                                <p className="text-3xl font-black flex items-center">₹{grossVal.toFixed(0)}</p>
                            </div>
                            <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
                                <Wallet className="w-6 h-6 text-blue-400" />
                            </div>
                        </div>
                        
                        <div className="space-y-2 pt-4 border-t border-slate-800">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Student Net (90%)</span>
                                <span className="text-xs font-bold text-green-400">₹{studentTakeHome.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400">Admin Commission (10%)</span>
                                <span className="text-xs font-bold text-slate-300">₹{platformFee.toFixed(0)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800 leading-relaxed">
                            FixMyProblem handles all tax compliance and platform overhead through the 10% service fee. {acceptModalOpen?.studentName} will receive the net amount directly in their dashboard.
                        </p>
                    </div>
                    
                    <div className="py-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-4">Quality Rating</label>
                        <StarRatingInput rating={rating} setRating={setRating} />
                    </div>
                    <textarea className="w-full border p-3 rounded-lg h-24 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Feedback for student..." value={feedback} onChange={e => setFeedback(e.target.value)} />
                    
                    <button onClick={handleAcceptClick} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center shadow-lg hover:bg-black transition-colors">
                        <Wallet className="w-5 h-5 mr-2" /> Accept & Release Payout
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
