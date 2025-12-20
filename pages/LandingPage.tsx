import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/Store';
import { UserRole, Problem, User } from '../types';
import {
  Code2, Trophy, Terminal, IndianRupee, Activity, ArrowUpRight, Cpu, Globe, CheckCircle2, Shield,
  Lightbulb, GraduationCap, Building2, Wallet, Users, LayoutDashboard, Rocket, Zap, HeartHandshake, Award, MessageSquareText,
  // Add missing Lucide React icons
  Search, Star, ChevronRight, Facebook, Twitter, Linkedin, Instagram, Landmark, Handshake, Gem, UserCircle2, Briefcase, Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ProblemDetailModal from '../components/ProblemDetailModal'; // Import ProblemDetailModal
import ProfileCard from '../components/ProfileCard'; // Import ProfileCard

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD';

interface LandingPageProps {
  onLoginClick: (role: UserRole) => void;
  onViewChange: (view: ViewState) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onViewChange }) => {
  const { problems, allUsers } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false); // State for problem detail modal
  const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null); // State for selected problem

  // Profile Card hover states
  const [showProfileCard, setShowProfileCard] = useState<string | null>(null); // Stores userId for hovered profile
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
    
    const totalProblems = problems.length;
    const openProblems = problems.filter(p => p.status === 'OPEN').length;
    const totalBountyValue = problems.reduce((acc, p) => {
      const val = parseFloat(p.bounty.replace(/[^0-9.]/g, '')) || 0;
      return acc + val;
    }, 0);

    return { totalUsers, totalCompanies, totalStudents, openProblems, totalProblems, totalBountyValue };
  }, [allUsers, problems]);

  const topStudents = useMemo(() => allUsers.filter(u => u.role === UserRole.STUDENT && (u.rating || 0) > 0).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3), [allUsers]);

  const testimonials = [
    {
      quote: "FixMyProblem transformed my coding skills. Solving real company issues gave me an edge in interviews and a portfolio I'm proud of!",
      author: "Priya Sharma",
      role: "Student, IIT Delhi",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      quote: "We struggled with a niche bug for weeks. FixMyProblem delivered a brilliant solution from a talented student in days. Incredible platform!",
      author: "Mark Davis",
      role: "CTO, InnovateX",
      avatar: "https://randomuser.me/api/portraits/men/34.jpg"
    },
    {
      quote: "The bounties are great, but the recognition and direct feedback from companies are priceless. Highly recommend for any student looking to stand out.",
      author: "Ahmed Khan",
      role: "Student, BITS Pilani",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg"
    },
  ];

  const faqs = [
    {
      question: "What is FixMyProblem?",
      answer: "FixMyProblem is a decentralized platform connecting companies with technical challenges to talented university students who can solve them for a bounty. We're bridging the gap between academic talent and industry needs."
    },
    {
      question: "How do students benefit from FixMyProblem?",
      answer: "Students gain invaluable real-world experience, build a verifiable portfolio with solutions to genuine industry problems, earn significant bounties, and get recognized by leading companies—often leading to internships, job offers, or valuable professional connections."
    },
    {
      question: "How do companies benefit from FixMyProblem?",
      answer: "Companies get innovative, cost-effective solutions to their technical problems, rapid prototyping, access to a global pool of fresh talent, accelerate their R&D, and identify potential future hires before they even graduate."
    },
    {
      question: "Is there a cost for companies to post a problem?",
      answer: "Companies pay a bounty for each problem, which is awarded directly to the student whose solution is accepted. There are no upfront platform fees to post a challenge, ensuring you only pay for successful outcomes."
    },
    {
      question: "How are solutions evaluated and bounties awarded?",
      answer: "Companies rigorously review submitted solutions, providing detailed feedback and ratings. Once a company accepts a solution, the pre-determined bounty is securely released to the student, and the problem is marked as 'closed'."
    },
    {
      question: "What kind of problems can be posted?",
      answer: "We welcome a wide range of technical challenges, including but not limited to, software development bugs, algorithm optimization, data analysis tasks, UI/UX design challenges, cybersecurity vulnerabilities, and innovative research proposals. If it's a tech problem, our students are ready!"
    }
  ];

  const leadershipTeam = [
    {
      name: "Dr. Alok Sharma",
      title: "Founder & CEO",
      bio: "A visionary in decentralized tech and education, Alok founded FixMyProblem to democratize innovation and talent discovery.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Ms. Kavya Reddy",
      title: "Head of Student Success",
      bio: "With a background in career development and mentorship, Kavya ensures students thrive and maximize their potential on the platform.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Mr. Raj Singh",
      title: "Chief Solutions Architect",
      bio: "Raj brings years of industry expertise to guide problem structuring and ensure high-quality solution delivery for companies.",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cfc38eb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      linkedin: "#",
      twitter: "#"
    }
  ];

  const impactStories = [
    {
      title: "Optimizing Supply Chain Logistics for GlobalFlow",
      description: "A student team developed a machine learning model that reduced GlobalFlow's logistics costs by 15% through route optimization.",
      icon: <LayoutDashboard className="w-8 h-8 text-blue-400" />,
      image: "https://images.unsplash.com/photo-1628126131338-04a43878b209?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Supply Chain Optimization"
    },
    {
      title: "Developing a Secure Microservice for FinTech Innovations",
      description: "Our student expert designed and implemented a secure, scalable microservice architecture, enhancing FinTech's transaction processing by 20%.",
      icon: <Shield className="w-8 h-8 text-green-400" />,
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Secure Microservice Development"
    },
    {
      title: "Enhancing User Engagement for E-Commerce Giant PixelMart",
      description: "Through advanced data analytics, a student helped PixelMart revamp their recommendation engine, leading to a 10% increase in user engagement.",
      icon: <Users className="w-8 h-8 text-purple-400" />,
      image: "https://images.unsplash.com/photo-1497215729113-d15ee6b0a5a0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "User Engagement Enhancement"
    }
  ];

  const handleOpenProblemDetails = (problem: Problem) => {
    setCurrentProblemForDetails(problem);
    setShowProblemDetailModal(true);
  };

  const handleSolveFromDetails = (problemId: string) => {
    // For landing page, clicking solve should take them to auth page as a student
    setShowProblemDetailModal(false); // Close details modal first
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
    <div className="min-h-screen font-sans bg-slate-950 text-white selection:bg-blue-500 selection:text-white">
      <Navbar onViewChange={onViewChange} transparent={!scrolled} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-br from-slate-950 to-indigo-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[1000px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow delay-500"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center px-6 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-bold mb-8 animate-fade-in-up shadow-md" aria-label="Innovation status: Live">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Accelerating Innovation, One Problem at a Time!
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-tight animate-fade-in-up delay-100">
            DEBUG THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">WORLD</span><br/>
            BUILD YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">LEGACY</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up delay-200">
            The decentralized marketplace connecting cutting-edge companies with brilliant student minds to solve real-world technical challenges.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fade-in-up delay-300">
             <button 
               onClick={() => onLoginClick(UserRole.STUDENT)}
               className="group relative px-6 sm:px-10 py-3 sm:py-4 bg-blue-600 rounded-full font-bold text-lg sm:text-xl text-white overflow-hidden shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 hover:bg-blue-700"
               aria-label="Start Hacking - Join as a Student"
             >
               <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 origin-left"></div>
               <span className="relative flex items-center justify-center">Start Hacking <Terminal className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" /></span>
             </button>
             <button 
               onClick={() => onLoginClick(UserRole.COMPANY)}
               className="px-6 sm:px-10 py-3 sm:py-4 bg-transparent border border-slate-700 text-white rounded-full font-bold text-lg sm:text-xl hover:bg-slate-800 transition-colors flex items-center justify-center shadow-md"
               aria-label="Post a Bounty - Join as a Company"
             >
               Post a Bounty <IndianRupee className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
             </button>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto animate-fade-in-up delay-400">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm flex flex-col items-center">
                  <Lightbulb className="w-8 h-8 text-blue-400 mb-3" />
                  <span className="text-3xl font-bold text-white">{stats.totalProblems}</span>
                  <span className="text-sm text-slate-400">Total Challenges</span>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm flex flex-col items-center">
                  <Terminal className="w-8 h-8 text-green-400 mb-3" />
                  <span className="text-3xl font-bold text-white">{stats.openProblems}</span>
                  <span className="text-sm text-slate-400">Open Challenges</span>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm flex flex-col items-center">
                  <Users className="w-8 h-8 text-purple-400 mb-3" />
                  <span className="text-3xl font-bold text-white">{stats.totalStudents}</span>
                  <span className="text-sm text-slate-400">Students Joined</span>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm flex flex-col items-center">
                  <Building2 className="w-8 h-8 text-red-400 mb-3" />
                  <span className="text-3xl font-bold text-white">{stats.totalCompanies}</span>
                  <span className="text-sm text-slate-400">Companies Partnered</span>
              </div>
          </div>
        </div>
      </section>

      {/* About FixMyProblem Section */}
      <section id="about" className="py-24 px-4 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">FixMyProblem</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
            Our mission is to foster a vibrant ecosystem where innovation meets talent, driving progress and empowering the next generation of tech leaders.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl animate-fade-in-up" aria-labelledby="mission-heading">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400 border border-blue-500/50">
                <Lightbulb className="w-10 h-10" />
              </div>
              <h3 id="mission-heading" className="font-bold text-xl md:text-2xl mb-3 text-white">Our Mission</h3>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">To bridge the gap between academic brilliance and industry demands by providing a platform for real-world problem-solving.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl animate-fade-in-up delay-100" aria-labelledby="vision-heading">
              <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-400 border border-purple-500/50">
                <Rocket className="w-10 h-10" />
              </div>
              <h3 id="vision-heading" className="font-bold text-xl md:text-2xl mb-3 text-white">Our Vision</h3>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">To be the global leader in decentralized innovation, empowering students and accelerating companies worldwide.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl animate-fade-in-up delay-200" aria-labelledby="values-heading">
              <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400 border border-green-500/50">
                <Handshake className="w-10 h-10" />
              </div>
              <h3 id="values-heading" className="font-bold text-xl md:text-2xl mb-3 text-white">Our Values</h3>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">Innovation, Collaboration, Excellence, Integrity, and Empowerment for every participant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Offerings (Services) Section */}
      <section id="offerings" className="py-24 px-4 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Offerings</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
            Providing unparalleled value for both ambitious students and innovative companies.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl animate-fade-in-up text-left" aria-labelledby="offerings-students-heading">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400 border border-blue-500/50">
                <GraduationCap className="w-10 h-10" />
              </div>
              <h3 id="offerings-students-heading" className="font-bold text-xl md:text-2xl mb-3 text-white">For Students: Grow & Earn</h3>
              <ul className="text-slate-400 text-base md:text-lg leading-relaxed space-y-3 list-disc list-inside">
                <li>Access to exclusive industry problems and real-world projects.</li>
                <li>Opportunities to earn competitive bounties and build a strong portfolio.</li>
                <li>Direct exposure and networking with leading tech companies.</li>
                <li>Skill validation and professional development through practical application.</li>
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl animate-fade-in-up delay-100 text-left" aria-labelledby="offerings-companies-heading">
              <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-400 border border-purple-500/50">
                <Building2 className="w-10 h-10" />
              </div>
              <h3 id="offerings-companies-heading" className="font-bold text-xl md:text-2xl mb-3 text-white">For Companies: Innovate & Discover</h3>
              <ul className="text-slate-400 text-base md:text-lg leading-relaxed space-y-3 list-disc list-inside">
                <li>Rapid, cost-effective solutions to pressing technical challenges.</li>
                <li>Access to a global pool of diverse, innovative student talent.</li>
                <li>Accelerated R&D and fresh perspectives on complex problems.</li>
                <li>A unique pipeline for identifying and recruiting future top-tier talent.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Students */}
      <section className="py-24 px-4 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
            How Students <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Debug & Earn</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
            Ignite your career, prove your skills, and get rewarded for your intellect.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl animate-fade-in-up">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400 border border-blue-500/50">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-3 text-white">1. Discover Challenges</h3>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">Browse a diverse range of real-world technical problems posted by companies across industries.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl animate-fade-in-up delay-100">
              <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-400 border border-purple-500/50">
                <Code2 className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-3 text-white">2. Craft Solutions</h3>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">Apply your expertise to develop innovative solutions, from code fixes to detailed architectural proposals.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl animate-fade-in-up delay-200">
              <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400 border border-green-500/50">
                <Wallet className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-3 text-white">3. Earn & Grow</h3>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">Get recognized, receive bounties upon solution acceptance, and build a powerful, verifiable portfolio.</p>
            </div>
          </div>
          <button 
            onClick={() => onLoginClick(UserRole.STUDENT)}
            className="mt-20 group relative px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 rounded-full font-bold text-lg sm:text-xl text-white overflow-hidden shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 hover:bg-blue-700"
            aria-label="Start Your Journey - Join as a Student"
          >
            <span className="relative flex items-center justify-center">Start Your Journey <GraduationCap className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" /></span>
          </button>
        </div>
      </section>

      {/* How It Works - Companies */}
      <section className="py-24 px-4 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
            How Companies <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Innovate & Recruit</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
            Accelerate your projects and discover top-tier talent from around the globe.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl animate-fade-in-up">
              <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400 border border-red-500/50">
                <Lightbulb className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-3 text-white">1. Post Challenges</h3>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">Clearly define your technical problems, set a bounty, and reach a vast network of skilled students.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl animate-fade-in-up delay-100">
              <div className="w-20 h-20 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-400 border border-orange-500/50">
                <LayoutDashboard className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-3 text-white">2. Review & Evaluate</h3>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">Easily manage and review multiple solutions, provide feedback, and identify the best fit for your needs.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-xl animate-fade-in-up delay-200">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400 border border-blue-500/50">
                <Rocket className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-xl md:text-2xl mb-3 text-white">3. Reward & Recruit</h3>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">Award bounties to winning solutions and tap into a direct pipeline for future talent acquisition.</p>
            </div>
          </div>
          <button 
            onClick={() => onLoginClick(UserRole.COMPANY)}
            className="mt-20 group relative px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 rounded-full font-bold text-lg sm:text-xl text-white overflow-hidden shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 hover:bg-purple-700"
            aria-label="Accelerate Your Project - Join as a Company"
          >
            <span className="relative flex items-center justify-center">Accelerate Your Project <Building2 className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" /></span>
          </button>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-24 px-4 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">FixMyProblem</span>?
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
            A platform built for growth, innovation, and direct impact.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 text-left shadow-lg animate-fade-in-up">
              <Zap className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="font-bold text-xl mb-2 text-white">Real-world Impact</h3>
              <p className="text-slate-400">Solve actual industry problems, not just theoretical exercises. Your code makes a difference.</p>
            </div>
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 text-left shadow-lg animate-fade-in-up delay-100">
              <Award className="w-10 h-10 text-pink-400 mb-4" />
              <h3 className="font-bold text-xl mb-2 text-white">Skill Validation</h3>
              <p className="text-slate-400">Build a verifiable track record of successful solutions, validating your expertise to potential employers.</p>
            </div>
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 text-left shadow-lg animate-fade-in-up delay-200">
              <Globe className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="font-bold text-xl mb-2 text-white">Global Talent Pool</h3>
              <p className="text-slate-400">Companies gain access to a diverse pool of bright minds from universities worldwide.</p>
            </div>
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 text-left shadow-lg animate-fade-in-up delay-300">
              <HeartHandshake className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="font-bold text-xl mb-2 text-white">Direct Engagement</h3>
              <p className="text-slate-400">Interact directly with companies and students, fostering valuable connections and mentorship opportunities.</p>
            </div>
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 text-left shadow-lg animate-fade-in-up delay-400">
              <Trophy className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="font-bold text-xl mb-2 text-white">Reputation Building</h3>
              <p className="text-slate-400">Students build a strong public profile based on their problem-solving track record and company ratings.</p>
            </div>
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 text-left shadow-lg animate-fade-in-up delay-500">
              <Code2 className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="font-bold text-xl mb-2 text-white">Continuous Learning</h3>
              <p className="text-slate-400">Stay sharp by consistently tackling new and complex challenges, pushing your technical boundaries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stories (Projects/Case Studies) Section */}
      <section className="py-24 px-4 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Impact Stories</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
            Real problems, real solutions, real impact. See how FixMyProblem drives success.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {impactStories.map((story, index) => (
              <div key={index} className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 shadow-xl text-left flex flex-col items-center animate-fade-in-up" aria-labelledby={`story-title-${index}`}>
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
                  {story.icon}
                </div>
                <h3 id={`story-title-${index}`} className="font-bold text-xl mb-3 text-white text-center">{story.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed text-center">{story.description}</p>
                {/* Image Placeholder */}
                <img src={story.image} alt={story.alt} className="w-full h-40 object-cover rounded-lg mt-6 border border-slate-700"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Leadership (Team) Section */}
      <section className="py-24 px-4 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Leadership</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
            Meet the dedicated individuals driving the vision and growth of FixMyProblem.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {leadershipTeam.map((member, index) => (
              <div key={index} className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center animate-fade-in-up" aria-labelledby={`leader-name-${index}`}>
                <img src={member.image} alt={`Profile of ${member.name}`} className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-6" />
                <h3 id={`leader-name-${index}`} className="font-bold text-2xl text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 text-lg font-medium mb-4">{member.title}</p>
                <p className="text-slate-400 text-base leading-relaxed mb-6">{member.bio}</p>
                <div className="flex space-x-4 mt-auto">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors" aria-label={`LinkedIn profile of ${member.name}`}><Linkedin className="w-6 h-6" /></a>
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors" aria-label={`Twitter profile of ${member.name}`}><Twitter className="w-6 h-6" /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Feed */}
      <section className="bg-slate-950 py-24 px-4 relative border-b border-slate-800">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 text-center md:text-left">
               <div>
                 <h2 className="text-4xl md:text-5xl font-extrabold mb-4 flex flex-col md:flex-row items-center justify-center md:justify-start">
                    <Activity className="w-10 h-10 md:w-12 md:h-12 mr-3 text-green-500 mb-2 md:mb-0" /> <span className="text-white">Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Challenges</span></span>
                 </h2>
                 <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto md:mx-0">Latest technical challenges posted by our innovative industry partners.</p>
               </div>
               <button onClick={() => onViewChange('DASHBOARD')} className="mt-8 md:mt-0 flex items-center text-blue-400 hover:text-blue-300 font-bold text-lg group" aria-label="View All Challenges">
                  View All Challenges <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {problems.slice(0, 6).map((prob) => {
                const companyUser = allUsers.find(u => u.id === prob.companyId);
                return (
                <div 
                  key={prob.id} 
                  onClick={() => handleOpenProblemDetails(prob)} // Open problem details on card click
                  className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-8 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer group shadow-xl"
                  role="button"
                  aria-label={`View details for problem: ${prob.title}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="flex items-center relative"
                      onMouseEnter={() => handleProfileHover(prob.companyId)}
                      onMouseLeave={handleProfileLeave}
                    >
                       <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center mr-3 font-bold text-lg text-slate-300" aria-hidden="true">
                          {prob.companyName.charAt(0)}
                       </div>
                       <span className="text-slate-300 text-base font-medium cursor-help hover:underline">{prob.companyName}</span>
                       {showProfileCard === prob.companyId && hoveredUser && <ProfileCard user={hoveredUser} onClose={handleProfileLeave} positionClasses="top-full left-0 mt-2" />}
                    </div>
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-full text-sm font-mono font-bold group-hover:bg-green-500 group-hover:text-black transition-colors shadow-md">
                      {prob.bounty}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl md:text-2xl text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">{prob.title}</h3>
                  <p className="text-slate-400 text-base line-clamp-3 mb-5 font-light leading-relaxed">{prob.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mt-auto">
                     {prob.tags.slice(0,3).map(t => (
                        <span key={t} className="text-xs uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-full text-slate-500 border border-slate-700 font-medium">
                           {t}
                        </span>
                     ))}
                  </div>
                </div>
              )})}
              {problems.length === 0 && (
                  <div className="col-span-full text-center py-20 border border-dashed border-slate-800 rounded-2xl animate-fade-in">
                      <Cpu className="w-16 h-16 text-slate-700 mx-auto mb-6" aria-hidden="true" />
                      <p className="text-slate-500 text-lg">System idle. Waiting for new protocols to be deployed...</p>
                  </div>
              )}
            </div>
         </div>
      </section>

      {/* Leaderboard Snippet */}
      <section className="py-24 px-4 bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto text-center">
             <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
                Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Top Solvers</span>
             </h2>
             <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
                These students are leading the charge in innovation and problem-solving.
             </p>

             <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                 {topStudents.map((s, i) => (
                     <div key={s.id} className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 text-left shadow-xl flex items-center animate-fade-in-up">
                         <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0
                           ${i === 0 ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-400' : 
                             i === 1 ? 'bg-gray-100 text-gray-600 border-2 border-gray-400' : 
                             'bg-orange-100 text-orange-700 border-2 border-orange-400'}`} aria-hidden="true">
                           {i === 0 && <Trophy className="w-6 h-6 fill-yellow-500 text-yellow-500"/>}
                           {i === 1 && <Trophy className="w-6 h-6 fill-gray-400 text-gray-400"/>}
                           {i === 2 && <Trophy className="w-6 h-6 fill-orange-400 text-orange-400"/>}
                         </div>
                         <div 
                           className="flex-1 relative"
                           onMouseEnter={() => handleProfileHover(s.id)}
                           onMouseLeave={handleProfileLeave}
                         >
                             <h3 className="font-bold text-lg md:text-xl text-white cursor-help hover:underline">{s.name}</h3>
                             <p className="text-slate-400 text-sm">{s.university}</p>
                             <div className="flex items-center text-blue-400 mt-2">
                                 <Star className="w-4 h-4 fill-blue-400 mr-1" aria-hidden="true" />
                                 <span className="font-bold text-md">{s.rating?.toFixed(1) || '0.0'}</span>
                                 <span className="text-slate-500 text-xs ml-2">{s.solvedCount} Solved</span>
                             </div>
                             {showProfileCard === s.id && hoveredUser && <ProfileCard user={hoveredUser} onClose={handleProfileLeave} positionClasses="bottom-full left-0 mb-2" />}
                         </div>
                     </div>
                 ))}
                 {topStudents.length === 0 && (
                     <div className="col-span-full text-center py-10 text-slate-500 italic">No students to rank yet. Start solving!</div>
                 )}
             </div>
             <button 
                onClick={() => onViewChange('LEADERBOARD')}
                className="mt-16 group relative px-6 sm:px-8 py-3 sm:py-4 bg-slate-800 rounded-full font-bold text-lg sm:text-xl text-white overflow-hidden border border-slate-700 hover:border-blue-500 hover:bg-slate-700 transition-all hover:scale-105 active:scale-95"
                aria-label="View Full Leaderboard"
             >
               <span className="relative flex items-center justify-center">View Full Leaderboard <ArrowUpRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:translate-x-1 transition-transform" /></span>
             </button>
          </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
            What Our Users Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Saying</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
            Hear from students and companies who are already benefiting from FixMyProblem.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 shadow-xl text-left flex flex-col justify-between transform transition-transform hover:scale-105 animate-fade-in-up">
                <MessageSquareText className="w-10 h-10 text-blue-400 mb-6 flex-shrink-0" aria-hidden="true" />
                <p className="text-white text-base md:text-lg italic mb-6 leading-relaxed flex-grow">"{testimonial.quote}"</p>
                <div className="flex items-center mt-auto">
                  <img src={testimonial.avatar} alt={`Avatar of ${testimonial.author}`} className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-400" />
                  <div>
                    <p className="font-bold text-white text-md">{testimonial.author}</p>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 px-4 bg-slate-900 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-8 text-white leading-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Join the Mission</span>?
          </h2>
          <p className="text-lg md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Whether you're looking to solve challenging problems or find innovative solutions, FixMyProblem is your platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fade-in-up delay-300">
             <button 
               onClick={() => onLoginClick(UserRole.STUDENT)}
               className="group relative px-6 sm:px-10 py-3 sm:py-4 bg-blue-600 rounded-full font-bold text-lg sm:text-xl text-white overflow-hidden shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 hover:bg-blue-700"
               aria-label="Start Hacking - Join as a Student"
             >
               <span className="relative flex items-center justify-center">Start Hacking <Terminal className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" /></span>
             </button>
             <button 
               onClick={() => onLoginClick(UserRole.COMPANY)}
               className="px-6 sm:px-10 py-3 sm:py-4 bg-transparent border border-slate-700 text-white rounded-full font-bold text-lg sm:text-xl hover:bg-slate-800 transition-colors flex items-center justify-center shadow-md"
               aria-label="Post a Bounty - Join as a Company"
             >
               Post a Bounty <IndianRupee className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
             </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center text-white leading-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400">Questions</span>
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-800/60 p-6 rounded-xl border border-slate-700 shadow-lg animate-fade-in-up">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer font-bold text-lg md:text-xl text-white hover:text-blue-400 transition-colors" aria-expanded="false" aria-controls={`faq-answer-${index}`}>
                    {faq.question}
                    <ChevronRight className="w-6 h-6 transform transition-transform group-open:rotate-90 text-slate-400" />
                  </summary>
                  <p id={`faq-answer-${index}`} className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed">{faq.answer}</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-20 px-4 text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1: Logo & Description */}
          <div>
            <div className="flex items-center group mb-4">
              <div className="rounded-lg p-1.5 mr-2 bg-blue-600">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">FixMyProblem</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              The decentralized marketplace connecting cutting-edge companies with brilliant student minds.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => onViewChange('HOME')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => onViewChange('LEADERBOARD')} className="hover:text-white transition-colors">Leaderboard</button></li>
              <li><button onClick={() => onViewChange('CONTACT')} className="hover:text-white transition-colors">Contact Us</button></li>
              <li><button onClick={() => onViewChange('HOME')} className="hover:text-white transition-colors">About Us</button></li> {/* Points to home which will scroll to section */}
              <li><button onClick={() => onViewChange('HOME')} className="hover:text-white transition-colors">Our Services</button></li> {/* Points to home which will scroll to section */}
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><button onClick={() => onLoginClick(UserRole.COMPANY)} className="hover:text-white transition-colors">Post a Challenge</button></li>
              <li><button onClick={() => onLoginClick(UserRole.STUDENT)} className="hover:text-white transition-colors">Solve Challenges</button></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><button onClick={() => onViewChange('PRIVACY')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onViewChange('TERMS')} className="hover:text-white transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom section: Copyright & Admin Access */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center text-sm">
              <Shield className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>&copy; 2024 FixMyProblem Inc. All rights reserved.</span>
           </div>
           <button onClick={() => onLoginClick(UserRole.ADMIN)} className="text-xs text-slate-700 hover:text-slate-500 transition-colors" aria-label="Admin Access Portal">
              Admin Access
           </button>
        </div>
      </footer>

      {/* Problem Detail Modal for Landing Page */}
      <ProblemDetailModal
        isOpen={showProblemDetailModal}
        onClose={() => setShowProblemDetailModal(false)}
        problem={currentProblemForDetails}
        onSolveClick={handleSolveFromDetails} // Provide solve action to redirect to auth
      />
    </div>
  );
};

export default LandingPage;