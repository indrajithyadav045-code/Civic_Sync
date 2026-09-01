import React, { useState } from 'react';
import { Droplet, Activity, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
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
    <div className="rounded-2xl p-4 bg-[#0D111A] border border-slate-800 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-1">
        <div className="flex items-center space-x-2">
          <Droplet className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            MetroWater Pipeline SCADA
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Reservoir & Pressure Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 line-clamp-1">{normalPipeline?.id || 'Pipeline #WN-201'}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            HEALTH: {networkHealthPct}%
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Pressure</span>
            <span className="text-sm font-bold text-cyan-400">{normalPipeline?.pressure || '3.2 Bar'}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Leak Loss</span>
            <span className="text-sm font-bold text-amber-400">{riskPipeline?.estimatedLossLitrePerHour ?? 450} L/h</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Risk Level</span>
            <span className="text-sm font-bold text-red-400">{riskPipeline?.leakRisk || 'HIGH'}</span>
          </div>
        </div>

        {/* Action Status */}
        <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">{riskPipeline?.id || 'Pipeline #WR-104'}:</span>
            <span className="text-[10px] font-mono text-amber-400">DMA Monitored</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            {riskPipeline?.recommendedAction || 'Isolate valve sector 4B; deploy acoustic hydrophone leak locator.'}
          </p>
          <button
            onClick={handleBalancePressure}
            className="w-full mt-1 px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] transition flex items-center justify-center space-x-1"
          >
            <Zap className="w-3 h-3" />
            <span>{pressureBalanced ? '✓ Pressure Regulated to 3.2 Bar' : 'Execute Automated Valve Balancing'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
