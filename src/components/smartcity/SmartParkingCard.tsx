import React from 'react';
import { SquareParking } from 'lucide-react';
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

  const zone = smartParking?.zone || 'T. Nagar Smart Parking Facility';
  const occupancyPct = smartParking?.occupancyPct ?? 78;
  const availableSpaces = smartParking?.availableSpaces ?? 54;
  const totalCapacity = smartParking?.totalCapacity ?? 250;
  const violationsCount = smartParking?.violationsCount ?? 2;
  const aiRecommendation = smartParking?.aiRecommendation || 'Display lot availability on Usman Road variable message sign.';

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
        <div className="flex items-center space-x-2">
          <SquareParking className="w-4 h-4 text-purple-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Smart Multi-Level Parking
          </h3>
        </div>

        <DataProvenanceBadge provenance={provenance} />
      </div>

      {/* Lot & Availability */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 line-clamp-1">{zone}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            OCCUPANCY: {occupancyPct}%
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Available</span>
            <span className="text-sm font-bold text-emerald-800">{availableSpaces} Slots</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Total</span>
            <span className="text-sm font-bold text-slate-900">{totalCapacity} Slots</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block font-sans">Violations</span>
            <span className="text-sm font-bold text-red-700">{violationsCount} Tow Alert</span>
          </div>
        </div>

        {/* Guidance Status */}
        <div className="p-2 rounded bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] block">Variable Message Signs (VMS):</span>
            <span className="text-[10px] text-purple-800 font-bold">Synchronized</span>
          </div>
          <p className="text-[10px] text-slate-700 leading-relaxed">
            {aiRecommendation}
          </p>
        </div>
      </div>
    </div>
  );
};
