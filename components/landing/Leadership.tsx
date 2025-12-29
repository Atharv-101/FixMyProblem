
import React from 'react';
import { Globe, ArrowUpRight, Cpu, Zap, Star, ShieldCheck, Heart } from 'lucide-react';

const Leadership: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-10 bg-paper relative border-t-2 border-black overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-coral/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="space-y-6 lg:space-y-8 reveal">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em]">
                <Cpu className="w-4 h-4 text-citrus" /> The Core Protocol
             </div>
             
             <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-black tracking-tighter leading-[0.85]">
                FixMyProblem <br/> 
                <span className="text-coral italic underline decoration-citrus decoration-4 underline-offset-8">By ATHinnovations.</span>
             </h2>

             <div className="space-y-6">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                  FixMyProblem is a mission-critical infrastructure owned and operated by <span className="text-forest underline underline-offset-4">ATHinnovations</span> 👀. 
                  As the parent company and owner, ATHinnovations acts as the venture engine—providing capital, architecture, and high-stakes engineering rigor to the grid. 😁
                </p>
                
                <div className="p-6 bg-citrus/10 border-2 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex gap-4 items-start">
                  <div className="bg-black text-citrus p-3 rounded-2xl flex-shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-xs tracking-widest mb-1 text-black">The ATH Mandate 🪄</h4>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed">We build decentralized tools that empower the top 1% of talent to solve the world's most complex technical roadblocks.</p>
                  </div>
                </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <a 
                  href="https://athinnovations.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="tactile-btn px-10 py-5 bg-black text-white rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center group"
                >
                  Visit ATHinnovations <ArrowUpRight className="ml-3 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                <div className="flex items-center justify-center gap-4 px-6 py-4 bg-white border-2 border-black rounded-2xl font-black text-[10px] uppercase tracking-widest">
                   <ShieldCheck className="w-4 h-4 text-coral fill-coral" /> Verified Ownership
                </div>
             </div>
          </div>

          <div className="relative group reveal mt-12 lg:mt-0">
            {/* Parent Company Visual Card */}
            <div className="absolute inset-0 bg-citrus/20 rounded-[4rem] blur-[60px] group-hover:bg-citrus/30 transition-all duration-500"></div>
            <div className="relative tactile-card p-10 bg-white rounded-[3rem] lg:rounded-[4rem] overflow-hidden">
               <div className="absolute -top-10 -right-10 w-48 h-48 bg-citrus/20 rounded-full animate-float"></div>
               
               <div className="flex items-center gap-6 mb-12">
                  <div className="w-20 lg:w-24 h-20 lg:h-24 rounded-3xl bg-black border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(255,95,95,1)]">
                     <img src="hhttps://athinnovations.in/images/main-logo.svg$0" alt="ATH" className="w-10 lg:w-12 invert" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-coral mb-1">Parent Entity</p>
                    <h3 className="text-4xl font-black tracking-tighter">ATHinnovations</h3>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="p-5 bg-gray-50 border-2 border-black rounded-2xl">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Deployments</p>
                     <p className="text-2xl font-black">24+ Systems</p>
                  </div>
                  <div className="p-5 bg-gray-50 border-2 border-black rounded-2xl">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Engineers</p>
                     <p className="text-2xl font-black">12k+ Active</p>
                  </div>
               </div>

               <div className="space-y-4 opacity-80 font-bold text-gray-700 text-lg">
                  <p className="flex items-center gap-3">🪄 Architecture of Human Potential.</p>
                  <p className="flex items-center gap-3">👀 Frictionless Code Extraction.</p>
                  <p className="flex items-center gap-3">😁 Built with Passion & Logic.</p>
               </div>

               <div className="mt-12 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  <span className="flex items-center gap-2"><Heart className="w-3 h-3 text-coral fill-coral" /> © 2024 ATHINNOVATIONS</span>
                  <Globe className="w-5 h-5 opacity-30" />
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Leadership;
