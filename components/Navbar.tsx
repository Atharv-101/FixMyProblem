
import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole } from '../types.ts';
import { LogOut, Code2, Menu, X, ArrowRight, Home } from 'lucide-react';
import ProfileCard from './ProfileCard.tsx';

// Updated ViewState to include all possible states from App.tsx
type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY' | 'PROFILE_VIEW' | 'ERROR_404';

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
  }, [onViewChange]);

  const isDarkNavbar = scrolled || !transparent || isMobileMenuOpen;

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isDarkNavbar ? 'bg-white border-b-[3px] border-black py-3' : 'bg-transparent py-6 md:py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        
        {/* Brand */}
        <div 
          className="flex items-center cursor-pointer group relative z-[110]" 
          onClick={() => handleNav('HOME')}
        >
          <div className="rounded-xl p-2 mr-3 bg-black border-2 border-citrus shadow-[3px_3px_0px_0px_rgba(255,95,95,1)] group-hover:rotate-6 transition-all duration-300">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className={`text-xl md:text-2xl font-black tracking-tighter transition-colors ${isDarkNavbar ? 'text-black' : 'text-black md:text-white'}`}>
            FixMyProblem
          </span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => handleNav('LEADERBOARD')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isDarkNavbar ? 'text-gray-500 hover:text-black' : 'text-white/60 hover:text-white'}`}>Solvers</button>
          <button onClick={() => handleNav('CONTACT')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isDarkNavbar ? 'text-gray-500 hover:text-black' : 'text-white/60 hover:text-white'}`}>Contact</button>
          
          {user ? (
            <div className="flex items-center space-x-6">
              <div 
                className="relative" 
                onMouseEnter={() => setShowProfileCard(true)} 
                onMouseLeave={() => setShowProfileCard(false)}
              >
                <div 
                  onClick={() => handleNav('DASHBOARD')}
                  className="w-11 h-11 rounded-2xl bg-citrus border-2 border-black overflow-hidden flex items-center justify-center font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:scale-105 transition-transform"
                >
                  {user.profilePicUrl ? <img src={user.profilePicUrl} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                </div>
                {showProfileCard && <ProfileCard user={user} onClose={() => setShowProfileCard(false)} positionClasses="top-full right-0 mt-6" />}
              </div>
              <button onClick={logout} className={`p-2.5 rounded-xl border-2 border-transparent transition-all ${isDarkNavbar ? 'text-gray-400 hover:text-red-600 hover:border-black' : 'text-white/40 hover:text-white hover:border-white'}`}>
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleNav('AUTH')} 
              className={`tactile-btn px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isDarkNavbar ? 'bg-black text-white hover:bg-forest' : 'bg-white text-black hover:bg-citrus'}`}
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center relative z-[110]">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className={`p-2.5 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${isMobileMenuOpen ? 'bg-coral text-white' : 'bg-black text-white'}`}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-white pt-24 px-8 flex flex-col items-center justify-center animate-fade-in overflow-y-auto">
          <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
            <button onClick={() => handleNav('HOME')} className="text-4xl font-black text-black flex items-center gap-3">
              <Home className="w-8 h-8 text-coral" /> Home
            </button>
            <button onClick={() => handleNav('LEADERBOARD')} className="text-4xl font-black text-black">Rankings</button>
            <button onClick={() => handleNav('CONTACT')} className="text-4xl font-black text-black">Support</button>
            
            <div className="w-full h-px bg-black/10 my-4"></div>

            {user ? (
              <>
                <div className="text-left w-full p-6 bg-paper border-2 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-citrus border-2 border-black flex items-center justify-center font-black text-xl">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-black">{user.name}</h4>
                      <p className="text-[10px] font-black uppercase text-coral tracking-widest">{user.role}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleNav('DASHBOARD')} className="text-4xl font-black text-forest">Workspace</button>
                <button onClick={() => handleNav('PAYMENT_HISTORY')} className="text-4xl font-black text-black">Payouts</button>
                <button onClick={logout} className="text-2xl font-black text-gray-400 pt-8">Disconnect Protocol</button>
              </>
            ) : (
              <button 
                onClick={() => handleNav('AUTH')} 
                className="tactile-btn w-full py-5 bg-black text-white rounded-2xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4"
              >
                Authenticate <ArrowRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
