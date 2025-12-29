
import React from 'react';
import { ShieldCheck, Zap, Layers } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section className="py-40 px-6 bg-gray-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-32 items-center">
          <div className="flex-1 reveal-left">
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tighter mb-10 leading-[0.9]">
              Engineered <br/>for <span className="text-blue-600 italic">Clarity.</span>
            </h2>
            
            <div className="space-y-10">
              <div className="flex gap-6 group reveal" style={{ transitionDelay: '0.1s' }}>
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-gray-900 mb-2">Immutable Trust</h3>
                  <p className="text-gray-500 max-w-sm">Every line of code and every bounty is protected by our automated validation protocol.</p>
                </div>
              </div>

              <div className="flex gap-6 group reveal" style={{ transitionDelay: '0.2s' }}>
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-gray-900 mb-2">Hyper Velocity</h3>
                  <p className="text-gray-500 max-w-sm">Skip the HR loop. Deploy your problem and get a verified PR from top talent in record time.</p>
                </div>
              </div>

              <div className="flex gap-6 group reveal" style={{ transitionDelay: '0.3s' }}>
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-gray-900 mb-2">Deep Scalability</h3>
                  <p className="text-gray-500 max-w-sm">From micro-bugs to core architecture redesigns—our student network handles it all.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative reveal-right">
            <div className="absolute inset-0 bg-blue-600/5 rounded-[5rem] blur-[80px]"></div>
            <div className="relative p-12 bg-white rounded-[4rem] border border-gray-100 shadow-2xl overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
               <div className="relative z-10 reveal-zoom" style={{ transitionDelay: '0.4s' }}>
                  <p className="text-8xl font-black text-gray-900 mb-4 tracking-tighter">90%</p>
                  <p className="text-2xl font-bold text-gray-400 mb-10 leading-tight">Faster than <br/>traditional agencies.</p>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-[90%] h-full bg-blue-600 animate-pulse"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
