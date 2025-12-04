import React, { useState, useEffect } from 'react';
import { useStore } from '../context/Store';
import { UserRole } from '../types';
import { LogOut, Code2, Trophy, ArrowLeft, Info, Briefcase, Mail, Menu, X } from 'lucide-react'; // Added Menu, X
import ProfileCard from './ProfileCard'; // Import ProfileCard

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD';

interface NavbarProps {
  onViewChange: (view: ViewState) => void;
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onViewChange, transparent }) => {
  const { user, logout } = useStore();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleNavLinkClick = (view: ViewState, hash?: string) => {
    if (view === 'HOME' && hash) {
      onViewChange('HOME');
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to allow view change to render
    } else {
      onViewChange(view);
    }
    setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
  };

  const commonNavLinkClasses = (isMobile = false) => `
    font-medium text-sm flex items-center transition-opacity hover:opacity-80
    ${transparent && !isMobile ? 'text-white/90' : 'text-gray-600'}
    ${isMobile ? 'text-white/90 justify-center py-3 w-full hover:bg-white/10 rounded-lg' : ''}
  `;

  const renderNavLinks = (isMobile = false) => (
    <>
      <button 
        onClick={() => handleNavLinkClick('HOME', 'about')} // Link to About section on LandingPage
        className={commonNavLinkClasses(isMobile)}
      >
        <Info className="w-4 h-4 mr-1" />
        About
      </button>
      <button 
        onClick={() => handleNavLinkClick('HOME', 'offerings')} // Link to Services section on LandingPage
        className={commonNavLinkClasses(isMobile)}
      >
        <Briefcase className="w-4 h-4 mr-1" />
        Services
      </button>
      <button 
        onClick={() => handleNavLinkClick('LEADERBOARD')}
        className={commonNavLinkClasses(isMobile)}
      >
        <Trophy className="w-4 h-4 mr-1" />
        Rankings
      </button>
      <button 
        onClick={() => handleNavLinkClick('CONTACT')}
        className={commonNavLinkClasses(isMobile)}
      >
        <Mail className="w-4 h-4 mr-1" />
        Contact
      </button>
    </>
  );

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${transparent ? 'bg-transparent pt-4' : 'bg-white/90 backdrop-blur-md border-b border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => handleNavLinkClick('HOME')}>
            <div className={`rounded-lg p-1.5 mr-2 transition-colors ${transparent ? 'bg-white/10 group-hover:bg-white/20' : 'bg-blue-600'}`}>
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-extrabold tracking-tight ${transparent ? 'text-white' : 'text-gray-900'}`}>FixMyProblem</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {renderNavLinks()}

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
                onClick={() => handleNavLinkClick('AUTH')}
                className={`text-sm font-bold px-5 py-2 rounded-full transition-all ${transparent ? 'bg-white text-slate-900 hover:bg-blue-50' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${transparent ? 'text-white' : 'text-gray-600'}`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center animate-fade-in-down">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="flex flex-col items-center space-y-4 w-full px-6">
            {renderNavLinks(true)}

            {user ? (
              <div className="flex flex-col items-center space-y-4 pt-4 mt-4 border-t border-slate-700 w-full">
                 {user.profilePicUrl ? (
                   <img src={user.profilePicUrl} alt={user.name} className="w-16 h-16 rounded-full border-2 border-white object-cover" />
                ) : (
                   <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white text-3xl">
                      {user.name.charAt(0)}
                   </div>
                )}
                <div className="text-center text-white">
                  <div className="font-semibold text-xl">{user.name}</div>
                  <div className="uppercase text-sm tracking-wider text-white/60">{user.role}</div>
                </div>
                <button
                  onClick={logout}
                  className="w-full max-w-xs bg-blue-600 text-white py-3 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <LogOut className="h-5 w-5 mr-2" /> Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleNavLinkClick('AUTH')}
                className="w-full max-w-xs bg-blue-600 text-white py-3 rounded-full font-bold hover:bg-blue-700 transition-colors mt-4"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;