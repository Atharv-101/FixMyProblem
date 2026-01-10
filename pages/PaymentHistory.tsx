
import React, { useMemo, useState } from 'react';
import { useStore } from '../context/Store.tsx';
import { UserRole } from '../types.ts';
// Fixed missing imports: CheckCircle2 and Zap
import { 
  IndianRupee, ArrowUpRight, ArrowDownLeft, Clock, Search, 
  Filter, Calendar, Briefcase, Lock, Sparkles, ShieldCheck, 
  ArrowLeft, Wallet, PieChart, FileText, Download, TrendingUp,
  CheckCircle2, Zap
} from 'lucide-react';

const PaymentHistory: React.FC = () => {
    const { user, payments, problems } = useStore();
    const [searchQuery, setSearchQuery] = useState('');

    const isStudent = user?.role === UserRole.STUDENT;
    const isCompany = user?.role === UserRole.COMPANY;
    const isAdmin = user?.role === UserRole.ADMIN;

    // Filter payments based on user role
    const filteredPayments = useMemo(() => {
        let base = payments;
        if (isStudent) base = payments.filter(p => p.toId === user?.id);
        if (isCompany) base = payments.filter(p => p.fromId === user?.id);
        
        return base.filter(p => 
            p.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.toName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [payments, user, isStudent, isCompany, searchQuery]);

    const stats = useMemo(() => {
        return filteredPayments.reduce((acc, p) => {
            const gross = parseFloat(p.amount.replace(/[^0-9.]/g, '')) || 0;
            const commission = parseFloat(p.commissionAmount.replace(/[^0-9.]/g, '')) || 0;
            const net = parseFloat(p.netAmount.replace(/[^0-9.]/g, '')) || 0;
            
            acc.gross += gross;
            acc.commission += commission;
            acc.net += net;
            return acc;
        }, { gross: 0, commission: 0, net: 0 });
    }, [filteredPayments]);

    const openLiabilities = useMemo(() => {
        if (!isCompany) return 0;
        return problems
            .filter(p => p.companyId === user?.id && p.status === 'OPEN')
            .reduce((acc, p) => acc + (parseFloat(p.bounty.replace(/[^0-9.]/g, '')) || 0), 0);
    }, [problems, user, isCompany]);

    const navigateToDashboard = () => {
        window.dispatchEvent(new CustomEvent('nav-change', { detail: 'DASHBOARD' }));
    };

    return (
        <div className="min-h-screen bg-paper pt-32 px-4 md:px-10 pb-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 p-10 opacity-[0.03] pointer-events-none">
                <Wallet className="w-[600px] h-[600px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 reveal">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 border-citrus shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] mb-4">
                            <ShieldCheck className="w-3.5 h-3.5 text-citrus" />
                            Protocol: Financial Ledger
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter leading-none italic underline decoration-forest decoration-8 underline-offset-8">
                            {isStudent ? 'Earnings.' : 'Expenditure.'}
                        </h1>
                        <p className="text-xl md:text-2xl font-bold text-gray-500 max-w-2xl mt-6">
                            {isStudent 
                                ? "Verifiable logs of your technical extractions from the grid. 😁" 
                                : "Manage your capital deployment and active bounty liabilities. 🪄"}
                        </p>
                    </div>
                    <button 
                        onClick={navigateToDashboard}
                        className="tactile-btn px-6 py-3 bg-white border-2 border-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 reveal">
                    <div className={`tactile-card p-10 rounded-[2.5rem] border-4 border-black relative overflow-hidden ${isStudent ? 'bg-forest text-citrus' : 'bg-black text-white'}`}>
                        <div className="absolute top-[-10px] right-[-10px] opacity-10"><TrendingUp className="w-24 h-24" /></div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">
                            {isStudent ? 'Net Extractions' : 'Total Dispatched'}
                        </p>
                        <div className="flex items-center text-4xl md:text-5xl font-black tracking-tighter">
                            <IndianRupee className="w-8 h-8 md:w-10 md:h-10 mr-1" />
                            {(isStudent ? stats.net : stats.gross).toLocaleString('en-IN')}
                        </div>
                        <p className="text-[9px] font-bold uppercase mt-4 opacity-40">
                            {isStudent ? '90% of gross bounty value' : 'Inclusive of platform overhead'}
                        </p>
                    </div>

                    <div className="tactile-card p-10 bg-citrus text-black rounded-[2.5rem] border-4 border-black relative overflow-hidden">
                        <div className="absolute top-[-10px] right-[-10px] opacity-10"><PieChart className="w-24 h-24" /></div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">
                            {isCompany ? 'Pending Liabilities' : 'Platform Commissions'}
                        </p>
                        <div className="flex items-center text-4xl md:text-5xl font-black tracking-tighter">
                            <IndianRupee className="w-8 h-8 md:w-10 md:h-10 mr-1" />
                            {(isCompany ? openLiabilities : stats.commission).toLocaleString('en-IN')}
                        </div>
                        <p className="text-[9px] font-bold uppercase mt-4 opacity-40">
                            {isCompany ? 'Bounties for OPEN challenges' : '10% Service Fee total'}
                        </p>
                    </div>

                    <div className="tactile-card p-10 bg-white text-black rounded-[2.5rem] border-4 border-black relative overflow-hidden">
                        <div className="absolute top-[-10px] right-[-10px] opacity-10"><Briefcase className="w-24 h-24" /></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Verification Nodes</p>
                        <div className="text-4xl md:text-5xl font-black tracking-tighter">
                            {filteredPayments.length} <span className="text-lg text-gray-300 font-bold ml-1 uppercase">Cycles</span>
                        </div>
                        <p className="text-[9px] font-bold uppercase mt-4 text-forest flex items-center gap-2">
                           <CheckCircle2 className="w-3 h-3" /> Successfully Settled
                        </p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="tactile-card bg-white rounded-[3rem] border-2 border-black overflow-hidden reveal shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                    <div className="p-8 border-b-2 border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3 italic">
                            <FileText className="w-6 h-6 text-coral" /> Transaction History.
                        </h3>
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-grow">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Scan by project name..." 
                                    className="pl-10 pr-4 py-3 bg-gray-50 border-2 border-black rounded-xl text-sm font-bold w-full outline-none focus:bg-citrus/5 transition-all"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b-2 border-black/5">
                                <tr>
                                    <th className="p-6">Execution & Ref</th>
                                    <th className="p-6">{isStudent ? 'Source Node' : 'Recipient Node'}</th>
                                    <th className="p-6">Grid Cycle Date</th>
                                    <th className="p-6">Gross Bounty</th>
                                    <th className="p-6 text-right">{isStudent ? 'Net Extraction' : 'Total Payout'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-gray-50">
                                {filteredPayments.map(p => (
                                    <tr key={p.id} className="hover:bg-citrus/5 group transition-colors">
                                        <td className="p-6">
                                            <div className="text-base font-black text-black group-hover:text-coral transition-colors">{p.problemTitle}</div>
                                            <div className="flex items-center mt-2 gap-3">
                                                <span className="text-[9px] text-gray-400 font-mono">TXN-{p.id.slice(-8).toUpperCase()}</span>
                                                <span className="text-[8px] bg-forest/10 text-forest px-2 py-0.5 rounded font-black uppercase flex items-center gap-1 border border-forest/10">
                                                    <Lock className="w-2.5 h-2.5" /> Verified
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm border-2 border-citrus">
                                                    {(isStudent ? p.fromName : p.toName).charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">{isStudent ? p.fromName : p.toName}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center text-xs text-gray-400 font-bold">
                                                <Calendar className="w-3.5 h-3.5 mr-2" />
                                                {new Date(p.timestamp).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="text-xs font-bold text-gray-500 line-through opacity-30 italic">{p.amount}</div>
                                            <div className="text-[8px] text-gray-300 font-black uppercase mt-1">Platform Audited</div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className={`text-xl font-black ${isStudent ? 'text-forest' : 'text-coral'}`}>
                                                {isStudent ? '+' : '-'}{isStudent ? p.netAmount : p.amount}
                                            </div>
                                            <div className="text-[9px] text-gray-400 font-bold uppercase mt-1 flex items-center justify-end gap-1">
                                                {isStudent ? '90% Release Protocol' : <><Zap className="w-2 h-2" /> 10% Platform Fee Applied</>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPayments.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <IndianRupee className="w-16 h-16 text-gray-100 mx-auto mb-6 animate-pulse" />
                                            <p className="text-gray-300 text-xl font-black uppercase tracking-widest italic">No financial records detected in this segment.</p>
                                        </td>
                                    </tr>
                                ) }
                            </tbody>
                        </table>
                    </div>

                    {filteredPayments.length > 0 && (
                        <div className="p-8 bg-gray-50 border-t-2 border-black/5 flex justify-center">
                            <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                <Download className="w-4 h-4" /> Export Financial Dossier (PDF/CSV)
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom Compliance Section */}
                <div className="mt-16 p-10 bg-gray-100 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 reveal">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white border-2 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <ShieldCheck className="w-8 h-8 text-forest" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black italic">Financial Integrity Node.</h4>
                            <p className="text-sm font-bold text-gray-500 leading-relaxed">FixMyProblem manages all tax compliance and platform fees at the source. Payouts are instant upon solution acceptance. 😁</p>
                        </div>
                    </div>
                    <button className="tactile-btn px-8 py-4 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-forest transition-all flex items-center gap-3">
                        Contact Command Center <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
