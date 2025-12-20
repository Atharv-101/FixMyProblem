
import React, { useState } from 'react';
import Modal from './Modal';
import { Loader2, CreditCard, Landmark, Smartphone, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  recipient: string;
  problemTitle: string;
  onSuccess: (method: string) => void;
}

const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ isOpen, onClose, amount, recipient, problemTitle, onSuccess }) => {
  const [step, setStep] = useState<'CHOICE' | 'PROCESSING' | 'SUCCESS'>('CHOICE');
  const [method, setMethod] = useState('');

  // Robust parsing: strip everything except digits and the decimal point
  const gross = parseFloat(amount.replace(/[^\d.]/g, '')) || 0;
  const commission = gross * 0.1;
  const net = gross - commission;

  const handlePay = (selectedMethod: string) => {
    setMethod(selectedMethod);
    setStep('PROCESSING');
    setTimeout(() => {
      setStep('SUCCESS');
      setTimeout(() => {
        onSuccess(selectedMethod);
        setStep('CHOICE');
      }, 1500);
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Secure Payout">
      <div className="p-2">
        {step === 'CHOICE' && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Lock className="w-16 h-16" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border border-blue-500/30 flex items-center">
                    <Lock className="w-3 h-3 mr-1" /> Original Bounty Locked
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Due</p>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-4xl font-black text-white">₹{gross.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Project:</span>
                    <span className="text-white font-medium truncate ml-4 max-w-[150px]">{problemTitle}</span>
                  </div>
                  
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                      <span className="text-slate-500">Service Fee (10%)</span>
                      <span className="text-red-400">- ₹{commission.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                      <span className="text-slate-500">Student Payout</span>
                      <span className="text-green-400">₹{net.toFixed(0)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-700">
                        <p className="text-[10px] text-slate-500 text-center italic">Recipient: {recipient}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Choose Payment Method</p>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => handlePay('Credit Card')} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <CreditCard className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    <span className="ml-3 font-bold text-gray-700 group-hover:text-blue-900">Credit / Debit Card</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                </button>

                <button onClick={() => handlePay('UPI')} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Smartphone className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    <span className="ml-3 font-bold text-gray-700 group-hover:text-blue-900">UPI (GPay / PhonePe)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center flex items-center justify-center pt-2">
              <ShieldCheck className="w-3 h-3 mr-1 text-green-500" /> Platform Fee protects your IP and ensures verified payouts
            </p>
          </div>
        )}

        {step === 'PROCESSING' && (
          <div className="py-20 flex flex-col items-center">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-blue-600 animate-spin mb-6" />
              <Lock className="w-6 h-6 text-blue-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+12px)]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Releasing Funds...</h3>
            <p className="text-sm text-gray-500 mt-2">Deducting commission & processing student payout</p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="py-20 flex flex-col items-center text-center animate-pop-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 border-4 border-green-500 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Transaction Finalized</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">₹{net.toFixed(0)} has been sent to {recipient}. ₹{commission.toFixed(0)} Platform fee processed.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentGatewayModal;
