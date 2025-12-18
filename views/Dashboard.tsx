import React, { useMemo } from 'react';
import { FundingGrant, SMTStatus } from '../types';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

interface DashboardProps {
  funding: FundingGrant[];
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export const Dashboard: React.FC<DashboardProps> = ({ funding }) => {
  
  const stats = useMemo(() => {
    const totalPotential = funding.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const approvedCount = funding.filter(f => f.smtStatus === SMTStatus.APPROVED).length;
    const pendingCount = funding.filter(f => f.smtStatus === SMTStatus.PENDING).length;
    
    // Requested hardcoded value for Urgent Deadlines to be 3
    const urgentDeadlines = 3; 

    return { totalPotential, approvedCount, pendingCount, urgentDeadlines };
  }, [funding]);

  const statusData = useMemo(() => {
    const counts = funding.reduce((acc, curr) => {
      acc[curr.smtStatus] = (acc[curr.smtStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [funding]);

  const monthData = useMemo(() => {
     // Aggregate amount by month of deadline
     const data: Record<string, number> = {};
     funding.forEach(f => {
        if (!f.dateForFunding) return;
        const date = new Date(f.dateForFunding);
        const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        data[key] = (data[key] || 0) + Number(f.amount || 0);
     });
     return Object.entries(data).map(([name, amount]) => ({ name, amount })).slice(0, 6);
  }, [funding]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Deputy Director's Dashboard</h2>
           <p className="text-slate-500">Overview of fundraising activities and financial outlook</p>
        </div>
        <div className="text-right">
            <span className="text-sm text-slate-500">Total Potential Pipeline</span>
            <div className="text-3xl font-bold text-emerald-600">
                £{stats.totalPotential.toLocaleString()}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <CheckCircle2 size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Approved Grants</p>
                <p className="text-2xl font-bold text-slate-800">{stats.approvedCount}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                <Clock size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Pending Review</p>
                <p className="text-2xl font-bold text-slate-800">{stats.pendingCount}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-full">
                <Calendar size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Urgent Deadlines (30d)</p>
                <p className="text-2xl font-bold text-slate-800">{stats.urgentDeadlines}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-96">
            <CardHeader title="Funding by Status" />
            <CardBody className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 text-xs text-slate-500 mt-[-20px]">
                    {statusData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {entry.name}
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>

        <Card className="h-96">
            <CardHeader title="Projected Funding by Deadline" />
            <CardBody className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: '#f1f5f9'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                        />
                        <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
      </div>

      <div className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Urgent: Funding to Respond to Deadlines</h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-medium text-xs">
                    <tr>
                        <th className="px-6 py-4">Funder</th>
                        <th className="px-6 py-4">Grant Name</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Prep Month</th>
                        <th className="px-6 py-4">Deadline</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {funding
                        .sort((a,b) => new Date(a.dateForFunding).getTime() - new Date(b.dateForFunding).getTime())
                        .slice(0, 5)
                        .map(grant => {
                            const date = new Date(grant.dateForFunding);
                            const prepDate = new Date(date);
                            prepDate.setMonth(date.getMonth() - 1);
                            
                            return (
                                <tr key={grant.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{grant.funder}</td>
                                    <td className="px-6 py-4 text-slate-600">{grant.fundName}</td>
                                    <td className="px-6 py-4 text-emerald-600 font-medium">£{grant.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-slate-500">{prepDate.toLocaleString('default', { month: 'short' })}</td>
                                    <td className="px-6 py-4 text-slate-500">{date.toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            grant.smtStatus === SMTStatus.APPROVED ? 'bg-emerald-100 text-emerald-800' :
                                            grant.smtStatus === SMTStatus.PENDING ? 'bg-amber-100 text-amber-800' : 
                                            'bg-slate-100 text-slate-800'
                                        }`}>
                                            {grant.smtStatus}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    {funding.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No active funding records found.</td></tr>
                    )}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  );
};