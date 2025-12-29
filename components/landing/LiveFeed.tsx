import React from 'react';
import { Activity, ArrowUpRight, Cpu, IndianRupee, Tag, Clock } from 'lucide-react';
import { Problem, User } from '../../types';
import ProfileCard from '../ProfileCard';

interface LiveFeedProps {
  problems: Problem[];
  allUsers: User[];
  onViewChange: (view: any) => void;
  onProblemClick: (prob: Problem) => void;
  onProfileHover: (userId: string) => void;
  onProfileLeave: () => void;
  showProfileCard: string | null;
  hoveredUser: User | null;
  // Added onProfileClick prop
  onProfileClick: (id: string) => void;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ 
  problems, allUsers, onViewChange, onProblemClick, 
  onProfileHover, onProfileLeave, showProfileCard, hoveredUser,
  onProfileClick
}) => {
  return (
    <section className="py-24 px-4 md:px-10 bg-transparent relative border-t-2 border-black reveal">
       <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
             <div className="text-left">
               <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-4">
                  The <span className="text-coral">Vault</span> Protocol.
               </h2>
               <p className="text-lg text-gray-500 font-bold uppercase tracking-widest">Active System Roadblocks</p>
             </div>
             <button 
                onClick={() => onViewChange('DASHBOARD')} 
                className="tactile-btn px-8 py-3 bg-black text-white rounded-xl font-black text-sm flex items-center group"
             >
                View Grid <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {problems.slice(0, 6).map((prob, idx) => (
              <div 
                key={prob.id} 
                onClick={() => onProblemClick(prob)}
                className={`tactile-card p-8 rounded-2xl cursor-pointer group transition-all duration-300 ${idx % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'} hover:rotate-0`}
              >
                <div className="sticker-tape opacity-20 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-8">
                  <div 
                    className="flex items-center relative"
                    onMouseEnter={() => onProfileHover(prob.companyId)}
                    onMouseLeave={onProfileLeave}
                    onClick={(e) => { e.stopPropagation(); onProfileClick(prob.companyId); }}
                  >
                     <div className="w-10 h-10 rounded-xl bg-gray-50 border-2 border-black flex items-center justify-center mr-3 font-black text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {prob.companyName.charAt(0)}
                     </div>
                     <span className="text-black text-xs font-black uppercase tracking-widest hover:text-coral transition-colors">{prob.companyName}</span>
                     {showProfileCard === prob.companyId && hoveredUser && <ProfileCard user={hoveredUser} onClose={onProfileLeave} positionClasses="top-full left-0 mt-2" />}
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bounty</p>
                     <div className="flex items-center font-black text-forest text-xl">
                        <IndianRupee className="w-4 h-4" />
                        {prob.bounty.replace(/[^\d]/g, '')}
                     </div>
                  </div>
                </div>

                <h3 className="font-black text-2xl text-black mb-4 leading-tight group-hover:text-coral transition-colors line-clamp-2">
                  {prob.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
                  {prob.description}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-6 border-t border-black/5 mt-auto">
                   {prob.tags.slice(0, 3).map(t => (
                      <span key={t} className="text-[9px] font-black uppercase tracking-[0.2em] bg-citrus/20 border border-citrus px-2 py-1 rounded">
                         {t}
                      </span>
                   ))}
                   <div className="ml-auto text-gray-300">
                      <Clock className="w-4 h-4" />
                   </div>
                </div>
              </div>
            ))}
            
            {problems.length === 0 && (
                <div className="col-span-full text-center py-32 tactile-card border-dashed bg-white/50 rounded-3xl">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Cpu className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-xl font-black uppercase tracking-widest">Awaiting Fresh Challenges...</p>
                    <button onClick={() => onViewChange('AUTH')} className="mt-8 text-coral font-black underline decoration-citrus decoration-4 underline-offset-4">Deploy Yours Now</button>
                </div>
            )}
          </div>
       </div>
    </section>
  );
};

export default LiveFeed;