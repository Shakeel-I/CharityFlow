
import React, { useState } from 'react';
import { TenderSite, PhilanthropicSite, StrategyItem } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Input, TextArea } from '../components/ui/Input';
import { Plus, Trash2, Search, ExternalLink } from 'lucide-react';

// --- Tender Sites Component ---
export const TenderView: React.FC<{ 
    data: TenderSite[], 
    onSave: (i: TenderSite) => void, 
    onDelete: (id: string) => void 
}> = ({ data, onSave, onDelete }) => {
    const [newItem, setNewItem] = useState<Partial<TenderSite>>({});

    const handleAdd = () => {
        if (!newItem.name || !newItem.login) return;
        onSave({ 
            id: crypto.randomUUID(), 
            name: newItem.name, 
            login: newItem.login, 
            password: newItem.password 
        });
        setNewItem({});
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Tender Sites</h2>
            <Card>
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 border-b border-slate-200">
                    <Input label="Site Name" value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                    <Input label="Login / Username" value={newItem.login || ''} onChange={e => setNewItem({...newItem, login: e.target.value})} />
                    <Input label="Password" type="password" value={newItem.password || ''} onChange={e => setNewItem({...newItem, password: e.target.value})} />
                    <button onClick={handleAdd} className="mb-4 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors w-full">Add Site</button>
                </div>
                <div className="divide-y divide-slate-100">
                    {data.map(site => (
                        <div key={site.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div>
                                <h4 className="font-semibold text-slate-900">{site.name}</h4>
                                <div className="text-sm text-slate-500">Login: {site.login}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">Password hidden</span>
                                <button onClick={() => onDelete(site.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && <div className="p-6 text-center text-slate-400 text-sm">No tender sites added yet.</div>}
                </div>
            </Card>
        </div>
    );
};

// --- Philanthropy Component ---
export const PhilanthropyView: React.FC<{ 
    data: PhilanthropicSite[], 
    onSave: (i: PhilanthropicSite) => void, 
    onDelete: (id: string) => void 
}> = ({ data, onSave, onDelete }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [current, setCurrent] = useState<Partial<PhilanthropicSite>>({});
    const [searchTerm, setSearchTerm] = useState('');

    const save = () => {
        if (!current.organisation) return;
        onSave({
            id: crypto.randomUUID(),
            dateAdded: new Date().toISOString(),
            organisation: current.organisation || 'Unknown',
            website: current.website || '',
            notes: current.notes || ''
        });
        setCurrent({});
        setIsFormOpen(false);
    }

    const filtered = data.filter(s => s.organisation.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Philanthropic Sites</h2>
                <div className="flex gap-2">
                    <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition-colors">
                        <Plus size={16}/> Add Site
                    </button>
                </div>
            </div>

            {isFormOpen && (
                <Card className="bg-slate-50 border-emerald-100 animate-fade-in">
                    <CardHeader title="New Philanthropic Site" />
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Organisation" value={current.organisation || ''} onChange={e => setCurrent({...current, organisation: e.target.value})} />
                            <Input label="Website" value={current.website || ''} onChange={e => setCurrent({...current, website: e.target.value})} />
                        </div>
                        <TextArea label="Notes" value={current.notes || ''} onChange={e => setCurrent({...current, notes: e.target.value})} />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800">Cancel</button>
                            <button onClick={save} className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700">Save Site</button>
                        </div>
                    </div>
                </Card>
            )}

            <Card>
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center">
                    <div className="relative flex-1 max-w-xs">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search organizations..." 
                            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date added to spreadsheet</th>
                                <th className="px-6 py-4">Organisation</th>
                                <th className="px-6 py-4">Website</th>
                                <th className="px-6 py-4">Notes</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map(site => (
                                <tr key={site.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-slate-400">
                                        {new Date(site.dateAdded).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800">
                                        {site.organisation}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={site.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline flex items-center gap-1">
                                            Visit Site <ExternalLink size={12} />
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 max-w-md">
                                        <p className="line-clamp-2" title={site.notes}>{site.notes}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => onDelete(site.id)} 
                                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No philanthropic sites found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

// --- Strategy Component ---
export const StrategyView: React.FC<{ 
    data: StrategyItem[], 
    onSave: (i: StrategyItem) => void, 
    onDelete: (id: string) => void 
}> = ({ data, onSave, onDelete }) => {
    const [current, setCurrent] = useState<Partial<StrategyItem>>({});

    const save = () => {
        onSave({
            id: crypto.randomUUID(),
            fund: current.fund || 'Unnamed Strategy',
            details: current.details || '',
            comments: current.comments || '',
            furtherInfo: current.furtherInfo || ''
        });
        setCurrent({});
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Strategy Development</h2>
            
            <Card>
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                    <h4 className="font-medium text-slate-800 mb-4">Add Strategy Item</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input label="Fund / Initiative" value={current.fund || ''} onChange={e => setCurrent({...current, fund: e.target.value})} />
                        <Input label="Further Info (URL)" value={current.furtherInfo || ''} onChange={e => setCurrent({...current, furtherInfo: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                         <TextArea label="Details" className="min-h-[80px]" value={current.details || ''} onChange={e => setCurrent({...current, details: e.target.value})} />
                         <TextArea label="Comments" className="min-h-[80px]" value={current.comments || ''} onChange={e => setCurrent({...current, comments: e.target.value})} />
                    </div>
                    <button onClick={save} className="bg-slate-900 text-white px-6 py-2 rounded-lg">Add Strategy Item</button>
                </div>

                <div className="divide-y divide-slate-100">
                    {data.map(item => (
                        <div key={item.id} className="p-6 hover:bg-slate-50">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-900">{item.fund}</h3>
                                <button onClick={() => onDelete(item.id)} className="text-slate-300 hover:text-red-400"><Trash2 size={16}/></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase">Details</span>
                                    <p className="text-sm text-slate-700 mt-1">{item.details}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 uppercase">Comments</span>
                                    <p className="text-sm text-slate-700 mt-1 italic">{item.comments}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
