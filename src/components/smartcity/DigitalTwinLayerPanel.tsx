import React from 'react';
import { Layers, CheckSquare, Square, Eye, EyeOff, Shield, Activity } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DigitalTwinLayers } from '../../types';

export const DigitalTwinLayerPanel: React.FC = () => {
  const { digitalTwinLayers, toggleDigitalTwinLayer, playSound } = useCivic();

  const layerItems: { key: keyof DigitalTwinLayers; label: string; count?: string; color: string }[] = [
    { key: 'incidents', label: 'Civic Incidents', count: '14 Active', color: 'text-blue-700' },
    { key: 'criticalIncidents', label: 'Critical Incidents', count: '3 Priority', color: 'text-red-700' },
    { key: 'highPriority', label: 'High Priority Incidents', count: '5 Reports', color: 'text-amber-700' },
    { key: 'dedupRadius50m', label: '50m Duplicate Radius', count: '3 Clusters', color: 'text-emerald-700' },
    { key: 'floodZones', label: 'Flood Risk Zones', count: 'Zone 13', color: 'text-blue-600' },
    { key: 'schools', label: 'Schools Buffer (180m)', count: '4 Facilities', color: 'text-amber-600' },
    { key: 'hospitals', label: 'Hospitals Corridor', count: '2 Centers', color: 'text-red-600' },
    { key: 'traffic', label: 'Traffic Density Overlay', count: 'Mount Rd 82%', color: 'text-yellow-600' },
    { key: 'streetLights', label: 'Smart Street Lights', count: 'Pole #SL-183', color: 'text-amber-500' },
    { key: 'wasteBins', label: 'Smart Waste Bins', count: 'Bin #WB-092', color: 'text-emerald-600' },
    { key: 'waterNetwork', label: 'Water Infrastructure', count: 'Pipeline #188', color: 'text-cyan-600' },
    { key: 'aqiHotspots', label: 'AQI Pollution Hotspots', count: 'Kathipara 86', color: 'text-teal-600' },
    { key: 'emergencyUnits', label: 'Emergency Response Units', count: 'AMB-04 Active', color: 'text-red-700' },
    { key: 'riskForecastZones', label: 'Predictive Risk Zones (6h)', count: '3 Zones', color: 'text-indigo-600' },
  ];

  const handleToggle = (key: keyof DigitalTwinLayers) => {
    playSound('beep');
    toggleDigitalTwinLayer(key);
  };

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-800" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            City Digital Twin Layers
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-mono font-semibold">
          PROTOTYPE / DEMO DATA
        </span>
      </div>

      {/* Layer Checkboxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
        {layerItems.map((item) => {
          const isEnabled = digitalTwinLayers[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleToggle(item.key)}
              className={`p-2 rounded border text-left transition flex items-center justify-between ${
                isEnabled
                  ? 'bg-blue-50/70 border-blue-300 text-slate-900 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                {isEnabled ? (
                  <CheckSquare className="w-4 h-4 text-blue-800 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="line-clamp-1">{item.label}</span>
              </div>
              {item.count && (
                <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-1">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
