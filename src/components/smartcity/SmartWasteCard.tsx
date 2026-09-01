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

  const ward = smartWaste?.ward || 'Ward 20 (Guindy Industrial Sector)';
  const binId = smartWaste?.binId || 'Bin #WB-092';
  const fillLevelPct = smartWaste?.fillLevelPct ?? 94;
  const status = smartWaste?.status || 'OVERFLOW_RISK';
  const predictedOverflow = smartWaste?.predictedOverflow || '2h 18m';
  const recommendedAction = smartWaste?.recommendedAction || 'Dispatch automated municipal compactor vehicle #GC-08.';

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
          <span className="font-semibold text-slate-200 line-clamp-1">{ward}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
            {status}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Bin ID</span>
            <span className="text-sm font-bold text-emerald-400">{binId}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Fill Level</span>
            <span className="text-sm font-bold text-amber-400">{fillLevelPct}%</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Overflow ETA</span>
            <span className="text-sm font-bold text-white">{predictedOverflow}</span>
          </div>
        </div>

        {/* Action Status */}
        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">Compactor Recommendation:</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">LoRaWAN Lock</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            {recommendedAction}
          </p>
          <button
            onClick={handleDispatchCompactor}
            className="w-full mt-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition flex items-center justify-center space-x-1"
          >
            <Truck className="w-3 h-3" />
            <span>{compactorDispatched ? '✓ Compactor Unit #GC-08 Dispatched' : 'Dispatch Rapid Bin Clearance Unit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
