
import React, { useState, useEffect } from 'react';
import { AppProvider, useStore } from './context/Store.tsx';
import { UserRole } from './types.ts';
import { Loader2, Zap, X, ShieldCheck, XCircle, Terminal, Sparkles } from 'lucide-react';

import Navbar from './components/Navbar.tsx';
import ScrollToTopButton from './components/ScrollToTopButton.tsx';
import CustomCursor from './components/CustomCursor.tsx';
import Modal from './components/Modal.tsx';

import LandingPage from './pages/LandingPage.tsx';
import AuthPage from './pages/AuthPage.tsx';
import AdminPortal from './pages/AdminPortal.tsx';
import StudentPortal from './pages/StudentPortal.tsx';
import CompanyPortal from './pages/CompanyPortal.tsx';
import MentorPortal from './pages/MentorPortal.tsx';
import SimulationHub from './pages/SimulationHub.tsx';
import LegalPage from './pages/LegalPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import Leaderboard from './pages/Leaderboard.tsx';
import PaymentHistory from './pages/PaymentHistory.tsx';
import ProfileDossier from './pages/ProfileDossier.tsx';
import Error404 from './pages/Error404.tsx';
import GenericInfoPage from './pages/GenericInfoPage.tsx';
import UsersDirectory from './pages/UsersDirectory.tsx';

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY' | 'PROFILE_VIEW' | 'ERROR_404' | 'GENERIC_PAGE' | 'SIMULATIONS' | 'USERS_DIRECTORY';

const AuditNotificationPopup: React.FC = () => {
  const { user, clearAuditNotification } = useStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user?.auditNotification && !user.auditNotification.read) {
      setShow(true);
    }
  }, [user?.auditNotification]);

  if (!show || !user?.auditNotification) return null;

  const isVerified = user.auditNotification.status === 'VERIFIED';

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="tactile-card bg-white p-10 md:p-12 rounded-[3rem] max-w-lg w-full border-4 border-black relative animate-pop">
            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-black flex items-center justify-center shadow-xl ${isVerified ? 'bg-forest text-citrus' : 'bg-coral text-white'}`}>
                {isVerified ? <ShieldCheck className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
            </div>
            
            <div className="text-center mt-12">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-black/10 mb-6 ${isVerified ? 'bg-forest/10 text-forest' : 'bg-coral/10 text-coral'}`}>
                    <Terminal className="w-3 h-3" /> Audit Dispatch Complete
                </div>
                <h2 className="text-3xl font-black tracking-tighter leading-none mb-4">
                    {isVerified ? 'Execution Verified.' : 'Execution Rejected.'}
                </h2>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-8">Node: {user.auditNotification.problemTitle}</p>
                
                <div className="p-6 bg-gray-50 border-2 border-black rounded-2xl text-left mb-8">
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-2">Mentor Review</p>
                    <p className="text-sm font-bold text-gray-700 italic leading-relaxed">"{user.auditNotification.feedback}"</p>
                </div>

                <button 
                  onClick={() => { setShow(false); clearAuditNotification(); }}
                  className="tactile-btn w-full bg-black text-white py-5 rounded-2xl font-black text-base uppercase tracking-widest hover:bg-forest flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5 text-citrus" /> Synchronize Grid
                </button>
            </div>
        </div>
    </div>
  );
};

const FixMyProblemApp: React.FC = () => {
  const { user, loading, siteConfig } = useStore();
  const [view, setView] = useState<ViewState>('HOME');
  const [authRole, setAuthRole] = useState<UserRole>(UserRole.STUDENT);
  const [targetProfileId, setTargetProfileId] = useState<string | null>(null);
  const [activePageData, setActivePageData] = useState<{ title: string; category: string; description?: string } | null>(null);

  useEffect(() => {
    const handleUrl = () => {
        const path = window.location.pathname;
        if (path.startsWith('/u/')) {
            const username = path.split('/u/')[1];
            if (username) { }
        }
    };
    handleUrl();
    window.addEventListener('popstate', handleUrl);
    return () => window.removeEventListener('popstate', handleUrl);
  }, []);

  useEffect(() => {
    if (user && view === 'AUTH') setView('DASHBOARD');
  }, [user]);

  const handleOpenProfile = (id: string) => {
    setTargetProfileId(id);
    setView('PROFILE_VIEW');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateTo = (newView: ViewState) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToInfoPage = (title: string, category: string) => {
    setActivePageData({ title, category });
    setView('GENERIC_PAGE');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
        <Loader2 className="w-12 h-12 animate-spin text-coral" />
    </div>
  );

  let currentContent;
  
  if (view === 'HOME') {
    currentContent = <LandingPage onLoginClick={(role) => { setAuthRole(role); navigateTo('AUTH'); }} onViewChange={navigateTo} onProfileClick={handleOpenProfile} onPageNav={navigateToInfoPage} />;
  } else if (view === 'LEADERBOARD') {
    currentContent = <Leaderboard onProfileClick={handleOpenProfile} />;
  } else if (view === 'USERS_DIRECTORY') {
    currentContent = <UsersDirectory onProfileClick={handleOpenProfile} />;
  } else if (view === 'SIMULATIONS') {
    currentContent = <SimulationHub onBack={() => navigateTo('HOME')} />;
  } else if (view === 'PRIVACY' || view === 'TERMS') {
    currentContent = <LegalPage type={view} />;
  } else if (view === 'CONTACT') {
    currentContent = <ContactPage />;
  } else if (view === 'AUTH' && !user) {
    currentContent = <AuthPage initialRole={authRole} onBack={() => navigateTo('HOME')} />;
  } else if (view === 'PROFILE_VIEW' && targetProfileId) {
    currentContent = <ProfileDossier userId={targetProfileId} onBack={() => navigateTo('HOME')} />;
  } else if (view === 'GENERIC_PAGE' && activePageData) {
    currentContent = <GenericInfoPage title={activePageData.title} category={activePageData.category} onBack={() => navigateTo('HOME')} />;
  } else if (user) {
    if (view === 'DASHBOARD') {
      if (user.role === UserRole.ADMIN) currentContent = <AdminPortal onProfileClick={handleOpenProfile} />;
      else if (user.role === UserRole.COMPANY) currentContent = <CompanyPortal onProfileClick={handleOpenProfile} />;
      else if (user.role === UserRole.MENTOR) currentContent = <MentorPortal onProfileClick={handleOpenProfile} />;
      else currentContent = <StudentPortal onProfileClick={handleOpenProfile} />;
    } else if (view === 'PAYMENT_HISTORY') {
      currentContent = <PaymentHistory />;
    } else {
      currentContent = <Error404 onBack={() => navigateTo('HOME')} />;
    }
  } else {
    currentContent = <Error404 onBack={() => navigateTo('HOME')} />;
  }

  const showGlobalNav = view !== 'AUTH' && view !== 'ERROR_404';

  return (
    <div className="font-sans text-black bg-paper min-h-screen transition-all flex flex-col" style={{ fontSize: `${siteConfig.baseFontSize}px` }}>
      <CustomCursor />
      <AuditNotificationPopup />
      {showGlobalNav && <Navbar onViewChange={navigateTo} transparent={view === 'HOME'} onProfileClick={handleOpenProfile} />}
      <main className="w-full flex-grow">
        {currentContent}
      </main>
      <ScrollToTopButton />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <FixMyProblemApp />
    </AppProvider>
  );
};

export default App;
