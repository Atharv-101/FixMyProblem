import React, { useState, useEffect } from 'react';
import { useStore } from '../context/Store';
import { UserRole } from '../types';
import { LogOut, Code2, Trophy, ArrowLeft } from 'lucide-react';
import ProfileCard from './ProfileCard'; // Import ProfileCard

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD';

interface NavbarProps {
  onViewChange: (view: ViewState) => void;
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onViewChange, transparent }) => {
  const { user, logout } = useStore();
  const [showProfileCard, setShowProfileCard] = useState(false);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${transparent ? 'bg-transparent pt-4' : 'bg-white/90 backdrop-blur-md border-b border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => onViewChange('HOME')}>
            <div className={`rounded-lg p-1.5 mr-2 transition-colors ${transparent ? 'bg-white/10 group-hover:bg-white/20' : 'bg-blue-600'}`}>
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-extrabold tracking-tight ${transparent ? 'text-white' : 'text-gray-900'}`}>FixMyProblem</span>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => onViewChange('LEADERBOARD')}
              className={`font-medium text-sm flex items-center transition-opacity hover:opacity-80 ${transparent ? 'text-white/90' : 'text-gray-600'}`}
            >
              <Trophy className="w-4 h-4 mr-1" />
              Rankings
            </button>

            {user ? (
              <div 
                className="flex items-center space-x-4 relative"
                onMouseEnter={() => setShowProfileCard(true)}
                onMouseLeave={() => setShowProfileCard(false)}
              >
                <div className={`text-sm hidden md:block text-right ${transparent ? 'text-white' : 'text-gray-700'}`}>
                  <div className="font-semibold">{user.name}</div>
                  <div className={`uppercase text-[10px] tracking-wider ${transparent ? 'text-white/60' : 'text-gray-500'}`}>{user.role}</div>
                </div>
                {user.profilePicUrl ? (
                   <img src={user.profilePicUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                ) : (
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white">
                      {user.name.charAt(0)}
                   </div>
                )}
                
                {showProfileCard && <ProfileCard user={user} onClose={() => setShowProfileCard(false)} positionClasses="top-full right-0 mt-2" />}

                <button
                  onClick={logout}
                  className={`p-2 rounded-full transition-colors ${transparent ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onViewChange('AUTH')}
                className={`text-sm font-bold px-5 py-2 rounded-full transition-all ${transparent ? 'bg-white text-slate-900 hover:bg-blue-50' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;