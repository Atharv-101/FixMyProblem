
import React, { useState, useEffect } from 'react';
import { AppProvider, useStore } from './context/Store';
import { UserRole } from './types';
import { Loader2 } from 'lucide-react';

import Navbar from './components/Navbar';
import ScrollToTopButton from './components/ScrollToTopButton';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AdminPortal from './pages/AdminPortal';
import StudentPortal from './pages/StudentPortal';
import CompanyPortal from './pages/CompanyPortal';
import LegalPage from './pages/LegalPage';
import ContactPage from './pages/ContactPage';
import Leaderboard from './pages/Leaderboard';
import PaymentHistory from './pages/PaymentHistory';

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY';

const FixMyProblemApp: React.FC = () => {
  const { user, loading, siteConfig } = useStore();
  const [view, setView] = useState<ViewState>('HOME');
  const [authRole, setAuthRole] = useState<UserRole>(UserRole.STUDENT);

  useEffect(() => {
    if (user && view === 'AUTH') setView('DASHBOARD');
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen" style={{ fontSize: `${siteConfig.baseFontSize}px` }}>
      {showGlobalNav && <Navbar onViewChange={setView} />}
      {currentContent}
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
