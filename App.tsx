
import React, { useState, useEffect } from 'react';
import { AppProvider, useStore } from './context/Store.tsx';
import { UserRole } from './types.ts';
import { Loader2 } from 'lucide-react';

import Navbar from './components/Navbar.tsx';
import ScrollToTopButton from './components/ScrollToTopButton.tsx';

import LandingPage from './pages/LandingPage.tsx';
import AuthPage from './pages/AuthPage.tsx';
import AdminPortal from './pages/AdminPortal.tsx';
import StudentPortal from './pages/StudentPortal.tsx';
import CompanyPortal from './pages/CompanyPortal.tsx';
import LegalPage from './pages/LegalPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import Leaderboard from './pages/Leaderboard.tsx';
import PaymentHistory from './pages/PaymentHistory.tsx';
import ProfileDossier from './pages/ProfileDossier.tsx';
import Error404 from './pages/Error404.tsx';

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY' | 'PROFILE_VIEW' | 'ERROR_404';

const FixMyProblemApp: React.FC = () => {
  const { user, loading, siteConfig } = useStore();
  const [view, setView] = useState<ViewState>('HOME');
  const [authRole, setAuthRole] = useState<UserRole>(UserRole.STUDENT);
  const [targetProfileId, setTargetProfileId] = useState<string | null>(null);

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
        <Loader2 className="w-12 h-12 animate-spin text-coral" />
    </div>
  );

  let currentContent;
  
  // View Routing Logic
  if (view === 'HOME') {
    currentContent = <LandingPage onLoginClick={(role) => { setAuthRole(role); navigateTo('AUTH'); }} onViewChange={navigateTo} onProfileClick={handleOpenProfile} />;
  } else if (view === 'LEADERBOARD') {
    currentContent = <Leaderboard onProfileClick={handleOpenProfile} />;
  } else if (view === 'PRIVACY' || view === 'TERMS') {
    currentContent = <LegalPage type={view} />;
  } else if (view === 'CONTACT') {
    currentContent = <ContactPage />;
  } else if (view === 'AUTH' && !user) {
    currentContent = <AuthPage initialRole={authRole} onBack={() => navigateTo('HOME')} />;
  } else if (view === 'PROFILE_VIEW' && targetProfileId) {
    currentContent = <ProfileDossier userId={targetProfileId} onBack={() => navigateTo('HOME')} />;
  } else if (user) {
    if (view === 'DASHBOARD') {
      if (user.role === UserRole.ADMIN) currentContent = <AdminPortal onProfileClick={handleOpenProfile} />;
      else if (user.role === UserRole.COMPANY) currentContent = <CompanyPortal onProfileClick={handleOpenProfile} />;
      else currentContent = <StudentPortal onProfileClick={handleOpenProfile} />;
    } else if (view === 'PAYMENT_HISTORY') {
      currentContent = <PaymentHistory />;
    } else {
      currentContent = <Error404 onBack={() => navigateTo('HOME')} />;
    }
  } else if (view === 'ERROR_404') {
    currentContent = <Error404 onBack={() => navigateTo('HOME')} />;
  } else {
    currentContent = <Error404 onBack={() => navigateTo('HOME')} />;
  }

  const showGlobalNav = view !== 'AUTH' && view !== 'ERROR_404';

  return (
    <div className="font-sans text-black bg-paper min-h-screen transition-all flex flex-col" style={{ fontSize: `${siteConfig.baseFontSize}px` }}>
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
