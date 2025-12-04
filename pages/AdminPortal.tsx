import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store';
import { UserRole, Problem, User } from '../types';
// Add Briefcase to the import statement
import { Users, CheckCircle2, Star, Trophy, BarChart3, Loader2, ArrowLeft, Shield, Activity, AlertTriangle, Mail, Search, Lock, ChevronRight, Zap, Eye, Download, UploadCloud, FileText, Phone, Scale, Terminal, Cpu, Globe, ArrowUpRight, Settings, Trash2, Ban, Edit2, UserCircle, Camera, Award, IndianRupee, Sparkles, XCircle, Power, MapPin, Briefcase } from 'lucide-react';
import ProblemDetailModal from '../components/ProblemDetailModal'; // Import ProblemDetailModal
import ProfileCard from '../components/ProfileCard'; // Import ProfileCard

const AdminPortal: React.FC = () => {
  const { allUsers, problems, siteConfig, updateSiteConfig, adminDeleteUser, adminDeleteProblem, adminBanUser } = useStore();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'CONTENT' | 'SETTINGS'>('OVERVIEW');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false); // New state for problem detail modal
  const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null); // State for selected problem

  // Profile Card hover states
  const [showProfileCard, setShowProfileCard] = useState<string | null>(null); // Stores userId for hovered profile
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);

  // Calculate Stats
  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const totalCompanies = allUsers.filter(u => u.role === UserRole.COMPANY).length;
    const totalStudents = allUsers.filter(u => u.role === UserRole.STUDENT).length;
    const onlineUsers = allUsers.filter(u => {
      if (!u.lastSeen) return false;
      const lastSeenTime = new Date(u.lastSeen).getTime();
      return (Date.now() - lastSeenTime) < 5 * 60 * 1000; // Active in last 5 mins
    }).length;
    
    const totalProblems = problems.length;
    const totalBountyValue = problems.reduce((acc, p) => {
      const val = parseFloat(p.bounty.replace(/[^0-9.]/g, '')) || 0;
      return acc + val;
    }, 0);

    return { totalUsers, totalCompanies, totalStudents, onlineUsers, totalProblems, totalBountyValue };
  }, [allUsers, problems]);

  const handleBanToggle = async (id: string, currentStatus: boolean) => {
      if(confirm(currentStatus ? "Unban this user?" : "Ban this user? They will be logged out immediately.")) {
          setProcessingId(id);
          try { await adminBanUser(id, currentStatus); } catch(e) { alert("Error updating user status"); }
          setProcessingId(null);
      }
  };

  const handleDeleteUser = async (id: string) => {
      if(confirm("Are you sure? This will permanently delete the user's profile data.")) {
          setProcessingId(id);
          try { await adminDeleteUser(id); } catch(e) { alert("Error deleting user"); }
          setProcessingId(null);
      }
  };

  const handleDeleteProblem = async (id: string) => {
      if(confirm("Permanently delete this problem?")) {
          setProcessingId(id);
          try { await adminDeleteProblem(id); } catch(e) { alert("Error deleting problem"); }
          setProcessingId(null);
      }
  }

  const handleOpenProblemDetails = (problem: Problem) => {
    setCurrentProblemForDetails(problem);
    setShowProblemDetailModal(true);
  };

  const handleProfileHover = (user: User) => {
    setHoveredUser(user);
    setShowProfileCard(user.id);
  };

  const handleProfileLeave = () => {
    setShowProfileCard(null);
    setHoveredUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 p-4">
             <Shield className="w-32 h-32" />
          </div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-400" /> Admin Command Center
          </h1>
          <p className="text-slate-400">Platform Overview & Monitoring</p>
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
           <button onClick={() => setActiveTab('OVERVIEW')} className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${activeTab === 'OVERVIEW' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>Overview</button>
           <button onClick={() => setActiveTab('USERS')} className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${activeTab === 'USERS' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>User Directory</button>
           <button onClick={() => setActiveTab('CONTENT')} className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${activeTab === 'CONTENT' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>Content Manager</button>
           <button onClick={() => setActiveTab('SETTINGS')} className="relative px-4 py-2 rounded-lg font-bold whitespace-nowrap bg-white text-gray-600 hover:bg-gray-200">
               <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping-slow ${activeTab === 'SETTINGS' ? 'hidden' : ''}`}></div>
               <Settings className="w-4 h-4 inline-block mr-1"/> Site Settings
           </button>
        </div>

        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600"><Zap className="w-6 h-6" /></div>
                <span className="text-xs font-bold text-gray-400 uppercase">Online Now</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.onlineUsers}</div>
              <div className="text-xs text-green-600 mt-2 flex items-center">
                 <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Active Users
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users className="w-6 h-6" /></div>
                <span className="text-xs font-bold text-gray-400 uppercase">Total Users</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.totalUsers}</div>
              <div className="text-xs text-gray-500 mt-2 flex justify-between">
                <span>{stats.totalStudents} Students</span>
                <span>{stats.totalCompanies} Companies</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><Briefcase className="w-6 h-6" /></div>
                <span className="text-xs font-bold text-gray-400 uppercase">Problems</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.totalProblems}</div>
              <div className="text-xs text-green-600 mt-2 font-medium">
                 {problems.filter(p => p.status === 'OPEN').length} Open
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600"><IndianRupee className="w-6 h-6" /></div>
                <span className="text-xs font-bold text-gray-400 uppercase">Total Bounty</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">₹{stats.totalBountyValue.toLocaleString('en-IN')}</div>
            </div>
          </div>
        )}

        {activeTab === 'USERS' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
                 <tr>
                   <th className="p-4">User</th>
                   <th className="p-4">Role</th>
                   <th className="p-4">Status</th>
                   <th className="p-4">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {allUsers.map(u => {
                    const isOnline = u.lastSeen && (Date.now() - new Date(u.lastSeen).getTime() < 5 * 60 * 1000);
                    return (
                   <tr key={u.id} className="hover:bg-slate-50">
                     <td className="p-4 font-medium text-slate-900">
                        <div 
                          className="flex items-center relative"
                          onMouseEnter={() => handleProfileHover(u)}
                          onMouseLeave={handleProfileLeave}
                        >
                            {u.profilePicUrl && <img src={u.profilePicUrl} className="w-8 h-8 rounded-full mr-2 object-cover" />}
                            <div className="cursor-help hover:underline">
                                {u.name} <br/>
                                <span className="text-xs text-slate-400 font-normal">{u.email}</span>
                            </div>
                            {showProfileCard === u.id && hoveredUser && <ProfileCard user={hoveredUser} onClose={handleProfileLeave} positionClasses="bottom-full left-0 mb-2" />}
                        </div>
                     </td>
                     <td className="p-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : u.role === 'COMPANY' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>{u.role}</span></td>
                     <td className="p-4">
                        <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold w-fit ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {isOnline ? 'Online' : 'Offline'}
                            </span>
                            {u.isBanned && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold w-fit">BANNED</span>}
                        </div>
                     </td>
                     <td className="p-4 flex gap-2">
                        {u.role !== UserRole.ADMIN && (
                            <>
                                <button 
                                    onClick={() => handleBanToggle(u.id, !!u.isBanned)}
                                    disabled={processingId === u.id}
                                    className={`p-2 rounded-full transition-colors ${u.isBanned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
                                    title={u.isBanned ? "Unban User" : "Ban User"}
                                >
                                    {processingId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (u.isBanned ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />)}
                                </button>
                                <button 
                                    onClick={() => handleDeleteUser(u.id)}
                                    disabled={processingId === u.id}
                                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full"
                                    title="Permanently Delete User Data"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                     </td>
                   </tr>
                 )})}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === 'CONTENT' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
                    <tr>
                    <th className="p-4">Problem</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Bounty</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {problems.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleOpenProblemDetails(p)}>
                        <td className="p-4 font-medium text-slate-900 max-w-xs truncate" title={p.title}>{p.title}</td>
                        <td className="p-4 text-sm text-gray-600">{p.companyName}</td>
                        <td className="p-4 text-green-600 font-bold">{p.bounty}</td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs font-bold ${p.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{p.status}</span></td>
                        <td className="p-4">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteProblem(p.id); }} // Stop propagation to prevent row click
                                disabled={processingId === p.id}
                                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        )}

        {activeTab === 'SETTINGS' && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center"><Settings className="w-5 h-5 mr-2" /> Global Configuration</h3>
                
                <div className="space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Base Font Size (Scale)</label>
                        <div className="flex items-center space-x-4">
                            <span className="text-xs text-gray-500">Small</span>
                            <input 
                                type="range" 
                                min="12" max="20" step="1"
                                value={siteConfig.baseFontSize}
                                onChange={(e) => updateSiteConfig({ baseFontSize: parseInt(e.target.value) })}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-gray-500">Large</span>
                            <span className="w-12 text-center font-mono font-bold border rounded px-1">{siteConfig.baseFontSize}px</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Adjusting this slider scales the entire interface.</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <span className="block font-bold text-gray-900">Dark Mode Support</span>
                            <span className="text-xs text-gray-500">Allow users to see the Cyber/Dark theme on Landing/Auth pages.</span>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input 
                                type="checkbox" 
                                checked={siteConfig.enableDarkMode} 
                                onChange={(e) => updateSiteConfig({ enableDarkMode: e.target.checked })}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                                style={{ transform: siteConfig.enableDarkMode ? 'translateX(100%)' : 'translateX(0)', borderColor: siteConfig.enableDarkMode ? '#2563eb' : '#e5e7eb' }}
                            />
                            <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${siteConfig.enableDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}></label>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Problem Detail Modal for Admin Portal */}
      <ProblemDetailModal 
          isOpen={showProblemDetailModal}
          onClose={() => setShowProblemDetailModal(false)}
          problem={currentProblemForDetails}
          // No onSolveClick for admin
      />
    </div>
  );
};

export default AdminPortal;