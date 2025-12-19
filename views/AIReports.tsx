
import React, { useMemo } from 'react';
import { FundingGrant, StrategyItem } from '../types';
import { Card } from '../components/ui/Card';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

interface AIReportsProps {
  funding: FundingGrant[];
  strategy: StrategyItem[];
}

export const AIReports: React.FC<AIReportsProps> = ({ funding }) => {
  // --- Chart Data Processing ---
  const chartData = useMemo(() => {
    // 1. Forecasted by month (Bar Chart)
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

    // 2. Status Distribution (Pie Chart)
    const statusMap: Record<string, { name: string; value: number }> = {};
    funding.forEach(f => {
      const status = f.smtStatus;
      if (!statusMap[status]) statusMap[status] = { name: status, value: 0 };
      statusMap[status].value += Number(f.amount || 0);
    });
    const statusData = Object.values(statusMap);

    return { monthlyData, statusData };
  }, [funding]);

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#64748b', '#8b5cf6', '#ec4899', '#f97316'];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Summary of Funding</h2>
        <p className="text-slate-500 max-w-xl mx-auto font-medium">
          Pipeline Analytics
        </p>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6 text-slate-700">
             <BarChart3 size={20} className="text-emerald-500" />
             <h3 className="font-bold text-lg">Forecasted by Month</h3>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(v) => `£${v/1000}k`} />
                <Tooltip 
                    formatter={(value: number) => [`£${value.toLocaleString()}`, 'Total Amount']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6 text-slate-700">
             <PieChartIcon size={20} className="text-blue-500" />
             <h3 className="font-bold text-lg">Funding Status Overview</h3>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={130}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`£${value.toLocaleString()}`, 'Total Amount']} />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '12px', paddingLeft: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
