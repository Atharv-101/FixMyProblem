
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
      title: "Platform",
      links: ["Post Challenges", "Find Solutions", "Technical Audit", "Bounty Scoping", "Hiring Automation"]
    },
    {
      title: "Participate",
      links: ["Competitions", "Hackathons", "Assessments", "Workshops", "College Festivals"]
    },
    {
      title: "Apply",
      links: ["Internships", "Jobs", "Scholarships", "Refer & Earn"]
    },
    {
      title: "Learn",
      links: ["Courses", "Articles", "Blog Series", "Engineering Tips"]
    },
    {
      title: "Practice",
      links: ["5 Days Interview Prep", "Code Assessments", "100-Day Coding Sprint"]
    },
    {
      title: "Others",
      links: ["About Us", "Careers", "Branding Guidelines", "Rewards Program", "FAQ"]
    }
  ];

  return (
    <footer className="bg-white pt-16 pb-8 border-t-2 border-black/5 text-gray-700 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Top Section: Brand & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-gray-100">
          <div className="space-y-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange('HOME')}>
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border-2 border-citrus shadow-[3px_3px_0px_0px_rgba(255,95,95,1)] group-hover:rotate-12 transition-transform">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-4xl font-black tracking-tighter text-black">FixMyProblem</span>
            </div>
            <p className="flex items-center gap-2 font-bold text-gray-500">
              Built with <Heart className="w-4 h-4 text-coral fill-coral" /> by <span className="text-black underline decoration-citrus decoration-2 underline-offset-4">ATHinnovations</span> for the world
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {socialIcons.map((social, idx) => (
              <a key={idx} href={social.href} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200 hover:bg-black hover:text-white transition-all">
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-10 py-16">
          {footerLinks.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-black border-b-2 border-citrus w-fit pb-1">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <button 
                      onClick={() => onPageNav(link, section.title)}
                      className="text-xs md:text-sm font-medium text-gray-500 hover:text-coral transition-colors text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Call to Action Sidebar */}
          <div className="col-span-2 lg:col-span-1 space-y-10">
            {/* Joined Badge - Updated from Hiring */}
            <div 
              onClick={() => onPageNav("Join Us", "Apply")}
              className="bg-citrus/20 p-4 rounded-2xl border-2 border-dashed border-citrus flex flex-col items-center justify-center text-center rotate-3 hover:rotate-0 transition-transform cursor-pointer group"
            >
               <h5 className="text-xl font-black text-black leading-none italic">Ready?</h5>
               <span className="bg-black text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest mt-1 group-hover:scale-110 transition-transform">Join Now</span>
            </div>

            <div className="space-y-4">
              <button onClick={() => onViewChange('CONTACT')} className="flex items-center gap-2 text-sm font-black text-black hover:text-coral transition-colors">
                Contact Us <ExternalLink className="w-4 h-4" />
              </button>
              <button onClick={() => onPageNav("Testimonials", "Others")} className="flex items-center gap-2 text-sm font-black text-black hover:text-coral transition-colors">
                Share Your Story <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Stay Updated</p>
              <div className="flex bg-gray-100 rounded-xl overflow-hidden border border-gray-200 focus-within:border-black transition-all">
                <input type="email" placeholder="Subscribe..." className="bg-transparent px-4 py-3 text-sm font-bold w-full outline-none" />
                <button className="bg-black text-white px-4 hover:bg-forest transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* App Stores */}
            <div className="flex flex-col gap-3">
               <button className="bg-black text-white px-4 py-2.5 rounded-xl flex items-center gap-3 border border-black hover:bg-white hover:text-black transition-all group">
                  <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-6" alt="Play Store" />
                  </div>
               </button>
               <button className="bg-black text-white px-4 py-2.5 rounded-xl flex items-center gap-3 border border-black hover:bg-white hover:text-black transition-all group">
                  <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-white/20 transition-colors">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="h-6" alt="App Store" />
                  </div>
               </button>
            </div>
          </div>
        </div>

        {/* Certification & Payments */}
        <div className="pt-12 border-t border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-10">
           <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 font-black text-xs">
                <ShieldCheck className="w-5 h-5" /> 100% SECURE PROTOCOL
              </div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">ISO 27001</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">GDPR COMPLIANT</span>
              </div>
           </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
           <p className="text-center md:text-left">© 2024 ATHINNOVATIONS (FLIVE CONSULTING PVT LTD). ALL RIGHTS RESERVED.</p>
           <div className="flex gap-6">
              <button onClick={() => onViewChange('TERMS')} className="hover:text-black">Terms</button>
              <button onClick={() => onViewChange('PRIVACY')} className="hover:text-black">Privacy</button>
              <button className="hover:text-black" onClick={() => onPageNav("Sitemap", "Internal")}>Sitemap</button>
           </div>
           <p className="text-center md:text-right">PROTOCOL VERSION: 12.29.2024.16.47</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
