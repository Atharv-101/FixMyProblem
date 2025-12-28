
import React from 'react';
import { Zap, Award, Globe, HeartHandshake, Trophy, Code2, Sparkles } from 'lucide-react';

const Features: React.FC = () => {
  const featureList = [
    {
      icon: <Zap className="w-8 h-8 text-black" />,
      title: "Hyper-Velocity",
      color: "bg-citrus",
      rotation: "rotate-[-2deg]"
    },
    {
      icon: <Award className="w-8 h-8 text-white" />,
      title: "Proof-of-Brain",
      color: "bg-forest",
      rotation: "rotate-[1deg]",
      textColor: "text-white"
    },
    {
      icon: <Globe className="w-8 h-8 text-white" />,
      title: "Global Grid",
      color: "bg-black",
      rotation: "rotate-[-1deg]",
      textColor: "text-white"
    },
    {
      icon: <Code2 className="w-8 h-8 text-white" />,
      title: "Clean Stack",
      color: "bg-coral",
      rotation: "rotate-[2deg]",
      textColor: "text-white"
    }
  ];

  return (
    <section className="py-24 px-4 md:px-10 bg-transparent relative border-b-2 border-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-8">
              Why the world <br/> trusts the <span className="text-coral">Fix.</span>
            </h2>
            <p className="text-xl text-gray-500 font-bold max-w-lg mb-12">
              We've replaced bureaucratic friction with a meritocratic protocol that prioritizes raw intelligence and speed.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 py-4 px-6 bg-gray-100 rounded-2xl w-fit mx-auto lg:mx-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               <Sparkles className="w-6 h-6 text-citrus fill-citrus" />
               <span className="text-sm font-black uppercase tracking-widest">Powered by Verified Talent</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-8 relative">
            {/* Background Circle Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-citrus/10 rounded-full blur-[100px] -z-10"></div>
            
            {featureList.map((f, i) => (
              <div key={i} className={`tactile-card p-8 md:p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center ${f.color} ${f.rotation} ${f.textColor || 'text-black'}`}>
                 <div className="sticker-tape opacity-10"></div>
                 <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                    {f.icon}
                 </div>
                 <h3 className="text-xl md:text-2xl font-black">{f.title}</h3>
                 <p className={`text-[10px] uppercase font-bold tracking-widest mt-2 opacity-60`}>Protocol Active</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
