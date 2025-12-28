
import React from 'react';
import { Code2, ArrowUpRight } from 'lucide-react';
import { UserRole } from '../../types';

interface LandingFooterProps {
  onLoginClick: (role: UserRole) => void;
  onViewChange: (view: any) => void;
}

const LandingFooter: React.FC<LandingFooterProps> = ({ onLoginClick, onViewChange }) => {
  return (
    <footer className="bg-black py-12 lg:py-20 px-4 md:px-10 text-white border-t-4 lg:border-t-[8px] border-coral">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-16 mb-16 lg:mb-24">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-coral rounded-xl lg:rounded-2xl flex items-center justify-center">
                <Code2 className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <span className="text-2xl lg:text-3xl font-black tracking-tighter">FixMyProblem</span>
            </div>
            <p className="text-lg lg:text-xl text-gray-400 font-bold max-w-sm leading-relaxed">
              The elite marketplace where <span className="text-white underline decoration-citrus">academic talent</span> fixes <span className="text-white underline decoration-coral">industry errors</span>.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => onLoginClick(UserRole.COMPANY)} className="px-5 py-2.5 lg:px-6 lg:py-3 bg-white text-black font-black rounded-lg hover:bg-citrus transition-colors text-sm">Hire Talent</button>
              <button onClick={() => onLoginClick(UserRole.STUDENT)} className="px-5 py-2.5 lg:px-6 lg:py-3 border border-white/20 font-black rounded-lg hover:bg-white/10 transition-colors text-sm">Join Solver</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:contents">
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 lg:mb-8">Navigation</h4>
              <ul className="space-y-3 lg:space-y-4 font-black text-base lg:text-lg">
                <li><button onClick={() => onViewChange('DASHBOARD')} className="hover:text-coral transition-colors flex items-center">Grid <ArrowUpRight className="ml-1 w-3 h-3" /></button></li>
                <li><button onClick={() => onViewChange('LEADERBOARD')} className="hover:text-coral transition-colors">Rankings</button></li>
                <li><button onClick={() => onViewChange('CONTACT')} className="hover:text-coral transition-colors">Support</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 lg:mb-8">System</h4>
              <ul className="space-y-3 lg:space-y-4 font-black text-base lg:text-lg">
                <li><button onClick={() => onViewChange('PRIVACY')} className="hover:text-coral transition-colors">Privacy</button></li>
                <li><button onClick={() => onViewChange('TERMS')} className="hover:text-coral transition-colors">Terms</button></li>
                <li><button onClick={() => onLoginClick(UserRole.ADMIN)} className="hover:text-coral transition-colors">Admin</button></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 lg:pt-16 border-t border-white/10 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 gap-4">
          <p className="text-center md:text-left">© 2024 FIXMYPROBLEM PROTOCOL. BUILT FOR SCALE.</p>
          <p className="text-center md:text-right">BY ATHINNOVATIONS • ENCRYPTED PAYOUTS</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
