import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Save } from 'lucide-react';

interface NotesDumpProps {
  notes: string;
  onChange: (notes: string) => void;
}

export const NotesDump: React.FC<NotesDumpProps> = ({ notes, onChange }) => {
  const [localNotes, setLocalNotes] = useState(notes);
  const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Debounce save
  useEffect(() => {
    setStatus('saving');
    const timer = setTimeout(() => {
        onChange(localNotes);
        setStatus('saved');
    }, 1000);
    return () => clearTimeout(timer);
  }, [localNotes, onChange]);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-slate-800">Notes Dump</h2>
         <span className={`text-sm flex items-center gap-1 ${status === 'saved' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <Save size={14} />
            {status === 'saved' ? 'Saved' : 'Saving...'}
         </span>
      </div>

      <Card className="flex-1 flex flex-col p-1">
         <textarea 
            className="w-full h-full p-6 resize-none focus:outline-none text-slate-700 leading-relaxed custom-scrollbar bg-white rounded-lg"
            placeholder="Type your rough notes, ideas, phone call logs here..."
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            spellCheck={false}
         />
      </Card>
    </div>
  );
};
