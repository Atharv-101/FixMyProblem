
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, User } from '../types.ts';
import { Search, Users, GraduationCap, Building2, Star, CheckCircle2, Terminal, Zap, Globe, Github, Linkedin } from 'lucide-react';
import ProfileCard from '../components/ProfileCard.tsx';

interface UsersDirectoryProps {
  onProfileClick: (id: string) => void;
}

const UsersDirectory: React.FC<UsersDirectoryProps> = ({ onProfileClick }) => {
  const { allUsers } = useStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileCard, setShowProfileCard] = useState<string | null>(null);
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    return allUsers
      .filter(u => u.role === selectedRole)
      .filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (u.university && u.university.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [allUsers, selectedRole, searchQuery]);

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
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
        <Users className="w-[600px] h-[600px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 border-citrus shadow-[4px_4px_0px_0px_rgba(255,95,95,1)] mb-6">
            <Zap className="w-3.5 h-3.5 text-citrus fill-citrus animate-pulse" />
            Grid Protocol: Entity Discovery
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter leading-none italic underline decoration-coral decoration-8 underline-offset-8">
            The Directory.
          </h1>
          <p className="mt-10 text-xl md:text-2xl font-bold text-gray-500 max-w-2xl mx-auto">
            Explore the <span className="text-black font-black">active nodes</span> of the grid. Connect with top solvers and industry architects. 😁
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center reveal">
          <div className="flex bg-white p-2 rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full md:w-auto">
            <button 
              onClick={() => setSelectedRole(UserRole.STUDENT)}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedRole === UserRole.STUDENT ? 'bg-black text-white' : 'hover:bg-citrus/10'}`}
            >
              <GraduationCap className="w-4 h-4" /> Solvers
            </button>
            <button 
              onClick={() => setSelectedRole(UserRole.COMPANY)}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedRole === UserRole.COMPANY ? 'bg-black text-white' : 'hover:bg-citrus/10'}`}
            >
              <Building2 className="w-4 h-4" /> Companies
            </button>
          </div>

          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-coral transition-colors" />
            <input 
              type="text" 
              placeholder={`Search for ${selectedRole === UserRole.STUDENT ? 'solvers, universities...' : 'companies, entities...'}`} 
              className="w-full pl-16 pr-8 py-5 rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1 outline-none transition-all text-lg font-bold placeholder:text-gray-300 bg-white" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 reveal-zoom">
          {filteredUsers.map((u, idx) => (
            <div 
              key={u.id} 
              onClick={() => onProfileClick(u.id)}
              onMouseEnter={() => handleProfileHover(u)}
              onMouseLeave={handleProfileLeave}
              className={`tactile-card p-8 rounded-[2.5rem] bg-white cursor-pointer group flex flex-col items-center text-center relative transition-all duration-300 hover:bg-paper ${idx % 2 === 0 ? 'rotate-[0.5deg]' : 'rotate-[-0.5deg]'} hover:rotate-0`}
            >
              <div className="sticker-tape opacity-20"></div>
              
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-citrus border-4 border-black mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden group-hover:rotate-6 transition-transform">
                {u.profilePicUrl ? (
                  <img src={u.profilePicUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black text-black">
                    {u.name.charAt(0)}
                  </div>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-black text-black tracking-tighter leading-tight mb-2 group-hover:text-coral transition-colors">{u.name}</h3>
              
              <div className="flex items-center gap-2 mb-6">
                {selectedRole === UserRole.STUDENT ? (
                  <>
                    <GraduationCap className="w-4 h-4 text-forest" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{u.university || 'Academic Node'}</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 text-coral" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{u.companyName || 'Verified Entity'}</span>
                  </>
                )}
              </div>

              {selectedRole === UserRole.STUDENT && (
                <div className="w-full flex justify-around py-4 border-t border-black/5">
                   <div>
                     <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Rank</p>
                     <p className="text-lg font-black text-forest flex items-center justify-center">{u.rating?.toFixed(1) || '0.0'} <Star className="w-3 h-3 ml-1 fill-forest" /></p>
                   </div>
                   <div>
                     <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Solves</p>
                     <p className="text-lg font-black text-black">{(u.solvedCount || 0) + (u.simSolvedCount || 0)}</p>
                   </div>
                </div>
              )}

              {selectedRole === UserRole.COMPANY && (
                <div className="w-full pt-4 border-t border-black/5 flex flex-col gap-3">
                   <p className="text-[10px] font-bold text-gray-500 italic leading-relaxed">"Infrastructure for complex extraction protocols."</p>
                   <div className="flex justify-center gap-4">
                      {u.github && <Github className="w-5 h-5 text-gray-300" />}
                      {u.linkedin && <Linkedin className="w-5 h-5 text-gray-300" />}
                      {u.websiteUrl && <Globe className="w-5 h-5 text-gray-300" />}
                   </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-black/5 w-full flex justify-center">
                 <button className="text-[9px] font-black uppercase tracking-[0.3em] text-coral flex items-center gap-2 group-hover:underline">
                    View Dossier <CheckCircle2 className="w-3 h-3" />
                 </button>
              </div>

              {showProfileCard === u.id && hoveredUser && (
                <ProfileCard user={hoveredUser} onClose={handleProfileLeave} positionClasses="top-full left-0 mt-4" />
              )}
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-32 tactile-card border-dashed bg-white/50 rounded-[3rem] mx-10 my-10">
            <Terminal className="w-20 h-20 text-gray-200 mx-auto mb-6 animate-pulse" />
            <p className="text-gray-400 text-2xl font-black uppercase tracking-widest">No matching nodes detected...</p>
            <button onClick={() => setSearchQuery('')} className="mt-6 text-coral font-black underline decoration-citrus decoration-4 underline-offset-8">Reset Scan</button>
          </div>
        )}
        
        <div className="mt-20 p-12 bg-black text-white rounded-[4rem] flex flex-col md:flex-row items-center gap-10 reveal">
          <div className="w-24 h-24 bg-forest text-citrus rounded-[2rem] border-4 border-white flex items-center justify-center shrink-0 shadow-[6px_6px_0px_0px_rgba(253,224,71,1)] animate-float">
             <Globe className="w-12 h-12" />
          </div>
          <div>
            <h4 className="text-3xl font-black tracking-tighter mb-4 italic">Collaborate or Compete. 😁</h4>
            <p className="text-gray-400 font-bold text-lg leading-relaxed">The directory is the pulse of our ecosystem. Find the perfect talent for your technical mission or find peers to tackle the grid's toughest roadblocks. Every node is verified. 🪄</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersDirectory;
