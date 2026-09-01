import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const SmartLightingCard: React.FC = () => {
  const { smartLighting } = useCivic();

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Smart Street Lighting
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          PROTOTYPE / DEMO DATA
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
          <span className="text-[10px] text-slate-500 block font-sans">Operational</span>
          <span className="text-sm font-bold text-emerald-700">{smartLighting.operationalPct}%</span>
        </div>
        <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
          <span className="text-[10px] text-slate-500 block font-sans">Faulty</span>
          <span className="text-sm font-bold text-amber-700">{smartLighting.faultyPct}%</span>
        </div>
        <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
          <span className="text-[10px] text-slate-500 block font-sans">Dark Zones</span>
          <span className="text-sm font-bold text-slate-900">{smartLighting.darkZonesCount} Detected</span>
        </div>
      </div>

      {/* Sample Fault Incident */}
      <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 font-mono">{smartLighting.sampleIncident.poleId}</span>
          <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 text-[10px] font-bold">
            STATUS: {smartLighting.sampleIncident.status}
          </span>
        </div>
        <div className="text-[11px] text-slate-600">
          Location: <strong className="text-slate-900">{smartLighting.sampleIncident.ward}</strong>
        </div>
        <div className="text-[11px] text-slate-600">
          AI Priority: <strong className="text-red-700 font-semibold">{smartLighting.sampleIncident.aiPriority}</strong>
        </div>
        <div className="text-[11px] text-slate-700 bg-white p-1.5 rounded border border-slate-200">
          Reason: {smartLighting.sampleIncident.reason}
        </div>
      </div>
    </div>
  );
};
