
import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole } from '../types.ts';
import { LogOut, Code2, Menu, X, ArrowRight, Home, LayoutDashboard, Trophy, PhoneCall, BrainCircuit, Users, Sparkles, HelpCircle } from 'lucide-react';

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY' | 'PROFILE_VIEW' | 'ERROR_404' | 'SIMULATIONS' | 'USERS_DIRECTORY' | 'GUIDE';

interface NavbarProps {
  onViewChange: (view: ViewState, isLogin?: boolean) => void;
  transparent?: boolean;
  onProfileClick: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onViewChange, transparent, onProfileClick }) => {
  const { user, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = useCallback((view: ViewState, isLogin?: boolean) => {
    onViewChange(view, isLogin);
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
          
          {/* Brand & Quick Dashboard Link */}
          <div className="flex items-center gap-6">
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

            {user && (
                <button 
                  onClick={() => onProfileClick(user.id)}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-citrus/20 border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-citrus transition-all"
                >
                  <Sparkles className="w-3 h-3 text-coral" /> My Profile
                </button>
            )}
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNav('GUIDE')} className="text-[10px] font-black uppercase tracking-[0.2em] text-coral flex items-center gap-1 hover:text-black transition-colors"><HelpCircle className="w-3.5 h-3.5"/> Working</button>
            <button onClick={() => handleNav('SIMULATIONS')} className="text-[10px] font-black uppercase tracking-[0.2em] text-forest flex items-center gap-1 hover:text-black transition-colors"><BrainCircuit className="w-3.5 h-3.5"/> Practice</button>
            <button onClick={() => handleNav('USERS_DIRECTORY')} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Users</button>
            <button onClick={() => handleNav('LEADERBOARD')} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> Leaderboard</button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleNav('DASHBOARD')}
                  className="tactile-btn px-6 py-3 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-coral transition-all shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </button>
                <div className="h-8 w-px bg-black/10 mx-2"></div>
                <div 
                    onClick={() => onProfileClick(user.id)}
                    className="w-11 h-11 rounded-2xl bg-citrus border-2 border-black overflow-hidden flex items-center justify-center font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:scale-110 transition-transform"
                >
                    {user.profilePicUrl ? <img src={user.profilePicUrl} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                </div>
                <button onClick={logout} className="p-2.5 rounded-xl border-2 border-transparent text-gray-400 hover:text-red-600 hover:border-black transition-all">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleNav('AUTH')} 
                className="tactile-btn px-8 py-3 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-forest transition-all shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]"
              >
                Authenticate Node
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
                <span className="text-2xl font-black">👀</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 z-[2000] bg-white transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="h-full flex flex-col p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center" onClick={() => handleNav('HOME')}>
              <div className="rounded-xl p-2 mr-3 bg-black border-2 border-citrus shadow-[4px_4px_0px_0px_rgba(255,95,95,1)]">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-black tracking-tighter">FixMyProblem</span>
            </div>
            <button onClick={toggleMobileMenu} className="w-12 h-12 rounded-full border-4 border-black bg-coral text-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col space-y-6">
            {user ? (
               <>
                 <button onClick={() => onProfileClick(user.id)} className="text-4xl font-black text-coral text-left tracking-tighter flex items-center gap-4 animate-pop">
                   <Sparkles className="w-10 h-10" /> My Profile
                 </button>
                 <button onClick={() => handleNav('DASHBOARD')} className="text-4xl font-black text-black text-left tracking-tighter flex items-center gap-4 animate-pop">
                   <LayoutDashboard className="w-10 h-10" /> Dashboard
                 </button>
               </>
            ) : (
               <button onClick={() => handleNav('AUTH')} className="text-4xl font-black text-black text-left tracking-tighter flex items-center gap-4 animate-pop">
                 <ArrowRight className="w-10 h-10" /> Authenticate
               </button>
            )}
            <button onClick={() => handleNav('HOME')} className="text-4xl font-black text-black text-left tracking-tighter flex items-center gap-4 opacity-50">
              <Home className="w-10 h-10" /> Home
            </button>
            <button onClick={() => handleNav('GUIDE')} className="text-4xl font-black text-black text-left tracking-tighter flex items-center gap-4">
              <HelpCircle className="w-10 h-10 text-coral" /> Working
            </button>
            <button onClick={() => handleNav('SIMULATIONS')} className="text-4xl font-black text-black text-left tracking-tighter flex items-center gap-4">
              <BrainCircuit className="w-10 h-10 text-forest" /> Practice
            </button>
            <button onClick={() => handleNav('USERS_DIRECTORY')} className="text-4xl font-black text-black text-left tracking-tighter flex items-center gap-4">
              <Users className="w-10 h-10 text-citrus" /> Users
            </button>
            <button onClick={() => handleNav('LEADERBOARD')} className="text-4xl font-black text-black text-left tracking-tighter flex items-center gap-4">
              <Trophy className="w-10 h-10 text-coral" /> Global Rank
            </button>
            
            {user && (
              <div className="pt-20">
                <button onClick={logout} className="text-xl font-black text-gray-300 uppercase tracking-[0.2em]">Disconnect Sequence</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
