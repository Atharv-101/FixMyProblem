import React from 'react';
import { Terminal, IndianRupee } from 'lucide-react';
import { UserRole } from '../../types';

interface CTAProps {
  onLoginClick: (role: UserRole) => void;
}

const CTA: React.FC<CTAProps> = ({ onLoginClick }) => {
  return (
    <section className="py-24 px-4 bg-blue-600 text-center reveal">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black mb-8 text-white leading-tight">
          Ready to <span className="text-blue-200">Join the Mission</span>?
        </h2>
        <p className="text-lg md:text-2xl text-blue-5 mb-12 max-w-3xl mx-auto leading-relaxed">
          Whether you're looking to solve challenging problems or find innovative solutions, FixMyProblem is your platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fade-in-up">
           <button 
             onClick={() => onLoginClick(UserRole.STUDENT)}
             className="group relative px-10 py-4 bg-white rounded-full font-bold text-xl text-blue-600 shadow-xl transition-all hover:scale-105 active:scale-95"
           >
             Start Hacking <Terminal className="inline-block ml-3 w-6 h-6" />
           </button>
           <button 
             onClick={() => onLoginClick(UserRole.COMPANY)}
             className="px-10 py-4 bg-blue-700 text-white border border-blue-500 rounded-full font-bold text-xl hover:bg-blue-800 transition-colors flex items-center justify-center shadow-lg"
           >
             Post a Bounty <IndianRupee className="ml-3 w-6 h-6 text-green-300" />
           </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;