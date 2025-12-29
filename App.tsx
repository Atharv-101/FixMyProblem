
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

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY' | 'PROFILE_VIEW';

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
        <Loader2 className="w-12 h-12 animate-spin text-coral" />
    </div>
  );

  let currentContent;
  if (view === 'HOME' && !user) currentContent = <LandingPage onLoginClick={(role) => { setAuthRole(role); setView('AUTH'); }} onViewChange={setView} onProfileClick={handleOpenProfile} />;
  else if (view === 'LEADERBOARD') currentContent = <Leaderboard onProfileClick={handleOpenProfile} />;
  else if (view === 'PRIVACY' || view === 'TERMS') currentContent = <LegalPage type={view} />;
  else if (view === 'CONTACT') currentContent = <ContactPage />;
  else if (view === 'PAYMENT_HISTORY') currentContent = <PaymentHistory />;
  else if (view === 'PROFILE_VIEW' && targetProfileId) currentContent = <ProfileDossier userId={targetProfileId} onBack={() => setView('DASHBOARD')} />;
  else if (view === 'AUTH' && !user) currentContent = <AuthPage initialRole={authRole} onBack={() => setView('HOME')} />;
  else if (user) {
      if (view === 'DASHBOARD') {
        if (user.role === UserRole.ADMIN) currentContent = <AdminPortal onProfileClick={handleOpenProfile} />;
        else if (user.role === UserRole.COMPANY) currentContent = <CompanyPortal onProfileClick={handleOpenProfile} />;
        else currentContent = <StudentPortal onProfileClick={handleOpenProfile} />;
      } else {
        currentContent = <LandingPage onLoginClick={(role) => { setAuthRole(role); setView('AUTH'); }} onViewChange={setView} onProfileClick={handleOpenProfile} />;
      }
  } else {
      currentContent = <LandingPage onLoginClick={(role) => { setAuthRole(role); setView('AUTH'); }} onViewChange={setView} onProfileClick={handleOpenProfile} />;
  }

  const showGlobalNav = view !== 'HOME' && view !== 'AUTH' && view !== 'PROFILE_VIEW';

  return (
    <div className="font-sans text-black bg-paper min-h-screen transition-all" style={{ fontSize: `${siteConfig.baseFontSize}px` }}>
      {showGlobalNav && <Navbar onViewChange={setView} onProfileClick={handleOpenProfile} />}
      <main className="w-full">
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
