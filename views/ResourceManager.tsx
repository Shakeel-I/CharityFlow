import React, { useState } from 'react';
import { TenderSite, PhilanthropicSite, StrategyItem } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Input, TextArea } from '../components/ui/Input';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

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

    const save = () => {
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Philanthropic Sites</h2>
                <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"><Plus size={16}/> Add Site</button>
            </div>

            {isFormOpen && (
                <Card className="bg-slate-50 border-emerald-100">
                    <CardHeader title="New Philanthropic Site" />
                    <div className="p-6 space-y-4">
                        <Input label="Organisation" value={current.organisation || ''} onChange={e => setCurrent({...current, organisation: e.target.value})} />
                        <Input label="Website" value={current.website || ''} onChange={e => setCurrent({...current, website: e.target.value})} />
                        <TextArea label="Notes" value={current.notes || ''} onChange={e => setCurrent({...current, notes: e.target.value})} />
                        <button onClick={save} className="bg-emerald-600 text-white px-6 py-2 rounded-lg">Save</button>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.map(site => (
                    <Card key={site.id} className="hover:shadow-md transition-shadow">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-slate-800">{site.organisation}</h3>
                                <button onClick={() => onDelete(site.id)} className="text-slate-300 hover:text-red-400"><Trash2 size={16}/></button>
                            </div>
                            <a href={site.website} target="_blank" rel="noreferrer" className="text-emerald-600 text-sm hover:underline truncate block mb-3">{site.website}</a>
                            <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">{site.notes}</p>
                            <div className="mt-3 text-xs text-slate-400">Added: {new Date(site.dateAdded).toLocaleDateString()}</div>
                        </div>
                    </Card>
                ))}
            </div>
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
