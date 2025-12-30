
import React, { useState } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Solution, Problem } from '../types.ts';
import { ShieldCheck, CheckCircle2, Terminal, Loader2, Star, Cpu, ArrowUpRight, Award, AlertTriangle, Brain, SearchCheck } from 'lucide-react';
import Modal from '../components/Modal.tsx';
import StarRatingInput from '../components/StarRatingInput.tsx';

interface MentorPortalProps {
  onProfileClick: (id: string) => void;
}

const MentorPortal: React.FC<MentorPortalProps> = ({ onProfileClick }) => {
    const { problems, verifySimulationSolution } = useStore();
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
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-lg">Verify solutions with AI-assisted pre-scoring and plagiarism detection 😁</p>
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
                                    const isFlagged = plag && plag.status !== 'CLEAN';
                                    
                                    return (
                                    <div key={item.solution.id} className="tactile-card p-8 bg-white rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-paper transition-all">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-black tracking-tighter group-hover:text-coral transition-colors">{item.problem.title}</h3>
                                                {isFlagged && <span className="bg-coral text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase animate-pulse">Similarity Alert</span>}
                                            </div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Student: 
                                                <span onClick={() => onProfileClick(item.solution.studentId)} className="text-black hover:underline cursor-pointer ml-1 font-black">{item.solution.studentName}</span>
                                            </p>
                                            <div className="flex gap-4 mt-4">
                                                <div className="bg-citrus/10 px-3 py-1.5 rounded-xl border border-citrus/20 flex items-center gap-2">
                                                    <Brain className="w-3 h-3 text-citrus" />
                                                    <span className="text-[10px] font-black">AI Suggests: {item.solution.aiEvaluation?.suggestedScore || '??'}%</span>
                                                </div>
                                                {isFlagged && (
                                                    <div className="bg-coral/10 px-3 py-1.5 rounded-xl border border-coral/20 flex items-center gap-2 text-coral">
                                                        <SearchCheck className="w-3 h-3" />
                                                        <span className="text-[10px] font-black">{plag?.similarityPercentage.toFixed(0)}% Match</span>
                                                    </div>
                                                )}
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
                            <p className="font-bold text-black opacity-70 leading-relaxed mb-8 italic">Your finalized score affects the student's Skill Level and Leaderboard rank. 😁</p>
                            <div className="space-y-2 text-[10px] font-black uppercase tracking-widest">
                                <p className="text-forest">90-100: Advanced</p>
                                <p className="text-black">75-89: Intermediate</p>
                                <p className="text-gray-500">60-74: Junior</p>
                                <p className="text-coral">&lt; 60: Beginner</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={!!reviewingSolution} onClose={() => setReviewingSolution(null)} title="Technical Audit Protocol">
                {reviewingSolution && (
                    <div className="space-y-8">
                        {/* AI Assistance Panel */}
                        <div className="bg-black text-white p-6 rounded-3xl relative overflow-hidden border-2 border-citrus">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <Brain className="w-6 h-6 text-citrus" />
                                    <h4 className="font-black uppercase tracking-widest text-xs">AI Evaluation Assist</h4>
                                </div>
                                <button 
                                    onClick={handleAiSync}
                                    className="bg-citrus text-black px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-transform"
                                >
                                    Adopt AI Suggestion
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 font-bold italic mb-4 leading-relaxed">
                                "{reviewingSolution.solution.aiEvaluation?.reasoning || 'AI analysis unavailable.'}"
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {reviewingSolution.solution.aiEvaluation?.flags.map(f => (
                                    <span key={f} className="bg-white/10 px-2 py-1 rounded text-[8px] font-black border border-white/10">{f}</span>
                                ))}
                            </div>
                        </div>

                        {/* Plagiarism Warning */}
                        {reviewingSolution.solution.plagiarismMetadata && reviewingSolution.solution.plagiarismMetadata.status !== 'CLEAN' && (
                            <div className="bg-coral/10 border-2 border-coral p-5 rounded-2xl flex items-start gap-3">
                                <AlertTriangle className="w-6 h-6 text-coral shrink-0" />
                                <div>
                                    <p className="font-black text-coral text-xs uppercase tracking-widest">Plagiarism Warning</p>
                                    <p className="text-[10px] font-bold text-gray-600 mt-1">
                                        This solution has a {reviewingSolution.solution.plagiarismMetadata.similarityPercentage.toFixed(0)}% similarity score. 
                                        {reviewingSolution.solution.plagiarismMetadata.status === 'PENALIZED' ? ' Automatic leaderboard penalty will be applied.' : ' Review logic structure carefully.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="p-6 bg-paper border-2 border-black rounded-3xl">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Subject Performance Content</label>
                            <div className="p-4 bg-white border-2 border-black rounded-2xl font-mono text-xs whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                                {reviewingSolution.solution.content}
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Competency Score (0-100)</label>
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
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block px-1">Mentor Audit Feedback</label>
                            <textarea 
                                className="w-full border-2 border-black p-5 rounded-2xl h-32 font-bold bg-paper outline-none focus:bg-citrus/5 transition-all text-sm" 
                                placeholder="Detail the logical optimizations or praise..." 
                                value={feedback} 
                                onChange={e => setFeedback(e.target.value)} 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleVerify('REJECTED')}
                                className="tactile-btn bg-coral text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest"
                            >
                                Reject Protocol
                            </button>
                            <button 
                                onClick={() => handleVerify('VERIFIED')}
                                disabled={isSubmitting || !feedback.trim() || rating === 0}
                                className="tactile-btn bg-forest text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Finalize Verification"}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MentorPortal;
