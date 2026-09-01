import React from 'react';
import { Wind, Thermometer, Droplets, AlertCircle } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const EnvironmentAqiCard: React.FC = () => {
  const { environmentAqi } = useCivic();

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-teal-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Environment & Air Quality
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          PROTOTYPE / DEMO DATA
        </span>
      </div>

      {/* AQI Big Score & Pollution Hotspot */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-teal-800 text-white flex flex-col items-center justify-center font-mono shadow">
            <span className="text-base font-bold leading-none">{environmentAqi.aqi}</span>
            <span className="text-[8px] uppercase tracking-wider text-teal-200">AQI</span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Moderate Air Quality</div>
            <div className="text-[11px] text-slate-500 line-clamp-1">Hotspot: {environmentAqi.pollutionHotspot}</div>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold uppercase">
          {environmentAqi.exposureRisk} EXPOSURE
        </span>
      </div>

      {/* Particulate Matter & Weather Telemetry */}
      <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-mono">
        <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
          <span className="text-[9px] text-slate-500 block font-sans">PM 2.5</span>
          <span className="font-bold text-slate-900">{environmentAqi.pm25} µg/m³</span>
        </div>
        <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
          <span className="text-[9px] text-slate-500 block font-sans">PM 10</span>
          <span className="font-bold text-slate-900">{environmentAqi.pm10} µg/m³</span>
        </div>
        <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
          <span className="text-[9px] text-slate-500 block font-sans">Temp</span>
          <span className="font-bold text-slate-900">{environmentAqi.temperatureC}°C</span>
        </div>
        <div className="p-1.5 rounded bg-slate-50 border border-slate-200">
          <span className="text-[9px] text-slate-500 block font-sans">Humidity</span>
          <span className="font-bold text-slate-900">{environmentAqi.humidityPct}%</span>
        </div>
      </div>
    </div>
  );
};
