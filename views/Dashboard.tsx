
import React, { useMemo, useState } from 'react';
import { FundingGrant, SMTStatus } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardProps {
  funding: FundingGrant[];
}

export const Dashboard: React.FC<DashboardProps> = ({ funding }) => {
  const INITIAL_LIMIT_SUMMARY = 3;
  const INITIAL_LIMIT_PIPELINE = 5;
  
  // State for expand/collapse
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);
  const [isProjectExpanded, setIsProjectExpanded] = useState(false);
  const [isPipelineExpanded, setIsPipelineExpanded] = useState(false);

  // Table 1 Summary: Status, Amount, Count
  const statusSummary = useMemo(() => {
    const summary = funding.reduce((acc, curr) => {
      const status = curr.smtStatus;
      if (!acc[status]) acc[status] = { amount: 0, count: 0 };
      acc[status].amount += Number(curr.amount || 0);
      acc[status].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    return Object.entries(summary).map(([status, stats]: [string, { amount: number; count: number }]) => ({
      status,
      amount: stats.amount,
      count: stats.count
    }));
  }, [funding]);

  // Table 2 Summary: Relevant WCA project, Amount, Count
  const projectSummary = useMemo(() => {
    const summary = funding.reduce((acc, curr) => {
      const project = curr.relevantWCAProject || 'Unassigned';
      if (!acc[project]) acc[project] = { amount: 0, count: 0 };
      acc[project].amount += Number(curr.amount || 0);
      acc[project].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    return Object.entries(summary).map(([project, stats]: [string, { amount: number; count: number }]) => ({
      project,
      amount: stats.amount,
      count: stats.count
    }));
  }, [funding]);

  // Table 3 Summary: Prep Month, Deadline Month, List of Funders
  const deadlinePipeline = useMemo(() => {
    // Define an interface for the summary value to fix type inference issues with Object.values
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
      
      if (!acc[key].funders.includes(curr.funder)) {
        acc[key].funders.push(curr.funder);
      }
      return acc;
    }, {} as Record<string, PipelineSummaryItem>);

    // Use explicit type assertion for Object.values to avoid 'unknown' type error on line 76
    const pipelineValues = Object.values(summary) as PipelineSummaryItem[];
    return pipelineValues.sort((a, b) => a.sortKey - b.sortKey);
  }, [funding]);

  // Slicing logic for tables
  const visibleStatus = isStatusExpanded ? statusSummary : statusSummary.slice(0, INITIAL_LIMIT_SUMMARY);
  const visibleProjects = isProjectExpanded ? projectSummary : projectSummary.slice(0, INITIAL_LIMIT_SUMMARY);
  const visiblePipeline = isPipelineExpanded ? deadlinePipeline : deadlinePipeline.slice(0, INITIAL_LIMIT_PIPELINE);

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case SMTStatus.SUCCESSFUL: return 'bg-emerald-100 text-emerald-800';
      case SMTStatus.CONSIDERATION: return 'bg-purple-100 text-purple-800';
      case SMTStatus.MANAGERS_MEETING: return 'bg-indigo-100 text-indigo-800';
      case SMTStatus.PROGRESS_APP:
      case SMTStatus.PROGRESS_AWAITING:
      case SMTStatus.PROGRESS_SUITABLE: return 'bg-blue-100 text-blue-800';
      case SMTStatus.NOT_PROCEEDING:
      case SMTStatus.UNSUCCESSFUL: return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
           <h2 className="text-3xl font-bold text-slate-900">Deputy Director's Dashboard</h2>
           <p className="text-slate-500 mt-1">Overview of fundraising activities and financial outlook</p>
        </div>
        <div className="text-right">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Annual Target</span>
            <div className="text-4xl font-black text-emerald-600 tabular-nums">
                £120,000
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Table 1: Status Summary */}
        <Card className="flex flex-col h-full">
          <CardHeader title="Funding Status Overview" />
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleStatus.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColorClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">£{item.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-slate-500 font-semibold">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {statusSummary.length > INITIAL_LIMIT_SUMMARY && (
            <div className="p-3 border-t border-slate-100 text-center">
              <button 
                onClick={() => setIsStatusExpanded(!isStatusExpanded)}
                className="text-emerald-600 hover:text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 mx-auto transition-all"
              >
                {isStatusExpanded ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Expand List ({statusSummary.length})</>}
              </button>
            </div>
          )}
        </Card>

        {/* Table 2: Project Allocation */}
        <Card className="flex flex-col h-full">
          <CardHeader title="WCA Project Allocation" />
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Relevant WCA Project</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleProjects.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{item.project}</td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">£{item.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-slate-500 font-semibold">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {projectSummary.length > INITIAL_LIMIT_SUMMARY && (
            <div className="p-3 border-t border-slate-100 text-center">
              <button 
                onClick={() => setIsProjectExpanded(!isProjectExpanded)}
                className="text-emerald-600 hover:text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 mx-auto transition-all"
              >
                {isProjectExpanded ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Expand List ({projectSummary.length})</>}
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Table 3: Funding Deadlines Pipeline */}
      <Card className="flex flex-col">
        <CardHeader title="Funding Deadlines Pipeline" />
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">Prep Month</th>
                <th className="px-6 py-4">Deadline Month</th>
                <th className="px-6 py-4">Funder(s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visiblePipeline.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded border border-amber-100">
                      {item.prepMonth}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-emerald-700 font-bold">
                      {item.deadlineMonth}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {item.funders.map((funder, fIdx) => (
                        <span 
                          key={fIdx} 
                          className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium border border-slate-200"
                        >
                          {funder}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {deadlinePipeline.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                    No pipeline data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {deadlinePipeline.length > INITIAL_LIMIT_PIPELINE && (
          <div className="p-3 border-t border-slate-100 text-center">
            <button 
              onClick={() => setIsPipelineExpanded(!isPipelineExpanded)}
              className="text-emerald-600 hover:text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 mx-auto transition-all"
            >
              {isPipelineExpanded ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Expand List ({deadlinePipeline.length})</>}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};
