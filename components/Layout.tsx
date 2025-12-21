
import React from 'react';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  Landmark, 
  HandHeart, 
  PiggyBank, 
  TrendingUp, 
  FileText,
  Clock,
  StickyNote,
  Cpu
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tenders', label: 'Tender Sites', icon: Landmark },
    { id: 'philanthropy', label: 'Philanthropic Sites', icon: HandHeart },
    { id: 'funding', label: 'Possible Funding & Grants', icon: PiggyBank },
    { id: 'summary', label: 'Summary of Funding', icon: FileText },
    { id: 'deadlines', label: 'Funding to Respond to Deadlines', icon: Clock },
    { id: 'strategy', label: 'Strategy Development', icon: TrendingUp },
    { id: 'notes', label: 'Notes Dump', icon: StickyNote },
  ] as const;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* High-Tech Sidebar */}
      <aside className="w-72 glass border-r border-slate-800 flex flex-col z-20 shrink-0">
        <div className="p-8 border-b border-slate-800/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Cpu size={120} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(34,211,238,0.4)] text-slate-950">W</div>
            <h1 className="text-xl font-black tracking-tighter text-white leading-none">
              WandCare<br/><span className="text-cyan-400">Alliance</span>
            </h1>
          </div>
          <p className="text-cyan-400 text-2xl uppercase tracking-[0.2em] font-black italic neon-glow-cyan">
            CRM <span className="text-xs align-top opacity-50 font-normal">v4.0.0</span>
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 custom-scrollbar">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onChangeView(item.id as ViewType)}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 text-left group ${
                    currentView === item.id 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 border border-transparent'
                  }`}
                >
                  <item.icon size={20} className={`shrink-0 transition-transform duration-300 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className={`font-bold text-sm tracking-wide ${currentView === item.id ? 'neon-glow-cyan' : ''}`}>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-slate-800/50 bg-slate-950/20">
          <div className="flex items-center justify-between text-[10px] mono text-slate-500">
            <span>SYSTEM: ONLINE</span>
            <span>ID: WCA-7729</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-950/50">
        <div className="max-w-7xl mx-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
};
