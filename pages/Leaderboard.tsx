
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, User, SkillLevel } from '../types.ts';
import { Trophy, Star, Zap, Flame, Terminal, Cpu, Info, Target, Filter, ChevronDown } from 'lucide-react';
import ProfileCard from '../components/ProfileCard.tsx';

interface LeaderboardProps {
  onProfileClick: (id: string) => void;
}

const SkillBadge: React.FC<{ level: SkillLevel }> = ({ level }) => {
    const colors = {
        'Advanced': 'bg-forest text-citrus',
        'Intermediate': 'bg-black text-white',
        'Junior': 'bg-citrus text-black',
        'Beginner': 'bg-gray-100 text-gray-500'
    };
    return (
        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-black/10 ${colors[level]}`}>
            {level}
        </span>
    );
};

const Leaderboard: React.FC<LeaderboardProps> = ({ onProfileClick }) => {
  const { allUsers } = useStore();
  const [filterStack, setFilterStack] = useState<string>('Global');

  const students = useMemo(() => {
    return allUsers
      .filter(u => u.role === UserRole.STUDENT)
      .filter(u => filterStack === 'Global' || (u.skills && u.skills.includes(filterStack)))
      .sort((a, b) => (b.leaderboardScore || 0) - (a.leaderboardScore || 0));
  }, [allUsers, filterStack]);

  const uniqueStacks = useMemo(() => {
    const stacks = new Set<string>(['Global']);
    allUsers.forEach(u => u.skills?.forEach(s => stacks.add(s)));
    return Array.from(stacks);
  }, [allUsers]);

  const [showProfileCard, setShowProfileCard] = useState<string | null>(null);
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);

  const handleProfileHover = (user: User) => {
    setHoveredUser(user);
    setShowProfileCard(user.id);
  };

  const handleProfileLeave = () => {
    setShowProfileCard(null);
    setHoveredUser(null);
  };

  return (
      <div className="min-h-screen bg-paper pt-32 px-4 md:px-10 pb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
            <Trophy className="w-[600px] h-[600px]" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-16 reveal">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 border-citrus shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] mb-6">
                      <Zap className="w-3.5 h-3.5 text-citrus fill-citrus animate-pulse" />
                      Protocol: Meritocratic Rankings
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter leading-none italic underline decoration-coral decoration-8 underline-offset-8">
                    The Grid.
                  </h1>
                  <p className="mt-10 text-xl md:text-2xl font-bold text-gray-500 max-w-2xl mx-auto">
                    Global ranking engine based on <span className="text-black font-black">Proof-of-Logic</span> formula. 😁
                  </p>
              </div>

              {/* Filters */}
              <div className="mb-10 flex flex-wrap gap-4 items-center justify-center">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <Filter className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase">Stack:</span>
                      <select 
                        value={filterStack} 
                        onChange={(e) => setFilterStack(e.target.value)}
                        className="bg-transparent text-xs font-black uppercase outline-none"
                      >
                          {uniqueStacks.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                  </div>
                  <div className="p-4 bg-citrus/10 border border-citrus/20 rounded-xl flex items-center gap-3">
                      <Info className="w-4 h-4 text-citrus" />
                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                        Score = (Verified * 10) + (AvgLast10 * 2) + Badges - Penalties
                      </p>
                  </div>
              </div>

              <div className="tactile-card bg-white rounded-[3rem] border-4 border-black overflow-hidden reveal-zoom shadow-2xl">
                  {students.map((s, i) => {
                      const isTop3 = i < 3;
                      
                      return (
                      <div 
                        key={s.id} 
                        className={`flex flex-col md:flex-row items-center p-6 md:p-10 border-b-2 border-black/5 hover:bg-citrus/5 transition-all group ${i === 0 ? 'bg-citrus/5' : ''}`}
                      >
                          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 shrink-0 mb-4 md:mb-0">
                              {i === 0 ? <Flame className="w-8 h-8 md:w-10 md:h-10 text-coral animate-bounce" /> : (
                                  <span className={`text-2xl md:text-4xl font-black ${isTop3 ? 'text-black' : 'text-gray-300'}`}>
                                    {i < 9 ? `0${i+1}` : i+1}.
                                  </span>
                              )}
                          </div>

                          <div 
                            className="flex-1 md:ml-6 flex flex-col md:flex-row items-center text-center md:text-left relative group/info cursor-pointer"
                            onMouseEnter={() => handleProfileHover(s)}
                            onMouseLeave={handleProfileLeave}
                            onClick={() => onProfileClick(s.id)}
                          >
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] border-4 border-black bg-white overflow-hidden shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-3 transition-transform relative mb-4 md:mb-0">
                                {s.profilePicUrl ? (
                                    <img src={s.profilePicUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-black text-3xl text-gray-300">
                                        {s.name.charAt(0)}
                                    </div>
                                )}
                              </div>
                              
                              <div className="md:ml-6 space-y-2">
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <h3 className="font-black text-2xl md:text-3xl text-black leading-none group-hover:text-coral transition-colors">{s.name}</h3>
                                    <SkillBadge level={s.skillLevel || 'Beginner'} />
                                </div>
                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Node: {s.university || 'Academic Grid'}</p>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    {s.badges?.slice(0, 4).map(b => (
                                        <span key={b.id} title={b.name} className="text-xl cursor-help hover:scale-125 transition-transform">{b.icon}</span>
                                    ))}
                                </div>
                              </div>
                              {showProfileCard === s.id && hoveredUser && <ProfileCard user={hoveredUser} onClose={handleProfileLeave} positionClasses="bottom-full left-0 mb-4" />}
                          </div>

                          <div className="flex gap-6 mt-6 md:mt-0 items-center">
                              <div className="text-center bg-paper border-2 border-black p-4 rounded-2xl min-w-[100px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                  <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1 leading-none">Verifications</p>
                                  <div className="font-black text-2xl md:text-3xl leading-none text-forest">{(s.simSolvedCount || 0) + (s.solvedCount || 0)}</div>
                              </div>
                              <div className="text-right min-w-[120px]">
                                  <div className="font-black text-black text-3xl md:text-5xl tracking-tighter leading-none">
                                    {Math.floor(s.leaderboardScore || 0)}
                                  </div>
                                  <p className="text-[8px] font-black uppercase text-coral tracking-widest mt-2">Grid Rank Score</p>
                              </div>
                          </div>
                      </div>
                  )})}
                  
                  {students.length === 0 && (
                      <div className="text-center py-32 tactile-card border-dashed bg-white/50 rounded-3xl mx-10 my-10">
                          <Terminal className="w-20 h-20 text-gray-200 mx-auto mb-6 animate-pulse" />
                          <p className="text-gray-400 text-2xl font-black uppercase tracking-widest">Awaiting Extraction Data...</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );
}

export default Leaderboard;
