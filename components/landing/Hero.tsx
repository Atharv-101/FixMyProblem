
import React, { useState, useEffect } from 'react';
import { Terminal, MoveRight, Star, Zap, Activity, IndianRupee, ArrowRight, Users, Building2, Globe, LayoutDashboard, Sparkles } from 'lucide-react';
import { UserRole } from '../../types.ts';
import { getLiveInsights } from '../../services/geminiService.ts';
import { useStore } from '../../context/Store.tsx';

interface HeroProps {
  onLoginClick: (role: UserRole, isLogin?: boolean) => void;
  stats: any;
}

const Hero: React.FC<HeroProps> = ({ onLoginClick, stats }) => {
  const { user } = useStore();
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

  const handleDashboardRedirect = () => {
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'DASHBOARD' }));
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen pt-40 md:pt-44 pb-16 px-4 md:px-10 overflow-hidden flex items-center bg-transparent">
      <div 
        className="absolute top-1/4 left-1/4 w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] bg-coral/5 rounded-full blur-[100px] pointer-events-none transition-transform duration-1000 ease-out hidden sm:block"
        style={{ transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)` }}
      />
      
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        
        <div className="relative text-center lg:text-left space-y-6 sm:space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[3px_3px_0px_0px_rgba(253,224,71,1)]">
             <Zap className="w-3 h-3 text-citrus fill-citrus animate-pulse" />
             Protocol: Active Grid
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-black leading-[1] sm:leading-[0.9] tracking-tighter">
              Fix your <br/>
              <span className="text-forest italic relative inline-block">
                roadblocks
                <div className="absolute -right-10 -top-6 w-12 h-12 bg-citrus rounded-full border-2 border-black flex items-center justify-center -rotate-12 animate-bounce hidden sm:flex">
                  <Star className="w-6 h-6 fill-black" />
                </div>
              </span> <br/>
              instantly.
            </h1>
          </div>

          <p className="text-sm sm:text-lg md:text-xl text-gray-500 max-w-lg mx-auto lg:ml-0 font-bold leading-relaxed opacity-80">
            The secure marketplace for companies to offload engineering hurdles to the top 1% of student talent.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-6 pt-4">
            {user ? (
              <button 
                onClick={handleDashboardRedirect}
                className="tactile-btn px-10 py-6 bg-black text-white rounded-2xl font-black text-2xl flex items-center justify-center group shadow-[8px_8px_0px_0px_rgba(253,224,71,1)] hover:bg-forest transition-all"
              >
                Go to Dashboard <LayoutDashboard className="ml-4 w-7 h-7 text-citrus group-hover:rotate-12 transition-transform" />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onLoginClick(UserRole.STUDENT, false)}
                  className="tactile-btn px-8 sm:px-10 py-5 bg-coral text-white rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center group"
                >
                  Register <MoveRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                <button 
                  onClick={() => onLoginClick(UserRole.COMPANY, false)}
                  className="tactile-btn px-8 sm:px-10 py-5 bg-white text-black border-2 border-black rounded-2xl font-black text-lg sm:text-xl hover:bg-citrus transition-colors"
                >
                  Hire Talent
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-black bg-white overflow-hidden shadow-md">
                  <img src={`https://i.pravatar.cc/100?u=h${i + 20}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex text-citrus fill-citrus mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-400">
                <span className="text-black font-black">{stats.totalProblems || '0'}</span> Tasks Audited
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full flex items-center justify-center group h-auto">
          <div 
            className="relative w-full max-w-sm sm:max-w-md transition-transform duration-700 ease-out"
            style={{ transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)` }}
          >
            <div className="tactile-card rounded-[2.5rem] rotate-[-2deg] z-30 animate-float bg-white p-6 sm:p-10 flex flex-col min-h-[400px] justify-between">
               <div className="sticker-tape opacity-30"></div>
               
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl sm:text-3xl font-black text-black tracking-tighter">Grid Metrics.</h3>
                  <div className="w-10 h-10 bg-coral/10 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-coral animate-pulse" />
                  </div>
               </div>
               
               <div className="space-y-4 sm:space-y-6 flex-grow">
                  <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-paper rounded-2xl border-2 border-black/5 hover:border-citrus transition-colors group/item">
                     <div className="w-14 h-14 sm:w-16 sm:h-16 bg-citrus rounded-2xl flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 group-hover/item:rotate-6 transition-transform">
                        <Users className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
                     </div>
                     <div>
                        <p className="text-[9px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Total Students</p>
                        <p className="text-3xl sm:text-5xl font-black text-black leading-none">{stats.totalStudents || 0}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-paper rounded-2xl border-2 border-black/5 hover:border-forest/20 transition-colors group/item">
                     <div className="w-14 h-14 sm:w-16 sm:h-16 bg-forest rounded-2xl flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 group-hover/item:-rotate-6 transition-transform">
                        <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-citrus" />
                     </div>
                     <div>
                        <p className="text-[9px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Total Companies</p>
                        <p className="text-3xl sm:text-5xl font-black text-black leading-none">{stats.totalCompanies || 0}</p>
                     </div>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase text-forest tracking-widest">Live Sync Operational</span>
                  </div>
                  <div className="text-[9px] font-black uppercase text-gray-300 tracking-[0.2em] hidden sm:block">STATUS: VERIFIED</div>
               </div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-36 sm:w-52 bg-black text-citrus tactile-card p-4 sm:p-6 rounded-2xl rotate-[6deg] z-40 hidden md:block animate-float [animation-delay:2s]">
               <div className="font-mono text-[9px] sm:text-[10px] space-y-2">
                  <div className="flex items-center justify-between text-coral">
                    <Activity className="w-3 h-3"/> 
                    <span className="font-black">SYNC_LIVE</span>
                  </div>
                  <p className="text-white/40 border-t border-white/10 pt-2">Processing nodes...</p>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-citrus w-2/3 animate-pulse"></div>
                  </div>
                  <p className="text-[8px] text-white/20">Ref: ATH-992-GRID</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full py-3 bg-black border-t-2 border-black overflow-hidden whitespace-nowrap z-20">
         <div className="inline-block animate-[scroll_50s_linear_infinite] uppercase text-[9px] sm:text-[10px] font-black tracking-[0.3em] text-white">
            {liveInsights.map((insight, i) => (
              <span key={i} className="mx-8 sm:mx-12">
                <span className="text-citrus">Live Grid:</span> {insight} • 
              </span>
            ))}
            {liveInsights.map((insight, i) => (
              <span key={`dup-${i}`} className="mx-8 sm:mx-12">
                <span className="text-citrus">Live Grid:</span> {insight} • 
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
