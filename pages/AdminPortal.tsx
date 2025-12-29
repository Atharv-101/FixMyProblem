
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, Problem, User } from '../types.ts';
import { Users, CheckCircle2, Star, Trophy, BarChart3, Loader2, ArrowLeft, Shield, Activity, AlertTriangle, Mail, Search, Lock, ChevronRight, Zap, Eye, Download, UploadCloud, FileText, Phone, Scale, Terminal, Cpu, Globe, ArrowUpRight, Settings, Trash2, Ban, Edit2, UserCircle, Camera, Award, IndianRupee, Sparkles, XCircle, Power, MapPin, Briefcase } from 'lucide-react';
import ProblemDetailModal from '../components/ProblemDetailModal.tsx';
import ProfileCard from '../components/ProfileCard.tsx';

interface AdminPortalProps {
  // Added onProfileClick prop to resolve type error
  onProfileClick: (id: string) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onProfileClick }) => {
  const { allUsers, problems, siteConfig, updateSiteConfig, adminDeleteUser, adminDeleteProblem, adminBanUser } = useStore();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'CONTENT' | 'SETTINGS'>('OVERVIEW');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
  const [currentProblemForDetails, setCurrentProblemForDetails] = useState<Problem | null>(null);

  const [showProfileCard, setShowProfileCard] = useState<string | null>(null);
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);

  const stats = useMemo(() => {
    const totalUsers = allUsers.length;
    const totalCompanies = allUsers.filter(u => u.role === UserRole.COMPANY).length;
    const totalStudents = allUsers.filter(u => u.role === UserRole.STUDENT).length;
    const onlineUsers = allUsers.filter(u => {
      if (!u.lastSeen) return false;
      const lastSeenTime = new Date(u.lastSeen).getTime();
      return (Date.now() - lastSeenTime) < 5 * 60 * 1000;
    }).length;
    
    const totalProblems = problems.length;
    const totalBountyValue = problems.reduce((acc, p) => {
      const val = parseFloat(p.bounty.replace(/[^0-9.]/g, '')) || 0;
      return acc + val;
    }, 0);

    return { totalUsers, totalCompanies, totalStudents, onlineUsers, totalProblems, totalBountyValue };
  }, [allUsers, problems]);

  const handleBanToggle = async (id: string, currentStatus: boolean) => {
      if(confirm(currentStatus ? "Unban this protocol user?" : "Ban this user? They will be detached immediately.")) {
          setProcessingId(id);
          try { await adminBanUser(id, currentStatus); } catch(e) { alert("Error updating user status"); }
          setProcessingId(null);
      }
  };

  const handleDeleteUser = async (id: string) => {
      if(confirm("Permanently wipe user identity from grid?")) {
          setProcessingId(id);
          try { await adminDeleteUser(id); } catch(e) { alert("Error deleting user"); }
          setProcessingId(null);
      }
  };

  const handleDeleteProblem = async (id: string) => {
      if(confirm("Permanently delete this problem from grid?")) {
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
    <div className="min-h-screen bg-transparent pt-32 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="tactile-card bg-black text-white p-10 rounded-[3rem] shadow-xl mb-12 relative overflow-hidden reveal">
          <div className="absolute right-[-20px] top-[-20px] opacity-10 p-4">
             <Shield className="w-64 h-64" />
          </div>
          <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-coral text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-black mb-6">
                 <Terminal className="w-4 h-4" /> Root Protocol Access
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter leading-none">
                Admin <span className="text-citrus italic">Console.</span>
              </h1>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] mt-4">Platform Oversight & Infrastructure 👀</p>
          </div>
        </div>

        <div className="flex space-x-4 mb-10 overflow-x-auto pb-4 reveal">
           {['OVERVIEW', 'USERS', 'CONTENT', 'SETTINGS'].map((tab) => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)} 
                className={`tactile-btn px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-black text-white' : 'bg-white text-black hover:bg-citrus'}`}
             >
                {tab}
             </button>
           ))}
        </div>

        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 reveal">
             <div className="tactile-card p-8 rounded-3xl bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-citrus p-3 rounded-2xl border-2 border-black"><Zap className="w-6 h-6 text-black" /></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Online Now</span>
                </div>
                <div className="text-5xl font-black text-black leading-none">{stats.onlineUsers}</div>
                <div className="text-xs text-forest font-black mt-4 flex items-center">
                   <span className="w-2.5 h-2.5 bg-forest rounded-full mr-2 animate-pulse"></span> Grid Active
                </div>
            </div>

            <div className="tactile-card p-8 rounded-3xl bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-coral p-3 rounded-2xl border-2 border-black text-white"><Users className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grid Population</span>
                </div>
                <div className="text-5xl font-black text-black leading-none">{stats.totalUsers}</div>
                <div className="text-xs text-gray-500 font-bold mt-4 flex justify-between">
                  <span>{stats.totalStudents} Solvers</span>
                  <span>{stats.totalCompanies} Grids</span>
                </div>
            </div>

            <div className="tactile-card p-8 rounded-3xl bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-forest p-3 rounded-2xl border-2 border-black text-white"><Briefcase className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Tasks</span>
                </div>
                <div className="text-5xl font-black text-black leading-none">{stats.totalProblems}</div>
                <div className="text-xs text-coral font-black mt-4">
                   {problems.filter(p => p.status === 'OPEN').length} Open Bounties
                </div>
            </div>

            <div className="tactile-card p-8 rounded-3xl bg-citrus">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-black p-3 rounded-2xl border-2 border-black text-white"><IndianRupee className="w-6 h-6" /></div>
                  <span className="text-[10px] font-black text-black uppercase tracking-widest opacity-40">Total Volume</span>
                </div>
                <div className="text-4xl font-black text-black leading-none">₹{stats.totalBountyValue.toLocaleString('en-IN')}</div>
                <p className="text-[9px] font-black uppercase text-black/40 mt-4 tracking-widest">System Liquidity</p>
            </div>
          </div>
        )}

        {activeTab === 'USERS' && (
          <div className="tactile-card bg-white rounded-[2.5rem] overflow-hidden reveal">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-black tracking-widest border-b-2 border-black/5">
                   <tr>
                     <th className="p-6 min-w-[200px]">Identity</th>
                     <th className="p-6 min-w-[120px]">Role</th>
                     <th className="p-6 min-w-[120px]">Grid Status</th>
                     <th className="p-6 min-w-[120px]">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y-2 divide-gray-50">
                   {allUsers.map(u => {
                      const isOnline = u.lastSeen && (Date.now() - new Date(u.lastSeen).getTime() < 5 * 60 * 1000);
                      return (
                     <tr key={u.id} className="hover:bg-gray-50 group">
                       <td className="p-6 font-bold text-black">
                          <div 
                            className="flex items-center relative cursor-pointer"
                            onMouseEnter={() => handleProfileHover(u)}
                            onMouseLeave={handleProfileLeave}
                            onClick={() => onProfileClick(u.id)}
                          >
                              <div className="w-12 h-12 rounded-xl bg-paper border-2 border-black flex items-center justify-center mr-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden font-black">
                                {u.profilePicUrl ? <img src={u.profilePicUrl} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                              </div>
                              <div className="cursor-help">
                                  <div className="text-lg leading-tight group-hover:text-coral transition-colors">{u.name}</div>
                                  <span className="text-xs text-gray-400 font-bold">{u.email}</span>
                              </div>
                              {showProfileCard === u.id && hoveredUser && <ProfileCard user={hoveredUser} onClose={handleProfileLeave} positionClasses="bottom-full left-0 mb-4" />}
                          </div>
                       </td>
                       <td className="p-6">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-lg border-2 border-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-black text-white' : u.role === 'COMPANY' ? 'bg-forest text-white' : 'bg-citrus text-black'}`}>
                            {u.role}
                          </span>
                       </td>
                       <td className="p-6">
                          <div className="flex flex-col gap-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit border-2 ${isOnline ? 'bg-green-100 text-forest border-forest' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                              <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-forest animate-pulse' : 'bg-gray-300'}`}></span>
                              {isOnline ? 'Active' : 'Offline'}
                              </span>
                              {u.isBanned && <span className="text-[9px] font-black bg-coral text-white px-3 py-1 rounded-lg border-2 border-black uppercase tracking-widest w-fit">DETACHED</span>}
                          </div>
                       </td>
                       <td className="p-6 flex gap-3">
                          {u.role !== UserRole.ADMIN && (
                              <>
                                  <button 
                                      onClick={() => handleBanToggle(u.id, !!u.isBanned)}
                                      disabled={processingId === u.id}
                                      className={`p-3 rounded-xl border-2 border-black transition-all ${u.isBanned ? 'bg-citrus text-black hover:scale-110' : 'bg-coral text-white hover:scale-110'}`}
                                      title={u.isBanned ? "Reconnect User" : "Detach User"}
                                  >
                                      {processingId === u.id ? <Loader2 className="w-5 h-5 animate-spin" /> : (u.isBanned ? <CheckCircle2 className="w-5 h-5" /> : <Ban className="w-5 h-5" />)}
                                  </button>
                                  <button 
                                      onClick={() => handleDeleteUser(u.id)}
                                      disabled={processingId === u.id}
                                      className="p-3 bg-white border-2 border-black rounded-xl text-coral hover:bg-black transition-all hover:scale-110"
                                      title="Wipe User Data"
                                  >
                                      <Trash2 className="w-5 h-5" />
                                  </button>
                              </>
                          )}
                       </td>
                     </tr>
                   )})}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'CONTENT' && (
            <div className="tactile-card bg-white rounded-[2.5rem] overflow-hidden reveal">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-black tracking-widest border-b-2 border-black/5">
                        <tr>
                        <th className="p-6 min-w-[200px]">Challenge Brief</th>
                        <th className="p-6 min-w-[120px]">Grid Entity</th>
                        <th className="p-6 min-w-[100px]">Bounty</th>
                        <th className="p-6 min-w-[100px]">Status</th>
                        <th className="p-6 min-w-[80px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-50">
                        {problems.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 cursor-pointer group" onClick={() => handleOpenProblemDetails(p)}>
                            <td className="p-6 font-bold text-black max-w-xs truncate text-lg group-hover:text-coral transition-colors" title={p.title}>{p.title}</td>
                            <td className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest">{p.companyName}</td>
                            <td className="p-6 text-forest font-black text-xl">{p.bounty}</td>
                            <td className="p-6">
                                <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 border-black ${p.status === 'OPEN' ? 'bg-citrus' : 'bg-gray-100 text-gray-300 border-black/10'}`}>
                                    {p.status}
                                </span>
                            </td>
                            <td className="p-6">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteProblem(p.id); }}
                                    disabled={processingId === p.id}
                                    className="p-3 bg-white border-2 border-black rounded-xl text-coral hover:bg-black transition-all hover:scale-110"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'SETTINGS' && (
            <div className="tactile-card bg-white p-12 rounded-[3rem] max-w-2xl reveal">
                <h3 className="text-3xl font-black mb-10 flex items-center tracking-tighter"><Settings className="w-8 h-8 mr-4 text-coral" /> Global Protocols 👀</h3>
                
                <div className="space-y-12">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Grid Scale (Base Font)</label>
                        <div className="flex items-center space-x-6">
                            <span className="text-[10px] font-black uppercase">Alpha</span>
                            <input 
                                type="range" 
                                min="12" max="20" step="1"
                                value={siteConfig.baseFontSize}
                                onChange={(e) => updateSiteConfig({ baseFontSize: parseInt(e.target.value) })}
                                className="flex-1 h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black border-2 border-black"
                            />
                            <span className="text-[10px] font-black uppercase">Omega</span>
                            <span className="w-16 text-center font-black text-xl border-2 border-black rounded-xl p-2 bg-citrus">{siteConfig.baseFontSize}px</span>
                        </div>
                    </div>

                    <div className="tactile-card flex items-center justify-between p-8 bg-paper rounded-3xl border-2 border-black">
                        <div>
                            <span className="block font-black text-lg text-black uppercase tracking-tighter">Night Ops Mode 🪄</span>
                            <span className="text-xs font-bold text-gray-400">Force high-contrast cyber theme globally. 😁</span>
                        </div>
                        <div className="relative inline-block w-14 h-8 select-none transition duration-200 ease-in">
                            <input 
                                type="checkbox" 
                                checked={siteConfig.enableDarkMode} 
                                onChange={(e) => updateSiteConfig({ enableDarkMode: e.target.checked })}
                                className="absolute block w-8 h-8 rounded-xl bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out border-black"
                                style={{ transform: siteConfig.enableDarkMode ? 'translateX(75%)' : 'translateX(0)' }}
                            />
                            <label className={`block overflow-hidden h-8 rounded-xl cursor-pointer border-2 border-black ${siteConfig.enableDarkMode ? 'bg-citrus' : 'bg-gray-200'}`}></label>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      <ProblemDetailModal 
          isOpen={showProblemDetailModal}
          onClose={() => setShowProblemDetailModal(false)}
          problem={currentProblemForDetails}
          onProfileClick={onProfileClick}
      />
    </div>
  );
};

export default AdminPortal;
