import React, { useState } from 'react';
import { Waves, Zap, CheckCircle2 } from 'lucide-react';
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
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
        <div className="flex items-center space-x-2">
          <Waves className="w-4 h-4 text-cyan-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Flood & Inundation Risk
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Critical Basin & Inundation Level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 line-clamp-1">{ward}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
            RISK: {riskScore}/100
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Water Level</span>
            <span className="text-sm font-bold text-cyan-800">{waterLevelFeet} ft</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Drain Cap</span>
            <span className="text-sm font-bold text-slate-900">{drainageFlowPct}%</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Rainfall</span>
            <span className="text-sm font-bold text-blue-800">{rainfallMmHr} mm/h</span>
          </div>
        </div>

        {/* Early Warning Message */}
        <div className="p-2 rounded bg-cyan-50 border border-cyan-200 text-xs text-cyan-950 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">Stormwater Drainage Status:</span>
            <span className="text-[10px] text-cyan-900 font-medium">{sensitiveProximity}</span>
          </div>
          <p className="text-[10px] text-slate-700 leading-relaxed">
            Runoff accumulation on 100ft bypass. Auxiliary pumps on standby.
          </p>
          <button
            onClick={handleTriggerPumps}
            className="w-full mt-1 px-2.5 py-1 rounded bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-[10px] transition flex items-center justify-center space-x-1"
          >
            <Zap className="w-3 h-3" />
            <span>{pumpDispatched ? '✓ De-watering Pumps Running (+14,000 LPM)' : 'Trigger Auxiliary Pumps'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
