import React, { useState } from 'react';
import { FundingGrant, SMTStatus } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Input, Select, TextArea } from '../components/ui/Input';
import { Plus, X, Search, Filter } from 'lucide-react';

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
  smtStatus: SMTStatus.PENDING,
  assignedTo: '',
  relevantWCAProject: '',
  details: '',
  amount: 0,
  dateForFunding: new Date().toISOString().split('T')[0],
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
    d.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Funding & Grants</h2>
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
            <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search funders, grants, or staff..." 
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
            <thead className="bg-slate-50 text-slate-500 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Funder / Grant</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((grant) => (
                <tr key={grant.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleEdit(grant)}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{grant.funder}</div>
                    <div className="text-xs text-slate-500">{grant.fundName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        grant.smtStatus === SMTStatus.APPROVED ? 'bg-emerald-100 text-emerald-800' :
                        grant.smtStatus === SMTStatus.PENDING ? 'bg-amber-100 text-amber-800' : 
                        grant.smtStatus === SMTStatus.REJECTED ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'
                    }`}>
                        {grant.smtStatus}
                    </span>
                    {grant.isSmallFund && <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">Small</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{grant.assignedTo || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">${grant.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(grant.dateForFunding).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(grant.id); }}
                        className="text-red-400 hover:text-red-600 font-medium"
                    >
                        Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
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
                <h3 className="text-lg font-bold text-slate-800">{currentGrant.id === emptyGrant.id ? 'Add New Grant' : 'Edit Grant'}</h3>
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
                        label="SMT Status"
                        value={currentGrant.smtStatus}
                        onChange={e => setCurrentGrant({...currentGrant, smtStatus: e.target.value as SMTStatus})}
                        options={[
                            { label: 'Pending Review', value: SMTStatus.PENDING },
                            { label: 'Approved', value: SMTStatus.APPROVED },
                            { label: 'Needs More Info', value: SMTStatus.NEEDS_INFO },
                            { label: 'Rejected', value: SMTStatus.REJECTED },
                        ]}
                    />

                    <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={currentGrant.isSmallFund}
                                onChange={e => setCurrentGrant({...currentGrant, isSmallFund: e.target.checked})}
                                className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                            />
                            <span className="text-sm font-medium text-slate-700">Is this a small fund?</span>
                        </label>
                    </div>

                    <Input 
                        label="Assigned To" 
                        value={currentGrant.assignedTo} 
                        onChange={e => setCurrentGrant({...currentGrant, assignedTo: e.target.value})} 
                    />
                    <Input 
                        label="Relevant WCA Project" 
                        value={currentGrant.relevantWCAProject} 
                        onChange={e => setCurrentGrant({...currentGrant, relevantWCAProject: e.target.value})} 
                    />

                    <Input 
                        label="Amount ($)" 
                        type="number"
                        value={currentGrant.amount} 
                        onChange={e => setCurrentGrant({...currentGrant, amount: parseFloat(e.target.value) || 0})} 
                    />
                    <Input 
                        label="Deadline (Date for Funding)" 
                        type="date"
                        value={currentGrant.dateForFunding} 
                        onChange={e => setCurrentGrant({...currentGrant, dateForFunding: e.target.value})} 
                    />

                    <Input 
                        label="Delivery Dates" 
                        placeholder="e.g. Q3 2024 - Q4 2025"
                        value={currentGrant.deliveryDates} 
                        onChange={e => setCurrentGrant({...currentGrant, deliveryDates: e.target.value})} 
                    />
                    <Input 
                        label="Website / Info Link" 
                        value={currentGrant.website} 
                        onChange={e => setCurrentGrant({...currentGrant, website: e.target.value})} 
                    />
                </div>

                <TextArea 
                    label="Details & Scope" 
                    value={currentGrant.details} 
                    onChange={e => setCurrentGrant({...currentGrant, details: e.target.value})} 
                />

                <TextArea 
                    label="Action Items" 
                    placeholder="Next steps..."
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
