
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

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY';

const FixMyProblemApp: React.FC = () => {
  const { user, loading, siteConfig } = useStore();
  const [view, setView] = useState<ViewState>('HOME');
  const [authRole, setAuthRole] = useState<UserRole>(UserRole.STUDENT);

  useEffect(() => {
    if (user && view === 'AUTH') setView('DASHBOARD');
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
        <Loader2 className="w-12 h-12 animate-spin text-coral" />
    </div>
  );

  let currentContent;
  if (view === 'HOME' && !user) currentContent = <LandingPage onLoginClick={(role) => { setAuthRole(role); setView('AUTH'); }} onViewChange={setView} />;
  else if (view === 'LEADERBOARD') currentContent = <Leaderboard />;
  else if (view === 'PRIVACY' || view === 'TERMS') currentContent = <LegalPage type={view} />;
  else if (view === 'CONTACT') currentContent = <ContactPage />;
  else if (view === 'PAYMENT_HISTORY') currentContent = <PaymentHistory />;
  else if (view === 'AUTH' && !user) currentContent = <AuthPage initialRole={authRole} onBack={() => setView('HOME')} />;
  else if (user) {
      if (view === 'DASHBOARD') {
        if (user.role === UserRole.ADMIN) currentContent = <AdminPortal />;
        else if (user.role === UserRole.COMPANY) currentContent = <CompanyPortal />;
        else currentContent = <StudentPortal />;
      } else {
        currentContent = <LandingPage onLoginClick={(role) => { setAuthRole(role); setView('AUTH'); }} onViewChange={setView} />;
      }
  } else {
      currentContent = <LandingPage onLoginClick={(role) => { setAuthRole(role); setView('AUTH'); }} onViewChange={setView} />;
  }

  const showGlobalNav = view !== 'HOME' && view !== 'AUTH';

  return (
    <div className="font-sans text-black bg-paper min-h-screen transition-all" style={{ fontSize: `${siteConfig.baseFontSize}px` }}>
      {showGlobalNav && <Navbar onViewChange={setView} />}
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
