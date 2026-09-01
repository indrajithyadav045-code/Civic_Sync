import React from 'react';
import { Wind, Trees, AlertTriangle, Activity } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const EnvironmentAqiCard: React.FC = () => {
  const { environmentAqi, liveAqi } = useCivic();

  const provenance = {
    source: 'CPCB / TNPCB Continuous Ambient Air Quality (CAAQMS)',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 60000,
    providerName: 'National Air Quality Index (NAQI)'
  };

  const aqiVal = liveAqi?.aqi || environmentAqi.aqi;
  const aqiCategory = liveAqi?.category || environmentAqi.category;

  return (
    <div className="rounded-2xl p-4 bg-[#0D111A] border border-slate-800 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-1">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-teal-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Air Quality & Environment
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* AQI Level & Category */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 line-clamp-1">{environmentAqi.stationName}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            aqiVal > 150 ? 'bg-red-950 text-red-300 border border-red-500/40' :
            aqiVal > 100 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
            'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
          }`}>
            AQI: {aqiVal} ({aqiCategory})
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">PM2.5</span>
            <span className="text-sm font-bold text-amber-400">{environmentAqi.pm25} µg/m³</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">PM10</span>
            <span className="text-sm font-bold text-white">{environmentAqi.pm10} µg/m³</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">CO₂ Level</span>
            <span className="text-sm font-bold text-teal-400">{environmentAqi.co2Ppm} ppm</span>
          </div>
        </div>

        {/* Advisory */}
        <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">Public Health Advisory:</span>
            <span className="text-[10px] font-mono text-teal-400">Moderate</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            {environmentAqi.advisory}
          </p>
        </div>
      </div>
    </div>
  );
};
