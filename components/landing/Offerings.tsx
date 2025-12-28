
import React from 'react';
import { GraduationCap, Building2, Target, Trophy, Search, Cpu } from 'lucide-react';

const Offerings: React.FC = () => {
  return (
    <section id="offerings" className="py-16 md:py-20 px-4 md:px-10 bg-black text-white relative border-y-4 lg:border-y-[6px] border-coral">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          <div className="flex-1 space-y-8 lg:space-y-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-8">
              Dual Protocol <br/> <span className="text-citrus">Execution.</span>
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:gap-10">
              <div className="group relative p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-white/10 hover:border-citrus transition-all">
                <div className="w-12 lg:w-14 h-12 lg:h-14 bg-citrus rounded-xl lg:rounded-2xl flex items-center justify-center text-black mb-5 group-hover:rotate-6 transition-transform">
                  <GraduationCap className="w-6 lg:w-8 h-6 lg:h-8" />
                </div>
                <h3 className="text-xl lg:text-2xl font-black mb-3">For Students</h3>
                <p className="text-gray-400 font-medium leading-relaxed text-sm lg:text-base">
                  Bridge theory and industry implementation. Build a verifiable proof-of-work history that matters.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-[9px] font-black uppercase tracking-widest text-citrus">
                  <span className="flex items-center gap-1"><Target className="w-3 h-3"/> Real Bounties</span>
                  <span className="flex items-center gap-1"><Trophy className="w-3 h-3"/> Reputation</span>
                </div>
              </div>

              <div className="group relative p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-white/10 hover:border-coral transition-all">
                <div className="w-12 lg:w-14 h-12 lg:h-14 bg-coral rounded-xl lg:rounded-2xl flex items-center justify-center text-white mb-5 group-hover:-rotate-6 transition-transform">
                  <Building2 className="w-6 lg:w-8 h-6 lg:h-8" />
                </div>
                <h3 className="text-xl lg:text-2xl font-black mb-3">For Companies</h3>
                <p className="text-gray-400 font-medium leading-relaxed text-sm lg:text-base">
                  Access a grid of top-tier student solvers who think outside your internal box.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-[9px] font-black uppercase tracking-widest text-coral">
                  <span className="flex items-center gap-1"><Search className="w-3 h-3"/> Sourcing</span>
                  <span className="flex items-center gap-1"><Cpu className="w-3 h-3"/> Scale R&D</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full mt-8 lg:mt-0">
            <div className="relative aspect-square md:aspect-video lg:aspect-square bg-forest rounded-[2.5rem] lg:rounded-[4rem] p-8 lg:p-12 overflow-hidden border-2 border-white/10">
               <div className="absolute top-0 right-0 w-48 lg:w-64 h-48 lg:h-64 bg-white/5 rounded-full -mr-24 -mt-24"></div>
               <div className="relative z-10 h-full flex flex-col justify-center text-center">
                  <div className="text-7xl sm:text-9xl lg:text-[140px] font-black leading-none text-citrus/20 tracking-tighter mb-2">120+</div>
                  <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6">Problems solved <br/>this month.</h4>
                  <div className="flex justify-center -space-x-3 lg:-space-x-4 scale-90 lg:scale-100">
                     {[1,2,3,4,5].map(i => (
                       <div key={i} className="w-12 lg:w-16 h-12 lg:h-16 rounded-full border-[3px] lg:border-4 border-forest bg-white overflow-hidden shadow-xl">
                          <img src={`https://i.pravatar.cc/100?u=off${i}`} className="w-full h-full object-cover" />
                       </div>
                     ))}
                  </div>
                  <p className="mt-8 text-gray-400 font-black uppercase tracking-[0.2em] text-[9px] lg:text-xs">Verified Protocol Stats</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Offerings;
