import React, { useState } from 'react';
import { Shield, Radio, Zap } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const EmergencyFleetCard: React.FC = () => {
  const { emergencyFleet, playSound } = useCivic();
  const [squadDispatched, setSquadDispatched] = useState(false);

  const provenance = {
    source: '108 / 100 / GCC Emergency Mesh (GPS AIS-140)',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 15000,
    providerName: 'Integrated Emergency Response Management'
  };

  const handleDispatchRapidSquad = () => {
    playSound('alert');
    setSquadDispatched(true);
    setTimeout(() => setSquadDispatched(false), 5000);
  };

  const ambulancesAvailable = emergencyFleet?.ambulancesAvailable ?? 18;
  const fireUnitsAvailable = emergencyFleet?.fireUnitsAvailable ?? 7;
  const policeAvailable = emergencyFleet?.policeAvailable ?? 24;
  const activeDispatch = emergencyFleet?.activeIncidentDispatch;

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-red-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Emergency Response Fleet
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Fleet Readiness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800">Incident: #{activeDispatch?.incidentId || 'CS-7421'}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
            STATUS: {activeDispatch?.status || 'EN_ROUTE'}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Ambulances</span>
            <span className="text-sm font-bold text-emerald-800">{ambulancesAvailable} Free</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Fire Tenders</span>
            <span className="text-sm font-bold text-slate-900">{fireUnitsAvailable} Ready</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Patrol Units</span>
            <span className="text-sm font-bold text-blue-800">{policeAvailable} Active</span>
          </div>
        </div>

        {/* Live Mission Status */}
        <div className="p-2 rounded bg-red-50 border border-red-200 text-xs text-red-950 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">{activeDispatch?.nearestUnit || 'Ambulance Unit TN-01-A-108'}:</span>
            <span className="text-[10px] text-red-800 font-bold">ETA {activeDispatch?.etaMinutesSeconds || '04m:12s'}</span>
          </div>
          <p className="text-[10px] text-slate-700 leading-relaxed">
            GPS AIS-140 live tracking active. Route clearance engaged.
          </p>
          <button
            onClick={handleDispatchRapidSquad}
            className="w-full mt-1 px-2.5 py-1 rounded bg-red-700 hover:bg-red-800 text-white font-semibold text-[10px] transition flex items-center justify-center space-x-1"
          >
            <Shield className="w-3 h-3" />
            <span>{squadDispatched ? '✓ Response Squad Alpha En Route' : 'Dispatch Response Squad'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
