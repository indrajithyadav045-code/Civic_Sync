import React, { useState } from 'react';
import { Shield, Truck, PhoneCall, Radio, CheckCircle2, Zap } from 'lucide-react';
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
    <div className="rounded-2xl p-4 bg-[#0D111A] border border-slate-800 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-1">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-red-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Emergency Response Fleet
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Fleet Readiness */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200">Incident: #{activeDispatch?.incidentId || 'CS-7421'}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-500/40">
            STATUS: {activeDispatch?.status || 'EN_ROUTE'}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Ambulances</span>
            <span className="text-sm font-bold text-emerald-400">{ambulancesAvailable} Free</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Fire Tenders</span>
            <span className="text-sm font-bold text-white">{fireUnitsAvailable} Ready</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Patrol Units</span>
            <span className="text-sm font-bold text-cyan-400">{policeAvailable} Active</span>
          </div>
        </div>

        {/* Live Mission Status */}
        <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">{activeDispatch?.nearestUnit || 'Ambulance Unit TN-01-A-108'}:</span>
            <span className="text-[10px] font-mono text-red-400">ETA {activeDispatch?.etaMinutesSeconds || '04m:12s'}</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            GPS AIS-140 live tracking active. Route clearance protocol engaged.
          </p>
          <button
            onClick={handleDispatchRapidSquad}
            className="w-full mt-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] transition flex items-center justify-center space-x-1"
          >
            <Shield className="w-3 h-3" />
            <span>{squadDispatched ? '✓ Emergency Response Squad Alpha En Route' : 'Dispatch High-Priority Response Squad'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
