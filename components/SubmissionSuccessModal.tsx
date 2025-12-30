
import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, X, Terminal, Zap, Flame, Rocket, Trophy, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemTitle: string;
}

const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({ isOpen, onClose, problemTitle }) => {
  const [randomMsg, setRandomMsg] = useState('');

  const hypeMessages = [
    "Wait, did you just solve that in one go? Your keyboard must be smoking! 💨",
    "Database unlocked. Logic verified. Ego boosted. 🧠✨",
    "Mentor.exe is now loading your genius. Stand by for total grid domination. 🪄",
    "Zero errors found. (Or at least, that's what we're telling the company). 😉",
    "You just converted coffee into pure, unadulterated code. Respect. ☕💻",
    "The firewall is crying. You're too fast for this system. 🚀🔥",
    "Mission Accomplished! Somewhere, a senior dev is nodding in approval. 🙌",
    "Payload deployed. The Grid will never be the same again. 🌐🛡️"
  ];

  useEffect(() => {
    if (isOpen) {
      setRandomMsg(hypeMessages[Math.floor(Math.random() * hypeMessages.length)]);
      
      // Initial Big Blast
      const end = Date.now() + (2 * 1000);
      const colors = ['#FF5F5F', '#FDE047', '#064E3B', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [isOpen]);

  const moreConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5F5F', '#FDE047', '#064E3B']
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-0 bg-black text-white overflow-hidden animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-coral rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-forest rounded-full blur-[120px] animate-pulse [animation-delay:1s]"></div>
      </div>

      {/* Retro Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 w-full max-w-4xl p-6 md:p-12 text-center flex flex-col items-center">
        
        {/* Floating Icons */}
        <div className="flex gap-4 mb-8">
            <div className="w-16 h-16 bg-citrus rounded-2xl border-4 border-white text-black flex items-center justify-center -rotate-12 animate-bounce shadow-xl shadow-citrus/20">
                <Rocket className="w-8 h-8" />
            </div>
            <div className="w-20 h-20 bg-coral rounded-full border-4 border-white text-white flex items-center justify-center animate-pulse shadow-xl shadow-coral/20">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="w-16 h-16 bg-forest rounded-2xl border-4 border-white text-citrus flex items-center justify-center rotate-12 animate-bounce [animation-delay:0.5s] shadow-xl shadow-forest/20">
                <Trophy className="w-8 h-8" />
            </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-[6px_6px_0px_0px_rgba(253,224,71,1)]">
            <Zap className="w-4 h-4 text-coral fill-coral animate-pulse" />
            Transmission Verified
        </div>

        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-4 leading-none text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            ABSOLUTE <span className="text-citrus">UNIT.</span>
        </h1>

        <p className="text-xl md:text-3xl font-black text-gray-300 mb-10 max-w-2xl leading-tight">
            Target Node: <span className="text-coral underline decoration-citrus underline-offset-8">{problemTitle}</span>
        </p>

        <div className="tactile-card bg-white text-black p-8 md:p-10 rounded-[3rem] max-w-xl w-full border-4 border-black mb-12 transform hover:scale-105 transition-transform duration-300 group cursor-pointer" onClick={moreConfetti}>
            <p className="text-2xl md:text-3xl font-black italic leading-tight text-forest mb-4">
               "{randomMsg}"
            </p>
            <div className="flex justify-center items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-coral transition-colors">
                <PartyPopper className="w-4 h-4" /> Tap for more Dopamine
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
            <button 
                onClick={onClose}
                className="tactile-btn flex-1 px-8 py-5 bg-citrus text-black rounded-2xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white"
            >
                Return to Base <Terminal className="w-6 h-6" />
            </button>
            <button 
                onClick={moreConfetti}
                className="tactile-btn px-8 py-5 bg-transparent border-4 border-white text-white rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-white/10"
            >
                <Flame className="w-6 h-6" />
            </button>
        </div>

        <div className="mt-16 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            PROCEED WITH CAUTION: HIGH IQ DETECTED IN GRID SECTION
        </div>
      </div>

      {/* Floating Sparkles in corners */}
      <div className="absolute top-10 left-10 text-citrus animate-spin-slow opacity-20"><Sparkles className="w-20 h-20" /></div>
      <div className="absolute bottom-10 right-10 text-coral animate-spin-slow opacity-20"><Sparkles className="w-24 h-24" /></div>
    </div>
  );
};

export default SubmissionSuccessModal;
