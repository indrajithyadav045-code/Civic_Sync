import React from 'react';
import { Activity, Shield, Car, Trees, Building2, Radio, TrendingUp, Info } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const CityHealthCard: React.FC = () => {
  const { cityHealth, highlightedSystemCategory, setHighlightedSystemCategory, playSound } = useCivic();

  const categories = [
    { key: 'mobility', label: 'Mobility', score: cityHealth.mobility, icon: Car, color: 'text-blue-400 bg-blue-950/40 border-blue-500/30' },
    { key: 'safety', label: 'Safety', score: cityHealth.safety, icon: Shield, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' },
    { key: 'environment', label: 'Environment', score: cityHealth.environment, icon: Trees, color: 'text-teal-400 bg-teal-950/40 border-teal-500/30' },
    { key: 'infrastructure', label: 'Infrastructure', score: cityHealth.infrastructure, icon: Building2, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30' },
    { key: 'emergency', label: 'Emergency', score: cityHealth.emergency, icon: Radio, color: 'text-red-400 bg-red-950/40 border-red-500/30' },
  ];

  const handleCategoryClick = (key: string) => {
    playSound('beep');
    setHighlightedSystemCategory(highlightedSystemCategory === key ? null : key);
  };

  const provenance = {
    source: 'CIVIC-SYNC Multi-Signal Aggregator',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 60000,
    providerName: 'GCC Smart City Operating Model'
  };

  return (
    <div className="rounded-2xl p-5 bg-[#0D111A] border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            City Health Score (Dynamic Real-Time Multi-Signal Index)
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Main Score & Subsystem Pillars */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Overall Big Circle Score */}
        <div className="flex items-center space-x-3.5 shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400/50 text-white flex flex-col items-center justify-center shadow-lg shadow-cyan-950/50">
            <span className="text-2xl font-black font-mono leading-none text-cyan-300">{cityHealth.overallScore}</span>
            <span className="text-[9px] text-cyan-400 font-mono">/ 100</span>
          </div>
          <div>
            <div className="text-sm font-bold text-white font-sans">Greater Chennai EOC</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Status: <strong className="text-emerald-400">{cityHealth.status}</strong> • Trend: <span className="text-cyan-300">{cityHealth.activeTrend}</span>
            </div>
          </div>
        </div>

        {/* Subsystem category buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = highlightedSystemCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategoryClick(cat.key)}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-between ${
                  isSelected 
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 ring-2 ring-cyan-400/30 font-bold shadow-lg' 
                    : `${cat.color} hover:border-slate-600`
                }`}
                title={`Click to filter/highlight ${cat.label} subsystem`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-slate-950' : ''}`} />
                <span className={`text-[11px] font-bold leading-tight line-clamp-1 ${isSelected ? 'text-slate-950' : 'text-slate-300'}`}>
                  {cat.label}
                </span>
                <span className={`text-xs font-mono font-extrabold mt-0.5 ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                  {cat.score}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
