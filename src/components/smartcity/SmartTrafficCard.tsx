import React, { useState } from 'react';
import { Navigation, Gauge, AlertTriangle, Car, GitBranch, Zap, CheckCircle2 } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const SmartTrafficCard: React.FC = () => {
  const { smartTraffic, playSound } = useCivic();
  const [corridorCleared, setCorridorCleared] = useState(false);

  const provenance = {
    source: 'GCTP / IUDX Mesh',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 30000,
    providerName: 'Smart City Urban Traffic Management (UTCS)'
  };

  const handleClearCorridor = () => {
    playSound('success');
    setCorridorCleared(true);
    setTimeout(() => setCorridorCleared(false), 5000);
  };

  const corridor = smartTraffic?.corridor || 'Mount Road Arterial Corridor';
  const congestion = smartTraffic?.congestion || 'HIGH';
  const densityPct = smartTraffic?.densityPct ?? 88;
  const averageSpeedKmh = smartTraffic?.averageSpeedKmh ?? 14;
  const activeBlockages = smartTraffic?.activeBlockages ?? 3;
  const aiRecommendation = smartTraffic?.aiRecommendation || 'Divert heavy vehicular transit to Sardar Patel Road. Apply adaptive 90s signal timing.';

  return (
    <div className="rounded-2xl p-4 bg-[#0D111A] border border-slate-800 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-1">
        <div className="flex items-center space-x-2">
          <Car className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Traffic Intelligence
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Corridor & Congestion Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 line-clamp-1">{corridor}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            congestion === 'HIGH' 
              ? 'bg-red-950 text-red-300 border border-red-500/40' 
              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
          }`}>
            CONGESTION: {congestion}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Density</span>
            <span className="text-sm font-bold text-white">{densityPct}%</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Avg Speed</span>
            <span className="text-sm font-bold text-cyan-400">{averageSpeedKmh} km/h</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Blockages</span>
            <span className="text-sm font-bold text-red-400">{activeBlockages} Active</span>
          </div>
        </div>

        {/* AI Route Recommendation */}
        <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 flex items-start space-x-2">
          <GitBranch className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1 w-full">
            <span className="font-bold text-[11px] block">AI Route Diversion Advisory:</span>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              {aiRecommendation}
            </p>
            <button
              onClick={handleClearCorridor}
              className="mt-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition flex items-center space-x-1"
            >
              <Zap className="w-3 h-3" />
              <span>{corridorCleared ? '✓ Green Corridor Active' : 'Activate Green Wave Signal'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
