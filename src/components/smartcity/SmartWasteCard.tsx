import React, { useState } from 'react';
import { Trash2, Truck, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const SmartWasteCard: React.FC = () => {
  const { smartWaste, playSound } = useCivic();
  const [compactorDispatched, setCompactorDispatched] = useState(false);

  const provenance = {
    source: 'WMD LoRaWAN Smart Bins',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 60000,
    providerName: 'Solid Waste Management Telemetry'
  };

  const handleDispatchCompactor = () => {
    playSound('success');
    setCompactorDispatched(true);
    setTimeout(() => setCompactorDispatched(false), 5000);
  };

  return (
    <div className="rounded-2xl p-4 bg-[#0D111A] border border-slate-800 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-1">
        <div className="flex items-center space-x-2">
          <Trash2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Smart Solid Waste
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Ward & Fill Level Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 line-clamp-1">{smartWaste.monitoredWard}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
            FLEET: {smartWaste.collectionStatus}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Avg Fill</span>
            <span className="text-sm font-bold text-emerald-400">{smartWaste.avgFillLevelPct}%</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Critical Bins</span>
            <span className="text-sm font-bold text-amber-400">{smartWaste.criticalBinsCount} Overdue</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Trucks</span>
            <span className="text-sm font-bold text-white">{smartWaste.activeTrucks} En Route</span>
          </div>
        </div>

        {/* Next Scheduled Run */}
        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">Next Automated Run:</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">{smartWaste.nextScheduledRun}</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            AI dynamic bin routing active. 14 compactor trucks running optimized fuel routes.
          </p>
          <button
            onClick={handleDispatchCompactor}
            className="w-full mt-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition flex items-center justify-center space-x-1"
          >
            <Truck className="w-3 h-3" />
            <span>{compactorDispatched ? '✓ Compactor Unit 14 Dispatched' : 'Dispatch Rapid Bin Clearance Unit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
