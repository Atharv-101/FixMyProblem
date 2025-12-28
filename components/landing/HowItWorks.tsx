
import React from 'react';
import { UserRole } from '../../types';
import { Search, Code2, Rocket, ArrowRight, Cpu, Zap, Lock } from 'lucide-react';

interface HowItWorksProps {
  onLoginClick: (role: UserRole) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onLoginClick }) => {
  const steps = [
    { 
      icon: Search, 
      title: 'Submit Brief', 
      desc: 'Define your roadblock. Use our AI tools to refine the requirements and set a bounty.',
      bg: 'bg-white',
      accent: 'text-coral',
      tag: '01'
    },
    { 
      icon: Code2, 
      title: 'Global Bidding', 
      desc: 'Top student minds submit execution plans. You pick the best fit based on rank and history.',
      bg: 'bg-citrus',
      accent: 'text-forest',
      tag: '02'
    },
    { 
      icon: Rocket, 
      title: 'Verified Fix', 
      desc: 'Audit the solution, merge to production, and release payment via our secure escrow.',
      bg: 'bg-forest',
      accent: 'text-citrus',
      text: 'text-white',
      tag: '03'
    }
  ];

  return (
    <section id="how-it-works" className="py-12 md:py-20 px-4 md:px-10 relative border-t-2 border-black bg-paper overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none hidden lg:block">
        <Cpu className="w-[300px] h-[300px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 md:mb-16 text-center reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-forest text-citrus rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3 fill-citrus" /> The Execution Protocol
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-black tracking-tighter mb-4 leading-none">
            How it <span className="marker-highlight text-coral italic">Works.</span>
          </h2>
          <p className="text-sm md:text-lg text-gray-500 font-bold uppercase tracking-[0.3em]">Optimized Meritocratic Workflow 😁</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className={`group relative p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] tactile-card transition-all duration-300 ${step.bg} ${step.text || 'text-black'}`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border-2 md:border-4 border-black flex items-center justify-center text-black mb-6 md:mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:rotate-6`}>
                <step.icon className={`w-7 h-7 md:w-8 md:h-8 ${step.accent}`} />
              </div>
              
              <span className={`absolute top-6 right-8 text-4xl md:text-5xl font-black opacity-[0.05] ${step.text ? 'text-white' : 'text-black'}`}>
                {step.tag}
              </span>

              <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 leading-tight">{step.title}</h3>
              <p className="text-sm md:text-base font-bold opacity-70 leading-relaxed mb-8 md:mb-10">
                {step.desc}
              </p>
              
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 group-hover:text-coral transition-all">
                <Lock className="w-3.5 h-3.5" /> Secure Pipeline 🪄
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
           <button 
             onClick={() => onLoginClick(UserRole.COMPANY)}
             className="tactile-btn px-10 md:px-12 py-5 md:py-6 bg-black text-white rounded-2xl font-black text-lg md:text-xl uppercase tracking-widest hover:bg-forest transition-all"
           >
             Initialize Project 👀
           </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
