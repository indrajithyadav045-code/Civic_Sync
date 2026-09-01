import React from 'react';
import { Siren, Shield, Flame, Radio, Clock, Navigation } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const EmergencyFleetCard: React.FC = () => {
  const { emergencyFleet } = useCivic();

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Siren className="w-4 h-4 text-red-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Emergency Response Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          PROTOTYPE / DEMO DATA
        </span>
      </div>

      {/* Resource Count Badges */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-red-50 border border-red-200 text-center">
          <div className="flex items-center justify-center space-x-1 text-red-800 text-[10px] font-sans font-semibold mb-0.5">
            <Radio className="w-3 h-3" />
            <span>AMBULANCES</span>
          </div>
          <span className="text-sm font-bold text-red-900">{emergencyFleet.ambulancesAvailable} AVAILABLE</span>
        </div>

        <div className="p-2 rounded bg-amber-50 border border-amber-200 text-center">
          <div className="flex items-center justify-center space-x-1 text-amber-800 text-[10px] font-sans font-semibold mb-0.5">
            <Flame className="w-3 h-3" />
            <span>FIRE UNITS</span>
          </div>
          <span className="text-sm font-bold text-amber-900">{emergencyFleet.fireUnitsAvailable} AVAILABLE</span>
        </div>

        <div className="p-2 rounded bg-blue-50 border border-blue-200 text-center">
          <div className="flex items-center justify-center space-x-1 text-blue-800 text-[10px] font-sans font-semibold mb-0.5">
            <Shield className="w-3 h-3" />
            <span>POLICE</span>
          </div>
          <span className="text-sm font-bold text-blue-900">{emergencyFleet.policeAvailable} AVAILABLE</span>
        </div>
      </div>

      {/* Active Incident Dispatch Box */}
      <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 font-mono">{emergencyFleet.activeIncidentDispatch.incidentId}</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            {emergencyFleet.activeIncidentDispatch.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-700">
          <span>Nearest Unit: <strong className="text-blue-900">{emergencyFleet.activeIncidentDispatch.nearestUnit}</strong></span>
          <span className="text-red-700 font-mono font-bold flex items-center space-x-1">
            <Clock className="w-3 h-3 inline" />
            <span>ETA: {emergencyFleet.activeIncidentDispatch.etaMinutesSeconds}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
