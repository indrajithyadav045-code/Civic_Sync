import React, { useState } from 'react';
import { Lightbulb, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const SmartLightingCard: React.FC = () => {
  const { smartLighting, playSound } = useCivic();
  const [lightsBoosted, setLightsBoosted] = useState(false);

  const provenance = {
    source: 'TANGEDCO SCADA / CCMS',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 60000,
    providerName: 'Centralized Control & Monitoring System'
  };

  const handleBoostIllumination = () => {
    playSound('success');
    setLightsBoosted(true);
    setTimeout(() => setLightsBoosted(false), 5000);
  };

  return (
    <div className="rounded-2xl p-4 bg-[#0D111A] border border-slate-800 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-1">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Street Lighting Grid
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Grid Telemetry */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200">Total Feeders: {smartLighting.totalPoles.toLocaleString()}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-950 text-yellow-300 border border-yellow-500/40">
            {smartLighting.energySavingsPct}% ENERGY SAVINGS
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Active Poles</span>
            <span className="text-sm font-bold text-emerald-400">{smartLighting.activePoles.toLocaleString()}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Dark Faults</span>
            <span className="text-sm font-bold text-red-400">{smartLighting.faultyPoles} Outages</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Dimming</span>
            <span className="text-sm font-bold text-cyan-400">{smartLighting.dimmingLevelPct}% PWM</span>
          </div>
        </div>

        {/* Energy Optimization Status */}
        <div className="p-2.5 rounded-xl bg-yellow-950/40 border border-yellow-500/30 text-xs text-yellow-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">Smart Lux Adaptive Dimming:</span>
            <span className="text-[10px] font-mono text-yellow-300">Sensor Active</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            Automatic astronomical clock & ambient light sensors adjusting 14,200 LED luminaires.
          </p>
          <button
            onClick={handleBoostIllumination}
            className="w-full mt-1 px-2.5 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-[10px] transition flex items-center justify-center space-x-1"
          >
            <Zap className="w-3 h-3" />
            <span>{lightsBoosted ? '✓ 100% Emergency Lux Boost Active' : 'Boost Grid Illumination to 100%'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
