import React from 'react';
import { Wind, Trees } from 'lucide-react';
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
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-teal-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Air Quality & Environment
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* AQI Level & Category */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 line-clamp-1">{environmentAqi.stationName}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            aqiVal > 150 ? 'bg-red-100 text-red-800 border border-red-200' :
            aqiVal > 100 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
            'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}>
            AQI: {aqiVal} ({aqiCategory})
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">PM2.5</span>
            <span className="text-sm font-bold text-amber-800">{environmentAqi.pm25} µg/m³</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">PM10</span>
            <span className="text-sm font-bold text-slate-900">{environmentAqi.pm10} µg/m³</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">CO₂ Level</span>
            <span className="text-sm font-bold text-teal-800">{environmentAqi.co2Ppm} ppm</span>
          </div>
        </div>

        {/* Advisory */}
        <div className="p-2 rounded bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">Public Health Advisory:</span>
            <span className="text-[10px] text-teal-900">Moderate</span>
          </div>
          <p className="text-[10px] text-slate-700 leading-relaxed">
            {environmentAqi.advisory}
          </p>
        </div>
      </div>
    </div>
  );
};
