import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemTitle: string;
}

const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({ isOpen, onClose, problemTitle }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-indigo-800 text-white animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
      tabIndex={-1}
    >
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        aria-label="Close success message"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-center max-w-lg w-full relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-blue-300 animate-spin-slow" />
        </div>
        
        <div className="relative z-10 p-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-green-400 text-white mb-8 border-4 border-white animate-pop-in">
            <CheckCircle2 className="w-16 h-16" />
          </div>

          <h2 id="success-title" className="text-3xl sm:text-4xl font-extrabold mb-4 animate-fade-in-up delay-100">
            Solution Submitted!
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed animate-fade-in-up delay-200">
            Thank you for contributing to 
            <span className="font-bold text-green-300 ml-2">{problemTitle}</span>.
            Your dedication helps push innovation forward.
          </p>

          <button 
            onClick={onClose} 
            className="px-8 py-3 bg-white text-blue-700 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-lg animate-fade-in-up delay-300"
          >
            Go back to challenges
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccessModal;