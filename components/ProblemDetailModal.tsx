
import React, { useState } from 'react';
import { Problem, Solution, User } from '../types.ts';
import { X, Briefcase, IndianRupee, Tag, Clock, Users, CheckCircle2, Download, Terminal, CalendarDays, BookOpenText, Info, AlertTriangle, Cpu, Layers, Activity } from 'lucide-react';
import ProfileCard from './ProfileCard.tsx';
import { useStore } from '../context/Store.tsx';

interface ProblemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
  onSolveClick?: (problemId: string) => void;
  onProfileClick?: (userId: string) => void;
}

const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({ isOpen, onClose, problem, onSolveClick, onProfileClick }) => {
  const { allUsers } = useStore();
  const [showCompanyProfileCard, setShowCompanyProfileCard] = useState(false);

  if (!isOpen || !problem) return null;

  const companyUser = allUsers.find(u => u.id === problem.companyId);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="tactile-card bg-white rounded-[2.5rem] w-full max-w-5xl relative animate-pop-in flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="p-6 md:p-8 border-b-4 border-black bg-paper flex justify-between items-center z-20">
          <div className="pr-12">
            <h2 id="problem-detail-title" className="text-2xl md:text-3xl font-black text-black tracking-tighter leading-none mb-1">{problem.title}</h2>
            <div className="flex items-center gap-3">
              <span 
                onClick={() => onProfileClick?.(problem.companyId)}
                className="text-[10px] font-black uppercase text-coral tracking-widest cursor-pointer hover:underline"
              >
                {problem.companyName} Grid
              </span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Execution ID: {problem.id.slice(-6)}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-black text-white rounded-2xl hover:bg-coral transition-colors shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Mission Briefing Details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Core Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-paper border-2 border-black rounded-2xl text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Bounty</p>
                  <div className="font-black text-lg flex items-center justify-center text-forest">
                    <IndianRupee className="w-4 h-4 mr-0.5" /> {problem.bounty.replace(/[^\d]/g, '')}
                  </div>
                </div>
                <div className="p-4 bg-paper border-2 border-black rounded-2xl text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact</p>
                  <div className="font-black text-lg flex items-center justify-center text-coral uppercase tracking-tighter">
                    <Activity className="w-4 h-4 mr-2" /> {problem.impact || 'Normal'}
                  </div>
                </div>
                <div className="p-4 bg-paper border-2 border-black rounded-2xl text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Created</p>
                  <div className="font-black text-xs md:text-sm flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 mr-2" /> {new Date(problem.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4 bg-paper border-2 border-black rounded-2xl text-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Protocol</p>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border-2 border-black ${problem.status === 'OPEN' ? 'bg-citrus' : 'bg-gray-200'}`}>
                    {problem.status}
                  </span>
                </div>
              </div>

              {/* Problem Briefing Sections */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2 mb-4">
                    <BookOpenText className="w-5 h-5 text-coral" /> Problem Summary
                  </h3>
                  <div className="p-6 bg-gray-50 border-2 border-black rounded-3xl text-gray-700 font-bold leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {problem.description}
                  </div>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-forest" /> Expected Behavior
                    </h3>
                    <div className="p-5 bg-paper border-2 border-black rounded-2xl text-gray-600 font-medium leading-relaxed text-sm italic">
                      {problem.expectedBehavior || "Not specified."}
                    </div>
                  </section>
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-coral" /> Current Behavior / Error
                    </h3>
                    <div className="p-5 bg-paper border-2 border-black rounded-2xl text-gray-600 font-medium leading-relaxed text-sm italic">
                      {problem.currentBehavior || "Not specified."}
                    </div>
                  </section>
                </div>

                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-black" /> Steps to Reproduce
                  </h3>
                  <div className="p-6 bg-paper border-2 border-black rounded-3xl text-gray-700 font-mono text-xs md:text-sm whitespace-pre-wrap">
                    {problem.stepsToReproduce || "No reproduction steps provided."}
                  </div>
                </section>
              </div>

              <section className="pt-8 border-t-2 border-black/5">
                <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-forest" /> Solver Submissions ({problem.solutions?.length || 0})
                </h3>
                {problem.solutions && problem.solutions.length > 0 ? (
                  <div className="space-y-4">
                    {problem.solutions.sort((a,b) => (a.isAccepted === b.isAccepted) ? 0 : a.isAccepted ? -1 : 1).map((s) => (
                      <div key={s.id} className={`p-6 rounded-2xl border-2 border-black transition-all ${s.isAccepted ? 'bg-citrus/5 border-forest' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <span 
                            onClick={() => onProfileClick?.(s.studentId)}
                            className="font-black text-black cursor-pointer hover:text-coral transition-colors"
                          >
                            {s.studentName}
                          </span>
                          {s.isAccepted && (
                            <span className="px-3 py-1 bg-forest text-citrus rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Accepted
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 font-bold text-sm mb-4 line-clamp-3 italic opacity-80">"{s.content}"</p>
                        <div className="flex justify-between items-center pt-3 border-t border-black/5 text-[10px] font-black text-gray-400 uppercase">
                          <span>{new Date(s.submittedAt).toLocaleDateString()}</span>
                          {s.attachmentUrl && (
                            <a href={s.attachmentUrl} target="_blank" className="flex items-center text-coral hover:underline">
                              <Download className="w-4 h-4 mr-1.5" /> Payload
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center border-2 border-dashed border-black/10 rounded-3xl bg-gray-50/50">
                    <p className="text-gray-400 font-black uppercase text-xs">No active execution plans found on the grid.</p>
                  </div>
                )}
              </section>
            </div>

            {/* Side Info Panel */}
            <div className="space-y-8">
               <div className="tactile-card p-6 bg-white rounded-3xl">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Cpu className="w-3 h-3"/> System Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {problem.techStack ? problem.techStack.split(',').map(tech => (
                      <div key={tech} className="px-3 py-2 bg-paper border-2 border-black rounded-xl font-black text-xs text-black">
                        {tech.trim()}
                      </div>
                    )) : <p className="text-[10px] text-gray-400 italic">Not specified.</p>}
                  </div>
               </div>

               <div className="tactile-card p-6 bg-white rounded-3xl">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Tag className="w-3 h-3"/> Grid Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
               </div>
               
               <div className="tactile-card p-6 bg-paper rounded-3xl border-dashed">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Briefcase className="w-3 h-3"/> Entity Details</h4>
                  <div 
                    onClick={() => onProfileClick?.(problem.companyId)}
                    className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-2xl cursor-pointer hover:bg-citrus/10 relative transition-all"
                  >
                    <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black">
                      {problem.companyName.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-black truncate">{problem.companyName}</p>
                      <p className="text-[8px] font-black uppercase text-coral">Verified Grid</p>
                    </div>
                  </div>
               </div>
               
               {onSolveClick && problem.status === 'OPEN' && (
                 <div className="p-8 bg-citrus rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h4 className="font-black text-xl mb-3 tracking-tighter">Initialize Execution?</h4>
                    <p className="text-xs font-bold mb-8 opacity-70 leading-relaxed">Review the mission brief carefully. Deploy your code payload to the company grid for bounty extraction. 😁</p>
                    <button 
                      onClick={() => onSolveClick(problem.id)}
                      className="tactile-btn w-full bg-black text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      <Terminal className="w-5 h-5" /> Commit Solution
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailModal;
