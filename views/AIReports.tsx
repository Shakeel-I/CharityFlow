
import React, { useMemo } from 'react';
import { FundingGrant, StrategyItem } from '../types';
import { Card } from '../components/ui/Card';
import { BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

interface AIReportsProps {
  funding: FundingGrant[];
  strategy: StrategyItem[];
}

export const AIReports: React.FC<AIReportsProps> = ({ funding }) => {
  const chartData = useMemo(() => {
    const monthlyMap: Record<string, { month: string; amount: number; sortKey: number }> = {};
    funding.forEach(f => {
      const month = f.deadlineMonth || 'N/A';
      if (!monthlyMap[month]) {
        const date = new Date(f.dateForFunding);
        monthlyMap[month] = { 
          month, 
          amount: 0, 
          sortKey: new Date(date.getFullYear(), date.getMonth(), 1).getTime() 
        };
      }
      monthlyMap[month].amount += Number(f.amount || 0);
    });
    const monthlyData = Object.values(monthlyMap).sort((a, b) => a.sortKey - b.sortKey);

    const statusMap: Record<string, { name: string; value: number }> = {};
    funding.forEach(f => {
      const status = f.smtStatus;
      if (!statusMap[status]) statusMap[status] = { name: status, value: 0 };
      statusMap[status].value += Number(f.amount || 0);
    });
    const statusData = Object.values(statusMap);

    return { monthlyData, statusData };
  }, [funding]);

  // Futuristic Neon Palette
  const PIE_COLORS = ['#22d3ee', '#a855f7', '#10b981', '#fbbf24', '#f43f5e', '#3b82f6', '#ec4899', '#f97316'];

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mono text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Activity size={14} /> Analytics Subsystem v4.2
        </div>
        <h2 className="text-5xl font-black text-white italic tracking-tighter">SUMMARY OF FUNDING</h2>
        <p className="text-slate-500 max-w-xl mx-auto font-medium mono text-sm uppercase tracking-widest">
          Pipeline Intelligence Analytics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-8">
          <div className="flex items-center gap-4 mb-8">
             <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
               <BarChart3 size={24} />
             </div>
             <h3 className="font-black text-xl text-slate-200 tracking-tight uppercase italic">Monthly Forecast</h3>
          </div>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold', fontFamily: 'JetBrains Mono'}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono'}} 
                  tickFormatter={(v) => `£${v/1000}k`} 
                />
                <Tooltip 
                    cursor={{fill: 'rgba(34, 211, 238, 0.05)'}}
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      border: '1px solid #1e293b', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: '#22d3ee' }}
                />
                <Bar dataKey="amount" fill="#22d3ee" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8">
          <div className="flex items-center gap-4 mb-8">
             <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
               <PieChartIcon size={24} />
             </div>
             <h3 className="font-black text-xl text-slate-200 tracking-tight uppercase italic">Status Matrix</h3>
          </div>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={100}
                  outerRadius={150}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="transparent"
                >
                  {chartData.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  layout="horizontal" 
                  align="center" 
                  verticalAlign="bottom" 
                  wrapperStyle={{ fontSize: '10px', paddingTop: '20px', fontFamily: 'JetBrains Mono', color: '#94a3b8', textTransform: 'uppercase' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
