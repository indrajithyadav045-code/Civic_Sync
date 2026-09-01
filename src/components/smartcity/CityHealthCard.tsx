import React from 'react';
import { Activity, Shield, Car, Trees, Building2, Radio, TrendingUp, Info } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const CityHealthCard: React.FC = () => {
  const { cityHealth, highlightedSystemCategory, setHighlightedSystemCategory, playSound } = useCivic();

  const categories = [
    { key: 'mobility', label: 'Mobility', score: cityHealth.mobility, icon: Car, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { key: 'safety', label: 'Safety', score: cityHealth.safety, icon: Shield, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { key: 'environment', label: 'Environment', score: cityHealth.environment, icon: Trees, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    { key: 'infrastructure', label: 'Infrastructure', score: cityHealth.infrastructure, icon: Building2, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { key: 'emergency', label: 'Emergency', score: cityHealth.emergency, icon: Radio, color: 'text-red-700 bg-red-50 border-red-200' },
  ];

  const handleCategoryClick = (key: string) => {
    playSound('beep');
    setHighlightedSystemCategory(highlightedSystemCategory === key ? null : key);
  };

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-800" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            City Health Score
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase font-mono">
          {cityHealth.status} ({cityHealth.overallScore}/100)
        </span>
      </div>

      {/* Main Score & Subsystem Pillars */}
      <div className="flex items-center justify-between gap-4">
        {/* Overall Big Circle Score */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shadow">
            <span className="text-lg font-bold font-mono leading-none">{cityHealth.overallScore}</span>
            <span className="text-[9px] text-slate-300 font-sans">/ 100</span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Greater Chennai EOC</div>
            <div className="text-[10px] text-slate-500 font-mono">Zone 13 Real-time Index</div>
          </div>
        </div>

        {/* Subsystem category buttons */}
        <div className="grid grid-cols-5 gap-1.5 flex-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = highlightedSystemCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategoryClick(cat.key)}
                className={`p-2 rounded border text-center transition flex flex-col items-center justify-between ${
                  isSelected 
                    ? 'bg-blue-900 text-white border-blue-900 shadow-sm' 
                    : `${cat.color} hover:shadow-xs`
                }`}
                title={`Click to filter/highlight ${cat.label} subsystem`}
              >
                <Icon className={`w-3.5 h-3.5 mb-1 ${isSelected ? 'text-white' : ''}`} />
                <span className={`text-[10px] font-semibold leading-tight line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                  {cat.label}
                </span>
                <span className={`text-xs font-bold font-mono mt-0.5 ${isSelected ? 'text-amber-300' : 'text-slate-900'}`}>
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
