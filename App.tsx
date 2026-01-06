
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AppProvider, useStore } from './context/Store.tsx';
import { UserRole } from './types.ts';
import { Loader2, Zap, X, ShieldCheck, XCircle, Terminal, Sparkles } from 'lucide-react';

import Navbar from './components/Navbar.tsx';
import ScrollToTopButton from './components/ScrollToTopButton.tsx';
import CustomCursor from './components/CustomCursor.tsx';

// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage.tsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.tsx'));
const AdminPortal = lazy(() => import('./pages/AdminPortal.tsx'));
const StudentPortal = lazy(() => import('./pages/StudentPortal.tsx'));
const CompanyPortal = lazy(() => import('./pages/CompanyPortal.tsx'));
const MentorPortal = lazy(() => import('./pages/MentorPortal.tsx'));
const SimulationHub = lazy(() => import('./pages/SimulationHub.tsx'));
const LegalPage = lazy(() => import('./pages/LegalPage.tsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.tsx'));
const Leaderboard = lazy(() => import('./pages/Leaderboard.tsx'));
const PaymentHistory = lazy(() => import('./pages/PaymentHistory.tsx'));
const ProfileDossier = lazy(() => import('./pages/ProfileDossier.tsx'));
const Error404 = lazy(() => import('./pages/Error404.tsx'));
const GenericInfoPage = lazy(() => import('./pages/GenericInfoPage.tsx'));
const UsersDirectory = lazy(() => import('./pages/UsersDirectory.tsx'));

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY' | 'PROFILE_VIEW' | 'ERROR_404' | 'GENERIC_PAGE' | 'SIMULATIONS' | 'USERS_DIRECTORY';

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-paper animate-fade-in">
    <div className="relative">
      <Loader2 className="w-16 h-16 animate-spin text-coral" />
      <Zap className="w-6 h-6 text-citrus absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-citrus" />
    </div>
    <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Synchronizing Grid Assets...</p>
  </div>
);

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
        <Suspense fallback={<LoadingFallback />}>
          {currentContent}
        </Suspense>
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
