import React from 'react';
import { Droplet, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const SmartWaterCard: React.FC = () => {
  const { smartWater } = useCivic();

  const provenance = {
    source: 'CMWSSB SCADA Pressure Telemetry',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 45000,
    providerName: 'Chennai Metro Water Supply & Sewerage Board'
  };

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
        <div className="flex items-center space-x-2">
          <Droplet className="w-4 h-4 text-cyan-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Water Network Intelligence
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Network Health */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-900">CMWSSB Pipeline Telemetry</div>
          <div className="text-[11px] text-slate-500 font-mono">SCADA Pressure Monitoring</div>
        </div>
        <div className="px-2 py-0.5 rounded bg-cyan-50 border border-cyan-200 text-cyan-900 font-mono font-bold text-xs">
          HEALTH: {smartWater.networkHealthPct}%
        </div>
      </div>

      {/* Pipeline Status Breakdown */}
      <div className="space-y-2 text-xs font-mono">
        <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
          <span>{smartWater.normalPipeline.id}</span>
          <span className="text-emerald-700 font-bold">{smartWater.normalPipeline.pressure}</span>
        </div>

        <div className="p-2.5 rounded bg-red-50 border border-red-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">{smartWater.riskPipeline.id}</span>
            <span className="text-red-700 font-bold text-[10px]">
              LEAK RISK: {smartWater.riskPipeline.leakRisk}
            </span>
          </div>
          <div className="text-[11px] text-slate-700">
            Estimated Water Loss: <strong className="text-red-700">{smartWater.riskPipeline.estimatedLossLitrePerHour.toLocaleString()} L/hr</strong>
          </div>
          <div className="text-[10px] text-slate-600 font-sans pt-0.5">
            Recommended: {smartWater.riskPipeline.recommendedAction}
          </div>
        </div>
      </div>
    </div>
  );
};
