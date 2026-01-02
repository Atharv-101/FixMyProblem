
import React from 'react';
import { BrainCircuit, Zap, ArrowRight, Cpu, Terminal } from 'lucide-react';

interface PracticeStatsProps {
  count: number;
  onViewChange: (view: any) => void;
}

const PracticeStats: React.FC<PracticeStatsProps> = ({ count, onViewChange }) => {
  return (
    <section className="py-12 px-4 md:px-10 bg-citrus relative border-y-4 border-black overflow-hidden group">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-black text-citrus rounded-[2rem] border-4 border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform duration-500 relative">
               <BrainCircuit className="w-12 h-12 md:w-16 md:h-16 animate-pulse" />
               <div className="absolute -top-2 -right-2 w-8 h-8 bg-coral rounded-full border-2 border-black flex items-center justify-center animate-bounce">
                  <Zap className="w-4 h-4 text-white fill-white" />
               </div>
            </div>
            
            <div className="space-y-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                  <Terminal className="w-3 h-3 text-citrus" /> Global Sandbox Stats
               </div>
               <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none">
                  <span className="text-black/40">TOTAL:</span> {count} SIMULATIONS.
               </h2>
               <p className="text-sm md:text-lg font-bold text-black/60 uppercase tracking-widest">
                  Live Technical Roadblocks Synced to the Grid 😁
               </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
            <div className="hidden xl:flex items-center gap-4 px-6 py-4 bg-white/40 border-2 border-black/10 rounded-2xl">
               <Cpu className="w-6 h-6 text-black/40" />
               <div className="text-[10px] font-black uppercase tracking-widest text-black/40 leading-tight">
                  Status: Optimal<br/>
                  Buffer: Encrypted
               </div>
            </div>
            
            <button 
              onClick={() => onViewChange('SIMULATIONS')}
              className="tactile-btn w-full sm:w-auto px-12 py-6 bg-black text-white rounded-2xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-forest transition-all shadow-[8px_8px_0px_0px_rgba(255,95,95,1)]"
            >
              Sync Sandbox <ArrowRight className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PracticeStats;
