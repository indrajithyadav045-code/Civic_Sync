import React, { useState } from 'react';
import { Trash2, Truck, Zap } from 'lucide-react';
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
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
        <div className="flex items-center space-x-2">
          <Trash2 className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Smart Solid Waste
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Ward & Fill Level Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 line-clamp-1">{ward}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {status}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Bin ID</span>
            <span className="text-sm font-bold text-emerald-800">{binId}</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Fill Level</span>
            <span className="text-sm font-bold text-amber-800">{fillLevelPct}%</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Overflow ETA</span>
            <span className="text-sm font-bold text-slate-900">{predictedOverflow}</span>
          </div>
        </div>

        {/* Action Status */}
        <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">Compactor Recommendation:</span>
            <span className="text-[10px] text-emerald-900 font-bold">LoRaWAN Lock</span>
          </div>
          <p className="text-[10px] text-slate-700 leading-relaxed">
            {recommendedAction}
          </p>
          <button
            onClick={handleDispatchCompactor}
            className="w-full mt-1 px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[10px] transition flex items-center justify-center space-x-1"
          >
            <Truck className="w-3 h-3" />
            <span>{compactorDispatched ? '✓ Compactor Unit #GC-08 Dispatched' : 'Dispatch Compactor Unit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
