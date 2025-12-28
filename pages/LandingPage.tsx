
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/Store';
import { UserRole, Problem, User } from '../types';

import Navbar from '../components/Navbar';
import ProblemDetailModal from '../components/ProblemDetailModal';
import ProfileCard from '../components/ProfileCard';

// Modular Sections
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import Offerings from '../components/landing/Offerings';
import HowItWorks from '../components/landing/HowItWorks';
import Features from '../components/landing/Features';
import ImpactStories from '../components/landing/ImpactStories';
import Leadership from '../components/landing/Leadership';
import LiveFeed from '../components/landing/LiveFeed';
import LeaderboardSnippet from '../components/landing/LeaderboardSnippet';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import LandingFooter from '../components/landing/LandingFooter';

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD';

interface LandingPageProps {
  onLoginClick: (role: UserRole) => void;
  onViewChange: (view: ViewState) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onViewChange }) => {
  const { problems, allUsers } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
  const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null);

  // Profile Card hover states
  const [showProfileCard, setShowProfileCard] = useState<string | null>(null);
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const totalCompanies = allUsers.filter(u => u.role === UserRole.COMPANY).length;
    const totalStudents = allUsers.filter(u => u.role === UserRole.STUDENT).length;
    const openProblems = problems.filter(p => p.status === 'OPEN').length;
    const totalProblems = problems.length;
    return { totalUsers, totalCompanies, totalStudents, openProblems, totalProblems };
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
    onViewChange('AUTH');
    onLoginClick(UserRole.STUDENT);
  };

  const handleProfileHover = (userId: string) => {
    const userToHover = allUsers.find(u => u.id === userId);
    setHoveredUser(userToHover || null);
    setShowProfileCard(userId);
  };

  const handleProfileLeave = () => {
    setShowProfileCard(null);
    setHoveredUser(null);
  };

  return (
    <div className="min-h-screen font-sans bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar onViewChange={onViewChange} transparent={!scrolled} />

      <Hero onLoginClick={onLoginClick} stats={stats} />
      
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
        onProfileHover={handleProfileHover}
        onProfileLeave={handleProfileLeave}
        showProfileCard={showProfileCard}
        hoveredUser={hoveredUser}
      />
      
      <LeaderboardSnippet 
        topStudents={topStudents}
        onViewChange={onViewChange}
        onProfileHover={handleProfileHover}
        onProfileLeave={handleProfileLeave}
        showProfileCard={showProfileCard}
        hoveredUser={hoveredUser}
      />
      
      <Testimonials />
      
      <FAQ />
      
      <CTA onLoginClick={onLoginClick} />
      
      <LandingFooter onLoginClick={onLoginClick} onViewChange={onViewChange} />

      <ProblemDetailModal
        isOpen={showProblemDetailModal}
        onClose={() => setShowProblemDetailModal(false)}
        problem={currentProblemForDetails}
        onSolveClick={handleSolveFromDetails}
      />
    </div>
  );
};

export default LandingPage;
