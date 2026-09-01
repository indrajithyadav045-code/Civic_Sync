import React, { useState, useEffect } from 'react';
import { Search, Map, LayoutDashboard, Cpu, Radio, PlusCircle, Globe, X, Command, ArrowRight } from 'lucide-react';
import { useCivic, ActiveView } from '../../context/CivicContext';

interface QuickCommandBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCommandBar: React.FC<QuickCommandBarProps> = ({ isOpen, onClose }) => {
  const { setActiveView, incidents, setLanguage, toggleDigitalTwinLayer, playSound } = useCivic();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const quickActions: { label: string; category: string; icon: any; action: () => void }[] = [
    { label: 'City Digital Twin Map', category: 'Navigation', icon: Map, action: () => { setActiveView('command_map'); onClose(); } },
    { label: 'Smart City Operations Command Center', category: 'Navigation', icon: LayoutDashboard, action: () => { setActiveView('command_center'); onClose(); } },
    { label: 'AI Triaged Grievance Queue', category: 'Navigation', icon: Cpu, action: () => { setActiveView('ai_triage'); onClose(); } },
    { label: 'Submit Citizen Grievance (Form C-1)', category: 'Actions', icon: PlusCircle, action: () => { setActiveView('report_issue'); onClose(); } },
    { label: 'Toggle Smart Traffic Map Layer', category: 'Map Layer', icon: Map, action: () => { toggleDigitalTwinLayer('traffic'); onClose(); } },
    { label: 'Toggle Flood Risk Basin Layer', category: 'Map Layer', icon: Map, action: () => { toggleDigitalTwinLayer('floodZones'); onClose(); } },
    { label: 'Switch Language to Tamil (தமிழ்)', category: 'Language', icon: Globe, action: () => { setLanguage('ta'); onClose(); } },
    { label: 'Switch Language to Telugu (తెలుగు)', category: 'Language', icon: Globe, action: () => { setLanguage('te'); onClose(); } },
    { label: 'Switch Language to English', category: 'Language', icon: Globe, action: () => { setLanguage('en'); onClose(); } },
  ];

  const filtered = quickActions.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="p-3 border-b border-slate-200 flex items-center space-x-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Type a command, layer, or jump to view..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-xs text-slate-900 outline-none placeholder:text-slate-400 font-sans"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  playSound('beep');
                  item.action();
                }}
                className="w-full p-2 rounded hover:bg-blue-50 text-left text-xs flex items-center justify-between group transition"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-1 rounded bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-900">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{item.label}</span>
                    <span className="text-[10px] text-slate-400 ml-2 font-mono uppercase">{item.category}</span>
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-800" />
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs italic">
              No matching commands or actions found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Navigation & Layer Quick-Jump</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 shadow-2xs">ESC</kbd>
        </div>
      </div>
    </div>
  );
};
