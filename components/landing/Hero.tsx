
import React, { useState, useEffect } from 'react';
import { Terminal, MoveRight, Star, Zap, Activity, IndianRupee, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types.ts';
import { getLiveInsights } from '../../services/geminiService.ts';

interface HeroProps {
  onLoginClick: (role: UserRole) => void;
  stats: any;
}

const Hero: React.FC<HeroProps> = ({ onLoginClick }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [liveInsights, setLiveInsights] = useState<string[]>([]);

  useEffect(() => {
    const fetchInsights = async () => {
      const data = await getLiveInsights();
      setLiveInsights(data);
    };
    fetchInsights();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen pt-44 pb-16 px-4 md:px-10 overflow-hidden flex items-center bg-transparent">
      {/* Dynamic Background Elements */}
      <div 
        className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-coral/10 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 ease-out hidden sm:block"
        style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
      />
      
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Content */}
        <div className="relative text-center lg:text-left space-y-8 lg:space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] animate-scale-in">
             <Zap className="w-3.5 h-3.5 text-citrus fill-citrus animate-pulse" />
             Protocol: Active Grid
          </div>
          
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-extrabold text-black leading-[0.9] tracking-tighter">
              Fix your <br/>
              <span className="marker-highlight text-forest italic relative">
                roadblocks
                <div className="absolute -right-6 lg:-right-12 -top-4 w-10 lg:w-12 h-10 lg:h-12 bg-citrus rounded-full border-2 border-black flex items-center justify-center -rotate-12 animate-bounce hidden sm:flex">
                  <Star className="w-5 lg:w-6 h-5 lg:h-6 fill-black" />
                </div>
              </span> <br/>
              instantly.
            </h1>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-lg mx-auto lg:ml-0 font-medium leading-relaxed animate-slide-up [animation-delay:200ms]">
            The secure marketplace for companies to offload engineering hurdles to the top 1% of student talent.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 lg:gap-6 animate-slide-up [animation-delay:400ms]">
            <button 
              onClick={() => onLoginClick(UserRole.COMPANY)}
              className="tactile-btn group px-8 lg:px-12 py-5 lg:py-6 bg-coral text-white rounded-2xl font-black text-xl lg:text-2xl flex items-center justify-center transition-all overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center">
                Hire Solvers <MoveRight className="ml-3 w-6 h-6 group-hover:translate-x-3 transition-transform duration-500" />
              </span>
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button 
              onClick={() => onLoginClick(UserRole.STUDENT)}
              className="tactile-btn px-8 lg:px-12 py-5 lg:py-6 bg-white text-black border-2 border-black rounded-2xl font-black text-xl lg:text-2xl hover:bg-citrus transition-colors"
            >
              Solve & Earn
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6 animate-slide-up [animation-delay:600ms]">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl border-2 border-black bg-white overflow-hidden shadow-md">
                  <img src={`https://i.pravatar.cc/150?u=h${i + 20}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-left bg-paper/80 backdrop-blur-md px-4 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex text-citrus fill-citrus mb-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-400">
                <span className="text-black">100+</span> Problems Fixed
              </p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="relative h-[450px] lg:h-[700px] w-full flex items-center justify-center group">
          <div 
            className="relative w-full h-full max-w-sm lg:max-w-md transition-transform duration-700 ease-out preserve-3d scale-[0.85] lg:scale-100"
            style={{ transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0) rotateY(${mousePos.x * 0.1}deg) rotateX(${mousePos.y * -0.1}deg)` }}
          >
            {/* Main Note Card */}
            <div className="absolute top-[5%] left-0 w-full tactile-card rounded-[2.5rem] lg:rounded-[3rem] rotate-[-2deg] z-30 animate-float shadow-2xl transition-transform duration-700">
               <div className="sticker-tape"></div>
               <div className="p-1.5 bg-black rounded-t-[2.5rem] lg:rounded-t-[3rem] overflow-hidden relative">
                  <div className="h-1 w-full bg-citrus/20 absolute bottom-0 left-0">
                    <div className="h-full bg-citrus w-1/3 animate-scan"></div>
                  </div>
               </div>
               <div className="p-8 lg:p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="relative">
                      <div className="w-20 lg:w-24 h-20 lg:h-24 rounded-[1.5rem] lg:rounded-[2rem] bg-gray-100 border-4 border-black overflow-hidden shadow-[5px_5px_0px_0px_rgba(255,95,95,1)]">
                         <img src="https://github.com/Atharv-101/FixMyProblem/blob/main/assets/img/atharvv.jpeg" className="w-full h-full object-cover grayscale" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-forest text-citrus rounded-lg border-2 border-black flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="bg-forest text-citrus text-[8px] font-black px-3 py-1.5 uppercase tracking-widest rounded-full mb-3 border border-black">Tier: SSS+</div>
                       <p className="text-2xl lg:text-3xl font-black text-black leading-none">Atharv Gangarde</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">MCOERC, Nashik</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                     <div className="flex justify-between items-end border-b border-black/5 pb-3">
                        <div>
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Payouts</p>
                          <p className="text-xl lg:text-2xl font-black text-forest">₹1,xxxx..</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Score</p>
                           <p className="text-xl lg:text-2xl font-black text-coral">9.98</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Floating Terminal */}
            <div 
              className="absolute bottom-6 -right-4 w-60 bg-black text-citrus tactile-card p-6 rounded-[2rem] rotate-[4deg] z-40 hidden sm:block animate-float [animation-delay:2s]"
            >
               <div className="flex items-center gap-2 mb-4 border-b border-citrus/20 pb-3">
                  <Terminal className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Live_Grid</span>
               </div>
               <div className="font-mono text-[9px] space-y-2 opacity-90">
                  <p className="text-coral flex items-center gap-1"><ArrowRight className="w-2.5 h-2.5"/> Bounty: ₹45k</p>
                  <p className="text-green-400 flex items-center gap-1"><ArrowRight className="w-2.5 h-2.5"/> Accepted: SP_2</p>
                  <p className="text-white/60 flex items-center gap-1"><ArrowRight className="w-2.5 h-2.5"/> Synced...</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker Section */}
      <div className="absolute bottom-0 left-0 w-full py-3 bg-black border-t-2 border-black overflow-hidden whitespace-nowrap z-20">
         <div className="inline-block animate-[scroll_45s_linear_infinite] uppercase text-[9px] lg:text-[10px] font-black tracking-[0.3em] text-white">
            {liveInsights.map((insight, i) => (
              <span key={i} className="mx-8 lg:mx-12">
                <span className="text-citrus">Live Insight:</span> {insight} • 
              </span>
            ))}
            {/* Duplicated for smooth loop */}
            {liveInsights.map((insight, i) => (
              <span key={`dup-${i}`} className="mx-8 lg:mx-12">
                <span className="text-citrus">Live Insight:</span> {insight} • 
              </span>
            ))}
         </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
