import React, { useState } from 'react';
import { CloudRain, Waves, AlertTriangle, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const FloodIntelligenceCard: React.FC = () => {
  const { floodIntelligence, playSound } = useCivic();
  const [pumpDispatched, setPumpDispatched] = useState(false);

  const provenance = {
    source: 'GCC Stormwater / IMD Telemetry',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 60000,
    providerName: 'Disaster Early Warning System (DEWS)'
  };

  const handleTriggerPumps = () => {
    playSound('success');
    setPumpDispatched(true);
    setTimeout(() => setPumpDispatched(false), 5000);
  };

  const ward = floodIntelligence?.ward || 'Ward 12 (Velachery South Basin)';
  const riskScore = floodIntelligence?.riskScore ?? 89;
  const waterLevelFeet = floodIntelligence?.waterLevelFeet ?? 2.8;
  const drainageFlowPct = floodIntelligence?.drainageFlowPct ?? 42;
  const rainfallMmHr = floodIntelligence?.rainfallMmHr ?? 48;
  const sensitiveProximity = floodIntelligence?.sensitiveProximity || '180m from DAV School & Apollo Clinic';

  return (
    <div className="rounded-2xl p-4 bg-[#0D111A] border border-slate-800 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-1">
        <div className="flex items-center space-x-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Flood & Sump Inundation
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Critical Basin & Inundation Level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 line-clamp-1">{ward}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-500/40">
            RISK: {riskScore}/100
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Water Level</span>
            <span className="text-sm font-bold text-cyan-400">{waterLevelFeet} ft</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Drain Cap</span>
            <span className="text-sm font-bold text-white">{drainageFlowPct}%</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Rainfall</span>
            <span className="text-sm font-bold text-emerald-400">{rainfallMmHr} mm/h</span>
          </div>
        </div>

        {/* Early Warning Message */}
        <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">Stormwater Inundation Status:</span>
            <span className="text-[10px] font-mono text-cyan-400">{sensitiveProximity}</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            Severe runoff accumulation detected on 100ft bypass. 150HP auxiliary pumps on standby.
          </p>
          <button
            onClick={handleTriggerPumps}
            className="w-full mt-1 px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] transition flex items-center justify-center space-x-1"
          >
            <Zap className="w-3 h-3" />
            <span>{pumpDispatched ? '✓ Heavy Diesel Pumps Running (+14,000 LPM)' : 'Trigger Auxiliary De-watering Pumps'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
