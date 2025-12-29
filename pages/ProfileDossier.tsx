
import React from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, User } from '../types.ts';
import { 
  ArrowLeft, Terminal, Shield, GraduationCap, Building2, MapPin, 
  Linkedin, Github, Globe, Star, Zap, Briefcase, Calendar, 
  CheckCircle2, IndianRupee, Activity, Mail
} from 'lucide-react';

interface ProfileDossierProps {
  userId: string;
  onBack: () => void;
}

const ProfileDossier: React.FC<ProfileDossierProps> = ({ userId, onBack }) => {
  const { allUsers, problems } = useStore();
  const profile = allUsers.find(u => u.id === userId);
  
  if (!profile) return null;

  const isStudent = profile.role === UserRole.STUDENT;
  const companyProblems = problems.filter(p => p.companyId === userId);
  
  // Calculate stats
  const solvedChallenges = isStudent ? profile.solvedCount || 0 : 0;
  const averageRating = profile.rating || 0;
  const joinedDate = profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : 'N/A';

  return (
    <div className="min-h-screen bg-paper pt-24 md:pt-32 px-4 md:px-10 pb-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
        {isStudent ? <Terminal className="w-96 h-96" /> : <Shield className="w-96 h-96" />}
      </div>

      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="tactile-btn mb-12 px-6 py-3 bg-white border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Grid
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Identity Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="tactile-card p-10 bg-black text-white rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Zap className="w-32 h-32 text-citrus fill-citrus" />
              </div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-32 h-32 rounded-[2rem] bg-citrus border-4 border-white flex items-center justify-center text-black font-black text-5xl mb-6 shadow-xl">
                   {profile.name.charAt(0)}
                </div>
                <h1 className="text-3xl font-black tracking-tighter mb-2">{profile.name}</h1>
                <span className={`px-4 py-1.5 rounded-full border-2 border-white font-black text-[10px] uppercase tracking-widest ${isStudent ? 'bg-forest text-citrus' : 'bg-coral text-white'}`}>
                   {profile.role} Protocol
                </span>
                
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
                    <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1">{isStudent ? 'Solved' : 'Posted'}</p>
                    <p className="text-2xl font-black text-white">{isStudent ? solvedChallenges : companyProblems.length}</p>
                 </div>
              </div>
            </div>

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
                 {profile.websiteUrl && (
                   <a href={profile.websiteUrl} target="_blank" className="flex items-center gap-3 text-black hover:text-coral transition-colors">
                      <Globe className="w-4 h-4" /> <span className="text-sm font-bold">Web Node</span>
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
            <section>
              <h2 className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-3 mb-6">
                 <Activity className="w-5 h-5 text-coral" /> Technical Intel
              </h2>
              <div className="tactile-card p-10 bg-white rounded-[3rem] border-2 border-black">
                <h3 className="text-xl font-black mb-4">Briefing</h3>
                <p className="text-gray-600 font-bold leading-relaxed whitespace-pre-wrap mb-10 italic">
                  "{profile.bio || "No technical manifesto recorded for this entity."}"
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                        {isStudent ? <GraduationCap className="w-4 h-4" /> : <Building2 className="w-4 h-4" />} Institutional Context
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
                        <Zap className="w-4 h-4" /> Grid Skillset
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
                  <Briefcase className="w-5 h-5 text-forest" /> Grid History
               </h2>
               <div className="space-y-6">
                  {isStudent ? (
                    profile.reviews && profile.reviews.length > 0 ? profile.reviews.map(review => (
                      <div key={review.id} className="tactile-card p-8 bg-white rounded-[2rem] border-2 border-black flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                         <div>
                            <h4 className="text-lg font-black text-black mb-1">{review.problemTitle}</h4>
                            <p className="text-[10px] font-black uppercase text-coral tracking-widest">Sync by {review.companyName}</p>
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
                      <div key={p.id} className="tactile-card p-8 bg-white rounded-[2rem] border-2 border-black flex justify-between items-center group cursor-pointer hover:bg-paper">
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
    </div>
  );
};

export default ProfileDossier;
