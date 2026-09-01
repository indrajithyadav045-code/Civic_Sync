import React from 'react';
import { SquareParking, AlertCircle, CheckCircle2, Car } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';

export const SmartParkingCard: React.FC = () => {
  const { smartParking } = useCivic();

  const provenance = {
    source: 'Smart Cities Mission IoT / Ultrasonic Bay Sensors',
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'LIVE' as const,
    refreshIntervalMs: 30000,
    providerName: 'GCC Smart Parking Management System'
  };

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
        <div className="flex items-center space-x-2">
          <SquareParking className="w-4 h-4 text-blue-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Smart Parking Intelligence
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Zone & Occupancy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800">{smartParking.zone}</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-900 font-mono font-bold text-[10px]">
            {smartParking.occupancyPct}% OCCUPIED
          </span>
        </div>

        {/* Bays info */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Available</span>
            <span className="text-sm font-bold text-emerald-700">{smartParking.availableSpaces} bays</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Total Cap</span>
            <span className="text-sm font-bold text-slate-900">{smartParking.totalCapacity} bays</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Violations</span>
            <span className="text-sm font-bold text-amber-700">{smartParking.violationsCount} Active</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
          AI Suggestion: <strong className="text-blue-900 font-semibold">"{smartParking.aiRecommendation}"</strong>
        </div>
      </div>
    </div>
  );
};
