import React from 'react';
import { Trash2, AlertTriangle, Truck, Clock } from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

export const SmartWasteCard: React.FC = () => {
  const { smartWaste } = useCivic();

  return (
    <div className="gov-card rounded-lg p-4 bg-white border border-slate-200 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Trash2 className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Waste Intelligence
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          PROTOTYPE / DEMO DATA
        </span>
      </div>

      {/* Bin Status & Fill Level */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900 font-mono">{smartWaste.binId}</span>
            <span className="text-slate-500 text-[11px] block">{smartWaste.ward}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-200 text-amber-900 font-bold text-[10px]">
            {smartWaste.status.replace('_', ' ')}
          </span>
        </div>

        {/* Fill Level Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-700 mb-1">
            <span>Fill Level:</span>
            <span className="font-bold text-slate-900 font-mono">{smartWaste.fillLevelPct}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-600 h-full" style={{ width: `${smartWaste.fillLevelPct}%` }}></div>
          </div>
        </div>

        {/* Prediction & Recommended Dispatch */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
          <div className="p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block font-sans">Predicted Overflow</span>
            <span className="text-xs font-bold text-red-700">{smartWaste.predictedOverflow}</span>
          </div>
          <div className="p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block font-sans">Fleet Directive</span>
            <span className="text-xs font-bold text-blue-900 font-sans">Dispatch Compactor</span>
          </div>
        </div>
      </div>
    </div>
  );
};
