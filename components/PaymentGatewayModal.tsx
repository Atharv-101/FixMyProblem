
import React, { useState } from 'react';
import Modal from './Modal';
import { Loader2, PartyPopper, ShieldCheck, CheckCircle2, Lock, Zap, ArrowRight, Info, Heart } from 'lucide-react';
import { useStore } from '../context/Store.tsx';
import confetti from 'canvas-confetti';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  recipient: string;
  problemTitle: string;
  onSuccess: (method: string) => void;
}

const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ isOpen, onClose, amount, recipient, problemTitle, onSuccess }) => {
  const { user } = useStore();
  const [step, setStep] = useState<'READY' | 'PROCESSING' | 'SUCCESS'>('READY');

  // Robust parsing
  const gross = parseFloat(amount.replace(/[^\d.]/g, '')) || 0;
  const commission = gross * 0.1;
  const net = gross - commission;

  const handleReleaseBounty = () => {
    setStep('PROCESSING');
    
    // Trigger "Party Blast" immediately for impact
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5F5F', '#FDE047', '#064E3B', '#ffffff']
    });

    // Simulate node verification and database sync
    setTimeout(() => {
      setStep('SUCCESS');
      
      // Another burst for success
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.7 },
        colors: ['#FDE047', '#064E3B']
      });

      setTimeout(() => {
        onSuccess('Party Blast Release');
        setStep('READY');
      }, 2500);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bounty Release Protocol">
      <div className="p-2">
        {step === 'READY' && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Lock className="w-16 h-16" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-citrus/20 text-citrus text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border border-citrus/30 flex items-center">
                    <Zap className="w-3 h-3 mr-1" /> CELEBRATION PROTOCOL
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Authorization Amount</p>
                <div className="flex justify-between items-end">
                  <span className="text-4xl font-black text-white">₹{gross.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Visual Release Section */}
            <div className="flex flex-col items-center justify-center p-8 bg-paper rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-citrus/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="w-24 h-24 bg-citrus text-black rounded-full border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-float">
                   <PartyPopper className="w-12 h-12" />
                </div>
                
                <div className="text-center space-y-2">
                   <h3 className="font-black text-black text-xl uppercase tracking-tighter italic">Ready for Payout</h3>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                     By clicking below, you authorize the immediate extraction of <span className="text-forest">₹{net.toLocaleString('en-IN')}</span> for <span className="text-coral">{recipient}</span>.
                   </p>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-forest/5 border-2 border-forest/10 p-4 rounded-xl flex gap-3 items-center">
               <ShieldCheck className="w-5 h-5 text-forest shrink-0" />
               <p className="text-[10px] font-bold text-forest leading-relaxed">
                 Escrow verification will be bypassed. Funds are marked as 'Dispatched' on the grid instantly. 😁
               </p>
            </div>

            {/* Actions */}
            <button 
                onClick={handleReleaseBounty}
                className="tactile-btn w-full bg-forest text-white py-6 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all group"
            >
                Authorize & Blast <PartyPopper className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>

            <p className="text-[10px] text-gray-400 text-center flex items-center justify-center pt-2 font-bold uppercase tracking-widest">
              <Heart className="w-3 h-3 mr-1 text-coral fill-coral" /> Synced via ATHinnovations Network
            </p>
          </div>
        )}

        {step === 'PROCESSING' && (
          <div className="py-20 flex flex-col items-center">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-forest animate-spin mb-6" />
              <Lock className="w-6 h-6 text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+12px)]" />
            </div>
            <h3 className="text-xl font-black text-black uppercase tracking-widest text-center px-4">Updating Grid...</h3>
            <p className="text-xs text-gray-500 font-bold mt-2 text-center max-w-xs">Writing extraction logs and releasing bounty from vault.</p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="py-20 flex flex-col items-center text-center animate-pop">
            <div className="w-24 h-24 bg-citrus/20 text-forest rounded-full flex items-center justify-center mb-6 border-4 border-forest animate-bounce shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-14 h-14" />
            </div>
            <h3 className="text-3xl font-black text-black tracking-tighter uppercase">BOUNTY DISPATCHED.</h3>
            <p className="text-sm text-gray-500 font-bold mt-2 max-w-xs mx-auto">
              Extraction verified for {recipient}. <br/> The solver has been notified of the successful transaction. Protocol closed. 🪄
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentGatewayModal;
