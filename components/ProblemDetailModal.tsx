import React from 'react';
import { Problem, Solution } from '../types';
import { X, Briefcase, IndianRupee, Tag, Clock, Users, CheckCircle2, Download, Terminal, CalendarDays, BookOpenText } from 'lucide-react';

interface ProblemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
  onSolveClick?: (problemId: string) => void; // New prop for solving action
}

const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({ isOpen, onClose, problem, onSolveClick }) => {
  if (!isOpen || !problem) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gradient-to-br from-indigo-800 to-blue-600 text-white animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="problem-detail-title"
      tabIndex={-1}
    >
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        aria-label="Close problem details"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 p-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
        <h2 id="problem-detail-title" className="text-4xl font-extrabold mb-4 text-white">{problem.title}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-white/90">
          <div className="flex items-center text-lg"><Briefcase className="w-5 h-5 mr-2 text-white/70" /> {problem.companyName}</div>
          <div className="flex items-center text-lg"><IndianRupee className="w-5 h-5 mr-2 text-white/70" /> {problem.bounty}</div>
          <div className="flex items-center text-lg"><CalendarDays className="w-5 h-5 mr-2 text-white/70" /> {new Date(problem.createdAt).toLocaleDateString()}</div>
          <div className="flex items-center text-lg">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${problem.status === 'OPEN' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
              {problem.status}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 flex items-center"><Tag className="w-5 h-5 mr-2 text-white/80" /> Tags</h3>
          <div className="flex flex-wrap gap-2">
            {problem.tags.map(tag => (
              <span key={tag} className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2 flex items-center"><BookOpenText className="w-5 h-5 mr-2 text-white/80" /> Description</h3>
          <p className="text-white/80 leading-relaxed bg-white/5 p-4 rounded-lg">{problem.description}</p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-white/80" /> Solutions ({problem.solutions?.length || 0})</h3>
          {problem.solutions && problem.solutions.length > 0 ? (
            <div className="space-y-4">
              {problem.solutions.sort((a,b) => (a.isAccepted === b.isAccepted) ? 0 : a.isAccepted ? -1 : 1).map((s: Solution) => ( // Accepted solutions first
                <div key={s.id} className={`p-4 rounded-lg ${s.isAccepted ? 'bg-green-500/20 border border-green-400' : 'bg-white/10 border border-white/20'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">{s.studentName}</span>
                    {s.isAccepted && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ACCEPTED
                      </span>
                    )}
                  </div>
                  <p className="text-white/80 text-sm mb-3 line-clamp-3">{s.content}</p>
                  <div className="flex justify-between items-center text-sm text-white/70">
                    <span>Submitted: {new Date(s.submittedAt).toLocaleDateString()}</span>
                    {s.attachmentUrl && (
                      <a href={s.attachmentUrl} target="_blank" className="flex items-center text-blue-300 hover:underline">
                        <Download className="w-4 h-4 mr-1" /> Attachment
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/70 italic">No solutions submitted yet for this challenge.</p>
          )}
        </div>

        {onSolveClick && problem.status === 'OPEN' && (
          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <button 
              onClick={() => onSolveClick(problem.id)}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center mx-auto"
            >
              <Terminal className="w-6 h-6 mr-2" /> Solve Challenge
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetailModal;