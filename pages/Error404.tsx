
import React from 'react';
import { Home, ArrowLeft, Ghost, Map, Construction } from 'lucide-react';

interface Error404Props {
  onBack: () => void;
}

const Error404: React.FC<Error404Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-6 overflow-hidden relative">
      {/* Decorative Background grid or items */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <Map className="w-[800px] h-[800px] text-black" />
      </div>
      
      <div className="max-w-xl w-full text-center relative z-10">
        <div className="tactile-card bg-black text-white p-12 md:p-16 rounded-[3rem] shadow-2xl relative animate-pop">
          <div className="sticker-tape !bg-coral"></div>
          
          <div className="w-24 h-24 bg-citrus text-black rounded-full border-4 border-black flex items-center justify-center mx-auto mb-10 shadow-[6px_6px_0px_0px_rgba(255,95,95,1)] animate-bounce">
             <Ghost className="w-12 h-12" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-none">
            Error404 <br/>
            <span className="text-citrus italic">— you have lost.</span>
          </h1>
          
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm mb-12 max-w-sm mx-auto leading-relaxed">
            The grid node you are looking for has been detached or never existed. Your current coordinates are invalid.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onBack}
              className="tactile-btn flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-citrus transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Safety
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="tactile-btn flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-white text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <Construction className="w-4 h-4" /> Re-scan Node
            </button>
          </div>
        </div>
        
        <div className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">
          Lost in the FixMyProblem Grid Protocol
        </div>
      </div>
    </div>
  );
};

export default Error404;
