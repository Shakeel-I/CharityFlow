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

    if (diffDays < 0) return 'bg-slate-100 text-slate-500 border-slate-200'; // Past
    if (diffDays <= 30) return 'bg-red-50 text-red-700 border-red-200'; // Urgent
    if (diffDays <= 60) return 'bg-amber-50 text-amber-700 border-amber-200'; // Upcoming
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'; // Distant
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
         <h2 className="text-2xl font-bold text-slate-800">Funding to Respond to Deadlines</h2>
         <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full border border-red-200 font-medium flex items-center gap-1">
             <AlertCircle size={12} /> Priority View
         </span>
      </div>

      <Card>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-medium text-xs">
                    <tr>
                        <th className="px-6 py-4">Deadline</th>
                        <th className="px-6 py-4">Funder</th>
                        <th className="px-6 py-4">Grant Name</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                        <th className="px-6 py-4">Assigned To</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {sortedData.map(grant => {
                        const date = new Date(grant.dateForFunding);
                        return (
                            <tr key={grant.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getUrgencyStyle(grant.dateForFunding)}`}>
                                        <Clock size={12} className="mr-1.5" />
                                        {date.toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">{grant.funder}</td>
                                <td className="px-6 py-4 text-slate-600">{grant.fundName}</td>
                                <td className="px-6 py-4 text-emerald-600 font-medium text-right">£{grant.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-slate-600">{grant.assignedTo || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        grant.smtStatus === SMTStatus.APPROVED ? 'bg-emerald-100 text-emerald-800' :
                                        grant.smtStatus === SMTStatus.PENDING ? 'bg-amber-100 text-amber-800' : 
                                        grant.smtStatus === SMTStatus.REJECTED ? 'bg-red-100 text-red-800' :
                                        'bg-slate-100 text-slate-800'
                                    }`}>
                                        {grant.smtStatus}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                    {sortedData.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No deadlines found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};
