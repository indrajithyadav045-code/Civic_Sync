import React from 'react';
import { Navigation, Gauge, AlertTriangle, Car, GitBranch } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const SmartTrafficCard: React.FC = () => {
  const { smartTraffic } = useCivic();

  const provenance = {
    source: 'GCTP / IUDX Mesh',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 30000,
    providerName: 'Smart City Urban Traffic Management (UTCS)'
  };

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
        <div className="flex items-center space-x-2">
          <Car className="w-4 h-4 text-blue-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Traffic Intelligence
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Corridor & Congestion Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 line-clamp-1">{smartTraffic.corridor}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            smartTraffic.congestion === 'HIGH' 
              ? 'bg-red-100 text-red-800 border border-red-200' 
              : 'bg-amber-100 text-amber-800'
          }`}>
            CONGESTION: {smartTraffic.congestion}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Density</span>
            <span className="text-sm font-bold text-slate-900">{smartTraffic.densityPct}%</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Avg Speed</span>
            <span className="text-sm font-bold text-blue-800">{smartTraffic.averageSpeedKmh} km/h</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Blockages</span>
            <span className="text-sm font-bold text-red-700">{smartTraffic.activeBlockages} Active</span>
          </div>
        </div>

        {/* AI Route Recommendation */}
        <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-[11px] text-blue-900">
            <GitBranch className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span>AI Dynamic Route Recommendation:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            "{smartTraffic.aiRecommendation}"
          </p>
        </div>
      </div>
    </div>
  );
};
