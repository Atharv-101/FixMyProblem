
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole } from '../types.ts';
import { LogOut, Code2, Menu, X, ArrowRight, Zap } from 'lucide-react';
import ProfileCard from './ProfileCard.tsx';

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY';

interface NavbarProps {
  onViewChange: (view: ViewState) => void;
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onViewChange, transparent }) => {
  const { user, logout } = useStore();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileNav = (view: ViewState) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  const navClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isMobileMenuOpen 
      ? 'h-screen bg-paper' 
      : (scrolled || !transparent ? 'bg-paper/95 backdrop-blur-xl border-b-[3px] border-black py-4' : 'bg-transparent py-8')
  }`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-full flex flex-col justify-center">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center cursor-pointer group relative z-[60]" 
            onClick={() => handleMobileNav('HOME')}
          >
            <div className="rounded-xl p-2 md:p-2.5 mr-3 bg-black border-2 border-citrus shadow-[3px_3px_0px_0px_rgba(255,95,95,1)] group-hover:rotate-6 transition-all duration-300">
              <Code2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight text-black">
              FixMyProblem
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {user ? (
              <div className="flex items-center space-x-6 relative">
                <div className="text-right">
                  <div className="font-black text-sm text-black tracking-tight">{user.name}</div>
                  <div className="uppercase text-[9px] font-black tracking-[0.2em] text-coral flex items-center justify-end gap-1.5">
                    <span className="w-1.5 h-1.5 bg-coral rounded-full animate-pulse"></span> {user.role}
                  </div>
                </div>
                
                <div 
                  className="relative" 
                  onMouseEnter={() => setShowProfileCard(true)} 
                  onMouseLeave={() => setShowProfileCard(false)}
                >
                  <div className="w-11 h-11 rounded-2xl bg-citrus border-2 border-black overflow-hidden flex items-center justify-center font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer">
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
                <div className="flex items-center space-x-8">
                  <button onClick={() => onViewChange('LEADERBOARD')} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors relative group">
                    Rankings
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-coral transition-all group-hover:w-full"></span>
                  </button>
                  <button onClick={() => onViewChange('CONTACT')} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors relative group">
                    Contact
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-coral transition-all group-hover:w-full"></span>
                  </button>
                </div>
                <button 
                  onClick={() => onViewChange('AUTH')} 
                  className="tactile-btn px-8 py-3 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-forest transition-all flex items-center group"
                >
                  Get Started <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center relative z-[60]">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className={`p-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(253,224,71,1)] transition-all ${isMobileMenuOpen ? 'bg-coral text-white' : 'bg-black text-white'}`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 pt-24 pb-12 px-8 bg-paper flex flex-col">
            <div className="space-y-8 mt-12">
              {!user ? (
                <>
                  <button onClick={() => handleMobileNav('HOME')} className="block text-4xl font-black text-black tracking-tighter">Directory</button>
                  <button onClick={() => handleMobileNav('LEADERBOARD')} className="block text-4xl font-black text-black tracking-tighter">Solvers</button>
                  <button onClick={() => handleMobileNav('CONTACT')} className="block text-4xl font-black text-black tracking-tighter">Support</button>
                  <div className="pt-8">
                    <button 
                      onClick={() => handleMobileNav('AUTH')} 
                      className="tactile-btn w-full py-6 bg-black text-white rounded-2xl font-black text-xl uppercase"
                    >
                      Login / Sign Up
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-5 p-6 bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                     <div className="w-16 h-16 rounded-2xl bg-citrus border-2 border-black flex items-center justify-center font-black text-2xl">
                        {user.name ? user.name.charAt(0) : 'U'}
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-black">{user.name}</h4>
                        <p className="text-[10px] font-black uppercase text-coral mt-1">{user.role}</p>
                     </div>
                  </div>
                  <button onClick={() => handleMobileNav('DASHBOARD')} className="block text-4xl font-black text-black tracking-tighter">Workspace</button>
                  <button onClick={() => handleMobileNav('PAYMENT_HISTORY')} className="block text-4xl font-black text-black tracking-tighter">Payouts</button>
                  <div className="mt-8">
                    <button 
                      onClick={logout} 
                      className="tactile-btn w-full py-5 bg-white text-black border-2 border-black rounded-2xl font-black text-xl"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
