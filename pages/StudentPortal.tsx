
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store';
import { UserRole, Problem, Solution, User } from '../types';
import { GraduationCap, Search, Edit2, Star, Download, Loader2, Code2, Paperclip, Terminal, CheckCircle2, Briefcase, IndianRupee, Lock, Wallet, ArrowUpRight } from 'lucide-react';
import Modal from '../components/Modal';
import ProfileEditModal from '../components/ProfileEditModal';
import SubmissionSuccessModal from '../components/SubmissionSuccessModal';
import ProblemDetailModal from '../components/ProblemDetailModal';
import ProfileCard from '../components/ProfileCard';

const StudentPortal: React.FC = () => {
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
        <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
           <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Student Dashboard</h1>
                        <div 
                          className="text-gray-500 flex items-center mt-1 relative group"
                          onMouseEnter={() => setShowStudentProfileCard(true)}
                          onMouseLeave={() => setShowStudentProfileCard(false)}
                        >
                            <GraduationCap className="w-4 h-4 mr-1"/> 
                            <span className="cursor-help hover:underline">{currentUserData?.name} ({currentUserData?.university})</span>
                            {showStudentProfileCard && currentUserData && <ProfileCard user={currentUserData} onClose={() => setShowStudentProfileCard(false)} positionClasses="top-full left-0 mt-2" />}
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsProfileOpen(true)} className="flex items-center text-xs md:text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg">
                            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                        </button>
                        <div className="text-right">
                             <div className="text-xl md:text-2xl font-bold text-blue-600 flex items-center justify-end">
                                {currentUserData?.rating?.toFixed(1) || '0.0'} <Star className="w-5 h-5 ml-1 fill-blue-600 text-blue-600"/>
                             </div>
                             <div className="text-xs text-gray-500">Current Rating</div>
                        </div>
                    </div>
                </div>

                {/* Financial Summary Section */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Wallet className="w-20 h-20" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Net Earnings</p>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-4xl font-black">₹{totalEarned.toLocaleString('en-IN')}</h2>
                                <span className="text-xs text-green-400 font-bold flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> Received</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2">Payouts are calculated after 10% platform commission</p>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Solutions Accepted</span>
                            <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
                        </div>
                        <div className="text-3xl font-black text-gray-900">{currentUserData?.solvedCount || 0}</div>
                        <p className="text-[10px] text-gray-500 mt-1">Total successfully verified fixes</p>
                    </div>
                </div>

                {currentUserData?.bio && (
                    <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-2">About Me</h3>
                        <p className="text-gray-600 text-sm">{currentUserData.bio}</p>
                        {currentUserData.skills && currentUserData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {currentUserData.skills.map(s => (
                                    <span key={s} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">{s}</span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Search problems by title, description, or tags..." className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm outline-none transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProblems.map(p => (
                        <div 
                            key={p.id} 
                            onClick={() => handleOpenProblemDetails(p)}
                            className={`bg-white p-6 rounded-xl shadow-sm border transition-all cursor-pointer flex flex-col h-full ${p.status === 'OPEN' ? 'border-gray-200 hover:border-blue-400 hover:shadow-md' : 'border-gray-100 opacity-80'}`}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                                    <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                                    {p.companyName}
                                </div>
                                <div className="flex items-center font-black text-green-600 text-lg">
                                    <IndianRupee className="w-4 h-4 mr-0.5" />
                                    {p.bounty.replace(/[^\d,.]/g, '')}
                                </div>
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{p.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow">{p.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {p.tags.slice(0, 2).map(tag => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wider font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                        {tag}
                                    </span>
                                ))}
                                {p.tags.length > 2 && <span className="text-[10px] text-gray-400 font-bold">+{p.tags.length - 2} more</span>}
                            </div>

                            <button 
                                disabled={p.status !== 'OPEN'} 
                                className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-all ${p.status === 'OPEN' ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                            >
                                {p.status === 'OPEN' ? (
                                    <>
                                        <Code2 className="w-4 h-4 mr-2" />
                                        Solve Challenge
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4 mr-2" />
                                        Challenge Closed
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                    {filteredProblems.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg font-medium">No challenges found matching your query.</p>
                            <button onClick={() => setSearchQuery('')} className="text-blue-600 font-bold mt-2 hover:underline">Clear search filter</button>
                        </div>
                    )}
                </div>
           </div>

           <ProblemDetailModal
                isOpen={showProblemDetailModal}
                onClose={() => setShowProblemDetailModal(false)}
                problem={currentProblemForDetails}
                onSolveClick={handleSolveFromDetails}
            />

           <Modal isOpen={!!selectedProblemIdForSubmission} onClose={() => setSelectedProblemIdForSubmission(null)} title="Submit Solution">
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">Demonstrate your problem-solving skills! Paste your solution details, code snippets, or architectural logic below.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <section>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                            Challenge
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 border border-gray-200 font-semibold">
                            {activeProblemForSubmission?.title}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                            Solution Details
                        </h3>
                        <textarea 
                            required 
                            className="w-full border border-gray-300 rounded-xl p-4 h-48 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
                            placeholder="Describe your approach and paste your solution here..." 
                            value={solutionText} 
                            onChange={e => setSolutionText(e.target.value)} 
                        />
                    </section>
                    
                    <section>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                            Project File (Optional)
                        </h3>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <input 
                                type="file" 
                                accept=".zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed" 
                                onChange={e => setSolutionFile(e.target.files ? e.target.files[0] : null)} 
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                            />
                            <p className="text-[10px] text-gray-400 mt-3 italic">
                                Preferred: ZIP archive of your project. Max 20MB.
                            </p>
                        </div>
                    </section>

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-all shadow-lg shadow-blue-600/20"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Uploading Solution...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                Submit Final Solution
                            </>
                        )}
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
