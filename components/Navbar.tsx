
import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole } from '../types.ts';
import { LogOut, Code2, Menu, X, ArrowRight } from 'lucide-react';
import ProfileCard from './ProfileCard.tsx';

// Updated ViewState to include all possible states from App.tsx
type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY' | 'PROFILE_VIEW';

interface NavbarProps {
  onViewChange: (view: ViewState) => void;
  transparent?: boolean;
  // Added onProfileClick prop to resolve type error
  onProfileClick: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onViewChange, transparent, onProfileClick }) => {
  const { user, logout } = useStore();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const isScrolled = currentScroll > 20;
      if (Math.abs(currentScroll - lastScroll) > 5) { // Throttled updates
        setScrolled(isScrolled);
        lastScroll = currentScroll;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = useCallback((view: ViewState) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [onViewChange]);

  const isDarkNavbar = scrolled || !transparent || isMobileMenuOpen;

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isDarkNavbar ? 'bg-white/95 backdrop-blur-sm border-b-[3px] border-black py-3 md:py-4' : 'bg-transparent py-6 md:py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        
        {/* Brand */}
        <div 
          className="flex items-center cursor-pointer group relative z-[110]" 
          onClick={() => handleNav('HOME')}
        >
          <div className="rounded-xl p-2 mr-3 bg-black border-2 border-citrus shadow-[3px_3px_0px_0px_rgba(255,95,95,1)] group-hover:rotate-6 transition-all duration-300">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-black">
            FixMyProblem
          </span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <div className="flex items-center space-x-6 relative">
              <div className="text-right">
                <div className="font-black text-sm text-black tracking-tight leading-none mb-1">{user.name}</div>
                <div className="uppercase text-[9px] font-black tracking-[0.2em] text-coral flex items-center justify-end gap-1.5">
                  <span className="w-1.5 h-1.5 bg-coral rounded-full animate-pulse"></span> {user.role}
                </div>
              </div>
              
              <div 
                className="relative" 
                onMouseEnter={() => setShowProfileCard(true)} 
                onMouseLeave={() => setShowProfileCard(false)}
              >
                <div 
                  onClick={() => handleNav('DASHBOARD')}
                  className="w-11 h-11 rounded-2xl bg-citrus border-2 border-black overflow-hidden flex items-center justify-center font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  {user.profilePicUrl ? <img src={user.profilePicUrl} className="w-full h-full object-cover" /> : (user.name ? user.name.charAt(0) : 'U')}
                </div>
                {showProfileCard && <ProfileCard user={user} onClose={() => setShowProfileCard(false)} positionClasses="top-full right-0 mt-6" />}
              </div>

              <button onClick={logout} className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 border-2 border-transparent hover:border-black transition-all">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-8">
              <button onClick={() => handleNav('LEADERBOARD')} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors relative group">
                Solvers
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-coral transition-all group-hover:w-full"></span>
              </button>
              <button onClick={() => handleNav('CONTACT')} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-coral transition-all group-hover:w-full"></span>
              </button>
              <button 
                onClick={() => handleNav('AUTH')} 
                className="tactile-btn px-8 py-3 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-forest transition-all flex items-center group"
              >
                Get Started <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center relative z-[110]">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className={`p-2.5 rounded-xl border-2 border-black transition-all ${isMobileMenuOpen ? 'bg-coral text-white' : 'bg-black text-white'}`}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-paper pt-24 px-8 flex flex-col animate-fade-in">
          <div className="space-y-4 mt-8 flex flex-col items-center">
            {!user ? (
              <>
                <button onClick={() => handleNav('HOME')} className="text-4xl font-black text-black tracking-tighter py-2">Home</button>
                <button onClick={() => handleNav('LEADERBOARD')} className="text-4xl font-black text-black tracking-tighter py-2">Rankings</button>
                <button onClick={() => handleNav('CONTACT')} className="text-4xl font-black text-black tracking-tighter py-2">Support</button>
                <div className="pt-8 w-full max-w-sm">
                  <button 
                    onClick={() => handleNav('AUTH')} 
                    className="tactile-btn w-full py-5 bg-black text-white rounded-2xl font-black text-xl uppercase tracking-widest"
                  >
                    Authenticate
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 p-6 bg-white border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm mb-4">
                   <div className="w-14 h-14 rounded-2xl bg-citrus border-2 border-black flex items-center justify-center font-black text-xl">
                      {user.name ? user.name.charAt(0) : 'U'}
                   </div>
                   <div className="truncate">
                      <h4 className="text-lg font-black text-black truncate">{user.name}</h4>
                      <p className="text-[9px] font-black uppercase text-coral tracking-widest">{user.role}</p>
                   </div>
                </div>
                <button onClick={() => handleNav('DASHBOARD')} className="text-3xl font-black text-black tracking-tighter py-2">Workspace</button>
                <button onClick={() => handleNav('PAYMENT_HISTORY')} className="text-3xl font-black text-black tracking-tighter py-2">Payouts</button>
                <div className="mt-8 w-full max-w-sm">
                  <button 
                    onClick={logout} 
                    className="tactile-btn w-full py-4 bg-white text-black border-2 border-black rounded-2xl font-black text-base uppercase tracking-widest"
                  >
                    Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
