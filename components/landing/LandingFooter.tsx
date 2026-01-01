
import React from 'react';
import { 
  Code2, Instagram, Linkedin, Facebook, Send, Disc, Youtube, 
  ArrowRight, Heart, Mail, ExternalLink, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingFooterProps {
  onLoginClick: (role: UserRole) => void;
  onViewChange: (view: any) => void;
  onPageNav: (title: string, category: string) => void;
}

const LandingFooter: React.FC<LandingFooterProps> = ({ onLoginClick, onViewChange, onPageNav }) => {
  const socialIcons = [
    { icon: <Instagram className="w-5 h-5" />, href: "#" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#" },
    { icon: <Facebook className="w-5 h-5" />, href: "#" },
    { icon: <Send className="w-5 h-5" />, href: "#" },
    { icon: <Disc className="w-5 h-5" />, href: "#" },
    { icon: <Youtube className="w-5 h-5" />, href: "#" },
  ];

  const footerLinks = [
    {
      title: "PLATFORM",
      links: ["Post Challenges", "Find Solutions", "Technical Audit", "Bounty Scoping", "Hiring Automation"]
    },
    {
      title: "PARTICIPATE",
      links: ["Competitions", "Hackathons", "Assessments", "Workshops", "College Festivals"]
    },
    {
      title: "APPLY",
      links: ["Internships", "Jobs", "Scholarships", "Refer & Earn"]
    },
    {
      title: "LEARN",
      links: ["Courses", "Articles", "Blog Series", "Engineering Tips"]
    },
    {
      title: "PRACTICE",
      links: ["5 Days Interview Prep", "Code Assessments", "100-Day Coding Sprint"]
    },
    {
      title: "OTHERS",
      links: ["About Us", "Careers", "Branding Guidelines", "Rewards Program", "FAQ"]
    }
  ];

  return (
    <footer className="bg-white pt-24 pb-12 text-gray-700 relative z-10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-16">
        
        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24 mb-24">
          
          {/* Column 1: Platform & Participate */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-black pb-2 border-b-2 border-black w-fit">Platform</h4>
              <ul className="space-y-4">
                {footerLinks[0].links.map((link) => (
                  <li key={link}>
                    <button onClick={() => onPageNav(link, "Platform")} className="text-sm font-medium text-gray-500 hover:text-coral transition-colors text-left">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-black pb-2 border-b-2 border-black w-fit">Participate</h4>
              <ul className="space-y-4">
                {footerLinks[1].links.map((link) => (
                  <li key={link}>
                    <button onClick={() => onPageNav(link, "Participate")} className="text-sm font-medium text-gray-500 hover:text-coral transition-colors text-left">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Apply, Learn, Practice, Others (Internal Grid) */}
          <div className="grid grid-cols-2 gap-y-12 gap-x-8">
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-black pb-2 border-b-2 border-black w-fit">Apply</h4>
              <ul className="space-y-4">
                {footerLinks[2].links.map((link) => (
                  <li key={link}>
                    <button onClick={() => onPageNav(link, "Apply")} className="text-sm font-medium text-gray-500 hover:text-coral transition-colors text-left">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-black pb-2 border-b-2 border-black w-fit">Learn</h4>
              <ul className="space-y-4">
                {footerLinks[3].links.map((link) => (
                  <li key={link}>
                    <button onClick={() => onPageNav(link, "Learn")} className="text-sm font-medium text-gray-500 hover:text-coral transition-colors text-left">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-black pb-2 border-b-2 border-black w-fit">Practice</h4>
              <ul className="space-y-4">
                {footerLinks[4].links.map((link) => (
                  <li key={link}>
                    <button onClick={() => onPageNav(link, "Practice")} className="text-sm font-medium text-gray-500 hover:text-coral transition-colors text-left">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-black pb-2 border-b-2 border-black w-fit">Others</h4>
              <ul className="space-y-4">
                {footerLinks[5].links.map((link) => (
                  <li key={link}>
                    <button onClick={() => onPageNav(link, "Others")} className="text-sm font-medium text-gray-500 hover:text-coral transition-colors text-left">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Sidebar CTA, Contact, Stay Updated, App Stores */}
          <div className="space-y-12">
            {/* Join Now Card */}
            <div 
              className="bg-citrus/20 p-6 rounded-3xl border-2 border-dashed border-citrus relative overflow-visible transform hover:-rotate-1 transition-transform group"
            >
               <h5 className="text-3xl font-black text-black leading-none italic mb-4">Ready?</h5>
               <button 
                  onClick={() => onLoginClick(UserRole.STUDENT)}
                  className="bg-black text-white px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest group-hover:scale-105 transition-transform"
               >
                  Join Now
               </button>
            </div>

            {/* Contact Links */}
            <div className="space-y-4">
              <button onClick={() => onViewChange('CONTACT')} className="flex items-center justify-between w-full text-lg font-black text-black hover:text-coral transition-colors">
                Contact Us <ExternalLink className="w-5 h-5" />
              </button>
              <button onClick={() => onPageNav("Testimonials", "Others")} className="flex items-center justify-between w-full text-lg font-black text-black hover:text-coral transition-colors">
                Share Your Story <ExternalLink className="w-5 h-5" />
              </button>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Stay Updated</p>
              <div className="flex bg-gray-50 rounded-2xl overflow-hidden border-2 border-black/5 focus-within:border-black transition-all">
                <input type="email" placeholder="Subscribe to grid..." className="bg-transparent px-6 py-4 text-sm font-bold w-full outline-none" />
                <button className="bg-black text-white px-6 hover:bg-forest transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* App Stores */}
            <div className="flex flex-col gap-4">
               <button className="bg-black p-1 rounded-2xl overflow-hidden border-2 border-black hover:bg-white transition-all group">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-12 w-full object-contain" alt="Play Store" />
               </button>
               <button className="bg-black p-1 rounded-2xl overflow-hidden border-2 border-black hover:bg-white transition-all group">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="h-12 w-full object-contain" alt="App Store" />
               </button>
            </div>
          </div>

        </div>

        {/* Footer Bottom Section */}
        <div className="pt-12 border-t-2 border-black/5 flex flex-col lg:flex-row justify-between items-center gap-12">
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center border-2 border-citrus shadow-[3px_3px_0px_0px_rgba(255,95,95,1)]">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-black">FixMyProblem</span>
            </div>
            <p className="text-sm font-bold text-gray-400">
              Built with <Heart className="w-4 h-4 text-coral fill-coral inline mx-1" /> by <span className="text-black underline decoration-citrus decoration-2 underline-offset-4">ATHinnovations</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-10 opacity-60">
             <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
               <ShieldCheck className="w-5 h-5 text-forest" /> 100% SECURE PROTOCOL
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black/10 rounded-xl">
               <CheckCircle2 className="w-4 h-4 text-green-500" />
               <span className="text-[9px] font-black uppercase">ISO 27001</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black/10 rounded-xl">
               <ShieldCheck className="w-4 h-4 text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest">GDPR COMPLIANT</span>
             </div>
          </div>

        </div>

        {/* Legal Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
           <p className="text-center md:text-left uppercase">© 2024 ATHINNOVATIONS (FLIVE CONSULTING PVT LTD). ALL RIGHTS RESERVED.</p>
           <div className="flex gap-12">
              <button onClick={() => onViewChange('TERMS')} className="hover:text-black uppercase">Terms</button>
              <button onClick={() => onViewChange('PRIVACY')} className="hover:text-black uppercase">Privacy</button>
              <button onClick={() => onPageNav("Sitemap", "Internal")} className="hover:text-black uppercase">Sitemap</button>
           </div>
           <p className="text-center md:text-right uppercase">PROTOCOL VERSION: 12.29.2024.16.47</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
