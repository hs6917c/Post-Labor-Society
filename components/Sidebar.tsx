import React from 'react';
import { OutlineItem, REPORT_OUTLINE } from '../types';
import { BookOpen, Activity, Cpu, Battery, Users, Layers, Award } from 'lucide-react';

interface SidebarProps {
  currentSectionId: string;
  onSelectSection: (id: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const ICONS: Record<string, React.ReactNode> = {
  'intro': <BookOpen size={18} />,
  'automation-shock': <Cpu size={18} />,
  'energy-currency': <Battery size={18} />,
  'surplus-humanity': <Users size={18} />,
  'project-society': <Activity size={18} />,
  'policy': <Layers size={18} />,
  'conclusion': <Award size={18} />
};

const Sidebar: React.FC<SidebarProps> = ({ currentSectionId, onSelectSection, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight">
            <span className="text-cyan-400">Post-Labor</span> Society
          </h1>
          <p className="text-xs text-slate-500 mt-2">AI & Energy Civilization Report</p>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-85px)]">
          <ul className="space-y-2">
            {REPORT_OUTLINE.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onSelectSection(item.id);
                    if(window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-all duration-200 group ${
                    currentSectionId === item.id 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className={`mt-0.5 transition-colors ${currentSectionId === item.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {ICONS[item.id] || <BookOpen size={18}/>}
                  </div>
                  <div>
                    <span className="text-sm font-medium block">{item.title.split('—')[0]}</span>
                    {item.subItems && (
                      <span className="text-[10px] text-slate-500 block mt-1 line-clamp-1 opacity-70">
                        {item.subItems[0]}...
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 px-4 py-4 bg-slate-950 rounded-lg border border-slate-800">
             <p className="text-xs text-slate-600 text-center">
                Powered by Gemini 2.5 Flash
             </p>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;