
import React, { useState } from 'react';
import { Problem, Solution, User } from '../types';
import { X, Briefcase, IndianRupee, Tag, Clock, Users, CheckCircle2, Download, Terminal, CalendarDays, BookOpenText } from 'lucide-react';
import ProfileCard from './ProfileCard';
import { useStore } from '../context/Store';

interface ProblemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
  onSolveClick?: (problemId: string) => void;
}

const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({ isOpen, onClose, problem, onSolveClick }) => {
  const { allUsers } = useStore();
  const [showCompanyProfileCard, setShowCompanyProfileCard] = useState(false);

  if (!isOpen || !problem) return null;

  const companyUser = allUsers.find(u => u.id === problem.companyId);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="tactile-card bg-white rounded-[2.5rem] w-full max-w-4xl relative animate-pop-in flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="p-6 md:p-10 border-b-2 border-black/5 bg-paper/80 backdrop-blur-md flex justify-between items-center z-20">
          <div className="pr-12">
            <h2 id="problem-detail-title" className="text-2xl md:text-4xl font-black text-black tracking-tighter leading-none mb-2">{problem.title}</h2>
            <p className="text-[10px] font-black uppercase text-coral tracking-widest">{problem.companyName} Grid Access</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-black text-white rounded-2xl hover:bg-coral transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 space-y-10">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 border-2 border-black rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Entity</p>
              <div 
                className="font-black text-sm md:text-base truncate cursor-help hover:text-coral transition-colors"
                onMouseEnter={() => setShowCompanyProfileCard(true)}
                onMouseLeave={() => setShowCompanyProfileCard(false)}
              >
                {problem.companyName}
                {showCompanyProfileCard && companyUser && <ProfileCard user={companyUser} onClose={() => setShowCompanyProfileCard(false)} positionClasses="top-full left-0 mt-2" />}
              </div>
            </div>
            <div className="p-4 bg-citrus/10 border-2 border-black rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Bounty</p>
              <div className="font-black text-sm md:text-base flex items-center text-forest">
                <IndianRupee className="w-4 h-4 mr-0.5" /> {problem.bounty.replace(/[^\d]/g, '')}
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-2 border-black rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Created</p>
              <div className="font-black text-sm md:text-base flex items-center">
                <CalendarDays className="w-4 h-4 mr-2" /> {new Date(problem.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-2 border-black rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Protocol</p>
              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border-2 border-black ${problem.status === 'OPEN' ? 'bg-citrus' : 'bg-gray-200'}`}>
                {problem.status}
              </span>
            </div>
          </div>

          {/* Body Section */}
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-lg font-black uppercase tracking-widest text-black flex items-center gap-2 mb-4">
                  <BookOpenText className="w-5 h-5 text-coral" /> Technical Brief
                </h3>
                <div className="p-6 bg-paper border-2 border-black rounded-3xl text-gray-600 font-bold leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                  {problem.description}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-black uppercase tracking-widest text-black flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-forest" /> Solutions ({problem.solutions?.length || 0})
                </h3>
                {problem.solutions && problem.solutions.length > 0 ? (
                  <div className="space-y-4">
                    {problem.solutions.sort((a,b) => (a.isAccepted === b.isAccepted) ? 0 : a.isAccepted ? -1 : 1).map((s) => (
                      <div key={s.id} className={`p-6 rounded-[2rem] border-2 border-black transition-all ${s.isAccepted ? 'bg-citrus/5' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-black text-black">{s.studentName}</span>
                          {s.isAccepted && (
                            <span className="px-3 py-1 bg-forest text-citrus rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Accepted
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 font-bold text-sm mb-6 line-clamp-3 italic opacity-80">"{s.content}"</p>
                        <div className="flex justify-between items-center pt-4 border-t border-black/5 text-[10px] font-black text-gray-400 uppercase">
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
                  <div className="p-12 text-center border-2 border-dashed border-black/10 rounded-3xl">
                    <p className="text-gray-300 font-black uppercase text-xs">No solver protocols released yet.</p>
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-8">
               <section>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Grid Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
               </section>
               
               {onSolveClick && problem.status === 'OPEN' && (
                 <div className="p-6 bg-citrus rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <h4 className="font-black text-lg mb-2">Initialize Solution?</h4>
                    <p className="text-xs font-bold mb-6 opacity-70">Release your execution plan to the grid. High ranking solvers get instant bounties. 😁</p>
                    <button 
                      onClick={() => onSolveClick(problem.id)}
                      className="tactile-btn w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      <Terminal className="w-5 h-5" /> Release Protocol
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
