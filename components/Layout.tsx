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
  StickyNote
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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-lg">W</div>
            <h1 className="text-xl font-bold tracking-wide truncate" title="WandCareAlliance">WandCareAlliance</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider pl-10">Fundraising Suite</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onChangeView(item.id as ViewType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    currentView === item.id 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} className="shrink-0" />
                  <span className="font-medium text-sm leading-tight">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="text-xs text-slate-500 text-center">
            &copy; {new Date().getFullYear()} WandCareAlliance
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
