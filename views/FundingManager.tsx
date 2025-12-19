
import React, { useState } from 'react';
import { FundingGrant, SMTStatus } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Input, Select, TextArea } from '../components/ui/Input';
import { Plus, X, Search, Filter } from 'lucide-react';

const PROJECTS = [
  "Bigger picture and community champions", "Community Champions", "Corporate relationships", 
  "CYP trauma", "ESOL and CYP", "ESOL project", "ESOL project or SYP trauma", "Autism", 
  "Black Men Cancer Trauma project", "Community Voice", "Core funding", 
  "Core funding or CYP/Refugee project", "CYP", "CYP or community champions", "CYP project", 
  "Drug and alcohol & mental health", "ESOL", "ESOL refugee project", "Neighbourhoods"
];

interface FundingManagerProps {
  data: FundingGrant[];
  onSave: (item: FundingGrant) => void;
  onDelete: (id: string) => void;
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

export const FundingManager: React.FC<FundingManagerProps> = ({ data, onSave, onDelete }) => {
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

  const filteredData = data.filter(d => 
    d.funder.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.fundName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.relevantWCAProject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColorClass = (status: SMTStatus) => {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Possible Funding & Grants</h2>
        <button 
          onClick={handleAddNew}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Opportunity
        </button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
            <div className="relative flex-1 max-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search funders, projects, or status..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter size={16} />
                <span>{filteredData.length} records</span>
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Funder</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Relevant WCA Project</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Prep Month</th>
                <th className="px-6 py-4">Deadline Month</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((grant) => (
                <tr key={grant.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => handleEdit(grant)}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{grant.funder}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{grant.fundName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${getStatusColorClass(grant.smtStatus)}`}>
                        {grant.smtStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{grant.relevantWCAProject}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">£{grant.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-amber-600 font-medium">{grant.prepMonth || '-'}</td>
                  <td className="px-6 py-4 text-emerald-700 font-bold">{grant.deadlineMonth || '-'}</td>
                  <td className="px-6 py-4 text-slate-500 italic max-w-[120px] truncate">{grant.action}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(grant.id); }}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                        No grants found matching your search.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
                <h3 className="text-lg font-bold text-slate-800">{currentGrant.id === '' ? 'Add New Grant' : 'Edit Grant'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        label="Status"
                        value={currentGrant.smtStatus}
                        onChange={e => setCurrentGrant({...currentGrant, smtStatus: e.target.value as SMTStatus})}
                        options={Object.values(SMTStatus).map(s => ({ label: s, value: s }))}
                    />

                    <Select 
                        label="Relevant WCA Project" 
                        value={currentGrant.relevantWCAProject} 
                        onChange={e => setCurrentGrant({...currentGrant, relevantWCAProject: e.target.value})} 
                        options={PROJECTS.map(p => ({ label: p, value: p }))}
                    />

                    <Input 
                        label="Amount (£)" 
                        type="number"
                        value={currentGrant.amount} 
                        onChange={e => setCurrentGrant({...currentGrant, amount: parseFloat(e.target.value) || 0})} 
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <Input 
                            label="Prep Month" 
                            placeholder="e.g. Nov 2025"
                            value={currentGrant.prepMonth} 
                            onChange={e => setCurrentGrant({...currentGrant, prepMonth: e.target.value})} 
                        />
                        <Input 
                            label="Deadline Month" 
                            placeholder="e.g. Jan 2026"
                            value={currentGrant.deadlineMonth} 
                            onChange={e => setCurrentGrant({...currentGrant, deadlineMonth: e.target.value})} 
                        />
                    </div>

                    <Input 
                        label="Assigned To" 
                        value={currentGrant.assignedTo} 
                        onChange={e => setCurrentGrant({...currentGrant, assignedTo: e.target.value})} 
                    />

                    <Input 
                        label="Deadline Date (Exact)" 
                        type="date"
                        value={currentGrant.dateForFunding} 
                        onChange={e => setCurrentGrant({...currentGrant, dateForFunding: e.target.value})} 
                    />
                </div>

                <TextArea 
                    label="Action Item" 
                    placeholder="Describe the next step..."
                    className="min-h-[80px]"
                    value={currentGrant.action} 
                    onChange={e => setCurrentGrant({...currentGrant, action: e.target.value})} 
                />

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800 mr-2">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm font-medium transition-colors">Save Grant</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
