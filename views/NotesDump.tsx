
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Save, Terminal } from 'lucide-react';

interface NotesDumpProps {
  notes: string;
  onChange: (notes: string) => void;
}

export const NotesDump: React.FC<NotesDumpProps> = ({ notes, onChange }) => {
  const [localNotes, setLocalNotes] = useState(notes);
  const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Debounce save
  useEffect(() => {
    if (localNotes === notes) return;
    setStatus('saving');
    const timer = setTimeout(() => {
        onChange(localNotes);
        setStatus('saved');
    }, 1000);
    return () => clearTimeout(timer);
  }, [localNotes, onChange, notes]);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
         <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Data Cache</h2>
            <div className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-md border border-cyan-500/20 text-[10px] font-black mono uppercase flex items-center gap-2">
              <Terminal size={14} /> Persistent Local Storage
            </div>
         </div>
         <span className={`text-[10px] font-black mono uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-full border ${status === 'saved' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5'}`}>
            <Save size={14} className={status === 'saving' ? 'animate-spin' : ''} />
            {status === 'saved' ? 'Sync: Synchronized' : 'Sync: Uploading...'}
         </span>
      </div>

      <Card className="flex-1 flex flex-col relative group">
         <div className="absolute top-4 right-6 pointer-events-none opacity-20 text-[10px] font-black mono text-cyan-500 uppercase tracking-widest z-10">
            End of Line // WCA-NOTES
         </div>
         <textarea 
            className="w-full h-full p-8 resize-none focus:outline-none text-slate-100 leading-relaxed custom-scrollbar bg-slate-950/20 backdrop-blur-md rounded-2xl mono text-sm selection:bg-cyan-500/30 border-none"
            placeholder="Initialize raw data dump... input rough notes, ideas, phone logs, or strategy fragments here."
            value={localNotes}
            onChange={(e) => {
              setLocalNotes(e.target.value);
              setStatus('unsaved');
            }}
            spellCheck={false}
         />
      </Card>
    </div>
  );
};
