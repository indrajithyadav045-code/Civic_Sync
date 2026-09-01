import React from 'react';
import { Waves, CloudRain, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const FloodIntelligenceCard: React.FC = () => {
  const { floodIntelligence } = useCivic();

  const provenance = {
    source: 'IMD Doppler & SCADA Mesh',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 45000,
    providerName: 'Ripon Building Hydrological Network'
  };

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
        <div className="flex items-center space-x-2">
          <Waves className="w-4 h-4 text-blue-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Flood & Drainage Intelligence
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Ward & Risk Score */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-900">{floodIntelligence.ward}</div>
          <div className="text-[11px] text-slate-500 font-mono">
            Rainfall: <strong className="text-slate-900">{floodIntelligence.rainfallMmHr} mm/hr</strong> | Water: <strong className="text-blue-800">{floodIntelligence.waterLevelFeet} ft</strong>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded bg-red-100 border border-red-200 text-red-800 font-mono font-bold text-xs">
          DYNAMIC RISK: {floodIntelligence.riskScore} / 100
        </div>
      </div>

      {/* Signals Checklist */}
      <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1 text-xs text-slate-700">
        <div className="font-bold text-[10px] uppercase text-slate-500">Live Spatial Signals:</div>
        {floodIntelligence.signals.map((sig, idx) => (
          <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-800">
            <CheckCircle2 className="w-3 h-3 text-green-700 shrink-0" />
            <span>{sig}</span>
          </div>
        ))}
      </div>

      {/* Recommended Municipal Actions */}
      <div className="p-2.5 rounded bg-amber-50 border border-amber-200 space-y-1 text-xs text-amber-950">
        <div className="font-bold text-[10px] uppercase text-amber-900 flex items-center space-x-1">
          <AlertTriangle className="w-3 h-3 text-amber-700" />
          <span>Recommended Preemptive Actions:</span>
        </div>
        {floodIntelligence.recommendedActions.map((action, idx) => (
          <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-amber-950">
            <ArrowRight className="w-3 h-3 text-amber-700 shrink-0" />
            <span>{action}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
