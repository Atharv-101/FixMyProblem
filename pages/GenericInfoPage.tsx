
import React from 'react';
import { ArrowLeft, Terminal, Cpu, Zap, Globe, Shield, Sparkles } from 'lucide-react';

interface GenericInfoPageProps {
  title: string;
  category: string;
  description?: string;
  onBack: () => void;
}

const GenericInfoPage: React.FC<GenericInfoPageProps> = ({ title, category, description, onBack }) => {
  return (
    <div className="min-h-screen bg-paper pt-32 px-6 md:px-10 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
        <Cpu className="w-[600px] h-[600px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="tactile-btn mb-12 px-6 py-3 bg-white border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Grid
        </button>

        <div className="space-y-10 reveal">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 border-citrus shadow-[4px_4px_0px_0px_rgba(255,95,95,1)]">
               <Zap className="w-3.5 h-3.5 text-citrus fill-citrus" />
               Category: {category}
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter leading-none italic underline decoration-citrus decoration-8 underline-offset-8">
              {title}.
            </h1>
          </div>

          <div className="tactile-card p-10 md:p-16 bg-white rounded-[3rem] border-2 border-black space-y-10">
            <div className="space-y-6 text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
               {description ? (
                 <p>{description}</p>
               ) : (
                 <>
                   <p>
                     Welcome to the <span className="text-forest underline underline-offset-4">{title}</span> node of our global protocol. We are currently scaling our infrastructure to provide a fully decentralized experience for this specific sector. 😁
                   </p>
                   <p>
                     As part of the <span className="text-coral">FixMyProblem</span> mission by <span className="text-black font-black">ATHinnovations</span>, this section aims to bridge the gap between complex engineering needs and the world's brightest student solvers. 🪄
                   </p>
                 </>
               )}
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-10 border-t-2 border-black/5">
               <div className="p-6 bg-gray-50 border-2 border-black rounded-2xl">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-citrus mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-lg mb-2 uppercase tracking-tighter">Verified Protocol</h4>
                  <p className="text-xs font-bold text-gray-500 leading-relaxed">All operations within this module are protected by our end-to-end encryption and identity verification systems. 👀</p>
               </div>
               <div className="p-6 bg-citrus/10 border-2 border-black rounded-2xl">
                  <div className="w-12 h-12 bg-coral rounded-xl flex items-center justify-center text-white mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-lg mb-2 uppercase tracking-tighter">Global Accessibility</h4>
                  <p className="text-xs font-bold text-gray-500 leading-relaxed">Connecting thousands of nodes across 50+ countries. The grid never sleeps, and neither does our commitment to quality. 😁</p>
               </div>
            </div>

            <div className="pt-8 flex flex-col items-center justify-center text-center space-y-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-paper border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles className="w-4 h-4 text-citrus fill-citrus" /> Active System Roadblocks: 12
               </div>
               <p className="text-gray-400 font-bold text-sm italic">Status: Deploying Assets...</p>
            </div>
          </div>
          
          <div className="flex justify-center pt-8">
             <div className="w-1 h-1 bg-black rounded-full mx-1"></div>
             <div className="w-1 h-1 bg-black rounded-full mx-1"></div>
             <div className="w-1 h-1 bg-black rounded-full mx-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericInfoPage;
