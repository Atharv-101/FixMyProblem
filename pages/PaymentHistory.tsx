
import React from 'react';
import { useStore } from '../context/Store';
import { UserRole } from '../types';
import { IndianRupee, ArrowUpRight, ArrowDownLeft, Clock, Search, Filter, Calendar, Briefcase, Lock, Sparkles, ShieldCheck } from 'lucide-react';

const PaymentHistory: React.FC = () => {
    const { user, payments, problems } = useStore();

    const isStudent = user?.role === UserRole.STUDENT;
    const isCompany = user?.role === UserRole.COMPANY;
    const isAdmin = user?.role === UserRole.ADMIN;

    const totalStats = payments.reduce((acc, p) => {
        const gross = parseFloat(p.amount.replace(/[^0-9.]/g, '')) || 0;
        const commission = parseFloat(p.commissionAmount.replace(/[^0-9.]/g, '')) || 0;
        const net = parseFloat(p.netAmount.replace(/[^0-9.]/g, '')) || 0;
        
        acc.gross += gross;
        acc.commission += commission;
        acc.net += net;
        return acc;
    }, { gross: 0, commission: 0, net: 0 });

    const openLiabilities = isCompany ? problems
        .filter(p => p.companyId === user.id && p.status === 'OPEN')
        .reduce((acc, p) => acc + (parseFloat(p.bounty.replace(/[^0-9.]/g, '')) || 0), 0) : 0;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900">Payment History</h1>
                    <p className="text-gray-500">Track all your earnings, payouts, and pending dues.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {isStudent ? 'Net Earnings' : (isAdmin ? 'Total Volume' : 'Total Payouts')}
                            </span>
                            <div className={`p-2 rounded-lg ${isStudent || isAdmin ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {isStudent || isAdmin ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <IndianRupee className="w-5 h-5 mr-1 text-gray-900" />
                            <span className="text-3xl font-black text-gray-900">
                                {isStudent ? totalStats.net.toLocaleString('en-IN') : totalStats.gross.toLocaleString('en-IN')}
                            </span>
                        </div>
                        {isStudent && <p className="text-[10px] text-gray-400 mt-2 font-medium">Post-commission (90%) total</p>}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {isAdmin ? 'Total Commissions' : (isCompany ? 'Open Liabilities' : 'Platform Cut')}
                            </span>
                            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                                {isAdmin ? <Sparkles className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <IndianRupee className="w-5 h-5 mr-1 text-gray-900" />
                            <span className="text-3xl font-black text-gray-900">
                                {isAdmin ? totalStats.commission.toLocaleString('en-IN') : (isCompany ? openLiabilities.toLocaleString('en-IN') : totalStats.commission.toLocaleString('en-IN'))}
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">
                            {isAdmin ? '10% from all challenges' : (isCompany ? 'Bounties for OPEN challenges' : '10% Platform fee total')}
                        </p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center justify-between mb-2 opacity-80">
                            <span className="text-xs font-bold uppercase tracking-widest">Transactions</span>
                            <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-black">{payments.length}</span>
                            <span className="ml-2 text-sm font-medium opacity-80">Successfully processed</span>
                        </div>
                        <div className="mt-2 text-[10px] text-blue-400 font-bold flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Protected by FixMyProblem Payout Protocol
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="font-bold text-gray-800">Recent Transactions</h3>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <div className="relative flex-grow sm:flex-grow-0">
                                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full" />
                            </div>
                            <button className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"><Filter className="w-4 h-4 text-gray-500" /></button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                                <tr>
                                    <th className="p-4">Project & Reference</th>
                                    <th className="p-4">{isStudent ? 'Source' : 'Recipient'}</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Gross Bounty</th>
                                    <th className="p-4 text-right">{isStudent ? 'Net Received' : 'Total Payout'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payments.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-gray-900">{p.problemTitle}</div>
                                            <div className="flex items-center mt-1">
                                                <span className="text-[10px] text-gray-400 font-mono mr-2">TXN-{p.id.slice(0, 8).toUpperCase()}</span>
                                                <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 flex items-center font-bold">
                                                    <Lock className="w-2.5 h-2.5 mr-1" /> VERIFIED
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold mr-2 border border-slate-200">
                                                    {(isStudent ? p.fromName : p.toName).charAt(0)}
                                                </div>
                                                <span className="text-xs font-bold text-gray-700">{isStudent ? p.fromName : p.toName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Calendar className="w-3 h-3 mr-1.5" />
                                                {new Date(p.timestamp).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-medium text-gray-500 line-through decoration-slate-300 decoration-1">{p.amount}</div>
                                            <div className="text-[9px] text-gray-400 font-bold uppercase">Incl. 10% Fee</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className={`font-black text-sm ${isStudent ? 'text-green-600' : 'text-red-600'}`}>
                                                {isStudent ? '+' : '-'}{isStudent ? p.netAmount : p.amount}
                                            </div>
                                            {isCompany && (
                                                <div className="text-[9px] text-gray-400 font-medium">₹{parseFloat(p.commissionAmount.replace(/[^0-9.]/g, '')).toFixed(0)} platform fee</div>
                                            )}
                                            {isStudent && (
                                                <div className="text-[9px] text-gray-400 font-medium">90% Net Payout</div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center">
                                            <IndianRupee className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400 text-sm font-medium">No financial records found.</p>
                                        </td>
                                    </tr>
                                ) }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;
