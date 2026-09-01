import React, { useState } from 'react';
import { 
  TrendingUp, 
  CloudRain, 
  AlertTriangle, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  Info,
  Clock,
  ArrowRight,
  Droplets,
  Building
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const PredictiveRiskForecast: React.FC = () => {
  const { forecastHotspots, setActiveView, playSound, t } = useCivic();
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>(forecastHotspots[0].id);

  const activeHotspot = forecastHotspots.find(h => h.id === selectedHotspotId) || forecastHotspots[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-900 rounded uppercase">
                {t('forecastBadge')}
              </span>
              <span className="text-xs font-semibold text-amber-700">WINDOW: NEXT 6 HOURS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans mt-0.5">
              {t('forecastHeading')}
            </h1>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded bg-slate-50 border border-slate-200 text-slate-700 text-xs max-w-sm flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <span>
            <strong>Prototype Model:</strong> Preemptive staging recommendations based on Doppler precipitation radar and drainage basin telemetry.
          </span>
        </div>
      </div>

      {/* Main Forecast Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Zone Selection Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Predicted Vulnerability Hotspots (Next 6h)
              </span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="space-y-2.5">
              {forecastHotspots.map((hotspot) => {
                const isSelected = selectedHotspotId === hotspot.id;
                const isHigh = hotspot.riskTier === 'HIGH_RISK';
                const isMedium = hotspot.riskTier === 'MEDIUM_RISK';

                return (
                  <div
                    key={hotspot.id}
                    onClick={() => {
                      setSelectedHotspotId(hotspot.id);
                      playSound('beep');
                    }}
                    className={`p-3.5 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{hotspot.zoneName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHigh 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : isMedium 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {hotspot.riskTier.replace('_', ' ')} ({hotspot.predictedScore}/100)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 mt-1.5 pt-1.5 border-t border-slate-200">
                      <div className="flex items-center space-x-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-700" />
                        <span>Precip: {hotspot.precipitationForecastMm}mm</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span>Drainage: {hotspot.drainageCapacityPct}% sat</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 7 Columns: Hotspot Diagnostics */}
        <div className="lg:col-span-7 space-y-4">
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  HYDROLOGICAL DIAGNOSTICS
                </span>
                <h3 className="text-base font-bold text-slate-900 font-sans">
                  {activeHotspot.zoneName}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-500 block">PREDICTED RISK INDEX</span>
                <span className="text-xl font-bold text-red-700 font-mono">
                  {activeHotspot.predictedScore}/100
                </span>
              </div>
            </div>

            {/* Risk Drivers */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Primary Machine-Learned Hydrological Drivers:
              </span>
              <div className="space-y-1.5">
                {activeHotspot.primaryRiskDrivers.map((driver, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-start space-x-2 text-xs text-slate-700">
                    <span className="text-red-600 font-bold mt-0.5">●</span>
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preemptive Action */}
            <div className="p-3.5 rounded bg-blue-50 border border-blue-200 space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-blue-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>RECOMMENDED PREEMPTIVE MUNICIPAL ACTION:</span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed pt-0.5">
                {activeHotspot.recommendedPreemptiveAction}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setActiveView('command_map')}
                className="px-3.5 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold transition flex items-center space-x-2"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-700" />
                <span>Show on Operations Map</span>
              </button>

              <button
                onClick={() => setActiveView('disaster_alerts')}
                className="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
              >
                <span>Draft Preemptive Broadcast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
