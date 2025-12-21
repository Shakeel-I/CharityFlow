
import React, { useState } from 'react';
import { TenderSite, PhilanthropicSite, StrategyItem } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Input, TextArea } from '../components/ui/Input';
import { Plus, Trash2, Search, ExternalLink, Globe, Key, User } from 'lucide-react';

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
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Tender Sites</h2>
            <Card>
                <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end bg-slate-900/30 border-b border-slate-800">
                    <Input label="Site Designation" value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                    <Input label="Access ID" value={newItem.login || ''} onChange={e => setNewItem({...newItem, login: e.target.value})} />
                    <Input label="Security Key" type="password" value={newItem.password || ''} onChange={e => setNewItem({...newItem, password: e.target.value})} />
                    <button onClick={handleAdd} className="mb-6 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg w-full">Initialize</button>
                </div>
                <div className="divide-y divide-slate-800/50">
                    {data.map(site => (
                        <div key={site.id} className="p-8 flex items-center justify-between hover:bg-cyan-500/5 transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                                    <Globe size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-100 uppercase tracking-tight text-lg">{site.name}</h4>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1.5 text-xs mono text-slate-400">
                                            <User size={12} /> {site.login}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs mono text-amber-400/80 uppercase font-bold">
                                            <Key size={12} /> Encrypted
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => onDelete(site.id)} className="text-slate-600 hover:text-rose-500 transition-colors p-2"><Trash2 size={20} /></button>
                        </div>
                    ))}
                    {data.length === 0 && <div className="p-12 text-center text-slate-500 mono text-xs uppercase tracking-widest italic">NO ACTIVE TENDER NODES</div>}
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
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Philanthropic Sites</h2>
                <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-2">
                    <Plus size={16}/> Integrate Site
                </button>
            </div>

            {isFormOpen && (
                <Card className="bg-slate-900/30 border-cyan-500/20 mb-10 animate-fade-in">
                    <CardHeader title="New Site Entry" />
                    <div className="p-8 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input label="Organisation Name" value={current.organisation || ''} onChange={e => setCurrent({...current, organisation: e.target.value})} />
                            <Input label="Neural Link (URL)" value={current.website || ''} onChange={e => setCurrent({...current, website: e.target.value})} />
                        </div>
                        <TextArea label="Intelligence Notes" value={current.notes || ''} onChange={e => setCurrent({...current, notes: e.target.value})} />
                        <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
                            <button onClick={() => setIsFormOpen(false)} className="px-6 py-2 text-slate-400 hover:text-white font-bold mono text-xs uppercase tracking-widest">Abort</button>
                            <button onClick={save} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest">Synchronize</button>
                        </div>
                    </div>
                </Card>
            )}

            <Card>
                <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Scan organizations..." 
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase font-black mono text-[10px] tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Logged</th>
                                <th className="px-8 py-4">Entity</th>
                                <th className="px-8 py-4">Website</th>
                                <th className="px-8 py-4">Details</th>
                                <th className="px-8 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filtered.map(site => (
                                <tr key={site.id} className="hover:bg-cyan-500/5 transition-colors group">
                                    <td className="px-8 py-6 text-slate-400 mono text-[10px] uppercase font-bold">
                                        {new Date(site.dateAdded).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-8 py-6 font-black text-slate-100 uppercase tracking-tight">
                                        {site.organisation}
                                    </td>
                                    <td className="px-8 py-6">
                                        <a href={site.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 mono text-[10px] uppercase tracking-wider">
                                            Visit Node <ExternalLink size={12} />
                                        </a>
                                    </td>
                                    <td className="px-8 py-6 text-slate-300 text-xs font-medium max-w-md">
                                        <p className="line-clamp-2 leading-relaxed" title={site.notes}>{site.notes}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => onDelete(site.id)} 
                                            className="text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                        >
                                            <Trash2 size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-slate-500 mono text-xs uppercase tracking-widest italic">NO MATRIX ENTRIES DETECTED</td>
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
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Strategic Core</h2>
            
            <Card>
                <div className="p-8 bg-slate-900/30 border-b border-slate-800">
                    <h4 className="font-black text-cyan-400 uppercase tracking-[0.2em] text-[10px] mono mb-6">Initialize Strategic Vector</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                        <Input label="Strategic Initiative" value={current.fund || ''} onChange={e => setCurrent({...current, fund: e.target.value})} />
                        <Input label="Context URL" value={current.furtherInfo || ''} onChange={e => setCurrent({...current, furtherInfo: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                         <TextArea label="Operational Parameters" className="min-h-[100px]" value={current.details || ''} onChange={e => setCurrent({...current, details: e.target.value})} />
                         <TextArea label="Executive Commentary" className="min-h-[100px]" value={current.comments || ''} onChange={e => setCurrent({...current, comments: e.target.value})} />
                    </div>
                    <button onClick={save} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg">Activate Strategy</button>
                </div>

                <div className="divide-y divide-slate-800/50">
                    {data.map(item => (
                        <div key={item.id} className="p-10 hover:bg-cyan-500/5 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="font-black text-slate-100 text-2xl uppercase italic tracking-tight">{item.fund}</h3>
                                <button onClick={() => onDelete(item.id)} className="text-slate-600 hover:text-rose-500 transition-colors p-2"><Trash2 size={20}/></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="bg-slate-950/30 p-6 rounded-2xl border border-slate-800">
                                    <span className="text-[10px] font-black text-cyan-500/70 uppercase tracking-[0.2em] mono mb-2 block">Operational Parameters</span>
                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{item.details}</p>
                                </div>
                                <div className="bg-cyan-500/5 p-6 rounded-2xl border border-cyan-500/10 italic">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mono mb-2 block">Executive Commentary</span>
                                    <p className="text-sm text-slate-200 leading-relaxed font-bold">{item.comments}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && <div className="p-16 text-center text-slate-500 mono text-xs uppercase tracking-widest italic">NO ACTIVE STRATEGIC VECTORS</div>}
                </div>
            </Card>
        </div>
    );
};
