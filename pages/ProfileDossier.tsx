
import React, { useEffect, useState } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, User } from '../types.ts';
import { 
  ArrowLeft, Terminal, Shield, GraduationCap, Building2, MapPin, 
  Linkedin, Github, Globe, Star, Zap, Briefcase, Calendar, 
  CheckCircle2, IndianRupee, Activity, Mail, Loader2, ShieldCheck, Award, Flame, Edit2
} from 'lucide-react';
import ProfileEditModal from '../components/ProfileEditModal.tsx';

interface ProfileDossierProps {
  userId?: string; // Optional if using username slug
  onBack: () => void;
}

const ProfileDossier: React.FC<ProfileDossierProps> = ({ userId, onBack }) => {
  const { user, allUsers, problems, fetchSingleUser, fetchUserByUsername } = useStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  useEffect(() => {
    const loadProfile = async () => {
      // Logic to detect if we have ID or need to check URL for username slug
      const path = window.location.pathname;
      const usernameFromUrl = path.startsWith('/u/') ? path.split('/u/')[1] : null;

      if (userId) {
          const local = allUsers.find(u => u.id === userId);
          if (local) { setProfile(local); setLoading(false); return; }
          const remote = await fetchSingleUser(userId);
          setProfile(remote);
      } else if (usernameFromUrl) {
          const remote = await fetchUserByUsername(usernameFromUrl);
          setProfile(remote);
      }
      setLoading(false);
    };
    loadProfile();
  }, [userId, allUsers, fetchSingleUser, fetchUserByUsername]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <Loader2 className="w-12 h-12 animate-spin text-coral" />
    </div>
  );
  
  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper p-10 text-center">
      <Shield className="w-20 h-20 text-gray-200 mb-6" />
      <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Profile Restricted</h2>
      <p className="text-gray-400 font-bold mt-2">The requested identity node is not accessible or does not exist.</p>
      <button onClick={onBack} className="mt-8 tactile-btn px-8 py-3 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest">Return to Grid</button>
    </div>
  );

  const isStudent = profile.role === UserRole.STUDENT;
  const companyProblems = problems.filter(p => p.companyId === userId);
  const isOwnProfile = user?.id === profile.id;
  
  // Calculate stats
  const bountySolves = profile.solvedCount || 0;
  const simSolves = profile.simSolvedCount || 0;
  const totalSolves = bountySolves + simSolves;
  const averageRating = profile.rating || 0;
  const joinedDate = profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : 'N/A';

  return (
    <div className="min-h-screen bg-paper pt-24 md:pt-32 px-4 md:px-10 pb-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
        {isStudent ? <Terminal className="w-96 h-96" /> : <Shield className="w-96 h-96" />}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
            <button 
                onClick={onBack}
                className="tactile-btn px-6 py-3 bg-white border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Grid
            </button>

            {isOwnProfile && (
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="tactile-btn px-6 py-3 bg-citrus border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Edit2 className="w-4 h-4" /> Reconfigure Identity
                </button>
            )}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Identity Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="tactile-card p-10 bg-black text-white rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Zap className="w-32 h-32 text-citrus fill-citrus" />
              </div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-32 h-32 rounded-[2rem] bg-citrus border-4 border-white flex items-center justify-center text-black font-black text-5xl mb-6 shadow-xl overflow-hidden">
                   {profile.profilePicUrl ? <img src={profile.profilePicUrl} className="w-full h-full object-cover" /> : profile.name.charAt(0)}
                </div>
                <h1 className="text-3xl font-black tracking-tighter mb-2">{profile.name}</h1>
                <p className="text-[10px] font-black uppercase text-citrus tracking-[0.3em] mb-4">/u/{profile.username}</p>
                <div className="flex flex-col gap-2 items-center">
                    <span className={`px-4 py-1.5 rounded-full border-2 border-white font-black text-[10px] uppercase tracking-widest ${isStudent ? 'bg-forest text-citrus' : 'bg-coral text-white'}`}>
                    {profile.role} Protocol
                    </span>
                </div>
                
                {profile.location && (
                  <div className="flex items-center gap-2 mt-6 text-gray-400 font-bold text-sm">
                    <MapPin className="w-4 h-4" /> {profile.location}
                  </div>
                )}
              </div>
              
              <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-2 gap-4">
                 <div className="text-center">
                    <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1">Reputation</p>
                    <p className="text-2xl font-black text-citrus flex items-center justify-center">{averageRating.toFixed(1)} <Star className="w-4 h-4 ml-1 fill-citrus" /></p>
                 </div>
                 <div className="text-center">
                    <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1">{isStudent ? 'Total Solves' : 'Posted'}</p>
                    <p className="text-2xl font-black text-white">{isStudent ? totalSolves : companyProblems.length}</p>
                 </div>
              </div>
            </div>

            {/* Badges System Visualization */}
            {isStudent && profile.badges && profile.badges.length > 0 && (
                <div className="tactile-card p-8 bg-paper rounded-[2rem] border-2 border-black">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                        <Award className="w-4 h-4 text-coral" /> Verified Badges
                    </h4>
                    <div className="flex flex-wrap gap-4">
                        {profile.badges.map(badge => (
                            <div key={badge.id} className="group relative">
                                <div className="w-16 h-16 bg-white border-2 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform cursor-help">
                                    {badge.icon}
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-3 bg-black text-white text-[9px] rounded-xl font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                                    <div className="text-citrus mb-1">{badge.name}</div>
                                    <div className="opacity-60">{badge.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="tactile-card p-8 bg-white rounded-[2rem] border-2 border-black space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sync Details</h4>
               <div className="space-y-4">
                 <div className="flex items-center gap-3 text-black">
                    <Mail className="w-4 h-4 text-coral" /> 
                    <span className="text-sm font-bold truncate">{profile.email}</span>
                 </div>
                 {profile.linkedin && (
                   <a href={profile.linkedin} target="_blank" className="flex items-center gap-3 text-black hover:text-coral transition-colors">
                      <Linkedin className="w-4 h-4" /> <span className="text-sm font-bold">LinkedIn Protocol</span>
                   </a>
                 )}
                 {profile.github && (
                   <a href={profile.github} target="_blank" className="flex items-center gap-3 text-black hover:text-coral transition-colors">
                      <Github className="w-4 h-4" /> <span className="text-sm font-bold">GitHub Archive</span>
                   </a>
                 )}
                 <div className="flex items-center gap-3 text-gray-400 pt-4 border-t border-black/5">
                    <Calendar className="w-4 h-4" /> 
                    <span className="text-[10px] font-black uppercase tracking-widest">Joined: {joinedDate}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Intel Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Stats Overview */}
            {isStudent && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="tactile-card p-8 bg-citrus rounded-[2rem] border-2 border-black flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-black uppercase text-black/40 tracking-widest mb-1">Practice verified</p>
                            <p className="text-4xl font-black text-black">{simSolves}</p>
                        </div>
                        <Zap className="w-10 h-10 text-black/20" />
                    </div>
                    <div className="tactile-card p-8 bg-forest text-white rounded-[2rem] border-2 border-black flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Bounty Extractions</p>
                            <p className="text-4xl font-black text-citrus">{bountySolves}</p>
                        </div>
                        <Flame className="w-10 h-10 text-white/20" />
                    </div>
                </div>
            )}

            <section>
              <h2 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-3 mb-6">
                 <Activity className="w-5 h-5 text-coral" /> Technical Intel
              </h2>
              <div className="tactile-card p-10 bg-white rounded-[3rem] border-2 border-black">
                <h3 className="text-xl font-black mb-4">Manifesto</h3>
                <p className="text-gray-600 font-bold leading-relaxed whitespace-pre-wrap mb-10 italic">
                  "{profile.bio || "No technical manifesto recorded for this entity."}"
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                        Institutional Hub
                     </h4>
                     <div className="p-5 bg-paper rounded-2xl border-2 border-black">
                        <p className="font-black text-black">{isStudent ? profile.university : profile.companyName}</p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">
                          {isStudent ? (profile.major ? `${profile.major} | Year ${profile.gradYear || 'N/A'}` : 'Academic Node') : `Team Size: ${profile.teamSize || 'N/A'}`}
                        </p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                        Grid Skillset
                     </h4>
                     <div className="flex flex-wrap gap-2">
                        {profile.skills && profile.skills.length > 0 ? profile.skills.map(skill => (
                           <span key={skill} className="px-3 py-1 bg-citrus border-2 border-black rounded-lg font-black text-[9px] uppercase tracking-widest">
                             {skill}
                           </span>
                        )) : <span className="text-xs text-gray-400 italic">No skills documented.</span>}
                     </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
               <h2 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-3 mb-6">
                  <Briefcase className="w-5 h-5 text-forest" /> Transmission History
               </h2>
               <div className="space-y-6">
                  {isStudent ? (
                    profile.reviews && profile.reviews.length > 0 ? profile.reviews.map(review => (
                      <div key={review.id} className="tactile-card p-8 bg-white rounded-[2rem] border-2 border-black flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                         <div>
                            <h4 className="text-lg font-black text-black mb-1">{review.problemTitle}</h4>
                            <p className="text-[10px] font-black uppercase text-coral tracking-widest">Sync Source: {review.companyName}</p>
                            <p className="mt-3 text-sm text-gray-500 font-bold italic leading-relaxed">"{review.feedback}"</p>
                         </div>
                         <div className="shrink-0 flex items-center gap-4">
                            <div className="text-center bg-citrus/10 border-2 border-citrus p-3 rounded-xl min-w-[80px]">
                               <p className="text-[9px] font-black uppercase text-citrus mb-1">Score</p>
                               <p className="text-xl font-black flex items-center justify-center">{review.rating} <Star className="w-4 h-4 ml-1 fill-black" /></p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-forest" />
                         </div>
                      </div>
                    )) : (
                      <div className="p-10 border-2 border-dashed border-black/10 rounded-[2rem] text-center">
                         <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest">No verified extractions yet.</p>
                      </div>
                    )
                  ) : (
                    companyProblems.map(p => (
                      <div key={p.id} className="tactile-card p-8 bg-white rounded-[2rem] border-2 border-black flex justify-between items-center group">
                         <div>
                            <h4 className="text-lg font-black text-black mb-1 group-hover:text-coral transition-colors">{p.title}</h4>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                               {p.status} • {new Date(p.createdAt).toLocaleDateString()}
                            </p>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">Bounty</p>
                            <p className="text-xl font-black text-forest flex items-center">
                               <IndianRupee className="w-4 h-4" /> {p.bounty.replace(/[^\d]/g, '')}
                            </p>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </section>
          </div>
        </div>
      </div>

      <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};

export default ProfileDossier;
