
import React, { useState } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole } from '../types.ts';
import { Loader2, ArrowLeft, CheckCircle2, AlertTriangle, Zap, Terminal, Shield, Lock, Cpu, ArrowRight, Sparkles } from 'lucide-react';

interface AuthPageProps {
  initialRole?: UserRole;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialRole, onBack }) => {
  const { login, register, resetPassword } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(initialRole || UserRole.STUDENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setMessage('Reset link deployed to your inbox. Check junk if missing.');
        setLoading(false);
        return;
      }

      if (isLogin) {
        await login(email, password);
      } else {
        if (role === UserRole.STUDENT) {
            const eduRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.[a-z]{2}|edu\.in)$/;
            if (!eduRegex.test(email)) throw new Error("Solver requires .edu or .ac.xx credentials.");
        }
        if (role === UserRole.ADMIN && extraInfo !== 'admin2024') throw new Error("Invalid Root Key.");

        await register(email, password, role, name, extraInfo);
        setMessage(`Verification sent to ${email}. Authenticate to proceed.`);
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'System error detected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-6 relative overflow-hidden">
      <div className="absolute top-10 left-10 opacity-5 animate-float">
        <Cpu className="w-64 h-64" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-5 animate-float [animation-delay:2s]">
        <Terminal className="w-64 h-64" />
      </div>

      <button 
        onClick={onBack}
        className="fixed top-8 left-8 z-50 flex items-center gap-3 px-6 py-3 bg-white border-2 border-black font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
        Return to Grid
      </button>

      <div className="w-full max-w-lg relative reveal">
        <div className="tactile-card bg-white p-10 md:p-14 rounded-[3rem] relative overflow-visible">
          <div className="sticker-tape"></div>
          
          <div className="text-center mb-10">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest mb-6">
                <Lock className="w-3.5 h-3.5 text-citrus fill-citrus" />
                {isLogin ? 'Identity Protocol' : 'Registration Sequence'}
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter leading-none mb-2">
                {isForgotPassword ? 'Reset Access' : (isLogin ? 'Welcome Back.' : 'Join the Grid.')}
             </h2>
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-4">
                {isForgotPassword ? "System recovery initiated" : "Authorize your credentials to sync"}
             </p>
          </div>

          {message && (
             <div className="bg-forest text-white p-4 rounded-xl mb-8 text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-3 flex-shrink-0" /> {message}
             </div>
          )}

          {error && (
            <div className="bg-coral text-white p-4 rounded-xl mb-8 text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center">
                <AlertTriangle className="w-4 h-4 mr-3 flex-shrink-0" /> {error}
             </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
             {!isLogin && !isForgotPassword && (
               <div className="grid grid-cols-2 gap-4 mb-8">
                  <button 
                    type="button" 
                    onClick={() => setRole(UserRole.STUDENT)} 
                    className={`py-4 text-[10px] font-black uppercase tracking-widest rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${role === UserRole.STUDENT ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
                  >
                    <Zap className="w-4 h-4" /> Solver
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setRole(UserRole.COMPANY)} 
                    className={`py-4 text-[10px] font-black uppercase tracking-widest rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${role === UserRole.COMPANY ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
                  >
                    <Shield className="w-4 h-4" /> Company
                  </button>
               </div>
             )}

             <div className="space-y-6">
               {!isLogin && !isForgotPassword && (
                 <>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Identity</label>
                     <input type="text" required placeholder="Alex Murphy" className="w-full bg-paper border-2 border-black rounded-xl px-5 py-4 text-black font-bold placeholder:text-gray-300 focus:bg-citrus/5 outline-none transition-all" value={name} onChange={e => setName(e.target.value)} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                       {role === UserRole.STUDENT ? "Academic Institute" : "Entity Name"}
                     </label>
                     <input type="text" required placeholder={role === UserRole.STUDENT ? "IIT Kharagpur" : "CyberDyne Systems"} className="w-full bg-paper border-2 border-black rounded-xl px-5 py-4 text-black font-bold placeholder:text-gray-300 focus:bg-citrus/5 outline-none transition-all" value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
                   </div>
                 </>
               )}

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Digital Mail</label>
                 <input type="email" required placeholder="user@grid.com" className="w-full bg-paper border-2 border-black rounded-xl px-5 py-4 text-black font-bold placeholder:text-gray-300 focus:bg-citrus/5 outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} />
               </div>
               
               {!isForgotPassword && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Access Cipher</label>
                    <input type="password" required placeholder="••••••••" className="w-full bg-paper border-2 border-black rounded-xl px-5 py-4 text-black font-bold placeholder:text-gray-300 focus:bg-citrus/5 outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
               )}
             </div>

             <div className="flex justify-end items-center text-[10px] font-black uppercase tracking-widest mt-2">
                {!isForgotPassword && isLogin && (
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-coral hover:underline decoration-2">Forgot Cipher?</button>
                )}
                {isForgotPassword && (
                    <button type="button" onClick={() => setIsForgotPassword(false)} className="text-gray-400 hover:text-black">Back to terminal</button>
                )}
             </div>

             <button 
                type="submit" 
                disabled={loading} 
                className="tactile-btn w-full bg-black text-white font-black py-5 rounded-2xl text-xl uppercase tracking-widest flex justify-center items-center gap-4 transition-all hover:bg-forest disabled:opacity-50"
             >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                   <>
                    {isForgotPassword ? 'Reset Link' : (isLogin ? 'Authenticate' : 'Initialize')}
                    <ArrowRight className="w-6 h-6" />
                   </>
                )}
             </button>
          </form>

          {!isForgotPassword && (
              <div className="text-center mt-10 pt-10 border-t-2 border-gray-50">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {isLogin ? "No identity found?" : "Already synced?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-coral ml-2 hover:underline decoration-2">
                       {isLogin ? "Generate New" : "Switch to Login"}
                    </button>
                 </p>
              </div>
          )}
        </div>

        <div className="absolute -bottom-6 -right-6 px-6 py-4 bg-citrus border-2 border-black rounded-2xl font-black text-xs uppercase tracking-widest rotate-6 shadow-lg flex items-center gap-2">
           <Sparkles className="w-4 h-4" /> Secured Protocol
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
