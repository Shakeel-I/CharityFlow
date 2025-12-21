
import React from 'react';
import { FundingGrant, SMTStatus } from '../types';
import { Card } from '../components/ui/Card';
import { Clock, AlertCircle } from 'lucide-react';

interface DeadlinesProps {
  data: FundingGrant[];
}

export const Deadlines: React.FC<DeadlinesProps> = ({ data }) => {
  // Sort by deadline, ascending (sooner first)
  const sortedData = [...data].sort((a, b) => new Date(a.dateForFunding).getTime() - new Date(b.dateForFunding).getTime());

  // Helper to determine urgency style
  const getUrgencyStyle = (dateString: string) => {
    const today = new Date();
    const target = new Date(dateString);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'bg-slate-800 text-slate-400 border-slate-700'; // Past
    if (diffDays <= 30) return 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]'; // Urgent
    if (diffDays <= 60) return 'bg-amber-500/10 text-amber-400 border-amber-500/30'; // Upcoming
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'; // Distant
  };

  const getStatusColorClass = (status: SMTStatus) => {
    switch (status) {
      case SMTStatus.SUCCESSFUL: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case SMTStatus.CONSIDERATION: return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case SMTStatus.MANAGERS_MEETING: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case SMTStatus.PROGRESS_APP:
      case SMTStatus.PROGRESS_AWAITING:
      case SMTStatus.PROGRESS_SUITABLE: return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case SMTStatus.NOT_PROCEEDING:
      case SMTStatus.UNSUCCESSFUL: return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
         <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Time Horizon</h2>
         <span className="bg-rose-500/20 text-rose-400 text-[10px] px-3 py-1 rounded-full border border-rose-500/30 font-black uppercase tracking-widest flex items-center gap-2">
             <AlertCircle size={14} /> Critical Buffer
         </span>
      </div>

      <Card>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-900/50 text-slate-400 uppercase font-black mono text-[10px] tracking-widest">
                    <tr>
                        <th className="px-8 py-4">Deadline Index</th>
                        <th className="px-8 py-4">Funder</th>
                        <th className="px-8 py-4">Grant Vector</th>
                        <th className="px-8 py-4 text-right">Amount</th>
                        <th className="px-8 py-4">Assigned Unit</th>
                        <th className="px-8 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                    {sortedData.map(grant => {
                        const date = new Date(grant.dateForFunding);
                        return (
                            <tr key={grant.id} className="hover:bg-cyan-500/5 transition-colors">
                                <td className="px-8 py-5">
                                    <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black border mono ${getUrgencyStyle(grant.dateForFunding)}`}>
                                        <Clock size={12} className="mr-2" />
                                        {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                    </div>
                                </td>
                                <td className="px-8 py-5 font-black text-slate-100 uppercase tracking-tight">{grant.funder}</td>
                                <td className="px-8 py-5 text-slate-300 text-xs font-medium">{grant.fundName}</td>
                                <td className="px-8 py-5 text-cyan-400 font-black text-right mono">£{grant.amount.toLocaleString()}</td>
                                <td className="px-8 py-5 text-slate-400 mono text-[10px] uppercase font-bold">{grant.assignedTo || '-'}</td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColorClass(grant.smtStatus)}`}>
                                        {grant.smtStatus}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                    {sortedData.length === 0 && (
                        <tr><td colSpan={6} className="px-8 py-16 text-center text-slate-500 uppercase mono text-xs tracking-[0.2em]">NO CHRONOLOGICAL DATA DETECTED</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};
