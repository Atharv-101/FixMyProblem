import React from 'react';
import { User, UserRole } from '../types';
import { UserCircle, Briefcase, GraduationCap, Star, Globe, Building2, Terminal, Code2 } from 'lucide-react';

interface ProfileCardProps {
  user: User;
  onClose: () => void; // To hide the card when not hovered
  positionClasses?: string; // e.g., "top-full mt-2 left-0"
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onClose, positionClasses = "top-full mt-2 left-1/2 -translate-x-1/2" }) => {
  if (!user) return null;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.STUDENT: return <GraduationCap className="w-4 h-4 mr-1 text-blue-400" />;
      case UserRole.COMPANY: return <Building2 className="w-4 h-4 mr-1 text-purple-400" />;
      case UserRole.ADMIN: return <Terminal className="w-4 h-4 mr-1 text-red-400" />;
      default: return <UserCircle className="w-4 h-4 mr-1 text-gray-400" />;
    }
  };

  return (
    <div
      className={`absolute z-50 min-w-72 max-w-sm bg-slate-900 border border-slate-700 rounded-xl shadow-lg p-6 text-white transform transition-all duration-200 ease-out animate-fade-in-up ${positionClasses}`}
      onMouseLeave={onClose}
    >
      <div className="flex items-center mb-4">
        {user.profilePicUrl ? (
          <img src={user.profilePicUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 mr-4" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-2xl border-2 border-blue-500 mr-4">
            {user.name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold flex items-center">{user.name}</h3>
          <p className="text-sm text-slate-400 flex items-center capitalize">{getRoleIcon(user.role)} {user.role.toLowerCase()}</p>
        </div>
      </div>

      {user.bio && <p className="text-sm text-slate-300 mb-4 line-clamp-3">{user.bio}</p>}

      {user.role === UserRole.STUDENT && (
        <>
          {user.university && <p className="text-sm text-slate-400 mb-1 flex items-center"><GraduationCap className="w-4 h-4 mr-2 text-blue-500" /> {user.university}</p>}
          <div className="flex items-center text-sm text-yellow-400 mb-1">
            <Star className="w-4 h-4 mr-2" /> {user.rating?.toFixed(1) || 'N/A'} Average Rating
          </div>
          <p className="text-sm text-slate-400 mb-4 flex items-center"><Code2 className="w-4 h-4 mr-2 text-green-500" /> {user.solvedCount || 0} Problems Solved</p>
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {user.skills.map(skill => (
                <span key={skill} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-full border border-slate-700">{skill}</span>
              ))}
            </div>
          )}
        </>
      )}

      {user.role === UserRole.COMPANY && (
        <>
          {user.companyName && <p className="text-sm text-slate-400 mb-1 flex items-center"><Building2 className="w-4 h-4 mr-2 text-purple-500" /> {user.companyName}</p>}
          {user.websiteUrl && (
            <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm flex items-center mt-2">
              <Globe className="w-4 h-4 mr-2" /> Visit Website
            </a>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileCard;