import React, { useState } from 'react';
import { Droplet, Zap } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const SmartWaterCard: React.FC = () => {
  const { smartWater, playSound } = useCivic();
  const [pressureBalanced, setPressureBalanced] = useState(false);

  const provenance = {
    source: 'CMWSSB SCADA / DMA Mesh',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 60000,
    providerName: 'Metropolitan Water Supply & Pipeline SCADA'
  };

  const handleBalancePressure = () => {
    playSound('success');
    setPressureBalanced(true);
    setTimeout(() => setPressureBalanced(false), 5000);
  };

  const networkHealthPct = smartWater?.networkHealthPct ?? 97;
  const normalPipeline = smartWater?.normalPipeline;
  const riskPipeline = smartWater?.riskPipeline;

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
        <div className="flex items-center space-x-2">
          <Droplet className="w-4 h-4 text-cyan-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            MetroWater Pipeline SCADA
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Reservoir & Pressure Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 line-clamp-1">{normalPipeline?.id || 'Pipeline #WN-201'}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
            HEALTH: {networkHealthPct}%
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Pressure</span>
            <span className="text-sm font-bold text-cyan-800">{normalPipeline?.pressure || '3.2 Bar'}</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Leak Loss</span>
            <span className="text-sm font-bold text-amber-800">{riskPipeline?.estimatedLossLitrePerHour ?? 450} L/h</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Risk Level</span>
            <span className="text-sm font-bold text-red-700">{riskPipeline?.leakRisk || 'HIGH'}</span>
          </div>
        </div>

        {/* Action Status */}
        <div className="p-2 rounded bg-cyan-50 border border-cyan-200 text-xs text-cyan-950 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">{riskPipeline?.id || 'Pipeline #WR-104'}:</span>
            <span className="text-[10px] text-cyan-900 font-medium">DMA Monitored</span>
          </div>
          <p className="text-[10px] text-slate-700 leading-relaxed">
            {riskPipeline?.recommendedAction || 'Isolate valve sector 4B; deploy acoustic hydrophone leak locator.'}
          </p>
          <button
            onClick={handleBalancePressure}
            className="w-full mt-1 px-2.5 py-1 rounded bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-[10px] transition flex items-center justify-center space-x-1"
          >
            <Zap className="w-3 h-3" />
            <span>{pressureBalanced ? '✓ Pressure Regulated to 3.2 Bar' : 'Execute Valve Balancing'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
