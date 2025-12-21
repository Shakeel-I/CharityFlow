
import React, { useMemo, useState } from 'react';
import { FundingGrant, SMTStatus } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { ChevronDown, ChevronUp, Zap, Target, Layers } from 'lucide-react';

interface DashboardProps {
  funding: FundingGrant[];
}

export const Dashboard: React.FC<DashboardProps> = ({ funding }) => {
  const INITIAL_LIMIT_SUMMARY = 3;
  const INITIAL_LIMIT_PIPELINE = 5;
  
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);
  const [isProjectExpanded, setIsProjectExpanded] = useState(false);
  const [isPipelineExpanded, setIsPipelineExpanded] = useState(false);

  const statusSummary = useMemo(() => {
    const summary = funding.reduce((acc, curr) => {
      const status = curr.smtStatus;
      if (!acc[status]) acc[status] = { amount: 0, count: 0 };
      acc[status].amount += Number(curr.amount || 0);
      acc[status].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    return Object.entries(summary).map(([status, stats]: [string, { amount: number; count: number }]) => ({
      status, amount: stats.amount, count: stats.count
    }));
  }, [funding]);

  const projectSummary = useMemo(() => {
    const summary = funding.reduce((acc, curr) => {
      const project = curr.relevantWCAProject || 'Unassigned';
      if (!acc[project]) acc[project] = { amount: 0, count: 0 };
      acc[project].amount += Number(curr.amount || 0);
      acc[project].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    return Object.entries(summary).map(([project, stats]: [string, { amount: number; count: number }]) => ({
      project, amount: stats.amount, count: stats.count
    }));
  }, [funding]);

  const deadlinePipeline = useMemo(() => {
    interface PipelineSummaryItem {
      prepMonth: string;
      deadlineMonth: string;
      funders: string[];
      sortKey: number;
    }
    const summary = funding.reduce((acc, curr) => {
      const pMonth = curr.prepMonth || 'N/A';
      const dMonth = curr.deadlineMonth || 'N/A';
      const key = `${pMonth}-${dMonth}`;
      if (!acc[key]) {
        const dateObj = new Date(curr.dateForFunding);
        acc[key] = { 
          prepMonth: pMonth,
          deadlineMonth: dMonth,
          funders: [],
          sortKey: new Date(dateObj.getFullYear(), dateObj.getMonth(), 1).getTime()
        };
      }
      if (!acc[key].funders.includes(curr.funder)) acc[key].funders.push(curr.funder);
      return acc;
    }, {} as Record<string, PipelineSummaryItem>);
    return (Object.values(summary) as PipelineSummaryItem[]).sort((a, b) => a.sortKey - b.sortKey);
  }, [funding]);

  const visibleStatus = isStatusExpanded ? statusSummary : statusSummary.slice(0, INITIAL_LIMIT_SUMMARY);
  const visibleProjects = isProjectExpanded ? projectSummary : projectSummary.slice(0, INITIAL_LIMIT_SUMMARY);
  const visiblePipeline = isPipelineExpanded ? deadlinePipeline : deadlinePipeline.slice(0, INITIAL_LIMIT_PIPELINE);

  const getStatusColorClass = (status: string) => {
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
    <div className="space-y-10 animate-fade-in">
      {/* Header HUD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-800 pb-10 gap-6">
        <div>
           <h2 className="text-3xl font-black text-white tracking-tighter mb-2 uppercase">FUNDRAISING CRM</h2>
           <p className="text-cyan-400/90 mono text-sm flex items-center gap-2">
             <Zap size={14} className="animate-pulse" /> INCOME DIVERSITY GRANTS & FUNDERS
           </p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm flex items-center gap-6 min-w-[300px]">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Target size={32} />
            </div>
            <div>
              <span className="text-[10px] mono font-bold text-slate-400 uppercase tracking-widest">Annual Target</span>
              <div className="text-4xl font-black text-white tabular-nums mono neon-glow-cyan">
                  £120,000
              </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Summary of Funding */}
        <Card>
          <CardHeader title="Summary of Funding" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/50 text-slate-400 uppercase mono text-[10px] tracking-widest">
                <tr>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Amount (GBP)</th>
                  <th className="px-8 py-4 text-center">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {visibleStatus.map((item, idx) => (
                  <tr key={idx} className="hover:bg-cyan-500/5 transition-all duration-300 group">
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColorClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-slate-100 mono">£{item.amount.toLocaleString()}</td>
                    <td className="px-8 py-5 text-center text-cyan-400 font-black mono text-xs">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {statusSummary.length > INITIAL_LIMIT_SUMMARY && (
            <div className="p-4 bg-slate-950/20 text-center border-t border-slate-800/50">
              <button 
                onClick={() => setIsStatusExpanded(!isStatusExpanded)}
                className="text-cyan-400 hover:text-cyan-300 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto transition-all"
              >
                {isStatusExpanded ? <><ChevronUp size={14} /> COLLAPSE VIEW</> : <><ChevronDown size={14} /> EXPAND DATASET ({statusSummary.length})</>}
              </button>
            </div>
          )}
        </Card>

        {/* Relevant WCA Project */}
        <Card>
          <CardHeader title="Relevant WCA Project" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900/50 text-slate-400 uppercase mono text-[10px] tracking-widest">
                <tr>
                  <th className="px-8 py-4">Project</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                  <th className="px-8 py-4 text-center">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {visibleProjects.map((item, idx) => (
                  <tr key={idx} className="hover:bg-cyan-500/5 transition-all duration-300">
                    <td className="px-8 py-5 font-bold text-slate-200 flex items-center gap-3 italic">
                      <Layers size={14} className="text-cyan-500" /> {item.project}
                    </td>
                    <td className="px-8 py-5 text-right font-black text-cyan-400 mono">£{item.amount.toLocaleString()}</td>
                    <td className="px-8 py-5 text-center text-slate-400 mono text-xs">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {projectSummary.length > INITIAL_LIMIT_SUMMARY && (
            <div className="p-4 bg-slate-950/20 text-center border-t border-slate-800/50">
              <button 
                onClick={() => setIsProjectExpanded(!isProjectExpanded)}
                className="text-cyan-400 hover:text-cyan-300 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto transition-all"
              >
                {isProjectExpanded ? <><ChevronUp size={14} /> COLLAPSE VIEW</> : <><ChevronDown size={14} /> EXPAND DATASET ({projectSummary.length})</>}
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Funding to Respond to deadlines */}
      <Card>
        <CardHeader title="Funding to Respond to Deadlines" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 text-slate-400 uppercase mono text-[10px] tracking-widest">
              <tr>
                <th className="px-8 py-4">Phase: Prep</th>
                <th className="px-8 py-4">Phase: Deadline</th>
                <th className="px-8 py-4">Entities Involved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {visiblePipeline.map((item, idx) => (
                <tr key={idx} className="hover:bg-cyan-500/5 transition-all duration-300">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className="text-amber-300 font-black mono text-xs bg-amber-400/10 px-3 py-1.5 rounded-md border border-amber-400/20 shadow-[0_0_10px_rgba(251,191,36,0.1)] uppercase block w-fit whitespace-nowrap">
                      {item.prepMonth}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-cyan-400 font-black mono text-xs uppercase">
                      {item.deadlineMonth}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      {item.funders.map((funder, fIdx) => (
                        <span key={fIdx} className="bg-slate-800/50 text-slate-300 px-2.5 py-1 rounded-md text-[10px] font-bold border border-slate-700 uppercase mono">
                          {funder}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
