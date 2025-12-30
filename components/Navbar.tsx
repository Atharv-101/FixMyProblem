
import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole } from '../types.ts';
import { LogOut, Code2, Menu, X, ArrowRight, Home, LayoutDashboard, Trophy, PhoneCall, BrainCircuit, Users } from 'lucide-react';
import ProfileCard from './ProfileCard.tsx';

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY' | 'PROFILE_VIEW' | 'ERROR_404' | 'SIMULATIONS' | 'USERS_DIRECTORY';

interface NavbarProps {
  onViewChange: (view: ViewState) => void;
  transparent?: boolean;
  onProfileClick: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onViewChange, transparent, onProfileClick }) => {
  const { user, logout } = useStore();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = useCallback((view: ViewState) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [onViewChange]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'auto';
  };

  const isDarkNavbar = scrolled || !transparent || isMobileMenuOpen;

  return (
    <>
      <nav className={`fixed top-0 w-full z-[1000] transition-all duration-500 ${isDarkNavbar ? 'bg-white/95 backdrop-blur-md border-b-[3px] border-black py-3' : 'bg-transparent py-6 md:py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
          
          {/* Brand */}
          <div 
            className="flex items-center cursor-pointer group relative z-[1100]" 
            onClick={() => handleNav('HOME')}
          >
            <div className="rounded-xl p-2 mr-3 bg-black border-2 border-citrus shadow-[3px_3px_0px_0px_rgba(255,95,95,1)] group-hover:rotate-12 transition-all duration-300">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-black">
              FixMyProblem
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNav('SIMULATIONS')} className="text-[10px] font-black uppercase tracking-[0.2em] text-forest flex items-center gap-1 hover:text-black transition-colors"><BrainCircuit className="w-3.5 h-3.5"/> Practice</button>
            <button onClick={() => handleNav('USERS_DIRECTORY')} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Users</button>
            <button onClick={() => handleNav('LEADERBOARD')} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> Leaderboard</button>
            <button onClick={() => handleNav('CONTACT')} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">Contact</button>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <div 
                  className="relative" 
                  onMouseEnter={() => setShowProfileCard(true)} 
                  onMouseLeave={() => setShowProfileCard(false)}
                >
                  <div 
                    onClick={() => handleNav('DASHBOARD')}
                    className="w-11 h-11 rounded-2xl bg-citrus border-2 border-black overflow-hidden flex items-center justify-center font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:scale-110 transition-transform"
                  >
                    {user.profilePicUrl ? <img src={user.profilePicUrl} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                  </div>
                  {showProfileCard && <ProfileCard user={user} onClose={() => setShowProfileCard(false)} positionClasses="top-full right-0 mt-6" />}
                </div>
                <button onClick={logout} className="p-2.5 rounded-xl border-2 border-transparent text-gray-400 hover:text-red-600 hover:border-black transition-all">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleNav('AUTH')} 
                className="tactile-btn px-8 py-3 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-forest transition-all"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden flex items-center relative z-[1100]">
            <button 
              onClick={toggleMobileMenu} 
              className={`p-1 w-12 h-12 rounded-full border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center overflow-hidden ${isMobileMenuOpen ? 'bg-coral' : 'bg-citrus'}`}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <span className="text-2xl">👀</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 z-[2000] bg-white transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="h-full flex flex-col p-8 overflow-y-auto">
          {/* Menu Header */}
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center" onClick={() => handleNav('HOME')}>
              <div className="rounded-xl p-2 mr-3 bg-black border-2 border-citrus shadow-[4px_4px_0px_0px_rgba(255,95,95,1)]">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-black tracking-tighter">FixMyProblem</span>
            </div>
            <button 
              onClick={toggleMobileMenu} 
              className="w-12 h-12 rounded-full border-4 border-black bg-coral text-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col space-y-6 md:space-y-8">
            <button 
              onClick={() => handleNav('HOME')} 
              className="text-5xl font-black text-black text-left tracking-tighter flex items-center gap-4 hover:text-coral transition-colors"
            >
              <Home className="w-10 h-10 text-coral" /> Home
            </button>
            <button 
              onClick={() => handleNav('SIMULATIONS')} 
              className="text-5xl font-black text-black text-left tracking-tighter flex items-center gap-4 hover:text-forest transition-colors"
            >
              <BrainCircuit className="w-10 h-10 text-forest" /> Practice Hub
            </button>
            <button 
              onClick={() => handleNav('USERS_DIRECTORY')} 
              className="text-5xl font-black text-black text-left tracking-tighter flex items-center gap-4 hover:text-citrus transition-colors"
            >
              <Users className="w-10 h-10 text-citrus" /> Users
            </button>
            <button 
              onClick={() => handleNav('LEADERBOARD')} 
              className="text-5xl font-black text-black text-left tracking-tighter flex items-center gap-4 hover:text-coral transition-colors"
            >
              <Trophy className="w-10 h-10 text-coral" /> Leaderboard
            </button>
            
            <div className="w-full h-1 bg-black/10 my-6"></div>

            {user ? (
              <div className="space-y-6">
                <div className="p-6 bg-paper border-2 border-black rounded-[2rem] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-citrus border-2 border-black flex items-center justify-center text-2xl font-black">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-xl leading-none">{user.name}</h4>
                    <p className="text-[10px] font-black uppercase text-coral mt-1 tracking-widest">{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleNav('DASHBOARD')} 
                  className="text-5xl font-black text-forest text-left tracking-tighter flex items-center gap-4"
                >
                  <LayoutDashboard className="w-10 h-10" /> Workspace
                </button>
                <button 
                  onClick={logout} 
                  className="text-2xl font-black text-gray-400 text-left pt-10"
                >
                  Disconnect Protocol
                </button>
              </div>
            ) : (
              <div className="pt-10">
                <button 
                  onClick={() => handleNav('AUTH')} 
                  className="tactile-btn w-full py-6 bg-black text-white rounded-2xl font-black text-2xl uppercase tracking-widest flex items-center justify-center gap-4"
                >
                  Authenticate <ArrowRight className="w-8 h-8" />
                </button>
              </div>
            )}
          </div>

          {/* Footer in Menu */}
          <div className="mt-auto pt-20 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">© 2024 ATHINNOVATIONS • GRID ACTIVE</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
