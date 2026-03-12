
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Problem, User } from '../types.ts';

import Navbar from '../components/Navbar.tsx';
import ProblemDetailModal from '../components/ProblemDetailModal.tsx';

// Modular Sections
import Hero from '../components/landing/Hero.tsx';
import About from '../components/landing/About.tsx';
import Offerings from '../components/landing/Offerings.tsx';
import HowItWorks from '../components/landing/HowItWorks.tsx';
import Features from '../components/landing/Features.tsx';
import ImpactStories from '../components/landing/ImpactStories.tsx';
import Leadership from '../components/landing/Leadership.tsx';
import LiveFeed from '../components/landing/LiveFeed.tsx';
import LeaderboardSnippet from '../components/landing/LeaderboardSnippet.tsx';
import Testimonials from '../components/landing/Testimonials.tsx';
import FAQ from '../components/landing/FAQ.tsx';
import CTA from '../components/landing/CTA.tsx';
import LandingFooter from '../components/landing/LandingFooter.tsx';
import PracticeStats from '../components/landing/PracticeStats.tsx';

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD' | 'PAYMENT_HISTORY' | 'PROFILE_VIEW' | 'SIMULATIONS';

interface LandingPageProps {
  onLoginClick: (role: UserRole, isLogin?: boolean) => void;
  onViewChange: (view: any) => void;
  onProfileClick: (id: string) => void;
  onPageNav: (title: string, category: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onViewChange, onProfileClick, onPageNav }) => {
  const { problems, allUsers, user } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
  const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Global navigation listener for child sections
    const handleGlobalNav = (e: any) => {
        if (e.detail === 'DASHBOARD') {
           onViewChange('DASHBOARD');
        } else if (e.detail) {
           onViewChange(e.detail);
        }
    };
    window.addEventListener('nav-change', handleGlobalNav);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('nav-change', handleGlobalNav);
    };
  }, [onViewChange]);

  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const totalCompanies = allUsers.filter(u => u.role === UserRole.COMPANY).length;
    const totalStudents = allUsers.filter(u => u.role === UserRole.STUDENT).length;
    const openProblems = problems.filter(p => p.status === 'OPEN').length;
    const totalProblems = problems.length;
    const practiceCount = problems.filter(p => p.isSimulation || p.companyName.toLowerCase().includes('practice')).length;
    
    return { totalUsers, totalCompanies, totalStudents, openProblems, totalProblems, practiceCount };
  }, [allUsers, problems]);

  const topStudents = useMemo(() => 
    allUsers
      .filter(u => u.role === UserRole.STUDENT && (u.rating || 0) > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3)
  , [allUsers]);

  const handleOpenProblemDetails = (problem: Problem) => {
    setCurrentProblemForDetails(problem);
    setShowProblemDetailModal(true);
  };

  const handleSolveFromDetails = (problemId: string) => {
    setShowProblemDetailModal(false);
    onLoginClick(UserRole.STUDENT, false);
  };

  return (
    <div className="min-h-screen font-sans bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar onViewChange={onViewChange} transparent={!scrolled} onProfileClick={onProfileClick} />

      <Hero onLoginClick={onLoginClick} stats={stats} />
      
      <PracticeStats count={stats.practiceCount} onViewChange={onViewChange} />

      <About />
      
      <Offerings />
      
      <HowItWorks onLoginClick={onLoginClick} />
      
      <Features />
      
      <ImpactStories />
      
      <Leadership />
      
      <LiveFeed 
        problems={problems} 
        allUsers={allUsers} 
        onViewChange={onViewChange}
        onProblemClick={handleOpenProblemDetails}
        onProfileHover={() => {}}
        onProfileLeave={() => {}}
        showProfileCard={null}
        hoveredUser={null}
        onProfileClick={onProfileClick}
      />
      
      <LeaderboardSnippet 
        topStudents={topStudents}
        onViewChange={onViewChange}
        onProfileHover={() => {}}
        onProfileLeave={() => {}}
        showProfileCard={null}
        hoveredUser={null}
        onProfileClick={onProfileClick}
      />
      
      <Testimonials />
      
      <FAQ />
      
      <CTA onLoginClick={onLoginClick} />
      
      <LandingFooter onLoginClick={onLoginClick} onViewChange={onViewChange} onPageNav={onPageNav} />

      <ProblemDetailModal
        isOpen={showProblemDetailModal}
        onClose={() => setShowProblemDetailModal(false)}
        problem={currentProblemForDetails}
        onSolveClick={handleSolveFromDetails}
        onProfileClick={onProfileClick}
      />
    </div>
  );
};

export default LandingPage;
