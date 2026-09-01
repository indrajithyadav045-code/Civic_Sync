import React from 'react';
import { 
  X, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplet, 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  Compass, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

interface AuraClimateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuraClimateModal: React.FC<AuraClimateModalProps> = ({ isOpen, onClose }) => {
  const { liveWeather } = useCivic();

  if (!isOpen) return null;

  const aura = liveWeather?.auraClimateRisk;
  const forecast = liveWeather?.hourlyForecast || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#0b121e] border border-cyan-500/30 text-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyan-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-cyan-400 tracking-tight">
                AURA Climate Digital Twin • Live Forecast
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                ISRO BAH 2026
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live atmospheric telemetry and 3-factor climate risk models (Heatwave, Flood, Drought).
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provenance & Source Link */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          {liveWeather?.provenance && (
            <DataProvenanceBadge provenance={liveWeather.provenance} />
          )}
          <a
            href="https://auraclimate.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-xs font-semibold hover:underline"
          >
            <span>Open AURA Climate Engine</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Main 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center space-x-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Temperature</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {liveWeather?.temperatureC ?? 30}°C
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Feels like {liveWeather?.apparentTempC ?? 33}°C
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center space-x-1">
              <Droplet className="w-3.5 h-3.5 text-cyan-400" />
              <span>Humidity</span>
            </div>
            <div className="text-2xl font-bold text-cyan-300 font-mono">
              {liveWeather?.humidityPct ?? 78}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Atmospheric Moisture
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center space-x-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span>Rainfall Rate</span>
            </div>
            <div className="text-2xl font-bold text-blue-300 font-mono">
              {liveWeather?.precipitationMmHr ?? 0} <span className="text-xs">mm/h</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {liveWeather?.conditionLabel ?? 'Clear'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center space-x-1">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span>Wind Velocity</span>
            </div>
            <div className="text-2xl font-bold text-teal-300 font-mono">
              {liveWeather?.windSpeedKmh ?? 14} <span className="text-xs">km/h</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Coastal Surface Telemetry
            </div>
          </div>
        </div>

        {/* 3 AURA Climate Risk Models */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>AURA 3-Factor Climate Risk Indices</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Heatwave Risk */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-red-300 flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                  <span>Heatwave Risk</span>
                </span>
                <span className="text-lg font-bold font-mono text-red-400">
                  {aura?.heatwaveRiskPct ?? 22}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                  style={{ width: `${aura?.heatwaveRiskPct ?? 22}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400">
                Wet-bulb thermal stress index
              </div>
            </div>

            {/* Flood Risk */}
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-300 flex items-center space-x-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  <span>Urban Flood Risk</span>
                </span>
                <span className="text-lg font-bold font-mono text-blue-400">
                  {aura?.floodRiskPct ?? 35}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: `${aura?.floodRiskPct ?? 35}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400">
                Soil saturation & storm runoff load
              </div>
            </div>

            {/* Drought Risk */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300 flex items-center space-x-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Drought Index</span>
                </span>
                <span className="text-lg font-bold font-mono text-amber-400">
                  {aura?.droughtRiskPct ?? 10}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"
                  style={{ width: `${aura?.droughtRiskPct ?? 10}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400">
                Moisture deficit & evaporative demand
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Forecast Carousel (Next 12 Hours) */}
        {forecast.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>12-Hour Microclimate Forecast (Open-Meteo Mesh)</span>
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {forecast.slice(0, 6).map((item, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1 hover:border-cyan-500/50 transition"
                >
                  <div className="text-[10px] text-slate-400 font-mono">{item.time}</div>
                  <div className="text-sm font-bold text-white font-mono">{item.tempC}°C</div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    {item.rainProbPct}% rain
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AURA AI Climate Intelligence Insights */}
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AURA AI Climate Intelligence Summary</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {aura?.aiClimateInsight}
          </p>

          <div className="pt-2 border-t border-cyan-500/20 space-y-1">
            <span className="text-[11px] font-semibold text-cyan-300">Recommended Preemptive Actions:</span>
            <ul className="text-[11px] text-slate-300 space-y-1 pl-3 list-disc">
              {aura?.recommendedActions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
