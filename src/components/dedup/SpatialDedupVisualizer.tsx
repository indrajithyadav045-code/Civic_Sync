import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  CheckCircle2, 
  Sliders, 
  ArrowRight, 
  Clock, 
  Merge, 
  Info,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const SpatialDedupVisualizer: React.FC = () => {
  const { incidents, selectedIncident, setSelectedIncident, setActiveView, playSound, t } = useCivic();
  const [bufferRadius, setBufferRadius] = useState(50);

  const incident = selectedIncident || incidents[0];
  const duplicates = incident.duplicates || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>{t('dedupBadge')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
            {t('dedupHeading')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('dedupDesc')}
          </p>
        </div>

        <button
          onClick={() => setActiveView('command_map')}
          className="flex items-center space-x-2 px-4 py-2 rounded bg-[#0f2a4a] hover:bg-[#1a3860] text-white font-semibold text-xs transition shadow-sm"
        >
          <MapPin className="w-4 h-4" />
          <span>View GIS Master Work Order</span>
        </button>
      </div>

      {/* Main Deduplication Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Clean GIS Cluster Diagram */}
        <div className="lg:col-span-7 space-y-4">
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                GIS Spatial Proximity Cluster Diagram (Velachery Bypass Corridor)
              </span>
              <span className="text-xs font-bold text-green-700">
                {duplicates.length + 1} Citizen Reports Merged
              </span>
            </div>

            {/* Clean SVG GIS Diagram */}
            <div className="relative rounded-lg bg-slate-50 border border-slate-200 aspect-video flex items-center justify-center p-4 select-none">
              <svg className="w-full h-full" viewBox="0 0 500 350">
                {/* 50m GIS Buffer Radius Ring */}
                <circle
                  cx="250"
                  cy="175"
                  r={bufferRadius * 2.2}
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />

                {/* Concentric grid rings */}
                <circle cx="250" cy="175" r="50" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="250" cy="175" r="100" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

                {/* Range Label */}
                <text x="250" y="55" fill="#0369a1" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                  50-Meter PostGIS Haversine Buffer Ring
                </text>

                {/* Connecting lines from master to duplicates */}
                <line x1="250" y1="175" x2="200" y2="120" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="175" x2="310" y2="135" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="175" x2="280" y2="230" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Duplicate Pin 1 (18m) */}
                <circle cx="200" cy="120" r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <text x="180" y="110" fill="#1e3a8a" fontSize="10" fontWeight="bold" fontFamily="monospace">#DP-01 (18m)</text>

                {/* Duplicate Pin 2 (34m) */}
                <circle cx="310" cy="135" r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <text x="325" y="140" fill="#1e3a8a" fontSize="10" fontWeight="bold" fontFamily="monospace">#DP-02 (34m)</text>

                {/* Duplicate Pin 3 (42m) */}
                <circle cx="280" cy="230" r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <text x="295" y="245" fill="#1e3a8a" fontSize="10" fontWeight="bold" fontFamily="monospace">#DP-03 (42m)</text>

                {/* Master Incident Pin (Center) */}
                <circle cx="250" cy="175" r="14" fill="#dc2626" stroke="#ffffff" strokeWidth="3" />
                <text x="250" y="179" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">★</text>
                <text x="250" y="205" fill="#991b1b" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  MASTER INCIDENT (#{incident.id})
                </text>
              </svg>
            </div>

            {/* Slider Control */}
            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Dynamic Deduplication Radius Threshold:</span>
                <span className="font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {bufferRadius} Meters
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={bufferRadius}
                onChange={(e) => setBufferRadius(Number(e.target.value))}
                className="w-full accent-blue-900 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Deduplication Table */}
        <div className="lg:col-span-5 space-y-4">
          <div className="gov-card rounded-lg p-5 bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Merged Citizen Reports ({duplicates.length})
              </span>
              <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                PostGIS Clustered
              </span>
            </div>

            <div className="space-y-2">
              {duplicates.map((dup) => (
                <div
                  key={dup.id}
                  className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-blue-900">{dup.id}</span>
                    <span className="font-semibold text-green-800 bg-green-100 px-1.5 py-0.2 rounded text-[10px]">
                      {dup.distanceFromPrimaryMeters}m away
                    </span>
                  </div>
                  <div className="font-semibold text-slate-900">{dup.citizenName} ({dup.timestamp})</div>
                  <p className="text-slate-600 text-[11px] italic">"{dup.notes}"</p>
                </div>
              ))}
            </div>

            {/* Impact Metric */}
            <div className="p-3.5 rounded bg-blue-50 border border-blue-200 space-y-1 text-xs text-blue-950">
              <div className="font-bold uppercase text-[10px] text-blue-900">
                Municipal Dispatch Efficiency Gain:
              </div>
              <p className="text-slate-700 leading-normal">
                Merging these 3 reports prevents sending 3 separate field crews to the same 50m block on 100ft road, saving <strong>2 hours</strong> and prioritizing crew dispatch to other affected sectors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
