import React from 'react';
import { Trophy, Star, ArrowUpRight } from 'lucide-react';
import { User } from '../../types';
import ProfileCard from '../ProfileCard';

interface LeaderboardSnippetProps {
  topStudents: User[];
  onViewChange: (view: any) => void;
  onProfileHover: (userId: string) => void;
  onProfileLeave: () => void;
  showProfileCard: string | null;
  hoveredUser: User | null;
  // Added onProfileClick prop
  onProfileClick: (id: string) => void;
}

const LeaderboardSnippet: React.FC<LeaderboardSnippetProps> = ({ 
  topStudents, onViewChange, onProfileHover, onProfileLeave, showProfileCard, hoveredUser,
  onProfileClick
}) => {
  return (
    <section className="py-24 px-4 bg-gray-50 border-b border-gray-100 reveal">
        <div className="max-w-7xl mx-auto text-center">
           <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
              Meet Our <span className="text-orange-600">Top Solvers</span>
           </h2>
           <p className="text-lg md:text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
              These students are leading the charge in innovation and problem-solving.
           </p>

           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {topStudents.map((s, i) => (
                   <div key={s.id} className="bg-white p-8 rounded-2xl border border-gray-100 text-left shadow-sm hover:shadow-md transition-shadow flex items-center animate-fade-in-up">
                       <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0
                         ${i === 0 ? 'bg-yellow-50 text-yellow-700 border-2 border-yellow-200' : 
                           i === 1 ? 'bg-gray-50 text-gray-600 border-2 border-gray-200' : 
                           'bg-orange-50 text-orange-700 border-2 border-orange-200'}`}>
                         <Trophy className={`w-6 h-6 ${i === 0 ? 'fill-yellow-500 text-yellow-500' : i === 1 ? 'fill-gray-400 text-gray-400' : 'fill-orange-400 text-orange-400'}`}/>
                       </div>
                       <div 
                         className="flex-1 relative cursor-pointer"
                         onMouseEnter={() => onProfileHover(s.id)}
                         onMouseLeave={onProfileLeave}
                         onClick={() => onProfileClick(s.id)}
                       >
                           <h3 className="font-bold text-lg md:text-xl text-gray-900 hover:underline cursor-help">{s.name}</h3>
                           <p className="text-gray-500 text-sm">{s.university}</p>
                           <div className="flex items-center text-blue-600 mt-2">
                               <Star className="w-4 h-4 fill-blue-600 mr-1" />
                               <span className="font-bold text-md">{s.rating?.toFixed(1) || '0.0'}</span>
                               <span className="text-gray-400 text-xs ml-2">{s.solvedCount} Solved</span>
                           </div>
                           {showProfileCard === s.id && hoveredUser && <ProfileCard user={hoveredUser} onClose={onProfileLeave} positionClasses="bottom-full left-0 mb-2" />}
                       </div>
                   </div>
               ))}
               {topStudents.length === 0 && (
                   <div className="col-span-full text-center py-10 text-gray-400 italic">No students to rank yet. Start solving!</div>
               )}
           </div>
           <button 
              onClick={() => onViewChange('LEADERBOARD')}
              className="mt-16 group relative px-8 py-4 bg-white rounded-full font-bold text-lg text-gray-900 overflow-hidden border border-gray-200 hover:border-blue-500 hover:bg-gray-50 transition-all hover:shadow-md active:scale-95"
           >
             <span className="relative flex items-center justify-center">View Full Leaderboard <ArrowUpRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:translate-x-1 transition-transform" /></span>
           </button>
        </div>
    </section>
  );
};

export default LeaderboardSnippet;