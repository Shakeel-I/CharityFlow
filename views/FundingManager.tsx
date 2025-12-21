
import React, { useState } from 'react';
import { FundingGrant, SMTStatus, TenderSite, PhilanthropicSite, StrategyItem } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Input, Select, TextArea } from '../components/ui/Input';
import { Plus, X, Search, Filter, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const PROJECTS = [
  "Bigger picture and community champions", "Community Champions", "Corporate relationships", 
  "CYP trauma", "ESOL and CYP", "ESOL project", "ESOL project or SYP trauma", "Autism", 
  "Black Men Cancer Trauma project", "Community Voice", "Core funding", 
  "Core funding or CYP/Refugee project", "CYP", "CYP or community champions", "CYP project", 
  "Drug and alcohol & mental health", "ESOL", "ESOL refugee project", "Neighbourhoods"
];

const STATUSES = Object.values(SMTStatus);

interface FundingManagerProps {
  data: FundingGrant[];
  onSave: (item: FundingGrant) => void;
  onDelete: (id: string) => void;
  tenders: TenderSite[];
  philanthropy: PhilanthropicSite[];
  strategy: StrategyItem[];
  notes: string;
}

const emptyGrant: FundingGrant = {
  id: '',
  funder: '',
  fundName: '',
  isSmallFund: false,
  smtStatus: SMTStatus.CONSIDERATION,
  assignedTo: '',
  relevantWCAProject: '',
  details: '',
  amount: 0,
  dateForFunding: new Date().toISOString().split('T')[0],
  prepMonth: '',
  deadlineMonth: '',
  deliveryDates: '',
  action: '',
  website: '',
  createdAt: '',
};

export const FundingManager: React.FC<FundingManagerProps> = ({ 
  data, onSave, onDelete, tenders, philanthropy, strategy, notes 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGrant, setCurrentGrant] = useState<FundingGrant>(emptyGrant);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (grant: FundingGrant) => {
    setCurrentGrant(grant);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentGrant({ ...emptyGrant, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentGrant);
    setIsModalOpen(false);
  };

  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    // 1. Possible Funding & Grants Sheet (Raw Data first so formulas can reference it)
    const fundingSheetData = data.map(g => ({
      'Funder': g.funder,
      'Fund Name': g.fundName,
      'Small Fund': g.isSmallFund ? 'Yes' : 'No',
      'Status': g.smtStatus,
      'Assigned To': g.assignedTo,
      'Project': g.relevantWCAProject,
      'Details': g.details,
      'Amount': g.amount,
      'Funding Date': g.dateForFunding,
      'Prep Month': g.prepMonth,
      'Deadline Month': g.deadlineMonth,
      'Delivery Dates': g.deliveryDates,
      'Action': g.action,
      'Website': g.website
    }));
    const wsFunding = XLSX.utils.json_to_sheet(fundingSheetData);
    XLSX.utils.book_append_sheet(wb, wsFunding, 'Possible Funding & Grants');

    // 2. Dashboard Sheet with Formulas
    // We create a sheet with the labels and then inject formulas
    // FIX: Explicitly type as (string | number)[][] to avoid inference issues when pushing rows containing both strings and numbers (e.g. status labels with initial 0 counts).
    const dashboardRows: (string | number)[][] = [
      ['WANDCARE ALLIANCE - FUNDRAISING CRM DASHBOARD'],
      [],
      ['SUMMARY BY STATUS'],
      ['Status', 'Amount (GBP)', 'Count']
    ];
    // Add status labels
    STATUSES.forEach(s => dashboardRows.push([s, 0, 0]));
    
    dashboardRows.push([]);
    dashboardRows.push(['SUMMARY BY PROJECT']);
    dashboardRows.push(['Project', 'Amount', 'Count']);
    // Add project labels
    PROJECTS.forEach(p => dashboardRows.push([p, 0, 0]));

    const wsDashboard = XLSX.utils.aoa_to_sheet(dashboardRows);

    // Inject Formulas for Status Summary
    STATUSES.forEach((s, idx) => {
      const row = 5 + idx; // Offset from aoa_to_sheet (4 header rows, 1-based is 5)
      // Amount Formula: =SUMIF('Possible Funding & Grants'!D:D, A{row}, 'Possible Funding & Grants'!H:H)
      // Count Formula: =COUNTIF('Possible Funding & Grants'!D:D, A{row})
      const cellAmount = XLSX.utils.encode_cell({ r: row - 1, c: 1 });
      const cellCount = XLSX.utils.encode_cell({ r: row - 1, c: 2 });
      const cellStatusLabel = XLSX.utils.encode_cell({ r: row - 1, c: 0 });

      wsDashboard[cellAmount] = { 
        f: `SUMIF('Possible Funding & Grants'!$D:$D, $${cellStatusLabel}, 'Possible Funding & Grants'!$H:$H)`,
        t: 'n'
      };
      wsDashboard[cellCount] = { 
        f: `COUNTIF('Possible Funding & Grants'!$D:$D, $${cellStatusLabel})`,
        t: 'n'
      };
    });

    // Inject Formulas for Project Summary
    const projectHeaderRow = 7 + STATUSES.length;
    PROJECTS.forEach((p, idx) => {
      const row = projectHeaderRow + idx;
      const cellAmount = XLSX.utils.encode_cell({ r: row - 1, c: 1 });
      const cellCount = XLSX.utils.encode_cell({ r: row - 1, c: 2 });
      const cellProjectLabel = XLSX.utils.encode_cell({ r: row - 1, c: 0 });

      wsDashboard[cellAmount] = { 
        f: `SUMIF('Possible Funding & Grants'!$F:$F, $${cellProjectLabel}, 'Possible Funding & Grants'!$H:$H)`,
        t: 'n'
      };
      wsDashboard[cellCount] = { 
        f: `COUNTIF('Possible Funding & Grants'!$F:$F, $${cellProjectLabel})`,
        t: 'n'
      };
    });

    XLSX.utils.book_append_sheet(wb, wsDashboard, 'Dashboard');

    // 3. Tender Sites
    const wsTenders = XLSX.utils.json_to_sheet(tenders.map(t => ({ 'Site Name': t.name, 'Login ID': t.login })));
    XLSX.utils.book_append_sheet(wb, wsTenders, 'Tender Sites');

    // 4. Philanthropic Sites
    const wsPhil = XLSX.utils.json_to_sheet(philanthropy.map(p => ({
      'Date Added': p.dateAdded,
      'Organisation': p.organisation,
      'Website': p.website,
      'Details': p.notes
    })));
    XLSX.utils.book_append_sheet(wb, wsPhil, 'Philanthropic Sites');

    // 5. Summary of Funding (Static copy of current summaries)
    const wsSummary = XLSX.utils.json_to_sheet(data.map(g => ({
        'Funder': g.funder,
        'Amount': g.amount,
        'Status': g.smtStatus,
        'Project': g.relevantWCAProject
    })));
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary of Funding');

    // 6. Funding to Respond to Deadlines
    const wsDeadlines = XLSX.utils.json_to_sheet(data.map(g => ({
      'Funder': g.funder,
      'Prep Phase': g.prepMonth,
      'Deadline Phase': g.deadlineMonth,
      'Amount': g.amount,
      'Exact Date': g.dateForFunding
    })).sort((a, b) => new Date(a['Exact Date']).getTime() - new Date(b['Exact Date']).getTime()));
    XLSX.utils.book_append_sheet(wb, wsDeadlines, 'Funding to Respond to Deadlines');

    // 7. Strategy Development
    const wsStrategy = XLSX.utils.json_to_sheet(strategy.map(s => ({
      'Initiative': s.fund,
      'Operational Parameters': s.details,
      'Commentary': s.comments,
      'Info Link': s.furtherInfo
    })));
    XLSX.utils.book_append_sheet(wb, wsStrategy, 'Strategy Development');

    // 8. Notes Dump
    const wsNotes = XLSX.utils.aoa_to_sheet([[notes]]);
    XLSX.utils.book_append_sheet(wb, wsNotes, 'Notes Dump');

    // Final Generation
    XLSX.writeFile(wb, 'WCA_Fundraising_CRM_Report.xlsx');
  };

  const filteredData = data.filter(d => 
    d.funder.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.fundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.relevantWCAProject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-black text-white italic tracking-tighter">POSSIBLE FUNDING & GRANTS</h2>
        <div className="flex gap-4">
          <button 
            onClick={handleExport}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all border border-slate-700 font-black uppercase text-xs tracking-widest shadow-lg"
          >
            <Download size={18} />
            Export Excel
          </button>
          <button 
            onClick={handleAddNew}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] font-black uppercase text-xs tracking-widest"
          >
            <Plus size={18} />
            Add Opportunity
          </button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex items-center gap-4">
            <div className="relative flex-1 max-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Search funders, projects, or status..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold mono text-slate-400">
                <Filter size={16} />
                <span>{filteredData.length} RECORDS</span>
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 text-slate-400 uppercase font-black mono text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">Funder Entity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">WCA Node</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Prep</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Action Pipeline</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredData.map((grant) => (
                <tr key={grant.id} className="hover:bg-cyan-500/5 transition-colors cursor-pointer group" onClick={() => handleEdit(grant)}>
                  <td className="px-6 py-5">
                    <div className="font-black text-slate-100 uppercase tracking-tight">{grant.funder}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px] mono uppercase">{grant.fundName}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border ${getStatusColorClass(grant.smtStatus)}`}>
                        {grant.smtStatus}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-300 font-bold italic text-xs">{grant.relevantWCAProject}</td>
                  <td className="px-6 py-5 text-right font-black text-cyan-400 mono">£{grant.amount.toLocaleString()}</td>
                  <td className="px-6 py-5 text-amber-300 font-bold mono text-xs">{grant.prepMonth || '-'}</td>
                  <td className="px-6 py-5 text-cyan-400 font-black mono text-xs uppercase">{grant.deadlineMonth || '-'}</td>
                  <td className="px-6 py-5 text-slate-400 italic text-xs max-w-[120px] truncate">{grant.action}</td>
                  <td className="px-6 py-5 text-right">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(grant.id); }}
                        className="text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 mono text-xs uppercase tracking-widest">
                        DATASET EMPTY OR FILTERED OUT
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal - Themed Dark */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-8 py-5 flex justify-between items-center z-10">
                <h3 className="text-xl font-black text-white italic">{currentGrant.id === '' ? 'INITIATE NEW GRANT' : 'MODIFY GRANT CONFIG'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <Input 
                        label="Funder Name" 
                        value={currentGrant.funder} 
                        onChange={e => setCurrentGrant({...currentGrant, funder: e.target.value})} 
                        required 
                    />
                    <Input 
                        label="Fund / Grant Name" 
                        value={currentGrant.fundName} 
                        onChange={e => setCurrentGrant({...currentGrant, fundName: e.target.value})} 
                        required 
                    />
                    
                    <Select 
                        label="Status Matrix"
                        value={currentGrant.smtStatus}
                        onChange={e => setCurrentGrant({...currentGrant, smtStatus: e.target.value as SMTStatus})}
                        options={Object.values(SMTStatus).map(s => ({ label: s, value: s }))}
                    />

                    <Select 
                        label="WCA Target Node" 
                        value={currentGrant.relevantWCAProject} 
                        onChange={e => setCurrentGrant({...currentGrant, relevantWCAProject: e.target.value})} 
                        options={PROJECTS.map(p => ({ label: p, value: p }))}
                    />

                    <Input 
                        label="Amount Value (£)" 
                        type="number"
                        value={currentGrant.amount} 
                        onChange={e => setCurrentGrant({...currentGrant, amount: parseFloat(e.target.value) || 0})} 
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Prep Window" 
                            placeholder="Nov 2025"
                            value={currentGrant.prepMonth} 
                            onChange={e => setCurrentGrant({...currentGrant, prepMonth: e.target.value})} 
                        />
                        <Input 
                            label="Deadline Window" 
                            placeholder="Jan 2026"
                            value={currentGrant.deadlineMonth} 
                            onChange={e => setCurrentGrant({...currentGrant, deadlineMonth: e.target.value})} 
                        />
                    </div>

                    <Input 
                        label="Unit Assigned" 
                        value={currentGrant.assignedTo} 
                        onChange={e => setCurrentGrant({...currentGrant, assignedTo: e.target.value})} 
                    />

                    <Input 
                        label="Exact Timestamp" 
                        type="date"
                        value={currentGrant.dateForFunding} 
                        onChange={e => setCurrentGrant({...currentGrant, dateForFunding: e.target.value})} 
                    />
                </div>

                <TextArea 
                    label="Executive Action" 
                    placeholder="Describe the critical path..."
                    className="min-h-[100px]"
                    value={currentGrant.action} 
                    onChange={e => setCurrentGrant({...currentGrant, action: e.target.value})} 
                />

                <div className="flex justify-end pt-6 border-t border-slate-800">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-400 hover:text-white mr-4 font-bold mono text-xs uppercase tracking-widest">Abort</button>
                    <button type="submit" className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl shadow-lg font-black transition-all uppercase text-xs tracking-[0.2em]">Synchronize Data</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
