import React from 'react';
import { DataProvenance, DataStatus } from '../../services/providers/types';

interface DataProvenanceBadgeProps {
  provenance: DataProvenance;
  showDetails?: boolean;
}

export const DataProvenanceBadge: React.FC<DataProvenanceBadgeProps> = ({ provenance, showDetails = true }) => {
  const getStatusColor = (status: DataStatus) => {
    switch (status) {
      case 'LIVE': return 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40';
      case 'UPDATING': return 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40';
      case 'STALE': return 'text-amber-300 bg-amber-950/60 border-amber-500/40';
      case 'OFFLINE': return 'text-red-300 bg-red-950/60 border-red-500/40';
      default: return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  const getStatusDot = (status: DataStatus) => {
    switch (status) {
      case 'LIVE': return <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>;
      case 'UPDATING': return <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-spin"></span>;
      case 'STALE': return <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>;
      case 'OFFLINE': return <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>;
      default: return <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>;
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${getStatusColor(provenance.status)} shadow-xs`}>
      {getStatusDot(provenance.status)}
      <span className="font-bold">{provenance.status}</span>
      {showDetails && (
        <>
          <span className="text-slate-600 font-sans">|</span>
          <span className="text-slate-300 font-sans truncate max-w-[150px]" title={provenance.source}>
            {provenance.source}
          </span>
          <span className="text-slate-600 font-sans">|</span>
          <span className="text-slate-400 font-mono">{provenance.lastUpdated}</span>
        </>
      )}
    </div>
  );
};
