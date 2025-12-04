import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store';
import { UserRole, Problem, Solution, User } from '../types';
import { Briefcase, Edit2, Power, Download, Award, Star, IndianRupee, Sparkles, CheckCircle2, Globe, Loader2, BookOpenText, CalendarDays } from 'lucide-react';
import { refineProblemDescription } from '../services/geminiService';
import Modal from '../components/Modal';
import ProfileEditModal from '../components/ProfileEditModal';
import StarRatingInput from '../components/StarRatingInput';
import ProblemDetailModal from '../components/ProblemDetailModal'; // Import the new modal
import ProfileCard from '../components/ProfileCard'; // Import ProfileCard

const CompanyPortal: React.FC = () => {
    const { user, problems, addProblem, acceptSolution, allUsers, editProblem, manualCloseProblem } = useStore();
    
    // State for modals
    const [modalMode, setModalMode] = useState<'POST' | 'EDIT' | null>(null);
    const [acceptModalOpen, setAcceptModalOpen] = useState<Solution | null>(null);
    const [showProblemDetailModal, setShowProblemDetailModal] = useState(false); // New state for problem detail modal
    
    // State for forms
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null); // Used for edit form and problem detail view
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [bounty, setBounty] = useState('');
    const [tags, setTags] = useState('');
    
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');

    const [isRefining, setIsRefining] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Profile Card hover states
    const [showCompanyProfileCard, setShowCompanyProfileCard] = useState(false); // For current logged-in company
    const [showStudentProfileCard, setShowStudentProfileCard] = useState<string | null>(null); // Stores studentId of hovered student
    
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

    const handleAcceptSubmit = () => {
        if (acceptModalOpen) {
            acceptSolution(acceptModalOpen.problemId, acceptModalOpen.id, acceptModalOpen.studentId, rating, feedback);
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
        if (window.confirm("Are you sure you want to close this problem? It will no longer accept new submissions.")) {
            await manualCloseProblem(problemId);
        }
    };

    const openProblemDetails = (problem: Problem) => {
        setCurrentProblem(problem);
        setShowProblemDetailModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
                        <div 
                          className="relative group"
                          onMouseEnter={() => setShowCompanyProfileCard(true)}
                          onMouseLeave={() => setShowCompanyProfileCard(false)}
                        >
                            <button onClick={() => setIsProfileOpen(true)} className="text-sm text-blue-600 hover:text-blue-800 font-bold mt-2 flex items-center">
                                <Edit2 className="w-4 h-4 mr-1" /> Edit Company Profile
                            </button>
                            {showCompanyProfileCard && user && <ProfileCard user={user} onClose={() => setShowCompanyProfileCard(false)} positionClasses="top-full left-0 mt-2" />}
                        </div>
                    </div>
                    <button onClick={openPostModal} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center shadow-md">
                        <Briefcase className="w-5 h-5 mr-2" /> Post Challenge
                    </button>
                </div>
                
                {user?.bio && (
                    <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
                        <h3 className="font-bold text-gray-800 mb-2">About Us</h3>
                        <p className="text-gray-600 text-sm">{user.bio}</p>
                        {user.websiteUrl && (
                             <a href={user.websiteUrl} target="_blank" className="text-blue-600 text-sm font-bold flex items-center mt-3 hover:underline">
                                <Globe className="w-4 h-4 mr-1"/> Visit Website
                             </a>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Your Challenges
                        </h2>
                        {myProblems.map(p => (
                            <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors">
                                <div className="flex justify-between mb-4">
                                    <h3 className="text-xl font-bold">{p.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEditModal(p)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"><Edit2 className="w-4 h-4" /></button>
                                        {p.status === 'OPEN' && <button onClick={() => handleCloseProblem(p.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full" title="Close Problem"><Power className="w-4 h-4"/></button>}
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => openProblemDetails(p)} 
                                    className="cursor-pointer group hover:bg-gray-50 p-3 -mx-3 -mt-3 rounded-lg transition-colors"
                                >
                                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{p.description}</p>
                                  <button className="text-blue-600 hover:underline text-sm font-medium flex items-center mt-2">
                                      View Details <BookOpenText className="w-4 h-4 ml-1" />
                                  </button>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-bold text-sm text-gray-500 uppercase mb-2 flex items-center">
                                        Submissions <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{p.solutions?.length || 0}</span>
                                    </h4>
                                    <div className="space-y-2">
                                        {p.solutions?.sort((a,b) => (a.isAccepted === b.isAccepted) ? 0 : a.isAccepted ? -1 : 1).map(s => { // Accepted solutions first
                                            const studentUser = allUsers.find(u => u.id === s.studentId);
                                            return (
                                            <div key={s.id} className={`flex justify-between items-center p-3 rounded border ${s.isAccepted ? 'bg-green-50 border-green-500 ring-1 ring-green-500' : 'bg-gray-50'}`}>
                                                <div 
                                                  className="relative group"
                                                  onMouseEnter={() => setShowStudentProfileCard(s.studentId)}
                                                  onMouseLeave={() => setShowStudentProfileCard(null)}
                                                >
                                                    <span className="font-bold text-gray-800 cursor-help hover:underline">{s.studentName}</span>
                                                    {s.isAccepted && <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded font-bold inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> ACCEPTED</span>}
                                                    {showStudentProfileCard === s.studentId && studentUser && <ProfileCard user={studentUser} onClose={() => setShowStudentProfileCard(null)} positionClasses="top-full left-0 mt-2" />}
                                                </div>
                                                <div className="flex gap-2">
                                                    {s.attachmentUrl && <a href={s.attachmentUrl} target="_blank" className="text-xs p-2 rounded font-bold flex items-center hover:bg-gray-200"><Download className="w-4 h-4"/></a>}
                                                    {p.status === 'OPEN' && !s.isAccepted && <button onClick={() => setAcceptModalOpen(s)} className="text-xs bg-green-600 text-white px-3 py-1 rounded font-bold hover:bg-green-700">Accept</button>}
                                                </div>
                                            </div>
                                        )})}
                                        {(!p.solutions || p.solutions.length === 0) && <p className="text-sm text-gray-400 italic">No submissions yet.</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {myProblems.length === 0 && (
                            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">You haven't posted any problems yet.</p>
                                <button onClick={openPostModal} className="text-blue-600 font-bold text-sm mt-2 hover:underline">Post your first challenge</button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                <Award className="w-5 h-5 mr-2 text-yellow-500" /> Top Ranked Students
                            </h2>
                            <div className="space-y-4">
                                {topStudents.map((s, index) => (
                                    <div key={s.id} className="flex items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mr-3 ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-500'}`}>#{index + 1}</div>
                                        <div 
                                          className="flex-1 relative group"
                                          onMouseEnter={() => setShowStudentProfileCard(s.id)}
                                          onMouseLeave={() => setShowStudentProfileCard(null)}
                                        >
                                            <div className="font-bold text-sm text-gray-900 cursor-help hover:underline">{s.name}</div>
                                            <div className="text-xs text-gray-500">{s.university}</div>
                                            {showStudentProfileCard === s.id && s && <ProfileCard user={s} onClose={() => setShowStudentProfileCard(null)} positionClasses="top-full left-0 mt-2" />}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-blue-600 text-sm">{s.rating?.toFixed(1)} ★</div>
                                            <div className="text-[10px] text-gray-400">{s.solvedCount} Solved</div>
                                        </div>
                                    </div>
                                ))}
                                {topStudents.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No students to rank yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={!!modalMode} onClose={() => setModalMode(null)} title={modalMode === 'EDIT' ? 'Edit Challenge' : 'Post New Challenge'}>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input required className="w-full border p-3 rounded-lg" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                    <div className="flex justify-between items-center mb-1">
                       <label className="block text-sm font-bold text-gray-700">Description</label>
                       <button type="button" onClick={handleAIRefine} disabled={isRefining || !desc} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors disabled:opacity-50">
                            {isRefining ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                            {isRefining ? 'Enhancing...' : 'Enhance with AI'}
                       </button>
                    </div>
                    <textarea required className="w-full border p-3 rounded-lg h-32" placeholder="Description..." value={desc} onChange={e => setDesc(e.target.value)} />
                    <input required className="w-full border p-3 rounded-lg" placeholder="Bounty (e.g. ₹5000)" value={bounty} onChange={e => setBounty(e.target.value)} />
                     <input className="w-full border p-3 rounded-lg" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">{modalMode === 'EDIT' ? 'Save Changes' : 'Publish'}</button>
                </form>
            </Modal>

            <Modal isOpen={!!acceptModalOpen} onClose={() => setAcceptModalOpen(null)} title={`Accept Solution from ${acceptModalOpen?.studentName}`}>
                <div className="space-y-6">
                    <p className="text-sm text-gray-600">You are accepting this solution. This will close the problem and award the bounty. Please provide a rating and feedback for the student.</p>
                    <div className="py-6 bg-gray-50 rounded-lg border border-gray-100">
                        <label className="text-sm font-bold text-gray-700 mb-3 block text-center uppercase tracking-wide">Rate the Student</label>
                        <StarRatingInput rating={rating} setRating={setRating} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Feedback / Testimonial</label>
                        <textarea className="w-full border p-3 rounded-lg h-24" placeholder="e.g. Excellent work on optimizing the query..." value={feedback} onChange={e => setFeedback(e.target.value)} />
                    </div>
                    <button onClick={handleAcceptSubmit} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">Confirm Acceptance</button>
                </div>
            </Modal>
            
            <ProfileEditModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

            <ProblemDetailModal 
                isOpen={showProblemDetailModal}
                onClose={() => setShowProblemDetailModal(false)}
                problem={currentProblem} // Pass the currently selected problem
            />
        </div>
    );
};

export default CompanyPortal;