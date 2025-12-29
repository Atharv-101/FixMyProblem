
import React from 'react';
import { Globe, ArrowUpRight, Cpu, Zap, Star, ShieldCheck, Heart } from 'lucide-react';

const Leadership: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-10 bg-paper relative border-t-2 border-black overflow-hidden">
      {/* Background decoration - reduced size on mobile to prevent overflow */}
      <div className="absolute top-0 right-0 w-[200px] md:w-[600px] h-[200px] md:h-[600px] bg-coral/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Text Content */}
          <div className="space-y-6 md:space-y-8 reveal">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em]">
                <Cpu className="w-4 h-4 text-citrus" /> The Core Protocol
             </div>
             
             <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-black tracking-tighter leading-[0.9] sm:leading-[0.85]">
                FixMyProblem <br/> 
                <span className="text-coral italic underline decoration-citrus decoration-4 underline-offset-4 md:underline-offset-8">By ATHinnovations.</span>
             </h2>

             <div className="space-y-6">
                <p className="text-base sm:text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                  FixMyProblem is a mission-critical infrastructure owned and operated by <a href="https://athinnovations.in" target="_blank" rel="noopener noreferrer" className="text-forest underline underline-offset-4 hover:text-coral transition-colors">ATHinnovations</a> 👀. 
                  As the parent company and owner, ATHinnovations acts as the venture engine—providing capital, architecture, and high-stakes engineering rigor to the grid.
                </p>
                
                <div className="p-5 md:p-6 bg-citrus/10 border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex gap-4 items-start">
                  <div className="bg-black text-citrus p-2 md:p-3 rounded-xl md:rounded-2xl flex-shrink-0">
                    <Zap className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-[10px] md:text-xs tracking-widest mb-1 text-black">The ATH Mandate 🪄</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-600 leading-relaxed">We build decentralized tools that empower the top 1% of talent to solve the world's most complex technical roadblocks.</p>
                  </div>
                </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-2">
                <a 
                  href="https://athinnovations.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="tactile-btn px-8 md:px-10 py-4 md:py-5 bg-black text-white rounded-2xl font-black text-base md:text-lg uppercase tracking-widest flex items-center justify-center group w-full sm:w-auto"
                >
                  Visit ATHinnovations <ArrowUpRight className="ml-3 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                <div className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-black rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest w-full sm:w-auto">
                   <ShieldCheck className="w-4 h-4 text-coral fill-coral" /> Verified Ownership
                </div>
             </div>
          </div>

          {/* Right Visual Card */}
          <div className="relative group reveal mt-4 lg:mt-0">
            {/* Parent Company Visual Card */}
            <div className="absolute inset-0 bg-citrus/20 rounded-[3rem] md:rounded-[4rem] blur-[40px] md:blur-[60px] group-hover:bg-citrus/30 transition-all duration-500"></div>
            <div className="relative tactile-card p-6 sm:p-10 bg-white rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border-2 border-black">
               <div className="absolute -top-10 -right-10 w-32 md:w-48 h-32 md:h-48 bg-citrus/20 rounded-full animate-float"></div>
               
               <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12 relative z-10">
                  <div className="w-16 h-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-2xl md:rounded-3xl bg-black border-2 md:border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,95,95,1)] md:shadow-[6px_6px_0px_0px_rgba(255,95,95,1)]">
                     <img src="https://athinnovations.in/images/main-logo.svg" alt="ATH" className="w-8 md:w-12 invert" />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-coral mb-1">Parent Entity</p>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter">ATHinnovations</h3>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10 relative z-10">
                  <div className="p-4 md:p-5 bg-gray-50 border-2 border-black rounded-2xl">
                     <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2">Deployments</p>
                     <p className="text-xl md:text-2xl font-black">2 Systems Running</p>
                  </div>
                  <div className="p-4 md:p-5 bg-gray-50 border-2 border-black rounded-2xl">
                     <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2">Engineers</p>
                     <p className="text-xl md:text-2xl font-black">10 Super Humans</p>
                  </div>
               </div>

               <div className="space-y-3 md:space-y-4 opacity-80 font-bold text-gray-700 text-sm md:text-lg relative z-10">
                  <p className="flex items-center gap-2 md:gap-3">🪄 Architecture of Human Potential.</p>
                  <p className="flex items-center gap-2 md:gap-3">👀 Frictionless Code Extraction.</p>
                  <p className="flex items-center gap-2 md:gap-3">😁 Built with Passion & Logic.</p>
               </div>

               <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 relative z-10">
                  <span className="flex items-center gap-2"><Heart className="w-3 h-3 text-coral fill-coral" /> © 2024 ATHINNOVATIONS</span>
                  <Globe className="w-5 h-5 opacity-30 hidden sm:block" />
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Leadership;
