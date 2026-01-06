
import React, { useState } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Solution, Problem } from '../types.ts';
// Added XCircle to the imports below
import { ShieldCheck, CheckCircle2, Terminal, Loader2, Star, Cpu, ArrowUpRight, Award, AlertTriangle, Brain, SearchCheck, Check, X, XCircle } from 'lucide-react';
import Modal from '../components/Modal.tsx';
import StarRatingInput from '../components/StarRatingInput.tsx';

interface MentorPortalProps {
  onProfileClick: (id: string) => void;
}

const MentorPortal: React.FC<MentorPortalProps> = ({ onProfileClick }) => {
    const { problems, verifySimulationSolution, overridePlagiarismStatus } = useStore();
    const [reviewingSolution, setReviewingSolution] = useState<{ solution: Solution, problem: Problem } | null>(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pendingReviews = problems.filter(p => p.isSimulation || p.companyName.toLowerCase().includes('practice'))
        .flatMap(p => (p.solutions || []).filter(s => s.reviewStatus === 'PENDING').map(s => ({ problem: p, solution: s })));

    const handleVerify = async (status: 'VERIFIED' | 'REJECTED') => {
        if (!reviewingSolution) return;
        setIsSubmitting(true);
        try {
            await verifySimulationSolution(
                reviewingSolution.problem.id, 
                reviewingSolution.solution.id, 
                reviewingSolution.solution.studentId, 
                rating, 
                feedback,
                status
            );
            setReviewingSolution(null);
            setRating(0);
            setFeedback('');
        } catch (e: any) {
            console.error("Audit Protocol Error:", e);
            alert(`Audit failed: ${e.message || 'System interruption. Check console.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAiSync = () => {
        if (reviewingSolution?.solution.aiEvaluation) {
            setRating(reviewingSolution.solution.aiEvaluation.suggestedScore);
            setFeedback(reviewingSolution.solution.aiEvaluation.reasoning);
        }
    };

    const handleOverridePlagiarism = async (status: 'CLEAN' | 'FLAGGED' | 'PENALIZED') => {
        if (!reviewingSolution) return;
        await overridePlagiarismStatus(reviewingSolution.problem.id, reviewingSolution.solution.id, status);
        // Refresh local state for immediate feedback
        setReviewingSolution(prev => prev ? {
            ...prev,
            solution: {
                ...prev.solution,
                plagiarismMetadata: {
                    ...prev.solution.plagiarismMetadata!,
                    status
                }
            }
        } : null);
    };

    return (
        <div className="min-h-screen bg-paper pt-32 px-6 md:px-10 pb-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <ShieldCheck className="w-[600px] h-[600px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="tactile-card bg-black text-white p-12 rounded-[3rem] shadow-xl mb-12 relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] opacity-10 p-4">
                        <Terminal className="w-64 h-64" />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest text-citrus rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 mb-6">
                            <ShieldCheck className="w-4 h-4" /> Mentor Evaluation Node
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter leading-none italic">
                            Audit <span className="text-citrus">Core.</span>
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-lg">Verify solutions with similarity detection & AI-assisted pre-scoring 😁</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-2xl font-black tracking-widest uppercase flex items-center gap-3">
                            <Cpu className="w-8 h-8 text-coral" /> Evaluation Queue ({pendingReviews.length})
                        </h2>

                        {pendingReviews.length === 0 ? (
                            <div className="p-20 text-center border-4 border-dashed border-black/10 rounded-[3rem] bg-white/50">
                                <CheckCircle2 className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xl">System Optimal. No Pending Tasks.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {pendingReviews.map((item) => {
                                    const plag = item.solution.plagiarismMetadata;
                                    const isFlagged = plag && (plag.status === 'FLAGGED' || plag.status === 'PENALIZED');
                                    
                                    return (
                                    <div key={item.solution.id} className="tactile-card p-8 bg-white rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-paper transition-all border-2 border-black/5 hover:border-black/20">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-black tracking-tighter group-hover:text-coral transition-colors">{item.problem.title}</h3>
                                                {isFlagged && <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase animate-pulse ${plag?.status === 'PENALIZED' ? 'bg-red-600 text-white' : 'bg-coral text-white'}`}>Similarity: {plag?.similarityPercentage.toFixed(0)}%</span>}
                                            </div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Student: 
                                                <span onClick={() => onProfileClick(item.solution.studentId)} className="text-black hover:underline cursor-pointer ml-1 font-black">{item.solution.studentName}</span>
                                            </p>
                                            <div className="flex gap-4 mt-4">
                                                <div className="bg-citrus/10 px-3 py-1.5 rounded-xl border border-citrus/20 flex items-center gap-2">
                                                    <Brain className="w-3 h-3 text-citrus" />
                                                    <span className="text-[10px] font-black">AI Suggests: {item.solution.aiEvaluation?.suggestedScore || '??'}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setReviewingSolution(item)}
                                            className="tactile-btn px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-forest shrink-0"
                                        >
                                            Begin Audit <ArrowUpRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )})}
                            </div>
                        )}
                    </div>

                    <div className="space-y-12">
                        <div className="tactile-card bg-citrus p-10 rounded-[3rem] border-4 border-black">
                            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                                <Award className="w-8 h-8" /> Rank Protocol
                            </h3>
                            <p className="font-bold text-black opacity-70 leading-relaxed mb-8 italic">Scores affect Skill Level. <span className="text-coral">Similarity alerts</span> require manual override or penalty commitment. 😁</p>
                            <div className="space-y-2 text-[10px] font-black uppercase tracking-widest">
                                <p className="text-red-600">90%+ Similarity: Auto Penalty (-50 pts)</p>
                                <p className="text-coral">80%-89% Similarity: Flagged Review</p>
                                <p className="text-forest mt-4">90-100: Advanced</p>
                                <p className="text-black">75-89: Intermediate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={!!reviewingSolution} onClose={() => setReviewingSolution(null)} title="Technical Audit Protocol">
                {reviewingSolution && (
                    <div className="space-y-8">
                        {/* Similarity Panel */}
                        <div className={`p-6 rounded-3xl border-4 border-black relative overflow-hidden transition-all ${reviewingSolution.solution.plagiarismMetadata?.status === 'PENALIZED' ? 'bg-red-50' : reviewingSolution.solution.plagiarismMetadata?.status === 'FLAGGED' ? 'bg-coral/5' : 'bg-paper'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <SearchCheck className={`w-8 h-8 ${reviewingSolution.solution.plagiarismMetadata?.status === 'PENALIZED' ? 'text-red-600' : 'text-coral'}`} />
                                    <div>
                                        <h4 className="font-black uppercase tracking-widest text-xs">Similarity Extraction</h4>
                                        <p className="text-3xl font-black">{reviewingSolution.solution.plagiarismMetadata?.similarityPercentage.toFixed(1)}% Match</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {reviewingSolution.solution.plagiarismMetadata?.status !== 'CLEAN' && (
                                        <button 
                                            onClick={() => handleOverridePlagiarism('CLEAN')}
                                            className="px-4 py-2 bg-forest text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                                        >
                                            <Check className="w-3 h-3" /> Dismiss Flag
                                        </button>
                                    )}
                                    {reviewingSolution.solution.plagiarismMetadata?.status === 'CLEAN' && reviewingSolution.solution.plagiarismMetadata.similarityPercentage > 50 && (
                                        <button 
                                            onClick={() => handleOverridePlagiarism('FLAGGED')}
                                            className="px-4 py-2 bg-coral text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                                        >
                                            <AlertTriangle className="w-3 h-3" /> Re-flag Node
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {reviewingSolution.solution.plagiarismMetadata?.status === 'PENALIZED' && (
                                <div className="bg-red-600 text-white p-3 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest mb-4">
                                    <XCircle className="w-4 h-4" /> Similarity Threshold (90%) Exceeded. Payout extraction restricted.
                                </div>
                            )}

                            <p className="text-xs text-gray-500 font-bold leading-relaxed italic">
                                "Cross-referencing logic nodes against previous submissions for Execution ID: {reviewingSolution.problem.id.slice(-6)}."
                            </p>
                        </div>

                        {/* AI Assistance Panel */}
                        <div className="bg-black text-white p-6 rounded-3xl relative overflow-hidden border-2 border-citrus">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <Brain className="w-6 h-6 text-citrus" />
                                    <h4 className="font-black uppercase tracking-widest text-xs">AI Logic Scan</h4>
                                </div>
                                <button 
                                    onClick={handleAiSync}
                                    className="bg-citrus text-black px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-transform"
                                >
                                    Sync AI Values
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 font-bold italic mb-4 leading-relaxed">
                                "{reviewingSolution.solution.aiEvaluation?.reasoning || 'AI analysis unavailable.'}"
                            </p>
                        </div>

                        <div className="p-6 bg-paper border-2 border-black rounded-3xl">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Technical Implementation</label>
                            <div className="p-4 bg-white border-2 border-black rounded-2xl font-mono text-xs whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                                {reviewingSolution.solution.content}
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Final Competency Score</label>
                            <div className="flex items-center gap-6">
                                <input 
                                    type="range" min="0" max="100" 
                                    value={rating} 
                                    onChange={e => setRating(parseInt(e.target.value))}
                                    className="w-48 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black border border-black"
                                />
                                <span className={`text-4xl font-black ${rating >= 75 ? 'text-forest' : rating >= 60 ? 'text-citrus' : 'text-coral'}`}>{rating}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block px-1">Audit Protocol Log (Feedback)</label>
                            <textarea 
                                className="w-full border-2 border-black p-5 rounded-2xl h-32 font-bold bg-paper outline-none focus:bg-citrus/5 transition-all text-sm" 
                                placeholder="Explain your decision..." 
                                value={feedback} 
                                onChange={e => setFeedback(e.target.value)} 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleVerify('REJECTED')}
                                className="tactile-btn bg-coral text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest"
                            >
                                Reject Node
                            </button>
                            <button 
                                onClick={() => handleVerify('VERIFIED')}
                                disabled={isSubmitting || !feedback.trim() || rating === 0}
                                className="tactile-btn bg-forest text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Finalize Audit"}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MentorPortal;
