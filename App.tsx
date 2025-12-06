import React, { useState, useEffect } from 'react';
import { AppProvider, useStore } from './context/Store';
import { UserRole } from './types';
import { Loader2 } from 'lucide-react';

// Import shared UI components
import Navbar from './components/Navbar';
import ScrollToTopButton from './components/ScrollToTopButton';


// Import page components
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import AdminPortal from './pages/AdminPortal';
import StudentPortal from './pages/StudentPortal';
import CompanyPortal from './pages/CompanyPortal';
import LegalPage from './pages/LegalPage'; // Renamed import
import ContactPage from './pages/ContactPage';
import Leaderboard from './pages/Leaderboard';
import DigitalSerenityPage from './pages/DigitalSerenityPage'; // New: Import DigitalSerenityPage

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'DIGITAL_SERENITY'; // New: Added DIGITAL_SERENITY

const FixMyProblemApp: React.FC = () => {
  const { user, loading, siteConfig } = useStore();
  const [view, setView] = useState<ViewState>('HOME');
  const [authRole, setAuthRole] = useState<UserRole>(UserRole.STUDENT);

  useEffect(() => {
    if (user) setView('DASHBOARD');
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ fontSize: `${siteConfig.baseFontSize}px` }}>
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  let currentContent;
  if (view === 'HOME' && !user) currentContent = <LandingPage onLoginClick={(role) => { setAuthRole(role); setView('AUTH'); }} onViewChange={setView} />;
  else if (view === 'LEADERBOARD') currentContent = <Leaderboard />;
  else if (view === 'PRIVACY' || view === 'TERMS') currentContent = <LegalPage type={view} />; // Use LegalPage
  else if (view === 'CONTACT') currentContent = <ContactPage />;
  else if (view === 'AUTH' && !user) currentContent = <AuthPage initialRole={authRole} onBack={() => setView('HOME')} />;
  else if (view === 'DIGITAL_SERENITY') currentContent = <DigitalSerenityPage />; // New: Render DigitalSerenityPage
  else if (user) {
      if (user.role === UserRole.ADMIN) currentContent = <AdminPortal />;
      else if (user.role === UserRole.COMPANY) currentContent = <CompanyPortal />;
      else currentContent = <StudentPortal />;
  } else {
      currentContent = <LandingPage onLoginClick={(role) => { setAuthRole(role); setView('AUTH'); }} onViewChange={setView} />;
  }

  // GLOBAL NAVBAR: Render navbar on all pages except the LandingPage (which has its own fancy one) and Auth page
  const showGlobalNav = view !== 'HOME' && view !== 'AUTH' && view !== 'DIGITAL_SERENITY'; // New: Exclude DigitalSerenityPage

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