
import React, { useState, useEffect } from 'react';
import { AppProvider, useStore } from './context/Store.tsx';
import { UserRole } from './types.ts';
import { Loader2 } from 'lucide-react';

import Navbar from './components/Navbar.tsx';
import ScrollToTopButton from './components/ScrollToTopButton.tsx';
import CustomCursor from './components/CustomCursor.tsx';

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
import GenericInfoPage from './pages/GenericInfoPage.tsx';

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY' | 'PROFILE_VIEW' | 'ERROR_404' | 'GENERIC_PAGE';

const PAGE_CONTENT_MAP: Record<string, string> = {
  "Post Challenges": "Submit your engineering bottlenecks to a global pool of verified student talent. Our platform ensures that every challenge is scoped correctly and attracts high-quality solvers.",
  "Find Solutions": "Browse through a diverse list of technical problems posted by companies worldwide. Filter by tech stack and bounty size to find the perfect project for your skills.",
  "Technical Audit": "Our internal protocol ensures that every solution submitted undergoes a rigorous technical audit before the bounty is released.",
  "Bounty Scoping": "Need help deciding how much a bug is worth? Our AI-driven scoping tool helps companies set fair and attractive bounties based on complexity.",
  "Hiring Automation": "Skip the traditional HR loop. Our platform automates the identification of top-tier talent based on real-world performance on technical challenges.",
  "Competitions": "Join high-stakes engineering competitions hosted by leading tech firms. Prove your skills and win exclusive rewards and recognition.",
  "Hackathons": "Participate in 48-hour sprints to build innovative solutions for pressing industry needs. Collaborate with the brightest minds in the grid.",
  "Assessments": "Verify your technical proficiency through our standardized code assessments. Get a certified rating that companies trust.",
  "Workshops": "Level up your skills with workshops led by senior engineers from ATHinnovations and partner companies.",
  "College Festivals": "We partner with major university festivals to host exclusive on-campus coding challenges and recruitment drives.",
  "Internships": "Access exclusive internship opportunities at top-tier tech companies. Your performance on the grid serves as your ultimate resume.",
  "Jobs": "Secure full-time engineering roles. Companies use our grid rankings to find their next generation of developers.",
  "Scholarships": "Exceptional solvers are eligible for academic scholarships sponsored by ATHinnovations to support their technical education.",
  "Refer & Earn": "Grow the grid. Invite your friends or partner companies and earn a percentage of every bounty they solve or post.",
  "Courses": "Comprehensive engineering tracks designed to take you from academic theory to industry-ready implementation.",
  "Articles": "Deep dives into system architecture, decentralized protocols, and modern development best practices from our lead engineers.",
  "Blog Series": "Follow the journey of FixMyProblem and stay updated on the latest platform improvements and community successes.",
  "Engineering Tips": "Daily insights on optimizing code, securing microservices, and scaling distributed systems.",
  "5 Days Interview Prep": "A focused boot camp designed to help students ace technical interviews at FAANG and top startups.",
  "Code Assessments": "Practice with real-world technical problems that mimic the challenges faced by our partner companies.",
  "100-Day Coding Sprint": "The ultimate commitment to technical growth. Solve a challenge every day and climb to the top of the global rankings.",
  "About Us": "FixMyProblem is a mission-critical platform by ATHinnovations dedicated to democratizing engineering challenges and identifying the world's best student talent.",
  "Careers": "We're building the future of technical work. Join the ATHinnovations team and help us scale the FixMyProblem protocol.",
  "Branding Guidelines": "Resources and guidelines for using the FixMyProblem and ATHinnovations brand assets in your own projects.",
  "Rewards Program": "Earn reputation points for every successful solve and unlock exclusive perks, early access to bounties, and hardware rewards.",
  "FAQ": "Got questions? We've got answers. Everything you need to know about bounties, security, and using the platform.",
  "Sitemap": "A comprehensive directory of all the nodes and protocols available within the FixMyProblem grid.",
  "Testimonials": "Hear from the companies who fixed their roadblocks and the students who earned their way to the top.",
  "Join Us": "Become part of the most elite engineering network in the world. Register your profile today and start your journey on the grid."
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
    const description = PAGE_CONTENT_MAP[title];
    setActivePageData({ title, category, description });
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
  } else if (view === 'PRIVACY' || view === 'TERMS') {
    currentContent = <LegalPage type={view} />;
  } else if (view === 'CONTACT') {
    currentContent = <ContactPage />;
  } else if (view === 'AUTH' && !user) {
    currentContent = <AuthPage initialRole={authRole} onBack={() => navigateTo('HOME')} />;
  } else if (view === 'PROFILE_VIEW' && targetProfileId) {
    currentContent = <ProfileDossier userId={targetProfileId} onBack={() => navigateTo('HOME')} />;
  } else if (view === 'GENERIC_PAGE' && activePageData) {
    currentContent = <GenericInfoPage title={activePageData.title} category={activePageData.category} description={activePageData.description} onBack={() => navigateTo('HOME')} />;
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
  } else {
    currentContent = <Error404 onBack={() => navigateTo('HOME')} />;
  }

  const showGlobalNav = view !== 'AUTH' && view !== 'ERROR_404';

  return (
    <div className="font-sans text-black bg-paper min-h-screen transition-all flex flex-col" style={{ fontSize: `${siteConfig.baseFontSize}px` }}>
      <CustomCursor />
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
