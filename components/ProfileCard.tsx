
import React from 'react';
import { User, UserRole, SkillLevel } from '../types.ts';
import { UserCircle, GraduationCap, Star, Globe, Building2, Terminal, Code2, ShieldCheck, Target } from 'lucide-react';

interface ProfileCardProps {
  user: User;
  onClose: () => void;
  positionClasses?: string;
}

const SkillBadge: React.FC<{ level: SkillLevel }> = ({ level }) => {
    const colors = {
        'Advanced': 'bg-forest text-citrus',
        'Intermediate': 'bg-black text-white',
        'Junior': 'bg-citrus text-black',
        'Beginner': 'bg-gray-100 text-gray-500'
    };
    return (
        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border border-black/10 ${colors[level]}`}>
            {level}
        </span>
    );
};

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onClose, positionClasses = "top-full mt-2 left-1/2 -translate-x-1/2" }) => {
  if (!user) return null;

  return (
    <div
      className={`absolute z-50 min-w-[320px] bg-white border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 text-black transform transition-all duration-200 animate-pop-in ${positionClasses}`}
      onMouseLeave={onClose}
    >
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-citrus border-2 border-black flex items-center justify-center font-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden mr-4">
            {user.profilePicUrl ? <img src={user.profilePicUrl} className="w-full h-full object-cover" /> : user.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-black tracking-tighter leading-tight">{user.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <SkillBadge level={user.skillLevel || 'Beginner'} />
            <span className="text-[9px] font-black uppercase text-gray-400">Score: {Math.floor(user.leaderboardScore || 0)}</span>
          </div>
        </div>
      </div>

      {user.bio && <p className="text-xs font-bold text-gray-500 mb-6 italic leading-relaxed">"{user.bio}"</p>}

      {user.role === UserRole.STUDENT && (
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-black/5">
             <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-coral" />
                <span className="text-[9px] font-black uppercase">Solves</span>
             </div>
             <span className="font-black">{(user.simSolvedCount || 0) + (user.solvedCount || 0)}</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-black/5">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest" />
                <span className="text-[9px] font-black uppercase">Rolling Avg</span>
             </div>
             <span className="font-black">{user.rollingAverage || 0}%</span>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t-2 border-black/5">
         <button className="w-full py-2 bg-black text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-forest transition-colors">
            View Full Dossier
         </button>
      </div>
    </div>
  );
};

export default ProfileCard;
