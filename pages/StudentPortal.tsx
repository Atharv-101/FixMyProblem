import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store';
import { UserRole, Problem, Solution } from '../types';
import { GraduationCap, Search, Edit2, Star, Download, Loader2, Code2, Paperclip, Terminal, CheckCircle2 } from 'lucide-react';
import Modal from '../components/Modal';
import ProfileEditModal from '../components/ProfileEditModal';
import SubmissionSuccessModal from '../components/SubmissionSuccessModal'; // Import the new component
import ProblemDetailModal from '../components/ProblemDetailModal'; // Import ProblemDetailModal

const StudentPortal: React.FC = () => {
    const { user, allUsers, problems, addSolution } = useStore();
    const [selectedProblemIdForSubmission, setSelectedProblemIdForSubmission] = useState<string | null>(null); // Renamed for clarity
    const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null); // New state for problem details
    const [showProblemDetailModal, setShowProblemDetailModal] = useState(false); // New state for detail modal
    const [solutionText, setSolutionText] = useState('');
    const [solutionFile, setSolutionFile] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // New state for success modal
    
    const currentUserData = allUsers.find(u => u.id === user?.id) || user;
    const activeProblemForSubmission = problems.find(p => p.id === selectedProblemIdForSubmission);

    const filteredProblems = useMemo(() => {
        return problems.filter(p => {
          const query = searchQuery.toLowerCase();
          return !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.tags.some(tag => tag.toLowerCase().includes(query));
        }).sort((a, b) => { // Sort by status: OPEN first
            if (a.status === 'OPEN' && b.status !== 'OPEN') return -1;
            if (a.status !== 'OPEN' && b.status === 'OPEN') return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Then by newest
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
                setSelectedProblemIdForSubmission(null); // Close the submission form modal
                setShowSuccessModal(true); // Open the success modal
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
        setShowProblemDetailModal(false); // Close problem details modal
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
           <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
                        <p className="text-gray-500 flex items-center mt-1">
                            <GraduationCap className="w-4 h-4 mr-1"/> {currentUserData?.university}
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsProfileOpen(true)} className="flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg">
                            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                        </button>
                        <div className="text-right">
                             <div className="text-2xl font-bold text-blue-600 flex items-center justify-end">
                                {currentUserData?.rating?.toFixed(1) || '0.0'} <Star className="w-5 h-5 ml-1 fill-blue-600 text-blue-600"/>
                             </div>
                             <div className="text-xs text-gray-500">Current Rating</div>
                        </div>
                    </div>
                </div>

                {currentUserData?.bio && (
                    <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-2">About Me</h3>
                        <p className="text-gray-600 text-sm">{currentUserData.bio}</p>
                        {currentUserData.skills && currentUserData.skills.length > 0 && (
                            <div className="flex gap-2 mt-4">
                                {currentUserData.skills.map(s => (
                                    <span key={s} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Search problems by title, description, or tags..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProblems.map(p => (
                        <div 
                            key={p.id} 
                            onClick={() => handleOpenProblemDetails(p)} // Open problem details on card click
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{p.companyName}</span>
                                <span className="text-green-600 font-bold">{p.bounty}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">{p.description}</p>
                            <button disabled={p.status !== 'OPEN'} className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold disabled:opacity-50 pointer-events-none">
                                {p.status === 'OPEN' ? 'Solve Challenge' : 'Closed'}
                            </button>
                        </div>
                    ))}
                    {filteredProblems.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500 italic">No problems found matching your search.</div>
                    )}
                </div>
           </div>

           {/* Problem Detail Modal */}
           <ProblemDetailModal
                isOpen={showProblemDetailModal}
                onClose={() => setShowProblemDetailModal(false)}
                problem={currentProblemForDetails}
                onSolveClick={handleSolveFromDetails} // Pass the handler to open submission form
            />

           {/* Submit Solution Modal (now triggered from ProblemDetailModal) */}
           <Modal isOpen={!!selectedProblemIdForSubmission} onClose={() => setSelectedProblemIdForSubmission(null)} title="Submit Solution">
                <p className="text-gray-600 mb-6">Provide your solution details below. You can paste code, describe your approach, and attach supporting files.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            <Code2 className="w-5 h-5 mr-2 text-blue-600" /> 1. Challenge Details
                        </h3>
                        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 border border-gray-200 font-medium">
                            {activeProblemForSubmission?.title}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Carefully review the challenge you are about to submit a solution for.</p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            <Terminal className="w-5 h-5 mr-2 text-green-600" /> 2. Your Solution
                        </h3>
                        <textarea 
                            required 
                            className="w-full border border-gray-300 rounded-lg p-3 h-40 font-mono text-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
                            placeholder="Paste your code, describe your algorithm, or outline your architectural proposal here..." 
                            value={solutionText} 
                            onChange={e => setSolutionText(e.target.value)} 
                        />
                        <p className="text-xs text-gray-500 mt-2">Provide detailed information about your solution. This is crucial for evaluation.</p>
                    </section>
                    
                    <section>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            <Paperclip className="w-5 h-5 mr-2 text-purple-600" /> 3. Attachments (Optional)
                        </h3>
                        <div>
                            <input 
                                type="file" 
                                accept=".zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed" 
                                onChange={e => setSolutionFile(e.target.files ? e.target.files[0] : null)} 
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                You can attach a ZIP file containing your project code, documentation, or other resources. Max size 20MB.
                            </p>
                        </div>
                    </section>

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 animate-bounce-slow mr-2" />}
                        {isSubmitting ? 'Submitting Solution...' : 'Submit Solution'}
                    </button>
                </form>
           </Modal>

           <ProfileEditModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
           <SubmissionSuccessModal 
                isOpen={showSuccessModal} 
                onClose={() => setShowSuccessModal(false)} 
                problemTitle={activeProblemForSubmission?.title || 'the challenge'} // Pass activeProblem.title for context
            />
        </div>
    );
};

export default StudentPortal;