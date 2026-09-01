import React from 'react';
import { SquareParking, Car, CheckCircle2 } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const SmartParkingCard: React.FC = () => {
  const { smartParking } = useCivic();

  const provenance = {
    source: 'Smart City Smart Parking Mesh (FASTag / Magnetometer)',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 30000,
    providerName: 'Intelligent Parking Management System'
  };

  return (
    <div className="rounded-2xl p-4 bg-[#0D111A] border border-slate-800 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-white/10 gap-1">
        <div className="flex items-center space-x-2">
          <SquareParking className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Smart Multi-Level Parking
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Lot & Availability */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200 line-clamp-1">{smartParking.lotName}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
            OCCUPANCY: {smartParking.occupancyPct}%
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Available</span>
            <span className="text-sm font-bold text-emerald-400">{smartParking.availableSpots} Slots</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Total</span>
            <span className="text-sm font-bold text-white">{smartParking.totalSpots} Slots</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">EV Ports</span>
            <span className="text-sm font-bold text-cyan-400">{smartParking.evChargingSpots} Fast</span>
          </div>
        </div>

        {/* Guidance Status */}
        <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">Variable Message Signs (VMS):</span>
            <span className="text-[10px] font-mono text-purple-400">Synchronized</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            Real-time optical guidance active on arterial approach roads.
          </p>
        </div>
      </div>
    </div>
  );
};
