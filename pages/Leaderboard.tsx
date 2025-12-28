
import React, { useState } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole, User } from '../types.ts';
import { Trophy, Star } from 'lucide-react';
import ProfileCard from '../components/ProfileCard.tsx';

const Leaderboard: React.FC = () => {
  const { allUsers } = useStore();
  const students = allUsers.filter(u => u.role === UserRole.STUDENT).sort((a, b) => (b.rating || 0) - (a.rating || 0));
  
  const [showProfileCard, setShowProfileCard] = useState<string | null>(null);
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);

  const handleProfileHover = (user: User) => {
    setHoveredUser(user);
    setShowProfileCard(user.id);
  };

  const handleProfileLeave = () => {
    setShowProfileCard(null);
    setHoveredUser(null);
  };

  return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
          <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-center mb-8 flex justify-center items-center"><Trophy className="mr-2 text-yellow-500"/> Leaderboard</h1>
              <div className="bg-white rounded-xl shadow overflow-hidden">
                  {students.map((s, i) => (
                      <div key={s.id} className="flex items-center p-6 border-b hover:bg-blue-50">
                          <span className="w-8 font-bold text-gray-400 text-xl">#{i+1}</span>
                          <div 
                            className="flex-1 ml-4 flex items-center relative group"
                            onMouseEnter={() => handleProfileHover(s)}
                            onMouseLeave={handleProfileLeave}
                          >
                              {s.profilePicUrl ? (
                                  <img src={s.profilePicUrl} className="w-10 h-10 rounded-full object-cover mr-3 border" />
                              ) : (
                                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center font-bold text-gray-500">{s.name.charAt(0)}</div>
                              )}
                              <div className="cursor-help hover:underline">
                                <h3 className="font-bold text-lg">{s.name}</h3>
                                <p className="text-sm text-gray-500">{s.university}</p>
                              </div>
                              {showProfileCard === s.id && hoveredUser && <ProfileCard user={hoveredUser} onClose={handleProfileLeave} positionClasses="top-full left-0 mt-2" />}
                          </div>
                          <div className="text-right">
                              <div className="font-bold text-blue-600 text-xl">{s.rating?.toFixed(1)} ★</div>
                              <div className="text-xs text-gray-400">{s.solvedCount} Solved</div>
                          </div>
                      </div>
                  ))}
                  {students.length === 0 && (
                      <div className="text-center py-10 text-gray-500 italic">No students to display on the leaderboard yet.</div>
                  )}
              </div>
          </div>
      </div>
  );
}

export default Leaderboard;
