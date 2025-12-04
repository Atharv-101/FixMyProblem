import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { UserRole } from '../types';
import { Loader2, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

type ViewState = 'HOME' | 'LEADERBOARD' | 'PRIVACY' | 'TERMS' | 'CONTACT' | 'AUTH' | 'DASHBOARD';

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
        setMessage('Password reset link sent. Check your email.');
        setLoading(false);
        return;
      }

      if (isLogin) {
        await login(email, password);
      } else {
        if (role === UserRole.STUDENT) {
            const eduRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.[a-z]{2}|edu\.in)$/;
            if (!eduRegex.test(email)) throw new Error("Please use a valid college email (.edu, .edu.in or .ac.xx)");
        }
        if (role === UserRole.ADMIN && extraInfo !== 'admin2024') throw new Error("Invalid Admin Secret Key");

        await register(email, password, role, name, extraInfo);
        setMessage(`Verification email sent to ${email}. Please check your inbox and verify to log in.`);
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 z-50 flex items-center text-slate-400 hover:text-white transition-colors font-medium bg-slate-900/50 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-800 hover:border-slate-600 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
      </button>

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-white mb-2">
                {isForgotPassword ? 'Reset Access' : (isLogin ? 'Welcome Back' : 'Join the Network')}
             </h2>
             <p className="text-slate-400 text-sm">
                {!isForgotPassword && (
                  isLogin ? "Authenticate to access your dashboard" : "Create your secure identity"
                )}
             </p>
          </div>

          {message && (
             <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg mb-4 text-sm flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" /> {message}
             </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> {error}
             </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
             {!isLogin && !isForgotPassword && (
               <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-lg mb-4">
                  <button type="button" onClick={() => setRole(UserRole.STUDENT)} className={`py-2 text-sm font-bold rounded-md transition-all ${role === UserRole.STUDENT ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Student</button>
                  <button type="button" onClick={() => setRole(UserRole.COMPANY)} className={`py-2 text-sm font-bold rounded-md transition-all ${role === UserRole.COMPANY ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Company</button>
               </div>
             )}

             {!isLogin && !isForgotPassword && (
               <>
                 <input type="text" required placeholder="Full Name" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" value={name} onChange={e => setName(e.target.value)} />
                 <input type="text" required placeholder={role === UserRole.STUDENT ? "University Name" : (role === UserRole.ADMIN ? "Secret Key" : "Company Name")} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
               </>
             )}

             <input type="email" required placeholder="Email Address" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} />
             
             {!isForgotPassword && (
                <input type="password" required placeholder="Password" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />
             )}

             <div className="flex justify-between items-center text-sm mt-2">
                {!isForgotPassword && isLogin && (
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-blue-400 hover:text-blue-300">Forgot password?</button>
                )}
                {isForgotPassword && (
                    <button type="button" onClick={() => setIsForgotPassword(false)} className="text-slate-400 hover:text-white">Back to login</button>
                )}
             </div>

             <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Authenticate' : 'Initialize Account'))}
             </button>
          </form>

          {!isForgotPassword && (
              <p className="text-center text-slate-500 text-sm mt-6">
                 {isLogin ? "New user? " : "Already have an ID? "}
                 <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 font-bold hover:text-blue-300">
                    {isLogin ? "Create Account" : "Login"}
                 </button>
              </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
